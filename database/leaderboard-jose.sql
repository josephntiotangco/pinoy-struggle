-- JT-2026/11/28 - migrate ana's fighter id and allow all four fighters without losing scores
BEGIN;

ALTER TABLE leaderboard_runs
  DROP CONSTRAINT IF EXISTS leaderboard_runs_fighter_check;

ALTER TABLE leaderboard_bests
  DROP CONSTRAINT IF EXISTS leaderboard_bests_fighter_check;

UPDATE leaderboard_runs SET fighter = 'ana' WHERE fighter = 'gloria';
UPDATE leaderboard_bests SET fighter = 'ana' WHERE fighter = 'gloria';

ALTER TABLE leaderboard_runs
  ADD CONSTRAINT leaderboard_runs_fighter_check CHECK (fighter IN ('juan', 'ana', 'jose', 'maria'));

ALTER TABLE leaderboard_bests
  ADD CONSTRAINT leaderboard_bests_fighter_check CHECK (fighter IN ('juan', 'ana', 'jose', 'maria'));

COMMIT;
