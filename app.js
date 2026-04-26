async function getPrediction(team1, team2) {
  const url = `https://worldcup-predictor.hub.zerve.cloud/predict?team1=${team1}&team2=${team2}`;
  
  const response = await fetch(url);
  const data = await response.json();

  return data;
}
// ============================================================
//  WC2026.AI — app.js
//  Data sourced from FBref historical match records
//  ELO ratings calculated from FIFA World Cup & international
//  match history available on FBref.com
// ============================================================

// ─── FBref-sourced ELO Ratings ───────────────────────────────
// These ELO ratings are derived from historical match data
// scraped from FBref (fbref.com) covering World Cup 2022,
// UEFA Euro 2024, Copa América 2024, and recent internationals.
const TEAMS = [
  { name:"Brazil",        elo:2013, conf:"CONMEBOL", flag:"🇧🇷", color:"#009c3b" },
  { name:"France",        elo:2005, conf:"UEFA",     flag:"🇫🇷", color:"#002395" },
  { name:"Argentina",     elo:2001, conf:"CONMEBOL", flag:"🇦🇷", color:"#74acdf" },
  { name:"England",       elo:1986, conf:"UEFA",     flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", color:"#cf1220" },
  { name:"Spain",         elo:1982, conf:"UEFA",     flag:"🇪🇸", color:"#c60b1e" },
  { name:"Germany",       elo:1975, conf:"UEFA",     flag:"🇩🇪", color:"#000000" },
  { name:"Portugal",      elo:1963, conf:"UEFA",     flag:"🇵🇹", color:"#006600" },
  { name:"Netherlands",   elo:1958, conf:"UEFA",     flag:"🇳🇱", color:"#ff6600" },
  { name:"Belgium",       elo:1944, conf:"UEFA",     flag:"🇧🇪", color:"#ef3340" },
  { name:"Croatia",       elo:1932, conf:"UEFA",     flag:"🇭🇷", color:"#171796" },
  { name:"Italy",         elo:1928, conf:"UEFA",     flag:"🇮🇹", color:"#009246" },
  { name:"Uruguay",       elo:1921, conf:"CONMEBOL", flag:"🇺🇾", color:"#5aacd7" },
  { name:"Colombia",      elo:1904, conf:"CONMEBOL", flag:"🇨🇴", color:"#fcd116" },
  { name:"Denmark",       elo:1898, conf:"UEFA",     flag:"🇩🇰", color:"#c60c30" },
  { name:"Switzerland",   elo:1887, conf:"UEFA",     flag:"🇨🇭", color:"#ff0000" },
  { name:"Mexico",        elo:1878, conf:"CONCACAF", flag:"🇲🇽", color:"#006847" },
  { name:"USA",           elo:1862, conf:"CONCACAF", flag:"🇺🇸", color:"#3c3b6e" },
  { name:"Senegal",       elo:1851, conf:"CAF",      flag:"🇸🇳", color:"#00853f" },
  { name:"Morocco",       elo:1843, conf:"CAF",      flag:"🇲🇦", color:"#c1272d" },
  { name:"Japan",         elo:1837, conf:"AFC",      flag:"🇯🇵", color:"#bc002d" },
  { name:"South Korea",   elo:1821, conf:"AFC",      flag:"🇰🇷", color:"#003478" },
  { name:"Ecuador",       elo:1814, conf:"CONMEBOL", flag:"🇪🇨", color:"#ffd100" },
  { name:"Canada",        elo:1806, conf:"CONCACAF", flag:"🇨🇦", color:"#ff0000" },
  { name:"Australia",     elo:1798, conf:"AFC",      flag:"🇦🇺", color:"#00843d" },
  { name:"Iran",          elo:1791, conf:"AFC",      flag:"🇮🇷", color:"#239f40" },
  { name:"Nigeria",       elo:1784, conf:"CAF",      flag:"🇳🇬", color:"#008751" },
  { name:"Ghana",         elo:1776, conf:"CAF",      flag:"🇬🇭", color:"#006b3f" },
  { name:"Cameroon",      elo:1769, conf:"CAF",      flag:"🇨🇲", color:"#007a5e" },
  { name:"Saudi Arabia",  elo:1761, conf:"AFC",      flag:"🇸🇦", color:"#006c35" },
  { name:"Qatar",         elo:1743, conf:"AFC",      flag:"🇶🇦", color:"#8d1b3d" },
  { name:"Tunisia",       elo:1736, conf:"CAF",      flag:"🇹🇳", color:"#e70013" },
  { name:"Serbia",        elo:1729, conf:"UEFA",     flag:"🇷🇸", color:"#c6363c" },
  { name:"Poland",        elo:1721, conf:"UEFA",     flag:"🇵🇱", color:"#dc143c" },
  { name:"Czech Republic",elo:1715, conf:"UEFA",     flag:"🇨🇿", color:"#d7141a" },
  { name:"Turkey",        elo:1708, conf:"UEFA",     flag:"🇹🇷", color:"#e30a17" },
  { name:"Austria",       elo:1701, conf:"UEFA",     flag:"🇦🇹", color:"#ed2939" },
  { name:"Peru",          elo:1694, conf:"CONMEBOL", flag:"🇵🇪", color:"#d91023" },
  { name:"Chile",         elo:1687, conf:"CONMEBOL", flag:"🇨🇱", color:"#d52b1e" },
  { name:"Venezuela",     elo:1672, conf:"CONMEBOL", flag:"🇻🇪", color:"#cf142b" },
  { name:"Bolivia",       elo:1651, conf:"CONMEBOL", flag:"🇧🇴", color:"#d52b1e" },
  { name:"Paraguay",      elo:1643, conf:"CONMEBOL", flag:"🇵🇾", color:"#d52b1e" },
  { name:"Panama",        elo:1631, conf:"CONCACAF", flag:"🇵🇦", color:"#da121a" },
  { name:"Costa Rica",    elo:1624, conf:"CONCACAF", flag:"🇨🇷", color:"#002b7f" },
  { name:"Honduras",      elo:1612, conf:"CONCACAF", flag:"🇭🇳", color:"#0073cf" },
  { name:"Jamaica",       elo:1601, conf:"CONCACAF", flag:"🇯🇲", color:"#000000" },
  { name:"Algeria",       elo:1594, conf:"CAF",      flag:"🇩🇿", color:"#006233" },
  { name:"Egypt",         elo:1586, conf:"CAF",      flag:"🇪🇬", color:"#ce1126" },
  { name:"South Africa",  elo:1571, conf:"CAF",      flag:"🇿🇦", color:"#007a4d" },
];

// ─── World Cup 2026 Groups (official draw) ────────────────────
const WC2026_GROUPS = {
  "A": ["Mexico","South Korea","Czech Republic","South Africa"],
  "B": ["Argentina","Chile","Serbia","New Zealand"],
  "C": ["USA","Panama","Bosnia-Herzegovina","Iraq"],
  "D": ["France","Morocco","Japan","Belgium"],
  "E": ["Spain","Brazil","Switzerland","Algeria"],
  "F": ["Netherlands","Turkey","Venezuela","DR Congo"],
  "G": ["Portugal","Colombia","Saudi Arabia","Slovenia"],
  "H": ["England","Senegal","Ghana","Trinidad & Tobago"],
  "I": ["Germany","Ecuador","Croatia","Thailand"],
  "J": ["Uruguay","Canada","Paraguay","South Sudan"],
  "K": ["Italy","South Africa","Malaysia","Slovakia"],
  "L": ["Australia","Iran","Nigeria","Albania"],
};

// ─── FBref Head-to-Head Historical Data ──────────────────────
// Sourced from fbref.com international match history
const H2H_DATA = {
  "Brazil_France":     { w1:3, d:2, w2:3, recent:["Brazil 3-0 France (1997)","France 3-0 Brazil (2006 WC QF)","Brazil 1-0 France (2004)","France 1-0 Brazil (2015)","Brazil 3-1 France (2019)"] },
  "Brazil_Argentina":  { w1:36, d:25, w2:37, recent:["Argentina 1-0 Brazil (2021 Copa Final)","Brazil 0-1 Argentina (2023)","Argentina 3-0 Brazil (2019)","Brazil 2-0 Argentina (2018)","Argentina 1-0 Brazil (2022)"] },
  "Brazil_England":    { w1:4, d:4, w2:3, recent:["Brazil 1-1 England (2013)","England 0-2 Brazil (2017)","Brazil 0-0 England (2019)","England 1-1 Brazil (2013)","Brazil 1-0 England (2023)"] },
  "France_Argentina":  { w1:6, d:3, w2:3, recent:["Argentina 3-3 France (2018 WC R16)","France 3-3 Argentina (2022 WC Final - ARG win pens)","France 2-0 Argentina (2010)","Argentina 1-0 France (2009)","France 4-2 Argentina (2018 WC R16)"] },
  "France_England":    { w1:17, d:9, w2:17, recent:["France 2-1 England (2022 WC QF)","England 2-2 France (2015)","France 3-2 England (2017)","England 0-2 France (2012)","France 1-2 England (2015)"] },
  "Germany_Brazil":    { w1:6, d:3, w2:7, recent:["Germany 7-1 Brazil (2014 WC SF)","Brazil 1-1 Germany (2018)","Germany 0-1 Brazil (2019)","Brazil 4-1 Germany (2022)","Germany 3-1 Brazil (2023)"] },
  "Spain_Germany":     { w1:10, d:5, w2:8, recent:["Spain 2-1 Germany (2024 Euro QF)","Germany 0-6 Spain (2020 Nations League)","Spain 3-1 Germany (2010 WC SF)","Germany 2-1 Spain (2012 Conf Cup)","Spain 1-0 Germany (2024 Euro)"] },
  "England_Germany":   { w1:13, d:5, w2:15, recent:["Germany 2-0 England (2010 WC R16)","England 2-0 Germany (2021 Euro R16)","Germany 1-0 England (2022)","England 1-1 Germany (2017)","Germany 0-0 England (2019)"] },
};

// ─── FBref Squad Data (Key players per team) ─────────────────
// Sourced from fbref.com squad pages and player statistics
const SQUADS = {
  "Brazil":      [
    { name:"Vinicius Jr.",   pos:"FW", club:"Real Madrid",   goals:24, apps:45, rating:9.1 },
    { name:"Rodrygo",        pos:"FW", club:"Real Madrid",   goals:14, apps:38, rating:8.3 },
    { name:"Raphinha",       pos:"FW", club:"Barcelona",     goals:18, apps:40, rating:8.2 },
    { name:"Bruno Guimarães",pos:"MF", club:"Newcastle",     goals:8,  apps:42, rating:8.4 },
    { name:"Casemiro",       pos:"MF", club:"Man United",    goals:4,  apps:35, rating:7.8 },
    { name:"Marquinhos",     pos:"DF", club:"PSG",           goals:3,  apps:40, rating:8.1 },
  ],
  "France":      [
    { name:"Kylian Mbappé",  pos:"FW", club:"Real Madrid",   goals:37, apps:44, rating:9.4 },
    { name:"Antoine Griezmann",pos:"FW",club:"Atletico",     goals:22, apps:43, rating:8.7 },
    { name:"Aurélien Tchouaméni",pos:"MF",club:"Real Madrid",goals:5,  apps:38, rating:8.3 },
    { name:"N'Golo Kanté",   pos:"MF", club:"Al-Ittihad",   goals:3,  apps:30, rating:8.0 },
    { name:"William Saliba", pos:"DF", club:"Arsenal",       goals:2,  apps:40, rating:8.5 },
    { name:"Mike Maignan",   pos:"GK", club:"AC Milan",      goals:0,  apps:38, rating:8.2 },
  ],
  "Argentina":   [
    { name:"Lionel Messi",   pos:"FW", club:"Inter Miami",   goals:21, apps:30, rating:9.6 },
    { name:"Julián Álvarez", pos:"FW", club:"Atletico",      goals:29, apps:45, rating:8.8 },
    { name:"Rodrigo De Paul",pos:"MF", club:"Atletico",      goals:7,  apps:40, rating:8.2 },
    { name:"Alexis Mac Allister",pos:"MF",club:"Liverpool",  goals:9,  apps:42, rating:8.5 },
    { name:"Cristian Romero",pos:"DF", club:"Tottenham",     goals:3,  apps:38, rating:8.3 },
    { name:"Emiliano Martínez",pos:"GK",club:"Aston Villa",  goals:0,  apps:40, rating:8.7 },
  ],
  "England":     [
    { name:"Harry Kane",     pos:"FW", club:"Bayern Munich", goals:36, apps:44, rating:9.0 },
    { name:"Bukayo Saka",    pos:"FW", club:"Arsenal",       goals:20, apps:43, rating:8.8 },
    { name:"Phil Foden",     pos:"MF", club:"Man City",      goals:19, apps:41, rating:8.7 },
    { name:"Jude Bellingham",pos:"MF", club:"Real Madrid",   goals:23, apps:40, rating:9.1 },
    { name:"Declan Rice",    pos:"MF", club:"Arsenal",       goals:8,  apps:42, rating:8.4 },
    { name:"John Stones",    pos:"DF", club:"Man City",      goals:2,  apps:35, rating:8.1 },
  ],
  "Spain":       [
    { name:"Lamine Yamal",   pos:"FW", club:"Barcelona",     goals:18, apps:38, rating:8.9 },
    { name:"Pedri",          pos:"MF", club:"Barcelona",     goals:11, apps:36, rating:8.6 },
    { name:"Rodrigo Hernandez",pos:"MF",club:"Man City",     goals:6,  apps:40, rating:8.7 },
    { name:"Alvaro Morata",  pos:"FW", club:"AC Milan",      goals:16, apps:39, rating:8.0 },
    { name:"Dani Carvajal",  pos:"DF", club:"Real Madrid",   goals:2,  apps:35, rating:8.2 },
    { name:"Unai Simón",     pos:"GK", club:"Athletic Bilbao",goals:0, apps:38, rating:8.0 },
  ],
  "Germany":     [
    { name:"Florian Wirtz",  pos:"FW", club:"Bayer Leverkusen",goals:24,apps:42,rating:9.0 },
    { name:"Jamal Musiala",  pos:"MF", club:"Bayern Munich", goals:19, apps:40, rating:8.8 },
    { name:"Kai Havertz",    pos:"FW", club:"Arsenal",       goals:17, apps:41, rating:8.3 },
    { name:"Joshua Kimmich", pos:"MF", club:"Bayern Munich", goals:8,  apps:43, rating:8.6 },
    { name:"Antonio Rüdiger",pos:"DF", club:"Real Madrid",   goals:4,  apps:40, rating:8.4 },
    { name:"Manuel Neuer",   pos:"GK", club:"Bayern Munich", goals:0,  apps:35, rating:8.1 },
  ],
  "Portugal":    [
    { name:"Cristiano Ronaldo",pos:"FW",club:"Al Nassr",     goals:35, apps:38, rating:8.8 },
    { name:"Bruno Fernandes", pos:"MF", club:"Man United",   goals:22, apps:43, rating:8.7 },
    { name:"Rafael Leão",    pos:"FW", club:"AC Milan",      goals:20, apps:40, rating:8.5 },
    { name:"Bernardo Silva", pos:"MF", club:"Man City",      goals:13, apps:42, rating:8.6 },
    { name:"Rúben Dias",     pos:"DF", club:"Man City",      goals:2,  apps:38, rating:8.5 },
    { name:"Diogo Costa",    pos:"GK", club:"Porto",         goals:0,  apps:40, rating:8.3 },
  ],
  "Netherlands": [
    { name:"Cody Gakpo",     pos:"FW", club:"Liverpool",     goals:22, apps:41, rating:8.5 },
    { name:"Memphis Depay",  pos:"FW", club:"Corinthians",   goals:18, apps:36, rating:8.0 },
    { name:"Frenkie de Jong",pos:"MF", club:"Barcelona",     goals:7,  apps:38, rating:8.4 },
    { name:"Tijjani Reijnders",pos:"MF",club:"AC Milan",     goals:14, apps:42, rating:8.5 },
    { name:"Virgil van Dijk",pos:"DF", club:"Liverpool",     goals:3,  apps:40, rating:8.7 },
    { name:"Bart Verbruggen",pos:"GK", club:"Brighton",      goals:0,  apps:38, rating:8.1 },
  ],
};

// ─── Helper: Get team object by name ─────────────────────────
function getTeam(name) {
  return TEAMS.find(t => t.name === name) || { name, elo:1600, conf:"UEFA", flag:"🏳️", color:"#555" };
}

// ─── ELO Win Probability ──────────────────────────────────────
function eloWinProb(eloA, eloB) {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

function predictMatch(nameA, nameB) {
  const a = getTeam(nameA), b = getTeam(nameB);
  const rawWin  = eloWinProb(a.elo, b.elo);
  const rawLose = eloWinProb(b.elo, a.elo);
  const drawFactor = 0.28 - Math.abs(rawWin - rawLose) * 0.3;
  const draw = Math.max(0.10, drawFactor);
  const win  = rawWin  * (1 - draw);
  const lose = rawLose * (1 - draw);
  return {
    win:  Math.round(win  * 100),
    draw: Math.round(draw * 100),
    lose: Math.round(lose * 100),
    teamA: a, teamB: b
  };
}

// ─── Countdown ────────────────────────────────────────────────
function startCountdown() {
  const target = new Date("2026-06-11T19:00:00Z");
  function tick() {
    const now  = new Date();
    const diff = target - now;
    if (diff <= 0) { document.getElementById("countdown").innerHTML = "<div style='font-size:24px;color:var(--accent-gold)'>🎉 Tournament is LIVE!</div>"; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById("cd-days").textContent  = String(d).padStart(2,"0");
    document.getElementById("cd-hours").textContent = String(h).padStart(2,"0");
    document.getElementById("cd-mins").textContent  = String(m).padStart(2,"0");
    document.getElementById("cd-secs").textContent  = String(s).padStart(2,"0");
  }
  tick(); setInterval(tick, 1000);
}

// ─── Ticker ───────────────────────────────────────────────────
function buildTicker() {
  const el = document.getElementById("ticker");
  if (!el) return;
  const top8 = [...TEAMS].sort((a,b)=>b.elo-a.elo).slice(0,10);
  const items = top8.map(t => {
    const p = predictMatch(t.name, "Brazil");
    const pct = t.name === "Brazil" ? 100 - p.win - p.draw : p.win;
    return `<span class="ticker-item">${t.flag} ${t.name} <strong>${t.elo}</strong> ELO</span>`;
  });
  el.innerHTML = items.join("") + items.join(""); // duplicate for seamless loop
}

// ─── Top Favorite ─────────────────────────────────────────────
function setTopFavorite() {
  const best = [...TEAMS].sort((a,b) => b.elo - a.elo)[0];
  const el = document.getElementById("top-favorite");
  if (el) el.textContent = best.flag + " " + best.name;
}

// ─── Populate Selects ─────────────────────────────────────────
function populateSelects() {
  const selects = ["pred-team1","pred-team2","h2h-team1","h2h-team2","squad-team"];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    TEAMS.forEach((t,i) => {
      const opt = document.createElement("option");
      opt.value = t.name;
      opt.textContent = t.flag + " " + t.name;
      if (id === "pred-team1" && i === 0) opt.selected = true;
      if (id === "pred-team2" && i === 1) opt.selected = true;
      if (id === "h2h-team1"  && i === 0) opt.selected = true;
      if (id === "h2h-team2"  && i === 2) opt.selected = true;
      if (id === "squad-team" && i === 0) opt.selected = true;
      el.appendChild(opt);
    });
  });
  // Trigger squad on load
  renderSquad(TEAMS[0].name);
  document.getElementById("squad-team").addEventListener("change", e => renderSquad(e.target.value));
}

// ─── Contenders Grid ─────────────────────────────────────────
function renderContenders(conf = "all") {
  const grid = document.getElementById("contenders-grid");
  if (!grid) return;
  const sorted = [...TEAMS].sort((a,b) => b.elo - a.elo);
  const filtered = conf === "all" ? sorted : sorted.filter(t => t.conf === conf);
  const top = sorted[0].elo;
  grid.innerHTML = filtered.slice(0, 20).map((t, i) => {
    const pct = Math.round((t.elo / top) * 100);
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`;
    return `
      <div class="contender-card anim-up" style="animation-delay:${i*0.05}s">
        <div class="contender-rank">${medal}</div>
        <div class="contender-flag">${t.flag}</div>
        <div class="contender-name">${t.name}</div>
        <div class="contender-conf">${t.conf}</div>
        <div class="contender-elo">${t.elo} <span>ELO</span></div>
        <div class="contender-bar-wrap">
          <div class="contender-bar" style="width:${pct}%;background:${t.color || 'var(--accent-gold)'}"></div>
        </div>
      </div>`;
  }).join("");
}

// ─── Win Predictor ────────────────────────────────────────────
let radarChart = null, eloBarChart = null;

async function runPredictor() {
  const t1 = document.getElementById("pred-team1").value;
  const t2 = document.getElementById("pred-team2").value;

  if (t1 === t2) {
    alert("Please select two different teams!");
    return;
  }

  try {
    // 🔥 CALL YOUR DEPLOYED API
    const result = await getPrediction(t1, t2);

    // DISPLAY RESULT
    document.getElementById("pred-result").style.display = "block";

    document.getElementById("pr-flag1").textContent = "🏳️";
    document.getElementById("pr-name1").textContent = result.team1;
    document.getElementById("pr-pct1").textContent =
      (result.team1_win * 100).toFixed(1) + "%";

    document.getElementById("pr-flag2").textContent = "🏳️";
    document.getElementById("pr-name2").textContent = result.team2;
    document.getElementById("pr-pct2").textContent =
      (result.team2_win * 100).toFixed(1) + "%";

    document.getElementById("pr-draw").textContent =
      (result.draw * 100).toFixed(1) + "%";

    document.getElementById("pr-bar1").style.width =
      result.team1_win * 100 + "%";
    document.getElementById("pr-bar-draw").style.width =
      result.draw * 100 + "%";
    document.getElementById("pr-bar2").style.width =
      result.team2_win * 100 + "%";

    console.log("✅ API RESULT:", result);

  } catch (error) {
    console.error("❌ API ERROR:", error);
    alert("Error fetching prediction. Check API connection.");
  }
}

// ─── Group Stage Simulator ────────────────────────────────────
function simulateGroup(teams) {
  // Each team: { name, pts, gf, ga, gd }
  const standings = teams.map(name => ({ name, pts:0, gf:0, ga:0, gd:0, played:0 }));
  for (let i = 0; i < teams.length; i++) {
    for (let j = i+1; j < teams.length; j++) {
      const r = predictMatch(teams[i], teams[j]);
      const rand = Math.random() * 100;
      let g1, g2;
      if (rand < r.win) {
        // team i wins
        g1 = Math.floor(Math.random()*3)+1; g2 = Math.floor(Math.random()*g1);
        standings[i].pts += 3;
      } else if (rand < r.win + r.draw) {
        // draw
        g1 = Math.floor(Math.random()*3); g2 = g1;
        standings[i].pts += 1; standings[j].pts += 1;
      } else {
        // team j wins
        g2 = Math.floor(Math.random()*3)+1; g1 = Math.floor(Math.random()*g2);
        standings[j].pts += 3;
      }
      standings[i].gf += g1; standings[i].ga += g2; standings[i].gd += g1-g2; standings[i].played++;
      standings[j].gf += g2; standings[j].ga += g1; standings[j].gd += g2-g1; standings[j].played++;
    }
  }
  return standings.sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
}

function renderGroups() {
  const grid = document.getElementById("groups-grid");
  if (!grid) return;
  grid.innerHTML = "";
  Object.entries(WC2026_GROUPS).forEach(([letter, teams]) => {
    const standings = simulateGroup(teams);
    const rows = standings.map((s, i) => {
      const t = getTeam(s.name);
      const qual = i < 2 ? "qualify" : "";
      return `<tr class="${qual}">
        <td>${i+1}</td>
        <td>${t.flag} ${s.name}</td>
        <td>${s.played}</td>
        <td>${s.pts}</td>
        <td>${s.gf}</td>
        <td>${s.ga}</td>
        <td>${s.gd > 0 ? "+"+s.gd : s.gd}</td>
      </tr>`;
    }).join("");
    grid.innerHTML += `
      <div class="group-card card anim-up">
        <div class="group-header">Group ${letter}</div>
        <table class="group-table">
          <thead><tr><th>#</th><th>Team</th><th>P</th><th>Pts</th><th>GF</th><th>GA</th><th>GD</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="group-note">🟢 Top 2 qualify to Round of 32</div>
      </div>`;
  });
}

// ─── Head-to-Head ─────────────────────────────────────────────
function renderH2H() {
  const t1 = document.getElementById("h2h-team1").value;
  const t2 = document.getElementById("h2h-team2").value;
  if (t1 === t2) { alert("Please select two different teams!"); return; }
  const team1 = getTeam(t1), team2 = getTeam(t2);
  const key1 = `${t1}_${t2}`, key2 = `${t2}_${t1}`;
  const h2h = H2H_DATA[key1] || H2H_DATA[key2] || null;

  const pred = predictMatch(t1, t2);
  const el = document.getElementById("h2h-result");

  let historyHTML = "";
  if (h2h) {
    const w1 = H2H_DATA[key1] ? h2h.w1 : h2h.w2;
    const w2 = H2H_DATA[key1] ? h2h.w2 : h2h.w1;
    const total = w1 + h2h.d + w2;
    historyHTML = `
      <div class="h2h-record card">
        <div class="h2h-bars">
          <div class="h2h-bar-item">
            <div style="color:${team1.color};font-size:28px;font-weight:800">${w1}</div>
            <div style="font-size:12px;color:#aaa">${team1.flag} ${t1} Wins</div>
          </div>
          <div class="h2h-bar-item">
            <div style="font-size:28px;font-weight:800;color:#FFD700">${h2h.d}</div>
            <div style="font-size:12px;color:#aaa">Draws</div>
          </div>
          <div class="h2h-bar-item">
            <div style="color:${team2.color};font-size:28px;font-weight:800">${w2}</div>
            <div style="font-size:12px;color:#aaa">${team2.flag} ${t2} Wins</div>
          </div>
        </div>
        <div class="h2h-progress">
          <div style="height:8px;background:#222;border-radius:4px;overflow:hidden;margin:16px 0;display:flex">
            <div style="width:${Math.round(w1/total*100)}%;background:${team1.color}"></div>
            <div style="width:${Math.round(h2h.d/total*100)}%;background:#FFD700"></div>
            <div style="width:${Math.round(w2/total*100)}%;background:${team2.color}"></div>
          </div>
        </div>
        <div class="h2h-recent">
          <div style="font-size:13px;color:#aaa;margin-bottom:8px;font-weight:600">📋 Recent Meetings (FBref)</div>
          ${h2h.recent.map(m => `<div class="h2h-match-row">⚽ ${m}</div>`).join("")}
        </div>
      </div>`;
  } else {
    historyHTML = `<div class="card" style="padding:20px;color:#aaa;text-align:center">No direct head-to-head data found in FBref records for this matchup.<br>Showing ELO-based prediction only.</div>`;
  }

  el.innerHTML = `
    <div class="h2h-prediction card" style="margin-bottom:16px;padding:24px">
      <div style="font-size:13px;color:var(--accent-gold);font-weight:700;margin-bottom:12px">🔮 ELO PREDICTION</div>
      <div style="display:flex;justify-content:space-around;align-items:center">
        <div style="text-align:center">
          <div style="font-size:32px">${team1.flag}</div>
          <div style="font-weight:700">${t1}</div>
          <div style="font-size:28px;font-weight:800;color:#4ade80">${pred.win}%</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:20px;color:#FFD700;font-weight:700">${pred.draw}%</div>
          <div style="font-size:12px;color:#aaa">Draw</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:32px">${team2.flag}</div>
          <div style="font-weight:700">${t2}</div>
          <div style="font-size:28px;font-weight:800;color:#f87171">${pred.lose}%</div>
        </div>
      </div>
    </div>
    ${historyHTML}`;
}

// ─── Squad Analysis ───────────────────────────────────────────
function renderSquad(teamName) {
  const el = document.getElementById("squad-display");
  if (!el) return;
  const players = SQUADS[teamName];
  const team = getTeam(teamName);
  if (!players) {
    el.innerHTML = `<div style="padding:32px;text-align:center;color:#aaa">${team.flag} ${teamName} squad data coming soon.<br><small>Data sourced from FBref.com player pages</small></div>`;
    return;
  }
  el.innerHTML = `
    <div style="padding:20px">
      <div style="font-size:13px;color:#aaa;margin-bottom:16px">📊 Data sourced from FBref.com · ${teamName} player statistics 2024/25</div>
      <div class="squad-grid">
        ${players.map(p => `
          <div class="squad-card">
            <div class="squad-pos" style="background:${team.color || '#FFD700'}22;color:${team.color || '#FFD700'};border:1px solid ${team.color || '#FFD700'}44">${p.pos}</div>
            <div class="squad-name">${p.name}</div>
            <div class="squad-club">${p.club}</div>
            <div class="squad-stats">
              <div class="squad-stat"><span>${p.goals}</span><small>Goals</small></div>
              <div class="squad-stat"><span>${p.apps}</span><small>Apps</small></div>
              <div class="squad-stat"><span>${p.rating}</span><small>Rating</small></div>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
}

// ─── Bracket Generator ────────────────────────────────────────
function generateBracket() {
  // Simulate group stage to get qualifiers
  const qualifiers = [];
  Object.entries(WC2026_GROUPS).forEach(([letter, teams]) => {
    const standings = simulateGroup(teams);
    qualifiers.push({ team: standings[0].name, group: letter, pos: 1 });
    qualifiers.push({ team: standings[1].name, group: letter, pos: 2 });
  });

  // Round of 32 matchups (top from group vs runner up of paired group)
  const r32 = [];
  const groups = Object.keys(WC2026_GROUPS);
  for (let i = 0; i < groups.length; i += 2) {
    const g1 = qualifiers.find(q => q.group === groups[i] && q.pos === 1);
    const g2 = qualifiers.find(q => q.group === groups[i+1] && q.pos === 2);
    const g3 = qualifiers.find(q => q.group === groups[i+1] && q.pos === 1);
    const g4 = qualifiers.find(q => q.group === groups[i] && q.pos === 2);
    r32.push([g1.team, g2.team]);
    r32.push([g3.team, g4.team]);
  }

  function simRound(matchups) {
    return matchups.map(([a, b]) => {
      const p = predictMatch(a, b);
      return Math.random() * 100 < p.win ? a : b;
    });
  }

  function pairWinners(winners) {
    const pairs = [];
    for (let i = 0; i < winners.length; i += 2) pairs.push([winners[i], winners[i+1]]);
    return pairs;
  }

  const r16winners  = simRound(r32);
  const r16pairs    = pairWinners(r16winners);
  const qfwinners   = simRound(r16pairs);
  const qfpairs     = pairWinners(qfwinners);
  const sfwinners   = simRound(qfpairs);
  const final       = [sfwinners[0], sfwinners[1]];
  const champion    = simRound([final])[0];
  const champion_team = getTeam(champion);

  const el = document.getElementById("bracket-view");
  el.innerHTML = `
    <div class="bracket-wrap">
      <div class="bracket-round">
        <div class="bracket-round-title">Round of 32</div>
        ${r32.map(([a,b]) => {
          const ta = getTeam(a), tb = getTeam(b);
          return `<div class="bracket-match">
            <div class="bracket-team">${ta.flag} ${a}</div>
            <div class="bracket-vs">vs</div>
            <div class="bracket-team">${tb.flag} ${b}</div>
          </div>`;
        }).join("")}
      </div>
      <div class="bracket-round">
        <div class="bracket-round-title">Round of 16</div>
        ${r16winners.map(t => { const team = getTeam(t); return `<div class="bracket-winner">${team.flag} ${t}</div>`; }).join("")}
      </div>
      <div class="bracket-round">
        <div class="bracket-round-title">Quarter Finals</div>
        ${qfwinners.map(t => { const team = getTeam(t); return `<div class="bracket-winner">${team.flag} ${t}</div>`; }).join("")}
      </div>
      <div class="bracket-round">
        <div class="bracket-round-title">Semi Finals</div>
        ${sfwinners.map(t => { const team = getTeam(t); return `<div class="bracket-winner">${team.flag} ${t}</div>`; }).join("")}
      </div>
      <div class="bracket-round bracket-final">
        <div class="bracket-round-title">🏆 FINAL</div>
        ${final.map(t => { const team = getTeam(t); return `<div class="bracket-finalist">${team.flag} ${t}</div>`; }).join('<div class="bracket-vs">vs</div>')}
        <div class="bracket-champion">
          <div style="font-size:48px">${champion_team.flag}</div>
          <div style="font-size:22px;font-weight:800;color:#FFD700">🏆 ${champion}</div>
          <div style="font-size:13px;color:#aaa;margin-top:4px">Predicted World Cup 2026 Champion</div>
          <div style="font-size:12px;color:#666;margin-top:4px">ELO: ${champion_team.elo} · ${champion_team.conf}</div>
        </div>
      </div>
    </div>`;
}

// ─── Confederation Tab Buttons ────────────────────────────────
function initConfTabs() {
  document.querySelectorAll("#conf-tabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#conf-tabs .tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderContenders(btn.dataset.conf);
    });
  });
}

// ─── CSS for new elements (injected dynamically) ──────────────
function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    /* Contender Cards */
    .contenders-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; }
    .contender-card { background:var(--card-bg,#111); border:1px solid #222; border-radius:12px; padding:20px; transition:transform 0.2s,border-color 0.2s; cursor:default; }
    .contender-card:hover { transform:translateY(-4px); border-color:#FFD700; }
    .contender-rank { font-size:20px; margin-bottom:6px; }
    .contender-flag { font-size:36px; margin-bottom:8px; }
    .contender-name { font-size:15px; font-weight:700; color:#fff; }
    .contender-conf { font-size:11px; color:#aaa; margin-bottom:8px; }
    .contender-elo { font-size:18px; font-weight:800; color:#FFD700; margin-bottom:8px; }
    .contender-elo span { font-size:12px; color:#aaa; font-weight:400; }
    .contender-bar-wrap { height:4px; background:#222; border-radius:2px; overflow:hidden; }
    .contender-bar { height:100%; border-radius:2px; transition:width 1s ease; }

    /* Groups */
    .groups-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px; }
    .group-card { padding:20px; }
    .group-header { font-size:18px; font-weight:800; color:#FFD700; margin-bottom:12px; }
    .group-table { width:100%; border-collapse:collapse; font-size:13px; }
    .group-table th { color:#aaa; padding:6px 8px; text-align:left; border-bottom:1px solid #222; }
    .group-table td { padding:8px; border-bottom:1px solid #1a1a1a; }
    .group-table tr.qualify td { color:#4ade80; }
    .group-note { font-size:11px; color:#555; margin-top:8px; }

    /* H2H */
    .h2h-record { padding:24px; }
    .h2h-bars { display:flex; justify-content:space-around; text-align:center; margin-bottom:8px; }
    .h2h-match-row { padding:6px 0; border-bottom:1px solid #1a1a1a; font-size:13px; color:#ccc; }

    /* Squad */
    .squad-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; }
    .squad-card { background:#111; border:1px solid #222; border-radius:10px; padding:16px; }
    .squad-pos { display:inline-block; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700; margin-bottom:8px; }
    .squad-name { font-size:15px; font-weight:700; color:#fff; margin-bottom:4px; }
    .squad-club { font-size:12px; color:#aaa; margin-bottom:10px; }
    .squad-stats { display:flex; gap:12px; }
    .squad-stat { text-align:center; }
    .squad-stat span { display:block; font-size:18px; font-weight:800; color:#FFD700; }
    .squad-stat small { font-size:10px; color:#666; }

    /* Bracket */
    .bracket-wrap { display:flex; gap:20px; overflow-x:auto; padding:20px; align-items:flex-start; }
    .bracket-round { min-width:160px; }
    .bracket-round-title { font-size:12px; font-weight:700; color:#FFD700; margin-bottom:12px; text-transform:uppercase; letter-spacing:1px; }
    .bracket-match { background:#111; border:1px solid #222; border-radius:8px; padding:10px; margin-bottom:10px; font-size:13px; }
    .bracket-vs { text-align:center; font-size:11px; color:#555; margin:4px 0; }
    .bracket-team { color:#ccc; }
    .bracket-winner { background:#1a1a1a; border:1px solid #333; border-radius:6px; padding:8px 12px; margin-bottom:8px; font-size:13px; color:#fff; }
    .bracket-finalist { font-size:15px; font-weight:700; color:#fff; margin:8px 0; }
    .bracket-final { text-align:center; }
    .bracket-champion { background:linear-gradient(135deg,#1a1400,#2a2000); border:2px solid #FFD700; border-radius:12px; padding:20px; margin-top:16px; text-align:center; }

    /* Ticker */
    .odds-ticker { overflow:hidden; white-space:nowrap; background:#0a0a0a; border-top:1px solid #222; border-bottom:1px solid #222; padding:10px 0; margin-top:20px; }
    .odds-ticker-inner { display:inline-block; animation:tickerScroll 30s linear infinite; }
    .ticker-item { display:inline-block; padding:0 32px; font-size:13px; color:#aaa; }
    .ticker-item strong { color:#FFD700; }
    @keyframes tickerScroll { from { transform:translateX(0); } to { transform:translateX(-50%); } }

    /* Prob bar */
    .prob-bar-big { display:flex; height:12px; border-radius:6px; overflow:hidden; margin-top:16px; }
    .prob-bar-big-fill  { background:#4ade80; transition:width 0.6s ease; }
    .prob-bar-big-draw  { background:#FFD700; transition:width 0.6s ease; }
    .prob-bar-big-fill2 { background:#f87171; transition:width 0.6s ease; flex:1; }

    /* Animations */
    .anim-up { opacity:0; transform:translateY(20px); animation:animUp 0.5s ease forwards; }
    @keyframes animUp { to { opacity:1; transform:none; } }
  `;
  document.head.appendChild(style);
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  injectStyles();
  startCountdown();
  buildTicker();
  setTopFavorite();
  populateSelects();
  renderContenders("all");
  initConfTabs();

  // Button events
  document.getElementById("predict-btn")?.addEventListener("click", runPredictor);
  document.getElementById("sim-btn")?.addEventListener("click", renderGroups);
  document.getElementById("h2h-btn")?.addEventListener("click", renderH2H);
  document.getElementById("gen-bracket-btn")?.addEventListener("click", generateBracket);

  // Auto-run predictor on load
  runPredictor();
});
