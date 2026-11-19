<!-- JT-2026/11/19 - document how to play and host pinoy struggle -->
# Pinoy Struggle

Play as Juan in a single-player arcade fighter set in Tondo, Manila. Beat nine challengers to clear the game.

## Play locally

Open [index.html](index.html) in a browser and choose **Start Fight**.

Each round lasts up to 60 seconds. Win by knockout or by finishing the round with more health than your opponent. Choose **Next Level** after a win or **Retry Level** after a loss or draw.

## Controls

| Action | Keyboard |
| --- | --- |
| Move left or right | `←` / `→` or `A` / `D` |
| Jump | `↑` or `W` |
| Guard | `↓` or `S` |
| Punch | `J` |
| Kick | `K` |
| Pause or resume | `Esc` |

On a phone, use the touch controls below the arena.

## Opponent ladder

1. `kamote_rider`
2. `adik`
3. `mayabang`
4. `congressman`
5. `matapobre`
6. `billing`
7. `stress`
8. `emotional_damage`
9. `gasoline`

## Host on Vercel

1. Push this project folder to a GitHub repository.
2. In Vercel, create a **New Project** and import the repository.
3. Keep the root directory set to the folder containing `index.html` and `vercel.json`. Use **Other** as the framework preset.
4. Click **Deploy**. The included [vercel.json](vercel.json) serves the game files directly. Open the URL Vercel provides to play online.

[Vercel's Git deployment guide](https://vercel.com/docs/git)
