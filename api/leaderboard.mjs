import { createHash, randomBytes, randomUUID } from "node:crypto";

//JT-2026/11/26 - serve the web player profile, run checkpoints, and public rankings
const COOKIE = "pinoy_struggle_player";
const MODES = new Set(["arena", "survival"]);
const FIGHTERS = new Set(["juan", "gloria"]);
const RUN_ID = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/u;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const token = request.headers.get("cookie")?.match(/(?:^|;\s*)pinoy_struggle_player=([a-f0-9]{64})(?:;|$)/u)?.[1];
    const playerKey = token ? hashToken(token) : null;
    try {
      if (request.method === "GET") {
        const mode = url.searchParams.get("mode");
        if (mode === null) {
          const rows = playerKey ? await query("SELECT nickname FROM leaderboard_players WHERE player_key = $1", [playerKey]) : [];
          return json({ nickname: rows[0]?.nickname ?? null });
        }
        if (!MODES.has(mode)) return json({ error: "Choose Arena or Survival." }, 400);
        return json(await rankings(mode, playerKey));
      }
      if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, { Allow: "GET, POST" });
      if (request.headers.get("origin") !== url.origin) return json({ error: "Use the game website." }, 403);
      if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Expected JSON." }, 415);
      const body = await request.json().catch(() => null);
      if (!body || typeof body !== "object") return json({ error: "Invalid request." }, 400);
      if (body.action === "profile") return await saveProfile(body.nickname, token, url.protocol === "https:");
      if (!playerKey) return json({ error: "Enter a nickname to save scores." }, 401);
      if (body.action === "start") return await startRun(body, playerKey);
      if (body.action === "clear") return await saveClear(body, playerKey);
      return json({ error: "Invalid request." }, 400);
    } catch {
      return json({ error: "The leaderboard is temporarily unavailable." }, 503);
    }
  },
};

//JT-2026/11/26 - send parameterized queries through neons serverless sql endpoint
async function query(sql, params) {
  const connectionString = process.env.DATABASE_URL;
  const database = new URL(connectionString);
  if (!["postgres:", "postgresql:"].includes(database.protocol) || !database.hostname.endsWith(".neon.tech")) {
    throw new Error("Expected a Neon connection string.");
  }
  const endpoint = "https://" + database.hostname.replace(/^[^.]+\./u, "api.") + "/sql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Neon-Connection-String": connectionString,
      "Neon-Raw-Text-Output": "false",
      "Neon-Array-Mode": "false",
    },
    body: JSON.stringify({ query: sql, params: params.map(value => value === null ? null : String(value)) }),
    redirect: "error",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Neon query failed.");
  const { rows } = await response.json();
  return rows;
}

//JT-2026/11/26 - hide reusable session tokens from database records
function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

