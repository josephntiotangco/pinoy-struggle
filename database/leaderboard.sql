-- JT-2026/11/26 - store web players, run progress, and personal bests
BEGIN;

CREATE TABLE IF NOT EXISTS leaderboard_players (
  player_key text PRIMARY KEY,
  nickname text NOT NULL CHECK (char_length(nickname) BETWEEN 2 AND 20)
);

CREATE TABLE IF NOT EXISTS leaderboard_runs (
  id uuid PRIMARY KEY,
  player_key text NOT NULL REFERENCES leaderboard_players(player_key),
  mode text NOT NULL CHECK (mode IN ('arena', 'survival')),
  fighter text NOT NULL CHECK (fighter IN ('juan', 'gloria')),
  cleared integer NOT NULL DEFAULT 0 CHECK (cleared BETWEEN 0 AND 24),
  active_ms integer NOT NULL DEFAULT 0 CHECK (active_ms BETWEEN 0 AND 86400000),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leaderboard_runs_player_created
  ON leaderboard_runs (player_key, created_at);

CREATE TABLE IF NOT EXISTS leaderboard_bests (
  player_key text NOT NULL REFERENCES leaderboard_players(player_key),
  mode text NOT NULL CHECK (mode IN ('arena', 'survival')),
  fighter text NOT NULL CHECK (fighter IN ('juan', 'gloria')),
  cleared integer NOT NULL CHECK (cleared BETWEEN 1 AND 24),
  active_ms integer NOT NULL CHECK (active_ms BETWEEN 1 AND 86400000),
  achieved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (player_key, mode)
);

CREATE INDEX IF NOT EXISTS leaderboard_bests_rank
  ON leaderboard_bests (mode, cleared DESC, active_ms, achieved_at, player_key);

COMMIT;
