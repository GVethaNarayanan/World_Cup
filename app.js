/* =============================================================
   WC2026.AI — Main Application Logic
   World Cup 2026 Prediction Dashboard
============================================================= */

// Team visual data: 2-letter code + primary color per nation
const TEAM_VISUAL = {
  FRA:{ iso:'FR', color:'#002395' }, BRA:{ iso:'BR', color:'#009C3B' },
  ENG:{ iso:'EN', color:'#CF091C' }, ESP:{ iso:'ES', color:'#AA151B' },
  ARG:{ iso:'AR', color:'#74ACDF' }, POR:{ iso:'PT', color:'#006600' },
  GER:{ iso:'DE', color:'#333333' }, NED:{ iso:'NL', color:'#FF6600' },
  BEL:{ iso:'BE', color:'#EF3340' }, ITA:{ iso:'IT', color:'#009246' },
  CRO:{ iso:'HR', color:'#FF0000' }, URU:{ iso:'UY', color:'#75AADB' },
  USA:{ iso:'US', color:'#B22234' }, MEX:{ iso:'MX', color:'#006847' },
  JPN:{ iso:'JP', color:'#BC002D' }, SEN:{ iso:'SN', color:'#00853F' },
  MAR:{ iso:'MA', color:'#C1272D' }, AUS:{ iso:'AU', color:'#00843D' },
  KOR:{ iso:'KR', color:'#CD2E3A' }, CAN:{ iso:'CA', color:'#FF0000' },
  ECU:{ iso:'EC', color:'#FFD100' }, SRB:{ iso:'SR', color:'#C6363C' },
  POL:{ iso:'PL', color:'#DC143C' }, SUI:{ iso:'CH', color:'#FF0000' },
  DEN:{ iso:'DK', color:'#C60C30' }, COL:{ iso:'CO', color:'#FDD116' },
  CMR:{ iso:'CM', color:'#007A5E' }, NGA:{ iso:'NG', color:'#008751' },
  IRN:{ iso:'IR', color:'#239F40' }, WAL:{ iso:'WL', color:'#C8102E' },
  TUN:{ iso:'TN', color:'#E70013' }, KSA:{ iso:'SA', color:'#006C35' },
  GHA:{ iso:'GH', color:'#006B3F' }, CRC:{ iso:'CR', color:'#002B7F' },
  CIV:{ iso:'CI', color:'#F77F00' }, QAT:{ iso:'QA', color:'#8D1B3D' },
  GRE:{ iso:'GR', color:'#0D5EAF' }, TUR:{ iso:'TR', color:'#E30A17' },
  EGY:{ iso:'EG', color:'#CE1126' }, ALG:{ iso:'DZ', color:'#006233' },
  PER:{ iso:'PE', color:'#D91023' }, CHI:{ iso:'CL', color:'#D52B1E' },
  HON:{ iso:'HN', color:'#0073CF' }, JAM:{ iso:'JM', color:'#000000' },
  VEN:{ iso:'VE', color:'#CF142B' }, BOL:{ iso:'BO', color:'#D52B1E' },
  PAN:{ iso:'PA', color:'#DA121A' }, NZL:{ iso:'NZ', color:'#00247D' }
};

// Returns a styled flag badge for a team code
function flagImg(code, size = 28) {
  const v = TEAM_VISUAL[code];
  if (!v) return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${Math.round(size*0.67)}px;background:#1a2a4a;border-radius:4px;font-size:${Math.max(8,size*0.32)}px;font-weight:700;color:rgba(255,255,255,0.6);letter-spacing:0">?</span>`;
  const h = Math.round(size * 0.67);
  const fs = Math.max(7, Math.round(size * 0.33));
  // Light text on dark colors, dark text on bright yellows
  const brightColors = ['#FFD100','#FDD116'];
  const textColor = brightColors.includes(v.color) ? '#000' : '#fff';
  return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${h}px;background:${v.color};border-radius:4px;font-size:${fs}px;font-weight:800;color:${textColor};letter-spacing:0.03em;font-family:'Inter',sans-serif;flex-shrink:0">${v.iso}</span>`;
}

function flagImgLg(code) { return flagImg(code, 60); }
function parseTwemoji() { /* no-op */ }

let ELO_DATA = null;
let MATCH_DATA = null;
let SQUAD_DATA = null;

let radarChart = null;
let eloBar = null;
let currentConf = 'all';

