"use strict";

//JT-2026/11/24 - use the hero three sprite sheet for the shared cast and voice timing
const ALMIGHTY_PUSH = {
  id: "hero_3",
  frame: { width: 372, height: 314, x: 110, y: 248, scale: 1.5 },
  bars: 2,
  impact: 2.05,
  soundEnd: 2.49,
  landingStart: 2.94,
  duration: 3.22,
  sound: { file: "almighty_push_preview.wav", volume: .44 },
};
// let almightyPushVoice;
//JT-2026/11/25 - cache a separate voice clip for each fighter's ultimate
const ultimateVoices = new Map();

//JT-2026/11/24 - sequence the hero three cast and hold its expanding wave before landing
function almightyPushPose(elapsed) {
  const { impact, soundEnd, landingStart, duration } = ALMIGHTY_PUSH;
  if (elapsed >= soundEnd && elapsed < landingStart) return [2, 0];
  const phases = [[impact, 7], [impact + (soundEnd - impact) * .28, 2], [soundEnd, 1], [duration, 2]];
  let row = phases.findIndex(([end]) => elapsed < end);
  if (row === -1) row = phases.length - 1;
  const start = row === 3 ? landingStart : row ? phases[row - 1][0] : 0;
  const [end, frames] = phases[row];
  const column = Math.min(frames - 1, Math.floor((elapsed - start) * frames / (end - start)));
  return [row, column];
}

//JT-2026/11/24 - preload the shared voice clip when combat audio is prepared
// function prepareAlmightyPushVoice() {
//   if (almightyPushVoice || typeof Audio !== "function") return;
//   almightyPushVoice = new Audio("assets/" + ALMIGHTY_PUSH.sound.file);
//   almightyPushVoice.preload = "auto";
//   almightyPushVoice.volume = ALMIGHTY_PUSH.sound.volume;
// }
//JT-2026/11/25 - preload the charge and release recordings for the active ultimate
function prepareAlmightyPushVoice(cast = ALMIGHTY_PUSH) {
  if (cast.chargeSound) prepareUltimateCue(cast.chargeSound);
  return prepareUltimateCue(cast.sound);
}

//JT-2026/11/24 - resume the voice only while the cast is inside the audio window
function resumeAlmightyPushVoice(attack) {
  // if (attack?.kind !== "almightyPush" || attack.elapsed >= ALMIGHTY_PUSH.soundEnd || document.hidden) return;
  // prepareAlmightyPushVoice();
  // if (!almightyPushVoice || almightyPushVoice.error) return;
  // const voice = { clip: almightyPushVoice, started: false, stalled: 0 };
  // voice.clip.currentTime = attack.elapsed;
  //JT-2026/11/25 - resume the current charge or release cue from its own offset
  const cast = attack?.cast ?? ALMIGHTY_PUSH;
  if (attack?.kind !== "almightyPush" || attack.elapsed >= cast.soundEnd || document.hidden) return;
  attack.audioEnabled = true;
  // const chargeEnd = cast.chargeEnd ?? 0;
  //JT-2026/11/28 - schedule the crash sound at the impact frame
  const chargeEnd = cast.soundAtImpact ? cast.impact : (cast.chargeEnd ?? 0);
  const charging = attack.elapsed < chargeEnd;
  const cue = charging ? cast.chargeSound : cast.sound;
  // const clip = prepareUltimateCue(cue);
  // if (!clip || clip.error) return;
  // const start = (charging ? 0 : chargeEnd) - (cue.offset ?? 0);
  // const end = charging ? chargeEnd : cast.soundEnd;
  // const voice = { clip, start, end, started: false, stalled: 0 };
  // attack.voice = voice;
  // voice.clip.currentTime = attack.elapsed - start;
  // voice.clip.play()
  //   .then(() => { voice.started = true; })
  //   .catch(() => { if (attack.voice === voice) attack.voice = null; });
  //JT-2026/11/28 - keep media startup failures out of the animation loop
  try {
    if (!cue) {
      if (cast.soundAtImpact) prepareUltimateCue(cast.sound);
      return;
    }
    const clip = prepareUltimateCue(cue);
    if (!clip || clip.error) return;
    const start = (charging ? 0 : chargeEnd) - (cue.offset ?? 0);
    const end = charging ? chargeEnd : cast.soundEnd;
    const voice = { clip, start, end, started: false, stalled: 0 };
    attack.voice = voice;
    voice.clip.currentTime = attack.elapsed - start;
    voice.clip.play()
      .then(() => { voice.started = true; })
      .catch(() => { if (attack.voice === voice) attack.voice = null; });
  } catch {
    attack.voice = null;
  }
}

//JT-2026/11/24 - detach the sound so a muted cast can still finish
// function pauseAlmightyPushVoice(attack) {
//JT-2026/11/25 - prevent a muted or paused cast from starting its next cue
function pauseAlmightyPushVoice(attack, continuing = false) {
  if (attack && !continuing) attack.audioEnabled = false;
  if (!attack?.voice) return;
  attack.voice.clip.pause();
  attack.voice = null;
}

