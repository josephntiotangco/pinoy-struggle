<!-- JT-2026/11/19 - document how to play and host pinoy struggle -->
# Pinoy Struggle

<!-- Play as Juan in a single-player arcade fighter set in Tondo, Manila. Beat nine challengers to clear the game. -->
<!-- JT-2026/11/19 - update the campaign to ten challengers -->
<!-- Play as Juan in a single-player arcade fighter set in Tondo, Manila. Beat ten challengers to clear the game. -->
<!-- JT-2026/11/19 - update the campaign to eleven challengers -->
Play as Juan in a single-player arcade fighter set in Tondo, Manila. Beat eleven challengers to clear the game.

## Play locally

Open [index.html](index.html) in a browser and choose **Start Fight**.

<!-- Each round lasts up to 60 seconds. Win by knockout or by finishing the round with more health than your opponent. Choose **Next Level** after a win or **Retry Level** after a loss or draw. -->
<!-- JT-2026/11/19 - explain the timeout rule with different health totals -->
Each round lasts up to 60 seconds. Win by knockout or by finishing with a higher percentage of your full health. Choose **Next Level** after a win or **Retry Level** after a loss or draw.

## Controls

<!-- | Guard | `↓` or `S` | -->
<!-- JT-2026/11/19 - document the retreat guard and both special attacks -->
<!--
| Guard | Move away from your opponent |
| Hadouken | `L` |
| Shoryuken | `I` |
-->
<!-- JT-2026/11/19 - list the renamed specials and their keyboard controls -->
| Action | Keyboard |
| --- | --- |
| Move left or right | `←` / `→` or `A` / `D` |
| Jump | `↑` or `W` |
| Guard | Hold the direction away from your opponent |
| Punch | `J` |
| Kick | `K` |
| Energy Wave | `L` |
| Super Upper Cut | `I` |
| Pause or resume | `Esc` |

<!-- Juan takes zero damage while actively moving away from his opponent. Leave room to step back. Use Hadouken and Shoryuken while on the ground. -->
<!-- JT-2026/11/19 - keep guard instructions with the movement controls -->
<!-- Juan takes zero damage while actively moving away from his opponent. Leave room to step back. -->
<!-- JT-2026/11/19 - document zero damage from hold back guard at the wall -->
Hold back to guard against all damage, even at the wall. Juan drops his guard while attacking.

On a phone, use the touch controls below the arena.

<!-- JT-2026/11/19 - explain how to earn and spend super charge -->
## Super Bar

<!--
Juan can use **Energy Wave (`L`)** or **Super Upper Cut (`I`)** while on the ground once his Super Bar reaches **100%** and shows **READY**. Starting either move resets the bar to **0%**.

Each round starts at **0%**. Land unblocked punches (**+20%**) and kicks (**+34%**) to fill the bar.
-->
<!-- JT-2026/11/19 - explain how to stock and spend three super bars -->
Juan can store up to **3 Super Bars**. An unblocked punch fills **30% of one bar** and an unblocked kick fills **50%**. Each round starts with all bars empty.

While on the ground, use **Energy Wave (`L`, 35 damage)** or **Super Upper Cut (`I`, 45 damage)** with at least one full bar. Each cast spends **one full bar** and keeps the remaining charge for your next cast.

## Opponent ladder

<!--
1. `kamote_rider`
2. `adik`
3. `mayabang`
4. `congressman`
5. `matapobre`
6. `billing`
7. `stress`
8. `emotional_damage`
9. `gasoline`
-->
<!-- JT-2026/11/19 - list the new fight order and increased health -->
<!--
1. `kamote_rider` — 160 HP
2. `snatcher` — 175 HP
3. `adik` — 185 HP
4. `politiko` — 200 HP
5. `mayabang` — 215 HP
6. `matapobre` — 230 HP
7. `gasoline` — 245 HP
8. `billing` — 260 HP
9. `stress` — 280 HP
10. `emotional_damage` — 300 HP
-->
<!-- JT-2026/11/19 - document the eleven opponent order and health -->
1. `kamote_rider` — 300 HP
2. `snatcher` — 320 HP
3. `kahirapan` — 330 HP
4. `adik` — 340 HP
5. `politiko` — 360 HP
6. `mayabang` — 380 HP
7. `matapobre` — 400 HP
8. `gasoline` — 420 HP
9. `billing` — 440 HP
10. `stress` — 460 HP
11. `emotional_damage` — 480 HP

## Host on Vercel

1. Push this project folder to a GitHub repository.
2. In Vercel, create a **New Project** and import the repository.
3. Keep the root directory set to the folder containing `index.html` and `vercel.json`. Use **Other** as the framework preset.
4. Click **Deploy**. The included [vercel.json](vercel.json) serves the game files directly. Open the URL Vercel provides to play online.

[Vercel's Git deployment guide](https://vercel.com/docs/git)
