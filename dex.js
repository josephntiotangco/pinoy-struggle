"use strict";

//JT-2026/11/23 - describe how the monsters fight and what they represent
const monsters = [
  { name: "Kamote Rider", asset: "kamote_rider_0.png", arena: "1", survival: "1",
    description: "A reckless motorcyclist who rushes along a marked lane in Survival. He represents dangerous riding habits like weaving through traffic." },
  // { name: "Lubak", asset: "lubak_sa_daan_0.png", arena: "2", survival: "4",
  //JT-2026/11/24 - list lubak in both g araneta and maypajo
  { name: "Lubak", asset: "lubak_sa_daan_0.png", arena: "2", survival: "4, 8",
    description: "A pothole monster made of broken asphalt and tires. Its ground strike hits foes inside the warning ring. It stands for neglected roads and the hazards they create." },
  // { name: "Ebike", asset: "ebike_0.png", arena: "3", survival: "2",
  //JT-2026/11/24 - show ebike in balintawak as well as edsa
  // { name: "Ebike", asset: "ebike_0.png", arena: "3", survival: "2, 5",
  //JT-2026/11/24 - include ebike in the maypajo waves
  { name: "Ebike", asset: "ebike_0.png", arena: "3", survival: "2, 5, 8",
    description: "An electric tricycle that darts forward after a brief lane warning in Survival. It represents the scramble for space when different vehicles share crowded streets." },
  // { name: "Snatcher", asset: "snatcher_0.png", arena: "4", survival: "1",
  //JT-2026/11/24 - show snatcher returning in maypajo
  { name: "Snatcher", asset: "snatcher_0.png", arena: "4", survival: "1, 8",
    description: "A quick street fighter who closes the gap before striking at short range. He represents the fear of having something stolen in a crowded place." },
  // { name: "Kahirapan", asset: "kahirapan_0.png", arena: "5",
  //JT-2026/11/24 - list kahirapan in the malacanang waves
  { name: "Kahirapan", asset: "kahirapan_0.png", arena: "5", survival: "7",
    description: "A slow, heavy challenger that brings the fight into close quarters in Tondo. Kahirapan represents the hard choices families face when money cannot cover basic needs." },
  // { name: "Adik", asset: "adik_0.png", arena: "6",
  //   description: "A quick challenger who presses Juan with close-range attacks in Tondo. This fight symbolizes how hard it can be to break the cycle of addiction." },
  //JT-2026/11/24 - describe adik as the final survival boss in maypajo
  { name: "Adik", asset: "adik_0.png", arena: "6", survival: "8",
    description: "A quick close-range challenger in Tondo and the final Survival boss in Maypajo. This fight symbolizes how hard it can be to break the cycle of addiction." },
  // { name: "Lipunan", asset: "lipunan_0.png", arena: "7",
  //JT-2026/11/24 - list lipunan in the padre faura waves
  { name: "Lipunan", asset: "lipunan_0.png", arena: "7", survival: "6",
    description: "A broad challenger with longer reach than the opponents in the previous Tondo fights. Lipunan embodies the pressure to fit in and meet other people's expectations." },
  // { name: "Traffic", asset: "traffic_0.png", arena: "8", survival: "2, 4",
  //   description: "A slow jeepney with a wide close-range strike. In Survival it appears on both EDSA and G. Araneta. It stands for the hours commuters lose in gridlock." },
  //JT-2026/11/24 - add the new challengers and update the shifted encounter levels
  { name: "Traffic", asset: "traffic_0.png", arena: "8", survival: "2, 4, 5",
    description: "A slow jeepney with a wide close-range strike. In Survival it appears on EDSA, G. Araneta, and Balintawak. It stands for the hours commuters lose in gridlock." },
  { name: "Taas Presyo", asset: "inflation_0.png", arena: "9", survival: "5",
    description: "A cash register monster that slams a wide area with Price Crush. Taas Presyo represents how rising food prices make the same grocery budget buy less." },
  // { name: "Boss Mo", asset: "bossy_0.png", arena: "9", survival: "1",
  { name: "Boss Mo", asset: "bossy_0.png", arena: "10", survival: "1",
    description: "A demanding boss who closes out Tondo in Survival with a wide swing after a warning ring. He satirizes managers who pile on work and expect employees to always say yes." },
  // { name: "Politiko", asset: "congressman_0.png", arena: "10",
  // { name: "Politiko", asset: "congressman_0.png", arena: "11",
  //   description: "A politician who mixes light strikes with heavy attacks outside Malacañang. He satirizes the gap between campaign promises and what gets delivered." },
  //JT-2026/11/24 - list politiko in padre faura and as the malacanang boss
  { name: "Politiko", asset: "congressman_0.png", arena: "11", survival: "6, 7",
    description: "A politician whose wide attack closes the Malacañang level in Survival. He satirizes the gap between campaign promises and what gets delivered." },
  // { name: "Baha", asset: "baha_0.png", arena: "11", survival: "4",
  { name: "Baha", asset: "baha_0.png", arena: "12", survival: "4",
    description: "A flood monster that surges down marked lanes as the boss of G. Araneta in Survival. It embodies how flooded streets can bring daily life to a standstill." },
  // { name: "Mayabang", asset: "mayabang_0.png", arena: "12", survival: "2",
  { name: "Mayabang", asset: "mayabang_0.png", arena: "13", survival: "2",
    description: "A show-off in an SUV who charges down a long marked lane as the boss of EDSA in Survival. He satirizes the urge to flaunt wealth and demand attention." },
  // { name: "Justice Delayed", asset: "injustice_0.png", arena: "14",
  //   description: "A courthouse specter who strikes with a gavel. The piles of case files and clocks represent the toll of waiting years for a case to be heard." },
  //JT-2026/11/24 - describe the padre faura boss and its gavel strike
  { name: "Justice Delayed", asset: "injustice_0.png", arena: "14", survival: "6",
    description: "A courthouse specter that closes the Padre Faura waves. Its gavel slams a wide warning ring. The case files and clocks represent the toll of waiting years for a hearing." },
  // { name: "Matapobre", asset: "matapobre_0.png", arena: "13",
  // { name: "Matapobre", asset: "matapobre_0.png", arena: "15",
  //JT-2026/11/24 - list matapobre in both padre faura and malacanang
  { name: "Matapobre", asset: "matapobre_0.png", arena: "15", survival: "6, 7",
    description: "A fast challenger at Malacañang who guards more often than most Arena opponents. Matapobre represents class prejudice and looking down on people with less money." },
  // { name: "Petrolyo", asset: "gasoline_0.png", arena: "14",
  { name: "Petrolyo", asset: "gasoline_0.png", arena: "16", survival: "5",
    description: "A fuel-themed opponent whose heavy attack ends in a burst of flame. Petrolyo represents how a jump in fuel prices can strain a household's budget." },
  // { name: "Bills", asset: "billing_0.png", arena: "15", survival: "3",
  { name: "Bills", asset: "billing_0.png", arena: "17", survival: "3",
    description: "A living reminder of unpaid bills that closes in and strikes after a short warning in Survival. It captures the pressure of due dates and expenses that keep piling up." },
  // { name: "Stress", asset: "stress_0.png", arena: "16", survival: "3",
  // { name: "Stress", asset: "stress_0.png", arena: "18", survival: "3",
  //JT-2026/11/24 - list stress in bahay and malacanang
  { name: "Stress", asset: "stress_0.png", arena: "18", survival: "3, 7",
    description: "A fast pursuer who gives Juan little time to react before attacking. Stress embodies the feeling of having too many demands and no time to catch your breath." },
  // { name: "Emotional Damage", asset: "emotional_damage_0.png", arena: "17", survival: "3",
  { name: "Emotional Damage", asset: "emotional_damage_0.png", arena: "19", survival: "3",
    description: "A heavy hitter who marks a wide warning ring on the floor before striking in Survival. It represents the hurt that can linger after harsh words or rejection." },
  // { name: "Loans", asset: "loans_0.png", arena: "18", survival: "3",
  { name: "Loans", asset: "loans_0.png", arena: "20", survival: "3",
    description: "The final Arena challenger and the boss of Bahay in Survival, with a heavy strike that covers a wide ring. Loans embodies the weight of debt and payments that keep coming due." },
];

