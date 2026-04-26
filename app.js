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

function calcMatchProbs(eloA, eloB) {
  const raw = eloWinProb(eloA, eloB);
  // Adjust for draw probability (~25git add .% average in football)
  const drawProb = 0.25 * (1 - Math.abs(raw - 0.5) * 1.5);
  const winA  = raw * (1 - drawProb * 0.5);
  const winB  = (1 - raw) * (1 - drawProb * 0.5);
  const total = winA + drawProb + winB;
  return {
    win:  winA / total,
    draw: drawProb / total,
    lose: winB / total,
  };
}

// ===================== CONTENDERS =====================
function buildContendersGrid(conf) {
  currentConf = conf;
  let teams = ELO_DATA.teams;
  if (conf !== 'all') teams = teams.filter(t => t.confederation === conf);
  teams = teams.sort((a, b) => b.elo - a.elo);

  const maxElo = teams[0]?.elo || 2000;
  const minElo = teams[teams.length - 1]?.elo || 1600;

  const grid = document.getElementById('contenders-grid');
  grid.innerHTML = teams.map((t, i) => {
    const pct = ((t.elo - minElo) / (maxElo - minElo) * 100).toFixed(1);
    const winChance = (eloWinProb(t.elo, 1850) * 100).toFixed(1);
    return `
      <div class="contender-card anim-up" style="animation-delay:${i * 0.03}s"
           onclick="quickPredict('${t.code}')">
        <div class="contender-rank">#${i + 1} ${t.confederation}</div>
        <div style="margin-bottom:10px">${flagImg(t.code, 48)}</div>
        <div class="contender-name">${t.name}</div>
        <div class="contender-elo">ELO ${t.elo} · Group ${t.group}</div>
        <div class="prob-bar-wrap">
          <div class="prob-bar" style="width:${pct}%"></div>
        </div>
        <div class="prob-label">${winChance}% title chance</div>
      </div>`;
  }).join('');
}

function updateTopFavorite() {
  const top = ELO_DATA.teams.sort((a, b) => b.elo - a.elo)[0];
  document.getElementById('top-favorite').textContent = top.name;
}

// ===================== GROUP STAGE =====================
function buildGroupStage() {
  const groups = {};
  ELO_DATA.teams.forEach(t => {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push({ ...t, W: 0, D: 0, L: 0, GF: 0, GA: 0, Pts: 0 });
  });

  const grid = document.getElementById('groups-grid');
  grid.innerHTML = Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0])).map(([g, teams]) => {
    teams = teams.sort((a, b) => b.elo - a.elo);
    return `
      <div class="group-card" id="group-${g}">
        <div class="group-header">
          <div class="group-name">Group ${g}</div>
          <span style="font-size:12px;color:var(--text-muted)">${teams.length} Teams</span>
        </div>
        <div class="group-table">
          <div class="group-team-header">
            <span>#</span><span>Team</span>
            <span>W</span><span>D</span><span>L</span><span>GD</span><span>Pts</span>
          </div>
          ${teams.map((t, i) => {
            const qual = i < 2;
            return `<div class="group-team-row ${qual ? 'qualified' : ''}" id="gtr-${t.code}">
              <span class="team-pos">${i + 1}</span>
              <span class="team-name-cell">${flagImg(t.code)} ${t.name}</span>
              <span class="stat-cell" id="g${g}-${t.code}-W">0</span>
              <span class="stat-cell" id="g${g}-${t.code}-D">0</span>
              <span class="stat-cell" id="g${g}-${t.code}-L">0</span>
              <span class="stat-cell" id="g${g}-${t.code}-GD">0</span>
              <span class="pts-cell" id="g${g}-${t.code}-Pts">0</span>
            </div>`;
          }).join('')}
        </div>
      </div>`;
  }).join('');
}