//JT-2026/11/26 - return fresh responses without caching private player data
function json(body, status = 200, headers = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

//JT-2026/11/26 - keep the same player when a nickname changes
async function saveProfile(value, existingToken, secure) {
  const nickname = typeof value === "string" ? value.normalize("NFKC").trim() : "";
  if (!/^[\p{L}\p{M}\p{N} ._’'-]{2,20}$/u.test(nickname) || !/[\p{L}\p{N}]/u.test(nickname)) {
    return json({ error: "Use 2–20 characters with letters or numbers." }, 400);
  }
  const token = existingToken ?? randomBytes(32).toString("hex");
  await query(`
    INSERT INTO leaderboard_players (player_key, nickname)
    VALUES ($1, $2)
    ON CONFLICT (player_key) DO UPDATE SET nickname = EXCLUDED.nickname
  `, [hashToken(token), nickname]);
  const cookie = `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${secure ? "; Secure" : ""}`;
  return json({ nickname }, 200, { "Set-Cookie": cookie });
}

//JT-2026/11/26 - issue a run id tied to the player and selected fighter
async function startRun({ mode, fighter }, playerKey) {
  if (!MODES.has(mode) || !FIGHTERS.has(fighter)) return json({ error: "Invalid mode or fighter." }, 400);
  const runId = randomUUID();
  const rows = await query(`
    WITH expired AS (
      DELETE FROM leaderboard_runs
      WHERE player_key = $2 AND created_at < now() - interval '24 hours'
    ), started AS (
      INSERT INTO leaderboard_runs (id, player_key, mode, fighter)
      SELECT $1::uuid, player_key, $3, $4 FROM leaderboard_players WHERE player_key = $2
      RETURNING player_key, mode
    )
    SELECT best.cleared, best.active_ms AS "activeMs"
    FROM started LEFT JOIN leaderboard_bests best USING (player_key, mode)
  `, [runId, playerKey, mode, fighter]);
  if (!rows.length) return json({ error: "Enter a nickname to save scores." }, 401);
  return json({ runId, personalBest: rows[0].cleared === null ? null : rows[0] }, 201);
}

//JT-2026/11/26 - save a sequential clear and update the best score atomically
async function saveClear({ runId, cleared, activeMs }, playerKey) {
  if (typeof runId !== "string" || !RUN_ID.test(runId) ||
      !Number.isInteger(cleared) || cleared < 1 || cleared > 24 ||
      !Number.isInteger(activeMs) || activeMs < 1 || activeMs > 86400000) {
    return json({ error: "Invalid score." }, 400);
  }
  const rows = await query(`
    WITH checkpoint AS (
      UPDATE leaderboard_runs
      SET cleared = $3, active_ms = $4
      WHERE id = $1::uuid AND player_key = $2
        AND created_at >= now() - interval '24 hours'
        AND $3 <= CASE mode WHEN 'arena' THEN 20 ELSE 24 END
        AND (
          (cleared = $3 - 1 AND active_ms < $4) OR
          (cleared = $3 AND active_ms = $4)
        )
      RETURNING player_key, mode, fighter, cleared, active_ms
    ), best AS (
      INSERT INTO leaderboard_bests (player_key, mode, fighter, cleared, active_ms)
      SELECT player_key, mode, fighter, cleared, active_ms FROM checkpoint
      ON CONFLICT (player_key, mode) DO UPDATE SET
        fighter = EXCLUDED.fighter, cleared = EXCLUDED.cleared,
        active_ms = EXCLUDED.active_ms, achieved_at = now()
      WHERE EXCLUDED.cleared > leaderboard_bests.cleared
        OR (EXCLUDED.cleared = leaderboard_bests.cleared AND EXCLUDED.active_ms < leaderboard_bests.active_ms)
      RETURNING cleared, active_ms
    )
    SELECT COALESCE(best.cleared, previous.cleared) AS cleared,
           COALESCE(best.active_ms, previous.active_ms) AS "activeMs",
           checkpoint.mode
    FROM checkpoint
    LEFT JOIN best ON true
    LEFT JOIN leaderboard_bests previous USING (player_key, mode)
  `, [runId, playerKey, cleared, activeMs]);
  if (!rows.length) return json({ error: "This checkpoint is out of order or the run has expired." }, 409);
  const [saved] = rows;
  // A concurrent run may have inserted the best after this statement's snapshot.
  if (saved.cleared === null) {
    const [best] = await query(`
      SELECT cleared, active_ms AS "activeMs"
      FROM leaderboard_bests WHERE player_key = $1 AND mode = $2
    `, [playerKey, saved.mode]);
    return json({ personalBest: best ?? null });
  }
  return json({ personalBest: { cleared: saved.cleared, activeMs: saved.activeMs } });
}

//JT-2026/11/26 - rank each mode by clears and active play time
async function rankings(mode, playerKey) {
  const rows = await query(`
    WITH ranked AS (
      SELECT p.nickname, b.fighter, b.cleared, b.active_ms AS "activeMs",
             COALESCE(b.player_key = $2, false) AS "isYou",
             row_number() OVER (ORDER BY b.cleared DESC, b.active_ms, b.achieved_at, b.player_key)::int AS rank
      FROM leaderboard_bests b JOIN leaderboard_players p USING (player_key)
      WHERE b.mode = $1
    )
    SELECT * FROM ranked WHERE rank <= 20 OR "isYou" ORDER BY rank
  `, [mode, playerKey]);
  return { entries: rows.filter(row => Number(row.rank) <= 20), personalBest: rows.find(row => row.isYou === true) ?? null };
}
