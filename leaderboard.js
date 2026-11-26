"use strict";

//JT-2026/11/26 - enable nickname entry and score reporting on the web pages
(() => {
  const endpoint = "/api/leaderboard";
  const form = document.getElementById("nickname-form");
  const result = document.querySelector("[data-rank-result]");
  const message = result?.querySelector("[data-rank-message]");
  const retry = result?.querySelector("[data-rank-retry]");
  let run;

  if (form) initializeHome();
  if (result) {
    globalThis.pinoyLeaderboard = {
      start(mode, fighter) {
        run = { mode, fighter, seconds: 0, cleared: 0, queue: [] };
        flush(run);
      },
      tick(dt) {
        if (run && !run.closed) run.seconds += dt;
      },
      clear() {
        if (!run || run.closed) return;
        run.queue.push({ cleared: ++run.cleared, activeMs: Math.round(run.seconds * 1000) });
        flush(run);
      },
    };
    retry.addEventListener("click", () => flush(run));
  }

  //JT-2026/11/26 - reuse the saved browser profile or collect a nickname
  function initializeHome() {
    const input = document.getElementById("nickname");
    const submit = form.querySelector("button");
    const heading = document.getElementById("entry-heading");
    const status = document.getElementById("nickname-status");
    const welcome = document.getElementById("player-welcome");
    const player = document.getElementById("player-nickname");
    const edit = document.getElementById("edit-nickname");
    const guest = document.getElementById("play-unranked");
    const board = document.getElementById("leaderboard");
    const modeHeading = document.getElementById("mode-heading");
    let nickname = null;

    submit.disabled = true;
    request(endpoint).then(profile => {
      if (profile.nickname) showMenu(profile.nickname);
    }).catch(() => {
      status.textContent = "Online rankings are unavailable. You can still play unranked.";
      guest.hidden = false;
    }).finally(() => { submit.disabled = false; });

    form.addEventListener("submit", async event => {
      event.preventDefault();
      submit.disabled = true;
      status.textContent = "Saving nickname…";
      try {
        const profile = await request(endpoint, { action: "profile", nickname: input.value });
        showMenu(profile.nickname);
        modeHeading.focus();
        if (!board.hidden) loadBoard(board.querySelector('[aria-pressed="true"]').dataset.rankMode);
      } catch (error) {
        status.textContent = error.message;
        if (error.status >= 500) guest.hidden = false;
      } finally {
        submit.disabled = false;
      }
    });

    edit.addEventListener("click", () => {
      welcome.hidden = true;
      form.hidden = false;
      heading.hidden = false;
      input.value = nickname;
      submit.textContent = "Save nickname";
      input.focus();
    });

    guest.addEventListener("click", () => {
      showMenu(null);
      status.textContent = "Playing unranked.";
      modeHeading.focus();
    });

    //JT-2026/11/26 - let the public board open from any web game result
    for (const tab of board.querySelectorAll("[data-rank-mode]")) {
      tab.addEventListener("click", () => loadBoard(tab.dataset.rankMode));
    }
    document.querySelector('a[href="#leaderboard"]').addEventListener("click", () => {
      if (location.hash === "#leaderboard") openBoard();
    });
    window.addEventListener("hashchange", openBoard);
    openBoard();

    //JT-2026/11/26 - unlock fighter selection and show the active nickname
    function showMenu(name) {
      nickname = name;
      document.body.dataset.rankHome = "open";
      heading.hidden = true;
      form.hidden = true;
      guest.hidden = true;
      welcome.hidden = !name;
      edit.hidden = false;
      player.textContent = name ? "Playing as " + name : "";
      status.textContent = "";
    }

    //JT-2026/11/26 - open the requested mode from the leaderboard link
    function openBoard() {
      if (location.hash !== "#leaderboard" && location.hash !== "#leaderboard-survival") return;
      board.hidden = false;
      loadBoard(location.hash === "#leaderboard-survival" ? "survival" : "arena");
      board.scrollIntoView({ block: "start" });
    }
  }

  //JT-2026/11/26 - render fresh public ranks and the current players best
  async function loadBoard(mode) {
    const board = document.getElementById("leaderboard");
    const table = document.getElementById("rank-table");
    const entries = document.getElementById("rank-entries");
    const best = document.getElementById("rank-personal-best");
    const status = document.getElementById("rank-status");
    const requestId = String(Number(board.dataset.requestId ?? 0) + 1);
    board.dataset.requestId = requestId;
    for (const tab of board.querySelectorAll("[data-rank-mode]")) {
      tab.setAttribute("aria-pressed", String(tab.dataset.rankMode === mode));
    }
    document.getElementById("rank-progress").textContent = mode === "arena" ? "Levels" : "Waves";
    status.textContent = "Loading rankings…";
    table.hidden = true;
    best.hidden = true;
    try {
      const data = await request(endpoint + "?mode=" + mode);
      if (board.dataset.requestId !== requestId) return;
      entries.replaceChildren();
      for (const entry of data.entries) {
        const row = document.createElement("tr");
        row.classList.toggle("rank-you", entry.isYou);
        for (const value of [entry.rank, entry.nickname, entry.fighter === "gloria" ? "Gloria" : "Juan", entry.cleared, formatTime(entry.activeMs)]) {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.append(cell);
        }
        entries.append(row);
      }
      table.hidden = data.entries.length === 0;
      status.textContent = table.hidden ? "No scores yet. Clear a " + (mode === "arena" ? "level" : "wave") + " to claim the first spot." : "";
      if (data.personalBest) {
        best.textContent = "Your rank #" + data.personalBest.rank + " · " + describeBest(data.personalBest, mode);
        best.hidden = false;
      }
    } catch (error) {
      if (board.dataset.requestId === requestId) status.textContent = error.message;
    }
  }

  //JT-2026/11/26 - submit clears in order and keep unsaved checkpoints available for retry
  async function flush(attempt) {
    if (attempt.saving || attempt.closed) return;
    attempt.saving = true;
    if (attempt === run) {
      retry.hidden = true;
      message.textContent = attempt.id ? "Saving score…" : "Connecting to the leaderboard…";
    }
    try {
      if (!attempt.id) {
        const data = await request(endpoint, { action: "start", mode: attempt.mode, fighter: attempt.fighter });
        attempt.id = data.runId;
        attempt.best = data.personalBest;
      }
      while (attempt.queue.length) {
        const data = await request(endpoint, { action: "clear", runId: attempt.id, ...attempt.queue[0] });
        attempt.best = data.personalBest;
        attempt.queue.shift();
      }
      if (attempt === run) message.textContent = attempt.best ? describeBest(attempt.best, attempt.mode) : "Clear a " + (attempt.mode === "arena" ? "level" : "wave") + " to save a score.";
    } catch (error) {
      attempt.closed = error.status < 500;
      if (attempt === run) {
        message.textContent = error.message;
        retry.hidden = attempt.closed;
      }
    } finally {
      attempt.saving = false;
    }
  }

  //JT-2026/11/26 - keep database credentials behind the same origin api
  async function request(path, payload) {
    const options = payload ? {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: payload.action === "clear",
    } : {};
    const response = await fetch(path, options).catch(() => null);
    const data = response ? await response.json().catch(() => null) : null;
    if (response?.ok && data) return data;
    throw Object.assign(new Error(data?.error ?? "The leaderboard is temporarily unavailable."), {
      status: data ? response.status : 503,
    });
  }

  //JT-2026/11/26 - report play time and completed levels or waves
  function describeBest(best, mode) {
    const unit = mode === "arena" ? "level" : "wave";
    const total = Number(best.cleared);
    return "Personal best · " + total + " " + unit + (total === 1 ? "" : "s") + " · " + formatTime(best.activeMs);
  }

  //JT-2026/11/26 - display time to hundredths for leaderboard tie breaks
  function formatTime(activeMs) {
    const hundredths = Math.floor(Number(activeMs) / 10);
    const minutes = Math.floor(hundredths / 6000);
    const seconds = String(Math.floor(hundredths / 100) % 60).padStart(2, "0");
    return minutes + ":" + seconds + "." + String(hundredths % 100).padStart(2, "0");
  }
})();