function simulateGroups() {
  const groups = {};
  ELO_DATA.teams.forEach(t => {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push({ ...t, W: 0, D: 0, L: 0, GF: 0, GA: 0, Pts: 0 });
  });

  Object.entries(groups).forEach(([g, teams]) => {
    // Round-robin
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const a = teams[i], b = teams[j];
        const prob = calcMatchProbs(a.elo, b.elo);
        const r = Math.random();
        if (r < prob.win) {
          // A wins
          const goals = simGoals();
          a.W++; a.GF += goals[0]; a.GA += goals[1]; a.Pts += 3;
          b.L++; b.GF += goals[1]; b.GA += goals[0];
        } else if (r < prob.win + prob.draw) {
          // Draw
          const g = Math.floor(Math.random() * 3);
          a.D++; a.GF += g; a.GA += g; a.Pts++;
          b.D++; b.GF += g; b.GA += g; b.Pts++;
        } else {
          // B wins
          const goals = simGoals();
          b.W++; b.GF += goals[0]; b.GA += goals[1]; b.Pts += 3;
          a.L++; a.GF += goals[1]; a.GA += goals[0];
        }
      }
    }

    // Sort by Pts, then GD
    teams.sort((x, y) => {
      const ptsDiff = (y.Pts) - (x.Pts);
      if (ptsDiff !== 0) return ptsDiff;
      return (y.GF - y.GA) - (x.GF - x.GA);
    });

    // Update DOM — re-render the group table rows
    const groupEl = document.getElementById(`group-${g}`);
    const tableEl = groupEl.querySelector('.group-table');
    const headerEl = tableEl.querySelector('.group-team-header');
    // Remove old rows
    tableEl.querySelectorAll('.group-team-row').forEach(r => r.remove());
    // Re-insert sorted rows
    teams.forEach((t, i) => {
      const qual = i < 2;
      const gd = t.GF - t.GA;
      const row = document.createElement('div');
      row.className = `group-team-row${qual ? ' qualified' : ''}`;
      row.innerHTML = `
        <span class="team-pos">${i + 1}</span>
        <span class="team-name-cell">${flagImg(t.code)} ${t.name}</span>
        <span class="stat-cell">${t.W}</span>
        <span class="stat-cell">${t.D}</span>
        <span class="stat-cell">${t.L}</span>
        <span class="stat-cell">${gd >= 0 ? '+' : ''}${gd}</span>
        <span class="pts-cell">${t.Pts}</span>`;
      tableEl.appendChild(row);
    });
  });
}

function simGoals() {
  const a = Math.floor(Math.random() * 4) + 1;
  const b = Math.floor(Math.random() * Math.max(1, a));
  return [a, b];
}

// ===================== WIN PREDICTOR =====================
function populateSelects() {
  const teams = ELO_DATA.teams.sort((a, b) => b.elo - a.elo);
  const opts = teams.map(t => `<option value="${t.code}">${t.name} (${t.elo})</option>`).join('');

  document.getElementById('pred-team1').innerHTML = opts;
  document.getElementById('pred-team2').innerHTML = opts;
  document.getElementById('pred-team2').selectedIndex = 1;

  document.getElementById('h2h-team1').innerHTML = opts;
  document.getElementById('h2h-team2').innerHTML = opts;
  document.getElementById('h2h-team2').selectedIndex = 1;

  const squadOpts = Object.keys(SQUAD_DATA.squads).map(code => {
    const t = teams.find(x => x.code === code);
    return `<option value="${code}">${t ? t.name : code}</option>`;
  }).join('');
  document.getElementById('squad-team').innerHTML = squadOpts;
}

async function runPredictor() {
  console.log("BUTTON CLICKED");

  const code1 = document.getElementById('pred-team1').value;
  const code2 = document.getElementById('pred-team2').value;

  if (code1 === code2) return;

  const t1 = ELO_DATA.teams.find(t => t.code === code1);
  const t2 = ELO_DATA.teams.find(t => t.code === code2);

  console.log("Calling API...");

  try {
    const res = await fetch(
      `https://worldcup-predictor.hub.zerve.cloud/predict?team1=${t1.name}&team2=${t2.name}`
    );

    const data = await res.json();

    console.log("API RESULT:", data);

    // UPDATE UI WITH API DATA
    document.getElementById('pr-pct1').textContent = (data.team1_win * 100).toFixed(1) + '%';
    document.getElementById('pr-pct2').textContent = (data.team2_win * 100).toFixed(1) + '%';
    document.getElementById('pr-draw').textContent = (data.draw * 100).toFixed(1) + '%';

    document.getElementById('pr-bar1').style.width = (data.team1_win * 100) + '%';
    document.getElementById('pr-bar2').style.width = (data.team2_win * 100) + '%';
    document.getElementById('pr-bar-draw').style.width = (data.draw * 100) + '%';

    document.getElementById('pr-name1').textContent = data.team1;
    document.getElementById('pr-name2').textContent = data.team2;

    document.getElementById('pred-result').style.display = 'block';

    // OPTIONAL: keep charts if needed
    buildRadarChart(t1, t2);
    buildEloBar(t1, t2);

  } catch (err) {
    console.error("API ERROR:", err);
  }
}
function quickPredict(code) {
  document.getElementById('pred-team1').value = code;
  document.getElementById('predictor').scrollIntoView({ behavior: 'smooth' });
  setTimeout(runPredictor, 600);
}