//JT-2026/11/23 - document the playable maps and the levels that use them
const maps = [
  { name: "Tondo, Manila", asset: "tondo_0.jpg", arena: "1, 5–7", survival: "1",
    description: "A neighborhood street lined with carinderias and houses. Juan's Survival run starts here." },
  // { name: "Maypajo, Caloocan", asset: "maypajo_0.jpg", arena: "2–3",
  //   description: "A busy road outside the Maypajo public market where Juan faces Lubak and Ebike in Arena." },
  //JT-2026/11/24 - list maypajo as the eighth survival arena
  { name: "Maypajo, Caloocan", asset: "maypajo_0.jpg", arena: "2–3", survival: "8",
    description: "A busy road outside the Maypajo public market where Juan faces Lubak and Ebike in Arena. Adik closes the Survival run here." },
  // { name: "EDSA", asset: "edsa_0.jpg", arena: "4, 8, 12", survival: "2",
  //JT-2026/11/24 - document both new locations and their stage numbers
  { name: "EDSA", asset: "edsa_0.jpg", arena: "4, 8, 13", survival: "2",
    description: "Guadalupe's crowded stretch of EDSA runs below the elevated tracks. Mayabang closes this Survival level." },
  { name: "Balintawak, Quezon City", asset: "balintawak_0.jpg", arena: "9", survival: "5",
    description: "The road outside Balintawak Public Market, with market stalls and buses under the elevated highway. Taas Presyo closes its Survival run." },
  // { name: "BGC, Taguig", asset: "bgc_0.jpg", arena: "9, 14",
  { name: "BGC, Taguig", asset: "bgc_0.jpg", arena: "10, 16",
    description: "A wide intersection framed by glass towers and storefronts, where Boss Mo and Petrolyo fight in Arena." },
  // { name: "Malacañang, Manila", asset: "malacaniang_0.jpg", arena: "10, 13",
  // { name: "Malacañang, Manila", asset: "malacaniang_0.jpg", arena: "11, 15",
  //   description: "The palace grounds and fountain frame Juan's fights against Politiko and Matapobre." },
  //JT-2026/11/24 - show the malacanang fight that unlocks maypajo
  { name: "Malacañang, Manila", asset: "malacaniang_0.jpg", arena: "11, 15", survival: "7",
    description: "The palace grounds and fountain frame Juan's fights against Politiko and Matapobre. Defeat Politiko here in Survival to reach Maypajo." },
  // { name: "G. Araneta, Quezon City", asset: "g_araneta_0.jpg", arena: "11", survival: "4",
  { name: "G. Araneta, Quezon City", asset: "g_araneta_0.jpg", arena: "12", survival: "4",
    description: "An avenue lined with shops beneath an elevated road. Baha is the boss of its final Survival wave." },
  // { name: "Padre Faura, Manila", asset: "pfaura_0.jpg", arena: "14",
  //   description: "A busy Manila street framed by courthouses and legal offices. Juan faces Justice Delayed in front of them." },
  //JT-2026/11/24 - show the padre faura fight that opens the route to malacanang
  { name: "Padre Faura, Manila", asset: "pfaura_0.jpg", arena: "14", survival: "6",
    description: "A busy Manila street framed by courthouses and legal offices. Defeat Justice Delayed here in Survival to reach Malacañang." },
  // { name: "Bahay", asset: "bahay_0.jpg", arena: "15–18", survival: "3",
  { name: "Bahay", asset: "bahay_0.jpg", arena: "17–20", survival: "3",
    description: "Juan's living room becomes the arena for Bills, Stress, Emotional Damage, and Loans." },
];