//JT-2026/11/24 - follow the voice through the blast and advance the landing after it ends
/*
function advanceAlmightyPush(attack, dt) {
  const voice = attack.voice;
  if (voice) {
    if (voice.started && voice.clip.ended) {
      attack.elapsed = ALMIGHTY_PUSH.soundEnd;
      attack.voice = null;
      return;
    }
    if (voice.started && voice.clip.currentTime > attack.elapsed) {
      attack.elapsed = voice.clip.currentTime;
      voice.stalled = 0;
      return;
    }
    voice.stalled += dt;
    if (voice.stalled < .65) return;
    pauseAlmightyPushVoice(attack);
  }
  attack.elapsed += dt;
}
*/
//JT-2026/11/25 - time the charge in game and sync the blast to the release voice
function advanceAlmightyPush(attack, dt) {
  const cast = attack.cast ?? ALMIGHTY_PUSH;
  //JT-2026/11/28 - let the gondola land and recover even when audio stalls
  if (cast.soundAtImpact) {
    const previous = attack.elapsed;
    attack.elapsed += dt;
    if (attack.audioEnabled && previous < cast.impact && attack.elapsed >= cast.impact) resumeAlmightyPushVoice(attack);
    if (attack.voice && attack.elapsed >= cast.soundEnd) pauseAlmightyPushVoice(attack, true);
    return;
  }
  const chargeEnd = cast.chargeEnd ?? 0;
  if (attack.elapsed < chargeEnd) {
    attack.elapsed = Math.min(chargeEnd, attack.elapsed + dt);
    if (attack.elapsed === chargeEnd) {
      pauseAlmightyPushVoice(attack, true);
      if (attack.audioEnabled) resumeAlmightyPushVoice(attack);
    }
    return;
  }
  const voice = attack.voice;
  const voiceEnd = voice?.end ?? cast.soundEnd;
  let elapsed = attack.elapsed + dt;
  if (voice) {
    const audioElapsed = Math.min(voiceEnd, (voice.start ?? 0) + voice.clip.currentTime);
    if (voice.started && voice.clip.ended) {
      elapsed = Math.max(attack.elapsed, voiceEnd);
    } else if (voice.started && audioElapsed > attack.elapsed) {
      elapsed = audioElapsed;
      voice.stalled = 0;
    } else {
      voice.stalled += dt;
      if (voice.stalled < .65) return;
      pauseAlmightyPushVoice(attack, true);
    }
  }
  attack.elapsed = elapsed;
  if (voice && elapsed >= voiceEnd) pauseAlmightyPushVoice(attack, true);
}

//JT-2026/11/24 - lift juan through the blast and ease him back to the floor after the hold
function almightyPushLift(elapsed) {
  const { impact, landingStart, duration } = ALMIGHTY_PUSH;
  const rise = Math.max(0, Math.min(1, 1 - (impact - elapsed) / .22));
  const descent = Math.max(0, Math.min(1, (elapsed - landingStart) / (duration - landingStart)));
  return 26 * rise * (1 - descent ** 2);
}

//JT-2026/11/25 - reuse one local audio element per ultimate cue
function prepareUltimateCue({ file, volume }) {
  if (typeof Audio !== "function") return;
  if (!ultimateVoices.has(file)) {
    const clip = new Audio("assets/" + file);
    clip.preload = "auto";
    clip.volume = volume;
    ultimateVoices.set(file, clip);
  }
  return ultimateVoices.get(file);
}

//JT-2026/11/25 - expand the shockwave from juan's torso through the airborne release
function drawAlmightyPushWave(context, x, feetY, size, elapsed) {
  const { impact, landingStart } = ALMIGHTY_PUSH;
  if (elapsed < impact || elapsed >= landingStart) return;
  const progress = (elapsed - impact) / (landingStart - impact);
  const expansion = 1 - (1 - progress) ** 2;
  const radius = (36 + 177 * expansion) * size;
  const opacity = (1 - progress) ** .7;
  const centerY = feetY - 72 * size;
  context.save();
  context.shadowBlur = 13 * size;
  context.shadowColor = "#62cfff";
  context.lineWidth = Math.max(1.3, (4.8 - 2 * expansion) * size);
  context.strokeStyle = `rgba(200, 247, 255, ${.95 * opacity})`;
  context.beginPath();
  context.arc(x, centerY, radius, 0, Math.PI * 2);
  context.stroke();
  context.shadowBlur = 0;
  context.lineWidth = Math.max(1, 2 * size);
  context.strokeStyle = `rgba(104, 204, 255, ${.55 * opacity})`;
  context.beginPath();
  context.arc(x, centerY, radius - (8 + 14 * expansion) * size, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}