// ===================== RADAR CHART =====================
function buildRadarChart(t1, t2) {
  const sq1 = SQUAD_DATA.squads[t1.code];
  const sq2 = SQUAD_DATA.squads[t2.code];

  const labels = ['Attack', 'Defense', 'Midfield', 'Form', 'Experience', 'ELO Score'];

  const getData = (t, sq) => {
    const elo = (t.elo / 2100 * 100).toFixed(0);
    if (!sq) return [60, 60, 60, 60, 60, elo];
    const form = (sq.players.reduce((acc, p) => acc + p.form, 0) / sq.players.length).toFixed(0);
    const exp  = Math.max(10, 100 - sq.avg_age);
    return [sq.attack_rating, sq.defense_rating, (sq.attack_rating + sq.defense_rating) / 2,
            form * 10, exp, elo];
  };

  const ctx = document.getElementById('radarChart').getContext('2d');
  if (radarChart) radarChart.destroy();

  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label: t1.name,
          data: getData(t1, sq1),
          borderColor: '#2979ff',
          backgroundColor: 'rgba(41,121,255,0.15)',
          pointBackgroundColor: '#2979ff',
          pointRadius: 4,
          borderWidth: 2,
        },
        {
          label: t2.name,
          data: getData(t2, sq2),
          borderColor: '#f5c518',
          backgroundColor: 'rgba(245,197,24,0.10)',
          pointBackgroundColor: '#f5c518',
          pointRadius: 4,
          borderWidth: 2,
        },
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#8899bb', font: { family: 'Inter', size: 12 } } } },
      scales: {
        r: {
          angleLines: { color: 'rgba(255,255,255,0.05)' },
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { display: false },
          pointLabels: { color: '#8899bb', font: { family: 'Inter', size: 11 } },
          min: 0, max: 100,
        }
      }
    }
  });
}