//JT-2026/11/23 - populate both catalogs before wiring up search
const cardTemplate = document.getElementById("dex-card");
const searchInput = document.getElementById("dex-search");
const searchStatus = document.getElementById("dex-status");
const sections = [...document.querySelectorAll(".dex-section")];

document.getElementById("monsters-grid").append(...monsters.map(createDexCard));
document.getElementById("maps-grid").append(...maps.map(createDexCard));
searchInput.addEventListener("input", filterDex);
filterDex();

//JT-2026/11/23 - render a portrait or map with its arena and survival levels
function createDexCard(entry) {
  const card = cardTemplate.content.cloneNode(true);
  card.querySelector("img").src = "assets/arcade/previews/" + entry.asset;
  card.querySelector("h3").textContent = entry.name;
  card.querySelector("p").textContent = entry.description;
  const levels = card.querySelector(".dex-levels");
  const arena = document.createElement("li");
  arena.textContent = "Arena · Lv. " + entry.arena;
  levels.append(arena);
  if (entry.survival) {
    const survival = document.createElement("li");
    survival.className = "dex-survival";
    survival.textContent = "Survival · Lv. " + entry.survival;
    levels.append(survival);
  }
  return card;
}

//JT-2026/11/23 - filter cards by their visible text and announce how many match
function filterDex() {
  const query = normalizeDexText(searchInput.value);
  let matches = 0;
  for (const section of sections) {
    const cards = [...section.querySelector(".dex-grid").children];
    let sectionMatches = 0;
    for (const card of cards) {
      card.hidden = !normalizeDexText(card.textContent).includes(query);
      sectionMatches += Number(!card.hidden);
    }
    section.hidden = sectionMatches === 0;
    document.querySelector(`.dex-tools nav a[href="#${section.id}"]`).hidden = section.hidden;
    matches += sectionMatches;
  }
  searchStatus.textContent = query ? (matches ? `${matches} ${matches === 1 ? "entry" : "entries"} found.` : "No monsters or maps found.") : "";
}

//JT-2026/11/23 - allow searches without accents or punctuation
function normalizeDexText(value) {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