// ===================== INIT =====================
async function init() {
  try {
    const [eloRes, matchRes, squadRes] = await Promise.all([
      fetch('./data/elo_ratings.json'),
      fetch('./data/historical_matches.json'),
      fetch('./data/squads.json'),
    ]);
    ELO_DATA   = await eloRes.json();
    MATCH_DATA = await matchRes.json();
    SQUAD_DATA = await squadRes.json();
  } catch (e) {
    console.warn('Data fetch failed, using inline fallback', e);
    ELO_DATA   = INLINE_ELO;
    MATCH_DATA = INLINE_MATCHES;
    SQUAD_DATA = INLINE_SQUADS;
  }

  startCountdown();
  buildTicker();
  buildContendersGrid('all');
  buildGroupStage();
  populateSelects();
  buildSquadTable('FRA');
  updateTopFavorite();
  setupEventListeners();
}

// ===================== COUNTDOWN =====================
function startCountdown() {
  const target = new Date('2026-06-11T18:00:00Z'); // WC2026 Opening ceremony
  function tick() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      document.getElementById('cd-days').textContent  = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent  = '00';
      document.getElementById('cd-secs').textContent  = '00';
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);
    document.getElementById('cd-days').textContent  = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-mins').textContent  = pad(mins);
    document.getElementById('cd-secs').textContent  = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
}

function pad(n) { return String(n).padStart(2, '0'); }

// ===================== TICKER =====================
function buildTicker() {
  const teams = ELO_DATA.teams.slice(0, 16);
  const changes = ['+1.2%','−0.8%','+2.1%','−1.5%','+0.7%','−0.3%','+1.8%','−2.2%',
                   '+0.4%','−1.1%','+3.0%','−0.6%','+1.5%','−0.9%','+0.2%','−1.7%'];
  const odds = eloToOdds(teams);
  let html = '';

  // Duplicate for seamless loop
  for (let i = 0; i < 2; i++) {
    teams.forEach((t, idx) => {
      const up = changes[idx].startsWith('+');
      html += `
        <div class="ticker-item">
          <span class="ticker-flag">${flagImg(t.code, 20)}</span>
          <span class="ticker-name">${t.name}</span>
          <span class="ticker-odds">${odds[idx]}x</span>
          <span class="${up ? 'ticker-change-up' : 'ticker-change-down'}">${changes[idx]}</span>
        </div>`;
    });
  }
  document.getElementById('ticker').innerHTML = html;
}

function eloToOdds(teams) {
  const maxElo = Math.max(...teams.map(t => t.elo));
  return teams.map(t => {
    const prob = eloWinProb(t.elo, maxElo - 80);
    return (1 / prob).toFixed(2);
  });
}

// ===================== ELO WIN PROBABILITY =====================
function eloWinProb(eloA, eloB) {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

function calcMatchProbs(eloA, eloB) {
  const raw = eloWinProb(eloA, eloB);
  // Adjust for draw probability (~25% average in football)
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

function runPredictor() {
  const code1 = document.getElementById('pred-team1').value;
  const code2 = document.getElementById('pred-team2').value;
  if (code1 === code2) return;

  const t1 = ELO_DATA.teams.find(t => t.code === code1);
  const t2 = ELO_DATA.teams.find(t => t.code === code2);
  const prob = calcMatchProbs(t1.elo, t2.elo);

  document.getElementById('pr-flag1').innerHTML = flagImg(t1.code, 72);
  document.getElementById('pr-name1').textContent = t1.name;
  document.getElementById('pr-pct1').textContent = (prob.win * 100).toFixed(1) + '%';

  document.getElementById('pr-flag2').innerHTML = flagImg(t2.code, 72);
  document.getElementById('pr-name2').textContent = t2.name;
  document.getElementById('pr-pct2').textContent = (prob.lose * 100).toFixed(1) + '%';

  document.getElementById('pr-draw').textContent  = (prob.draw * 100).toFixed(1) + '%';

  document.getElementById('pr-bar1').style.width       = (prob.win  * 100) + '%';
  document.getElementById('pr-bar-draw').style.width   = (prob.draw * 100) + '%';
  document.getElementById('pr-bar2').style.width       = (prob.lose * 100) + '%';

  document.getElementById('pred-result').style.display = 'block';

  buildRadarChart(t1, t2);
  buildEloBar(t1, t2, prob);
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