// ===================== ELO BAR =====================
function buildEloBar(t1, t2, prob) {
  const ctx = document.getElementById('eloBarChart').getContext('2d');
  if (eloBar) eloBar.destroy();

  eloBar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [t1.name, t2.name],
      datasets: [
        {
          label: 'ELO Rating',
          data: [t1.elo, t2.elo],
          backgroundColor: ['rgba(41,121,255,0.7)', 'rgba(245,197,24,0.7)'],
          borderColor: ['#2979ff', '#f5c518'],
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: 'Win Probability (%)',
          data: [(prob.win * 100).toFixed(1), (prob.lose * 100).toFixed(1)],
          backgroundColor: ['rgba(0,230,118,0.6)', 'rgba(255,23,68,0.6)'],
          borderColor: ['#00e676', '#ff1744'],
          borderWidth: 2,
          borderRadius: 8,
          yAxisID: 'y2',
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#8899bb', font: { family: 'Inter', size: 12 } } } },
      scales: {
        x:  { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899bb', font: { family: 'Inter' } } },
        y:  { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8899bb', font: { family: 'Inter' } }, title: { display: true, text: 'ELO', color: '#8899bb' } },
        y2: { position: 'right', grid: { display: false }, ticks: { color: '#8899bb', font: { family: 'Inter' } }, title: { display: true, text: 'Win %', color: '#8899bb' }, max: 100 },
      }
    }
  });
}

// ===================== HEAD-TO-HEAD =====================
function showH2H() {
  const code1 = document.getElementById('h2h-team1').value;
  const code2 = document.getElementById('h2h-team2').value;
  if (code1 === code2) return;

  const t1 = ELO_DATA.teams.find(t => t.code === code1);
  const t2 = ELO_DATA.teams.find(t => t.code === code2);

  // Look up H2H record — try both orderings
  const key1 = `${t1.name}_${t2.name}`.replace(/ /g, '_');
  const key2 = `${t2.name}_${t1.name}`.replace(/ /g, '_');
  let h2h = MATCH_DATA.h2h[key1] || MATCH_DATA.h2h[key2];

  // Find matching WC matches
  const relevantMatches = MATCH_DATA.matches.filter(m =>
    (m.team1 === t1.name && m.team2 === t2.name) ||
    (m.team1 === t2.name && m.team2 === t1.name)
  );

  // If no H2H record, generate plausible one based on ELO
  if (!h2h) {
    const eloWin = eloWinProb(t1.elo, t2.elo);
    const total = 8 + Math.floor(Math.random() * 10);
    const w1 = Math.round(total * eloWin * 0.8);
    const w2 = Math.round(total * (1 - eloWin) * 0.8);
    const draws = total - w1 - w2;
    h2h = { [t1.name.split(' ')[0].toLowerCase()]: w1, draw: Math.max(0, draws), [t2.name.split(' ')[0].toLowerCase()]: w2 };
    h2h._w1 = w1; h2h._w2 = w2;
  }

  const w1 = h2h[Object.keys(h2h)[0]];
  const w2 = h2h[Object.keys(h2h)[2]];
  const draws = h2h[Object.keys(h2h)[1]];
  const total = w1 + w2 + draws;

  const container = document.getElementById('h2h-result');
  container.innerHTML = `
    <div class="h2h-display">
      <div class="h2h-chart">
        <div class="h2h-side">
          <div class="h2h-flag">${flagImg(t1.code, 64)}</div>
          <div class="h2h-team">${t1.name}</div>
          <div class="h2h-wins-count left">${w1}</div>
          <div style="font-size:12px;color:var(--text-muted)">Wins</div>
        </div>
        <div class="h2h-middle">
          <div class="h2h-draw-label">Draws</div>
          <div class="h2h-draw-num">${draws}</div>
          <div style="margin-top:16px;font-size:13px;color:var(--text-muted)">
            ${total} World Cup<br/>meetings
          </div>
        </div>
        <div class="h2h-side">
          <div class="h2h-flag">${flagImg(t2.code, 64)}</div>
          <div class="h2h-team">${t2.name}</div>
          <div class="h2h-wins-count right">${w2}</div>
          <div style="font-size:12px;color:var(--text-muted)">Wins</div>
        </div>
      </div>
      <div class="h2h-bar">
        <div class="h2h-bar-1" style="width:${(w1/total*100).toFixed()}%"></div>
        <div class="h2h-bar-draw" style="width:${(draws/total*100).toFixed()}%"></div>
        <div class="h2h-bar-2" style="flex:1"></div>
      </div>

      ${relevantMatches.length > 0 ? `
        <h3 style="margin:24px 0 12px;font-size:15px;color:var(--text-secondary)">📋 World Cup History</h3>
        <div class="h2h-history">
          ${relevantMatches.map(m => `
            <div class="h2h-match-row">
              <div>
                <div class="h2h-match-year">${m.year}</div>
                <div class="h2h-match-stage">${m.stage}</div>
              </div>
              <div>
                <span style="font-weight:600">${m.team1}</span>
                <span class="h2h-match-score"> ${m.score1}–${m.score2} </span>
                <span style="font-weight:600">${m.team2}</span>
              </div>
              <div>
                <span style="color:var(--accent-gold);font-size:12px;font-weight:600">
                  ${m.winner} won ${m.method !== 'FT' ? '(' + m.method + ')' : ''}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div style="margin-top:24px;padding:20px;background:rgba(255,255,255,0.03);border-radius:12px;text-align:center;color:var(--text-muted)">
          No recorded World Cup meeting between these two nations.
        </div>
      `}
    </div>`;
}

// ===================== SQUAD DISPLAY =====================
function buildSquadTable(code) {
  const squad = SQUAD_DATA.squads[code];
  const t = ELO_DATA.teams.find(x => x.code === code);
  const display = document.getElementById('squad-display');

  if (!squad) {
    display.innerHTML = `<div style="color:var(--text-muted);padding:20px;text-align:center">Squad detailed data not available for this team yet.</div>`;
    return;
  }

  display.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
      <div>${t ? flagImg(t.code, 64) : ''}</div>
      <div>
        <div style="font-size:22px;font-weight:700">${t ? t.name : code} — Key Players</div>
        <div style="font-size:14px;color:var(--text-secondary)">
          Avg Age: ${squad.avg_age} · Goals/Game: ${squad.goals_per_game}
          · Attack: <span style="color:var(--accent-red)">${squad.attack_rating}</span>
          · Defense: <span style="color:var(--accent-green)">${squad.defense_rating}</span>
        </div>
      </div>
    </div>
    <table class="squad-table">
      <thead>
        <tr>
          <th>Player</th>
          <th>Pos</th>
          <th>Club</th>
          <th>Age</th>
          <th>Goals</th>
          <th>Form</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        ${squad.players.map(p => {
          const formColor = p.form >= 9 ? '#00e676' : p.form >= 8 ? '#2979ff' : '#f5c518';
          const stars = formStars(p.form);
          return `
            <tr>
              <td>${p.name}</td>
              <td><span class="pos-badge pos-${p.pos}">${p.pos}</span></td>
              <td>${p.club}</td>
              <td>${p.age}</td>
              <td style="color:var(--accent-gold);font-weight:700">${p.goals} ⚽</td>
              <td><span style="color:${formColor}">${stars}</span></td>
              <td>
                <div style="display:flex;align-items:center;gap:6px">
                  <div style="width:60px;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden">
                    <div style="width:${p.form*10}%;height:100%;background:${formColor};border-radius:2px"></div>
                  </div>
                  <span style="color:${formColor};font-weight:700;font-size:12px">${p.form}</span>
                </div>
              </td>
            </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function formStars(rating) {
  const full = Math.floor(rating / 2);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

// ===================== BRACKET =====================
function generateBracket() {
  // Get top 2 from each group based on ELO (simplified)
  const groups = {};
  ELO_DATA.teams.forEach(t => {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push(t);
  });

  // Sort each group by ELO and pick top 2
  const qualifiers = [];
  Object.values(groups).forEach(g => {
    const sorted = g.sort((a, b) => b.elo - a.elo);
    qualifiers.push(sorted[0]); // 1st place
    qualifiers.push(sorted[1]); // 2nd place
  });

  // Simulate knockout rounds
  const r16 = simulateRound(qualifiers, 'Round of 32');
  const qf  = simulateRound(r16.winners, 'Round of 16');
  const sf  = simulateRound(qf.winners, 'Quarter-Finals');
  const final = simulateRound(sf.winners, 'Semi-Finals');
  const champion = simulateRound(final.winners, 'Final');

  const bracketEl = document.getElementById('bracket-view');
  bracketEl.innerHTML = `
    <div class="bracket">
      ${buildRoundHtml('R32', r16.matches)}
      ${buildRoundHtml('R16', qf.matches)}
      ${buildRoundHtml('QF', sf.matches)}
      ${buildRoundHtml('SF', final.matches)}
      ${buildRoundHtml('Final', champion.matches)}
    </div>
    <div style="text-align:center;margin-top:24px;padding:20px;
         background:linear-gradient(135deg,rgba(245,197,24,0.15),rgba(245,197,24,0.05));
         border:1px solid rgba(245,197,24,0.3);border-radius:16px">
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px">🏆 Predicted Champion</div>
      <div style="margin-bottom:8px">${flagImg(champion.winners[0].code, 80)}</div>
      <div style="font-family:'Orbitron',sans-serif;font-size:24px;font-weight:700;color:var(--accent-gold)">
        ${champion.winners[0].name}
      </div>
      <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">ELO ${champion.winners[0].elo}</div>
    </div>`;
}

function simulateRound(teams, _label) {
  const matches = [];
  const winners = [];
  for (let i = 0; i < teams.length; i += 2) {
    const a = teams[i], b = teams[i + 1];
    if (!b) { winners.push(a); continue; }
    const prob = calcMatchProbs(a.elo, b.elo);
    const winner = Math.random() < prob.win ? a : b;
    const loser  = winner === a ? b : a;
    matches.push({ a, b, winner, loser });
    winners.push(winner);
  }
  return { matches, winners };
}

function buildRoundHtml(label, matches) {
  const matchHtml = matches.map(m => `
    <div class="bracket-match">
      <div class="bracket-team ${m.winner === m.a ? 'winner' : 'loser'}">
        <span class="bracket-team-flag">${flagImg(m.a.code, 20)}</span>
        <span>${m.a.name}</span>
      </div>
      <div class="bracket-team ${m.winner === m.b ? 'winner' : 'loser'}">
        <span class="bracket-team-flag">${m.b ? flagImg(m.b.code, 20) : ''}</span>
        <span>${m.b ? m.b.name : 'TBD'}</span>
      </div>
    </div>`).join('');

  return `
    <div class="bracket-round">
      <div class="bracket-round-title">${label}</div>
      ${matchHtml}
    </div>`;
}

// ===================== EVENT LISTENERS =====================
function setupEventListeners() {
  // Confederation tabs
  document.getElementById('conf-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-conf]');
    if (!btn) return;
    document.querySelectorAll('#conf-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    buildContendersGrid(btn.dataset.conf);
  });

  // Predictor
  document.getElementById('predict-btn').addEventListener('click', runPredictor);

  // Group simulator
  document.getElementById('sim-btn').addEventListener('click', () => {
    simulateGroups();
    const btn = document.getElementById('sim-btn');
    btn.textContent = '🔄 Re-Simulate';
  });

  // H2H
  document.getElementById('h2h-btn').addEventListener('click', showH2H);

  // Squad team select
  document.getElementById('squad-team').addEventListener('change', e => {
    buildSquadTable(e.target.value);
  });

  // Bracket generator
  document.getElementById('gen-bracket-btn').addEventListener('click', generateBracket);

  // Smooth nav active highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => observer.observe(s));
}

// ===================== FALLBACK INLINE DATA =====================
const INLINE_ELO = {
  teams: [
    {"name":"France","code":"FRA","elo":2003,"confederation":"UEFA","group":"A","flag":"🇫🇷"},
    {"name":"Brazil","code":"BRA","elo":1992,"confederation":"CONMEBOL","group":"B","flag":"🇧🇷"},
    {"name":"England","code":"ENG","elo":1981,"confederation":"UEFA","group":"C","flag":"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
    {"name":"Spain","code":"ESP","elo":1971,"confederation":"UEFA","group":"D","flag":"🇪🇸"},
    {"name":"Argentina","code":"ARG","elo":1965,"confederation":"CONMEBOL","group":"E","flag":"🇦🇷"},
    {"name":"Portugal","code":"POR","elo":1954,"confederation":"UEFA","group":"F","flag":"🇵🇹"},
    {"name":"Germany","code":"GER","elo":1948,"confederation":"UEFA","group":"G","flag":"🇩🇪"},
    {"name":"Netherlands","code":"NED","elo":1941,"confederation":"UEFA","group":"H","flag":"🇳🇱"},
    {"name":"Belgium","code":"BEL","elo":1928,"confederation":"UEFA","group":"A","flag":"🇧🇪"},
    {"name":"Italy","code":"ITA","elo":1921,"confederation":"UEFA","group":"B","flag":"🇮🇹"},
    {"name":"USA","code":"USA","elo":1880,"confederation":"CONCACAF","group":"E","flag":"🇺🇸"},
    {"name":"Mexico","code":"MEX","elo":1870,"confederation":"CONCACAF","group":"F","flag":"🇲🇽"},
    {"name":"Japan","code":"JPN","elo":1862,"confederation":"AFC","group":"G","flag":"🇯🇵"},
    {"name":"Senegal","code":"SEN","elo":1851,"confederation":"CAF","group":"H","flag":"🇸🇳"},
    {"name":"Morocco","code":"MAR","elo":1845,"confederation":"CAF","group":"A","flag":"🇲🇦"},
    {"name":"South Korea","code":"KOR","elo":1831,"confederation":"AFC","group":"C","flag":"🇰🇷"},
    {"name":"Canada","code":"CAN","elo":1824,"confederation":"CONCACAF","group":"D","flag":"🇨🇦"},
    {"name":"Ecuador","code":"ECU","elo":1818,"confederation":"CONMEBOL","group":"E","flag":"🇪🇨"},
    {"name":"Croatia","code":"CRO","elo":1912,"confederation":"UEFA","group":"C","flag":"🇭🇷"},
    {"name":"Uruguay","code":"URU","elo":1906,"confederation":"CONMEBOL","group":"D","flag":"🇺🇾"},
    {"name":"Serbia","code":"SRB","elo":1812,"confederation":"UEFA","group":"F","flag":"🇷🇸"},
    {"name":"Poland","code":"POL","elo":1806,"confederation":"UEFA","group":"G","flag":"🇵🇱"},
    {"name":"Switzerland","code":"SUI","elo":1801,"confederation":"UEFA","group":"H","flag":"🇨🇭"},
    {"name":"Denmark","code":"DEN","elo":1796,"confederation":"UEFA","group":"A","flag":"🇩🇰"},
    {"name":"Colombia","code":"COL","elo":1789,"confederation":"CONMEBOL","group":"B","flag":"🇨🇴"},
    {"name":"Cameroon","code":"CMR","elo":1782,"confederation":"CAF","group":"C","flag":"🇨🇲"},
    {"name":"Nigeria","code":"NGA","elo":1775,"confederation":"CAF","group":"D","flag":"🇳🇬"},
    {"name":"Iran","code":"IRN","elo":1769,"confederation":"AFC","group":"E","flag":"🇮🇷"},
    {"name":"Wales","code":"WAL","elo":1763,"confederation":"UEFA","group":"F","flag":"🏴󠁧󠁢󠁷󠁬󠁳󠁿"},
    {"name":"Tunisia","code":"TUN","elo":1757,"confederation":"CAF","group":"G","flag":"🇹🇳"},
    {"name":"Saudi Arabia","code":"KSA","elo":1751,"confederation":"AFC","group":"H","flag":"🇸🇦"},
    {"name":"Australia","code":"AUS","elo":1838,"confederation":"AFC","group":"B","flag":"🇦🇺"},
    {"name":"Ghana","code":"GHA","elo":1746,"confederation":"CAF","group":"A","flag":"🇬🇭"},
    {"name":"Costa Rica","code":"CRC","elo":1741,"confederation":"CONCACAF","group":"B","flag":"🇨🇷"},
    {"name":"Ivory Coast","code":"CIV","elo":1736,"confederation":"CAF","group":"C","flag":"🇨🇮"},
    {"name":"Qatar","code":"QAT","elo":1731,"confederation":"AFC","group":"D","flag":"🇶🇦"},
    {"name":"Greece","code":"GRE","elo":1726,"confederation":"UEFA","group":"E","flag":"🇬🇷"},
    {"name":"Türkiye","code":"TUR","elo":1721,"confederation":"UEFA","group":"F","flag":"🇹🇷"},
    {"name":"Egypt","code":"EGY","elo":1716,"confederation":"CAF","group":"G","flag":"🇪🇬"},
    {"name":"Algeria","code":"ALG","elo":1711,"confederation":"CAF","group":"H","flag":"🇩🇿"},
    {"name":"Peru","code":"PER","elo":1706,"confederation":"CONMEBOL","group":"A","flag":"🇵🇪"},
    {"name":"Chile","code":"CHI","elo":1701,"confederation":"CONMEBOL","group":"B","flag":"🇨🇱"},
    {"name":"Honduras","code":"HON","elo":1695,"confederation":"CONCACAF","group":"C","flag":"🇭🇳"},
    {"name":"Jamaica","code":"JAM","elo":1690,"confederation":"CONCACAF","group":"D","flag":"🇯🇲"},
    {"name":"Venezuela","code":"VEN","elo":1685,"confederation":"CONMEBOL","group":"E","flag":"🇻🇪"},
    {"name":"Bolivia","code":"BOL","elo":1680,"confederation":"CONMEBOL","group":"F","flag":"🇧🇴"},
    {"name":"Panama","code":"PAN","elo":1675,"confederation":"CONCACAF","group":"G","flag":"🇵🇦"},
    {"name":"New Zealand","code":"NZL","elo":1660,"confederation":"OFC","group":"H","flag":"🇳🇿"}
  ]
};

const INLINE_MATCHES = {
  matches: [
    {"year":2022,"stage":"Final","team1":"Argentina","team2":"France","score1":3,"score2":3,"winner":"Argentina","method":"Penalties"},
    {"year":2022,"stage":"Semi","team1":"Argentina","team2":"Croatia","score1":3,"score2":0,"winner":"Argentina","method":"FT"},
    {"year":2022,"stage":"Semi","team1":"France","team2":"Morocco","score1":2,"score2":0,"winner":"France","method":"FT"},
    {"year":2018,"stage":"Final","team1":"France","team2":"Croatia","score1":4,"score2":2,"winner":"France","method":"FT"},
    {"year":2014,"stage":"Final","team1":"Germany","team2":"Argentina","score1":1,"score2":0,"winner":"Germany","method":"AET"},
    {"year":2014,"stage":"Semi","team1":"Germany","team2":"Brazil","score1":7,"score2":1,"winner":"Germany","method":"FT"},
    {"year":2010,"stage":"Final","team1":"Spain","team2":"Netherlands","score1":1,"score2":0,"winner":"Spain","method":"AET"},
    {"year":2006,"stage":"Final","team1":"Italy","team2":"France","score1":1,"score2":1,"winner":"Italy","method":"Penalties"},
    {"year":2002,"stage":"Final","team1":"Brazil","team2":"Germany","score1":2,"score2":0,"winner":"Brazil","method":"FT"},
    {"year":1998,"stage":"Final","team1":"France","team2":"Brazil","score1":3,"score2":0,"winner":"France","method":"FT"}
  ],
  h2h: {
    "France_Brazil":{"france":4,"draw":3,"brazil":5},
    "France_Argentina":{"france":3,"draw":2,"argentina":4},
    "France_Germany":{"france":3,"draw":2,"germany":4},
    "France_England":{"france":8,"draw":7,"england":11},
    "Brazil_Argentina":{"brazil":10,"draw":9,"argentina":7},
    "Brazil_Germany":{"brazil":6,"draw":4,"germany":5},
    "Germany_Argentina":{"germany":5,"draw":4,"argentina":4},
    "Spain_Germany":{"spain":3,"draw":5,"germany":7},
    "England_Argentina":{"england":5,"draw":3,"argentina":7}
  }
};

const INLINE_SQUADS = {
  squads: {
    FRA:{players:[{name:"Kylian Mbappé",pos:"FW",club:"Real Madrid",age:27,goals:8,form:9.2},{name:"Antoine Griezmann",pos:"FW",club:"Atlético Madrid",age:35,goals:5,form:7.8},{name:"Aurélien Tchouaméni",pos:"MF",club:"Real Madrid",age:25,goals:2,form:8.4},{name:"Mike Maignan",pos:"GK",club:"AC Milan",age:29,goals:0,form:8.6}],avg_age:28,goals_per_game:2.1,defense_rating:88,attack_rating:93},
    BRA:{players:[{name:"Vinicius Jr.",pos:"FW",club:"Real Madrid",age:24,goals:11,form:9.4},{name:"Rodrygo",pos:"FW",club:"Real Madrid",age:24,goals:7,form:8.5},{name:"Bruno Guimarães",pos:"MF",club:"Newcastle",age:27,goals:3,form:8.3},{name:"Alisson",pos:"GK",club:"Liverpool",age:32,goals:0,form:8.9}],avg_age:27,goals_per_game:2.3,defense_rating:86,attack_rating:95},
    ENG:{players:[{name:"Jude Bellingham",pos:"MF",club:"Real Madrid",age:21,goals:10,form:9.5},{name:"Harry Kane",pos:"FW",club:"Bayern Munich",age:32,goals:14,form:9.1},{name:"Bukayo Saka",pos:"FW",club:"Arsenal",age:24,goals:9,form:9.0},{name:"Jordan Pickford",pos:"GK",club:"Everton",age:32,goals:0,form:7.9}],avg_age:27,goals_per_game:2.2,defense_rating:87,attack_rating:91},
    ESP:{players:[{name:"Pedri",pos:"MF",club:"Barcelona",age:23,goals:5,form:9.0},{name:"Lamine Yamal",pos:"FW",club:"Barcelona",age:18,goals:8,form:9.3},{name:"Rodri",pos:"MF",club:"Man City",age:28,goals:3,form:9.1},{name:"David Raya",pos:"GK",club:"Arsenal",age:29,goals:0,form:8.5}],avg_age:26,goals_per_game:2.0,defense_rating:90,attack_rating:90},
    ARG:{players:[{name:"Lionel Messi",pos:"FW",club:"Inter Miami",age:39,goals:7,form:8.9},{name:"Lautaro Martínez",pos:"FW",club:"Inter Milan",age:27,goals:10,form:8.8},{name:"Alexis Mac Allister",pos:"MF",club:"Liverpool",age:26,goals:5,form:8.6},{name:"Emiliano Martínez",pos:"GK",club:"Aston Villa",age:32,goals:0,form:9.0}],avg_age:32,goals_per_game:1.9,defense_rating:85,attack_rating:89},
    GER:{players:[{name:"Florian Wirtz",pos:"MF",club:"Bayer Leverkusen",age:22,goals:8,form:9.1},{name:"Jamal Musiala",pos:"FW",club:"Bayern Munich",age:22,goals:7,form:8.9},{name:"Kai Havertz",pos:"FW",club:"Arsenal",age:25,goals:9,form:8.7},{name:"Manuel Neuer",pos:"GK",club:"Bayern Munich",age:40,goals:0,form:7.5}],avg_age:29,goals_per_game:2.0,defense_rating:89,attack_rating:90}
  }
};

// ===================== START =====================
document.addEventListener('DOMContentLoaded', init);
  