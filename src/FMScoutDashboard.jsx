import { useState, useMemo } from "react";

// ─── Mock data (replace with real props when integrating) ─────────────────────

const MOCK_PLAYERS = [
  { id:1, rank:1, name:"Marcus Fernandez",  age:20, club:"Napoli",    nation:"🇮🇹", position:"AM (C)",  foot:"R", value:"£3.0M", valueM:3.0,  wage:"£4,500", contract:"30/06/2027", scoutScore:78, valueScore:88, priority:"High",   note:"Excellent technicals and vision",      goals:14, assists:8,  xG:11.2, xA:6.1, kp:52, dribbles:2.1, tackles:1.2, aerials:38, minutes:1892 },
  { id:2, rank:2, name:"Yusuf Aydın",       age:21, club:"Fenerbahce",nation:"🇹🇷", position:"RW",      foot:"L", value:"£1.8M", valueM:1.8,  wage:"£3,200", contract:"30/06/2026", scoutScore:76, valueScore:85, priority:"High",   note:"Explosive pace, great crossing",       goals:9,  assists:11, xG:7.4,  xA:8.9, kp:44, dribbles:3.1, tackles:0.9, aerials:22, minutes:1654 },
  { id:3, rank:3, name:"Lorenzo Ricci",     age:22, club:"Udinese",   nation:"🇮🇹", position:"CM (C)",  foot:"R", value:"£4.0M", valueM:4.0,  wage:"£6,500", contract:"30/06/2027", scoutScore:74, valueScore:83, priority:"High",   note:"Box to box, excellent engine",         goals:5,  assists:6,  xG:3.8,  xA:5.2, kp:61, dribbles:1.8, tackles:2.4, aerials:42, minutes:2013 },
  { id:4, rank:4, name:"Jakub Novák",       age:20, club:"Sparta",    nation:"🇨🇿", position:"DM (C)",  foot:"R", value:"£2.5M", valueM:2.5,  wage:"£3,900", contract:"30/06/2026", scoutScore:75, valueScore:82, priority:"Medium", note:"Strong defensively, good passer",      goals:2,  assists:4,  xG:1.4,  xA:3.1, kp:38, dribbles:0.9, tackles:2.9, aerials:41, minutes:2102 },
  { id:5, rank:5, name:"Tomás Vidal",       age:21, club:"Anderlecht",nation:"🇪🇸", position:"ST (C)",  foot:"R", value:"£2.5M", valueM:2.5,  wage:"£3,900", contract:"30/06/2026", scoutScore:73, valueScore:81, priority:"High",   note:"Finishing instinct, movement",         goals:19, assists:3,  xG:15.8, xA:2.4, kp:18, dribbles:1.4, tackles:0.8, aerials:28, minutes:1745 },
  { id:6, rank:6, name:"Simone Pafundi",    age:18, club:"Udinese",   nation:"🇮🇹", position:"RW",      foot:"R", value:"£1.3M", valueM:1.3,  wage:"£2,100", contract:"30/06/2026", scoutScore:71, valueScore:78, priority:"Medium", note:"High potential winger",               goals:6,  assists:7,  xG:4.9,  xA:5.8, kp:39, dribbles:3.1, tackles:0.7, aerials:28, minutes:1302 },
  { id:7, rank:7, name:"Filip Ranocchia",   age:22, club:"Palermo",   nation:"🇮🇹", position:"DM (C)",  foot:"R", value:"£900K", valueM:0.9,  wage:"£2,000", contract:"30/06/2025", scoutScore:69, valueScore:75, priority:"Medium", note:"Good ball winner",                    goals:1,  assists:2,  xG:0.8,  xA:1.6, kp:29, dribbles:0.6, tackles:2.6, aerials:47, minutes:1856 },
  { id:8, rank:8, name:"Rares Burnete",     age:20, club:"Lecce",     nation:"🇷🇴", position:"ST (C)",  foot:"R", value:"£1.1M", valueM:1.1,  wage:"£2,300", contract:"30/06/2026", scoutScore:68, valueScore:74, priority:"Medium", note:"Physical forward, strong",            goals:7,  assists:2,  xG:6.1,  xA:1.8, kp:12, dribbles:1.1, tackles:0.5, aerials:51, minutes:1214 },
];

const MOCK_SOLD = [
  { name:"Manuel De Luca",      boughtFor:"£300K", soldFor:"£2.2M", profit:"£1.9M", seasons:2, roi:633, outcome:"Sold - Profit" },
  { name:"Nicolò Corrado",      boughtFor:"£120K", soldFor:"£1.1M", profit:"£980K", seasons:2, roi:817, outcome:"Sold - Profit" },
  { name:"Simone Bianchi",      boughtFor:"£200K", soldFor:"£850K", profit:"£650K", seasons:3, roi:325, outcome:"Sold - Profit" },
  { name:"Francesco Ardizzone", boughtFor:"£0",    soldFor:"£250K", profit:"£250K", seasons:2, roi:null, outcome:"Contract End" },
  { name:"Andrea Schenetti",    boughtFor:"£0",    soldFor:"£150K", profit:"£150K", seasons:1, roi:null, outcome:"Contract End" },
];

const MOCK_TARGETS = [
  { position:"ST (C)",  type:"Starter",  budget:"£1.5M", targets:"1. Vidal, 2. Burnete, 3. Gori",             status:"Active",     deadline:"30/08/2024" },
  { position:"AM (C)",  type:"Starter",  budget:"£2.0M", targets:"1. Fernandez, 2. Aydın, 3. Fabbian",        status:"Active",     deadline:"30/08/2024" },
  { position:"CM (C)",  type:"Starter",  budget:"£1.5M", targets:"1. Ricci, 2. Novák, 3. Verre",              status:"Active",     deadline:"30/08/2024" },
  { position:"RW",      type:"Backup",   budget:"£800K", targets:"1. Pafundi, 2. D'Alessio, 3. Coli Saco",    status:"Monitoring", deadline:"30/08/2024" },
  { position:"CB",      type:"Backup",   budget:"£600K", targets:"1. Hristov, 2. Coppolaro, 3. Simic",        status:"Monitoring", deadline:"30/08/2024" },
  { position:"LB",      type:"Backup",   budget:"£400K", targets:"1. Cotali, 2. Liotti, 3. Zanoli",           status:"Monitoring", deadline:"30/08/2024" },
  { position:"DM",      type:"Backup",   budget:"£500K", targets:"1. Ranocchia, 2. Palumbo, 3. Vandeputte",   status:"Monitoring", deadline:"30/08/2024" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const scoreColor = (s) => s >= 80 ? "#4ade80" : s >= 60 ? "#facc15" : s >= 40 ? "#fb923c" : "#f87171";
const scoreBg    = (s) => s >= 80 ? "rgba(74,222,128,0.18)" : s >= 60 ? "rgba(250,204,21,0.18)" : "rgba(248,113,113,0.18)";
const priorityStyle = (p) => p === "High"
  ? { background:"#4ade80", color:"#052e16", fontWeight:700 }
  : { background:"#facc15", color:"#1c1917", fontWeight:700 };

// ─── Styled table header ──────────────────────────────────────────────────────

function TH({ children, onClick, sorted, dir, right = false }) {
  return (
    <th onClick={onClick} style={{
      padding:"8px 10px", fontSize:11, fontWeight:700, color:"#94a3b8",
      textTransform:"uppercase", letterSpacing:"0.06em", whiteSpace:"nowrap",
      cursor:onClick?"pointer":"default", userSelect:"none",
      textAlign:right?"right":"left", background:"#0f172a",
      borderBottom:"1px solid #1e3a5f", position:"sticky", top:0, zIndex:2,
    }}>
      <span style={{display:"flex", alignItems:"center", gap:4, justifyContent:right?"flex-end":"flex-start"}}>
        {children}
        {sorted && <span style={{color:"#4ade80", fontSize:10}}>{dir==="desc"?"▼":"▲"}</span>}
      </span>
    </th>
  );
}

function TD({ children, right = false, mono = false, style: extra = {} }) {
  return (
    <td style={{
      padding:"7px 10px", fontSize:12, color:"#cbd5e1",
      borderBottom:"1px solid #1e293b", whiteSpace:"nowrap",
      textAlign:right?"right":"left",
      fontFamily:mono?"'Courier New',monospace":"inherit",
      ...extra
    }}>
      {children}
    </td>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ number, title, icon }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
      <div style={{ width:24, height:24, background:"#1e3a5f", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#4ade80", flexShrink:0 }}>
        {number}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:12, color:"#64748b" }}>{icon}</span>
        <span style={{ fontSize:13, fontWeight:700, color:"#e2e8f0", letterSpacing:"0.08em", textTransform:"uppercase" }}>{title}</span>
      </div>
    </div>
  );
}

// ─── Score badge ──────────────────────────────────────────────────────────────

function ScoreBadge({ score }) {
  return (
    <span style={{ background:scoreBg(score), color:scoreColor(score), fontFamily:"'Courier New',monospace", fontWeight:700, fontSize:13, padding:"2px 9px", borderRadius:4, border:`1px solid ${scoreColor(score)}50` }}>
      {score}
    </span>
  );
}

// ─── Section 1: Master Shortlist ──────────────────────────────────────────────

function MasterShortlist({ players }) {
  const [sortKey, setSortKey] = useState("valueScore");
  const [sortDir, setSortDir] = useState("desc");

  const sorted = useMemo(() => {
    return [...players].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number") return sortDir === "desc" ? bv - av : av - bv;
      return sortDir === "desc" ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
    });
  }, [players, sortKey, sortDir]);

  const toggle = (k) => { if (sortKey === k) setSortDir(d => d === "desc" ? "asc" : "desc"); else { setSortKey(k); setSortDir("desc"); } };
  const isSorted = (k) => sortKey === k;

  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
        <thead>
          <tr>
            <TH></TH>
            <TH onClick={()=>toggle("name")}     sorted={isSorted("name")}       dir={sortDir}>Player</TH>
            <TH onClick={()=>toggle("age")}      sorted={isSorted("age")}        dir={sortDir}>Age</TH>
            <TH>Club</TH>
            <TH>Nation</TH>
            <TH>Pos</TH>
            <TH>Foot</TH>
            <TH onClick={()=>toggle("valueM")}   sorted={isSorted("valueM")}     dir={sortDir} right>Value</TH>
            <TH onClick={()=>toggle("wage")}     sorted={isSorted("wage")}       dir={sortDir} right>Wage p/w</TH>
            <TH>Contract Ends</TH>
            <TH onClick={()=>toggle("scoutScore")}sorted={isSorted("scoutScore")}dir={sortDir} right>Scout /100</TH>
            <TH onClick={()=>toggle("valueScore")}sorted={isSorted("valueScore")}dir={sortDir} right>Value /100</TH>
            <TH>Priority</TH>
            <TH>Notes</TH>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => (
            <tr key={p.id}
              style={{ background: i % 2 === 0 ? "#0f172a" : "#0d1526" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1e2d45"}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#0f172a" : "#0d1526"}>
              <TD mono style={{ color:"#475569", width:28, paddingRight:0 }}>{i + 1}</TD>
              <TD style={{ fontWeight:600, color:"#f1f5f9" }}>{p.name}</TD>
              <TD mono style={{ color: p.age <= 21 ? "#4ade80" : p.age >= 28 ? "#fb923c" : "#94a3b8" }}>{p.age}</TD>
              <TD style={{ color:"#94a3b8" }}>{p.club}</TD>
              <TD>{p.nation}</TD>
              <TD style={{ color:"#7dd3fc" }}>{p.position}</TD>
              <TD mono style={{ color:"#94a3b8" }}>{p.foot}</TD>
              <TD right mono style={{ color:"#f1f5f9" }}>{p.value}</TD>
              <TD right mono style={{ color:"#94a3b8" }}>£{p.wage.replace("£","")}</TD>
              <TD style={{ color:"#64748b" }}>{p.contract}</TD>
              <TD right><ScoreBadge score={p.scoutScore} /></TD>
              <TD right><ScoreBadge score={p.valueScore} /></TD>
              <TD>
                <span style={{ ...priorityStyle(p.priority), padding:"2px 10px", borderRadius:3, fontSize:11 }}>
                  {p.priority}
                </span>
              </TD>
              <TD style={{ color:"#64748b", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis" }}>{p.note}</TD>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Section 2: Moneyball Metrics ─────────────────────────────────────────────

function MoneyballMetrics({ players }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
        <thead>
          <tr>
            <TH>Player</TH>
            <TH right>xG</TH>
            <TH right>xA</TH>
            <TH right>KP</TH>
            <TH right>Dribbles</TH>
            <TH right>Tackles Won</TH>
            <TH right>Aerial % Won</TH>
            <TH right>Minutes Played</TH>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={p.id}
              style={{ background: i % 2 === 0 ? "#0f172a" : "#0d1526" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1e2d45"}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#0f172a" : "#0d1526"}>
              <TD style={{ fontWeight:500, color:"#f1f5f9" }}>{p.name}</TD>
              <TD right mono style={{ color: p.xG > 10 ? "#4ade80" : p.xG > 5 ? "#facc15" : "#94a3b8" }}>{p.xG.toFixed(2)}</TD>
              <TD right mono style={{ color: p.xA > 7 ? "#4ade80" : p.xA > 3 ? "#facc15" : "#94a3b8" }}>{p.xA.toFixed(2)}</TD>
              <TD right mono style={{ color: p.kp > 45 ? "#4ade80" : p.kp > 25 ? "#facc15" : "#94a3b8" }}>{p.kp}</TD>
              <TD right mono style={{ color: p.dribbles > 2.5 ? "#4ade80" : p.dribbles > 1.5 ? "#facc15" : "#94a3b8" }}>{p.dribbles.toFixed(2)}</TD>
              <TD right mono style={{ color: p.tackles > 2 ? "#4ade80" : p.tackles > 1 ? "#facc15" : "#94a3b8" }}>{p.tackles.toFixed(2)}</TD>
              <TD right mono style={{ color: p.aerials > 45 ? "#4ade80" : p.aerials > 30 ? "#facc15" : "#94a3b8" }}>{p.aerials}%</TD>
              <TD right mono style={{ color: p.minutes > 1800 ? "#4ade80" : p.minutes > 900 ? "#facc15" : "#94a3b8" }}>{p.minutes.toLocaleString()}</TD>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Section 3: Value Score Model ─────────────────────────────────────────────

function ValueScoreModel({ players }) {
  const [selected, setSelected] = useState(players[0]);
  const top5 = [...players].sort((a, b) => b.valueScore - a.valueScore).slice(0, 5);

  const metrics = [
    { metric:"Age Score (U23 best)", weight:"20%", score:selected.age <= 23 ? 85 : selected.age <= 26 ? 70 : 50, desc:"Youth premium" },
    { metric:"Transfer Value Score",  weight:"20%", score:selected.valueM < 2 ? 90 : selected.valueM < 5 ? 75 : 55, desc:"Value for money" },
    { metric:"Performance Score",     weight:"30%", score:selected.scoutScore, desc:"Stats quality" },
    { metric:"Potential Ability",     weight:"20%", score:selected.age <= 21 ? 90 : 75, desc:"Development ceiling" },
    { metric:"Wage Demand Score",     weight:"10%", score:selected.valueScore - 5, desc:"Wage vs output" },
  ];

  const total = metrics.reduce((s, m) => s + (m.score * parseFloat(m.weight) / 100), 0).toFixed(1);

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
      {/* Breakdown table */}
      <div style={{ gridColumn:"1/2" }}>
        <div style={{ marginBottom:10 }}>
          <label style={{ fontSize:11, color:"#64748b", marginBottom:4, display:"block" }}>Select player:</label>
          <select value={selected.id} onChange={e => setSelected(players.find(p => p.id === parseInt(e.target.value)))}
            style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:4, color:"#e2e8f0", fontSize:12, padding:"5px 8px", width:"100%" }}>
            {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
          <thead>
            <tr style={{ background:"#0f172a" }}>
              <th style={{ padding:"7px 8px", color:"#64748b", textAlign:"left", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", fontSize:10, borderBottom:"1px solid #1e3a5f" }}>Metric</th>
              <th style={{ padding:"7px 8px", color:"#64748b", textAlign:"right", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", fontSize:10, borderBottom:"1px solid #1e3a5f" }}>Weight</th>
              <th style={{ padding:"7px 8px", color:"#64748b", textAlign:"right", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", fontSize:10, borderBottom:"1px solid #1e3a5f" }}>Score</th>
              <th style={{ padding:"7px 8px", color:"#64748b", textAlign:"right", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", fontSize:10, borderBottom:"1px solid #1e3a5f" }}>Weighted</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, i) => {
              const weighted = (m.score * parseFloat(m.weight) / 100).toFixed(1);
              return (
                <tr key={i} style={{ background: i % 2 === 0 ? "#0f172a" : "#0d1526" }}>
                  <td style={{ padding:"6px 8px", color:"#94a3b8", fontSize:11, borderBottom:"1px solid #1e293b" }}>{m.metric}</td>
                  <td style={{ padding:"6px 8px", color:"#64748b", textAlign:"right", fontFamily:"monospace", fontSize:11, borderBottom:"1px solid #1e293b" }}>{m.weight}</td>
                  <td style={{ padding:"6px 8px", textAlign:"right", borderBottom:"1px solid #1e293b" }}><ScoreBadge score={m.score} /></td>
                  <td style={{ padding:"6px 8px", color:"#4ade80", textAlign:"right", fontFamily:"monospace", fontWeight:700, fontSize:12, borderBottom:"1px solid #1e293b" }}>{weighted}</td>
                </tr>
              );
            })}
            <tr style={{ background:"#0f172a", borderTop:"2px solid #1e3a5f" }}>
              <td colSpan={2} style={{ padding:"8px 8px", color:"#e2e8f0", fontWeight:700, fontSize:12 }}>TOTAL</td>
              <td style={{ padding:"8px 8px", color:"#e2e8f0", fontWeight:700, textAlign:"right", fontFamily:"monospace" }}>100%</td>
              <td style={{ padding:"8px 8px", textAlign:"right" }}>
                <span style={{ background:"#4ade80", color:"#052e16", fontFamily:"monospace", fontWeight:700, fontSize:14, padding:"3px 10px", borderRadius:4 }}>{selected.valueScore}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Score guide */}
      <div>
        <div style={{ fontSize:11, fontWeight:700, color:"#e2e8f0", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Value Score Guide</div>
        {[
          { range:"80 – 100", label:"Excellent Value",  sub:"Strong target",     color:"#4ade80" },
          { range:"60 – 79",  label:"Good Value",       sub:"Worth monitoring",  color:"#facc15" },
          { range:"40 – 59",  label:"Average Value",    sub:"Situational",       color:"#fb923c" },
          { range:"0 – 39",   label:"Poor Value",       sub:"Avoid / Too risky", color:"#f87171" },
        ].map(({ range, label, sub, color }) => (
          <div key={range} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, padding:"8px 10px", background:"#0d1526", borderRadius:4, border:`1px solid ${color}30` }}>
            <div style={{ background:color, color:"#0f172a", fontFamily:"monospace", fontWeight:700, fontSize:11, padding:"2px 8px", borderRadius:3, minWidth:64, textAlign:"center" }}>{range}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:"#e2e8f0" }}>{label}</div>
              <div style={{ fontSize:10, color:"#64748b" }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Top 5 */}
      <div>
        <div style={{ fontSize:11, fontWeight:700, color:"#e2e8f0", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Top 5 Value Scores ⭐</div>
        {top5.map((p, i) => (
          <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, padding:"8px 10px", background:"#0d1526", borderRadius:4 }}>
            <div style={{ fontSize:14, fontWeight:700, color:["#f59e0b","#94a3b8","#b45309","#64748b","#64748b"][i], width:20 }}>
              {["①","②","③","④","⑤"][i]}
            </div>
            <div style={{ flex:1, fontSize:12, fontWeight:600, color:"#e2e8f0" }}>{p.name}</div>
            <ScoreBadge score={p.valueScore} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 4: Transfer Window Board ────────────────────────────────────────

function TransferWindowBoard({ targets }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"160px 1fr", gap:20 }}>
      {/* Budget info */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {[
          { label:"Transfer Budget", value:"£1.10M", color:"#4ade80" },
          { label:"Wage Budget p/w", value:"£18,000", color:"#4ade80" },
          { label:"Window", value:"Summer 2024", color:"#7dd3fc" },
          { label:"Focus", value:"Value + Potential", color:"#4ade80" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:"#0d1526", borderRadius:6, padding:"10px 12px", border:"1px solid #1e3a5f" }}>
            <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{label}</div>
            <div style={{ fontSize:15, fontWeight:700, color, fontFamily:"monospace" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Targets table */}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr>
              {["Position Needed","Starter / Backup","Budget","Top Targets (Ranked)","Status","Deadline"].map(h => (
                <th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", background:"#0f172a", borderBottom:"1px solid #1e3a5f" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {targets.map((t, i) => (
              <tr key={i}
                style={{ background: i % 2 === 0 ? "#0f172a" : "#0d1526" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e2d45"}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#0f172a" : "#0d1526"}>
                <td style={{ padding:"7px 10px", color:"#7dd3fc", fontWeight:600, fontSize:12, borderBottom:"1px solid #1e293b" }}>{t.position}</td>
                <td style={{ padding:"7px 10px", color:"#94a3b8", fontSize:12, borderBottom:"1px solid #1e293b" }}>{t.type}</td>
                <td style={{ padding:"7px 10px", color:"#4ade80", fontFamily:"monospace", fontWeight:600, fontSize:12, borderBottom:"1px solid #1e293b" }}>{t.budget}</td>
                <td style={{ padding:"7px 10px", color:"#64748b", fontSize:11, borderBottom:"1px solid #1e293b" }}>{t.targets}</td>
                <td style={{ padding:"7px 10px", borderBottom:"1px solid #1e293b" }}>
                  <span style={{ background: t.status === "Active" ? "rgba(74,222,128,0.15)" : "rgba(250,204,21,0.15)", color: t.status === "Active" ? "#4ade80" : "#facc15", border:`1px solid ${t.status === "Active" ? "#4ade8050" : "#facc1550"}`, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:3 }}>
                    {t.status}
                  </span>
                </td>
                <td style={{ padding:"7px 10px", color:"#64748b", fontFamily:"monospace", fontSize:11, borderBottom:"1px solid #1e293b" }}>{t.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section 5: Sold / Success Tracker ───────────────────────────────────────

function SoldTracker({ sold }) {
  const totalSpent    = "£620K";
  const totalReceived = "£4.55M";
  const totalProfit   = "£3.93M";
  const avgROI        = "592%";

  return (
    <div>
      <div style={{ overflowX:"auto", marginBottom:16 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr>
              {["Player","Bought For","Sold For","Profit","Seasons With Club","ROI %","Outcome"].map(h => (
                <th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", background:"#0f172a", borderBottom:"1px solid #1e3a5f" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sold.map((s, i) => (
              <tr key={i}
                style={{ background: i % 2 === 0 ? "#0f172a" : "#0d1526" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e2d45"}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#0f172a" : "#0d1526"}>
                <td style={{ padding:"7px 10px", fontWeight:600, color:"#f1f5f9", fontSize:12, borderBottom:"1px solid #1e293b" }}>{s.name}</td>
                <td style={{ padding:"7px 10px", color:"#94a3b8", fontFamily:"monospace", fontSize:12, borderBottom:"1px solid #1e293b" }}>{s.boughtFor}</td>
                <td style={{ padding:"7px 10px", color:"#7dd3fc", fontFamily:"monospace", fontWeight:600, fontSize:12, borderBottom:"1px solid #1e293b" }}>{s.soldFor}</td>
                <td style={{ padding:"7px 10px", color:"#4ade80", fontFamily:"monospace", fontWeight:700, fontSize:12, borderBottom:"1px solid #1e293b" }}>{s.profit}</td>
                <td style={{ padding:"7px 10px", color:"#94a3b8", fontFamily:"monospace", fontSize:12, borderBottom:"1px solid #1e293b" }}>{s.seasons}</td>
                <td style={{ padding:"7px 10px", borderBottom:"1px solid #1e293b" }}>
                  {s.roi ? <span style={{ color:"#4ade80", fontFamily:"monospace", fontWeight:700 }}>{s.roi}%</span> : <span style={{ color:"#475569" }}>—</span>}
                </td>
                <td style={{ padding:"7px 10px", borderBottom:"1px solid #1e293b" }}>
                  <span style={{ fontSize:11, color: s.outcome.includes("Profit") ? "#4ade80" : "#94a3b8" }}>{s.outcome}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
        {[
          { label:"Total Spent",    value:totalSpent,    color:"#f87171" },
          { label:"Total Received", value:totalReceived, color:"#7dd3fc" },
          { label:"Total Profit",   value:totalProfit,   color:"#4ade80" },
          { label:"Average ROI",    value:avgROI,        color:"#4ade80" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:"#0d1526", border:"1px solid #1e3a5f", borderRadius:6, padding:"12px 14px", textAlign:"center" }}>
            <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>{label}</div>
            <div style={{ fontSize:20, fontWeight:700, color, fontFamily:"monospace" }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function FMScoutDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label:"Master Shortlist",       icon:"☰" },
    { label:"Moneyball Metrics",      icon:"📊" },
    { label:"Value Score Model",      icon:"🧮" },
    { label:"Transfer Window Board",  icon:"🔄" },
    { label:"Sold / Success Tracker", icon:"✅" },
  ];

  return (
    <div style={{
      background:"#0a0f1e",
      minHeight:"100vh",
      fontFamily:"'Trebuchet MS', 'Segoe UI', sans-serif",
      color:"#e2e8f0",
    }}>

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(135deg, #0f172a 0%, #0a1628 100%)", borderBottom:"2px solid #1e3a5f", padding:"16px 24px" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            {/* Logo mark */}
            <div style={{ width:52, height:52, background:"linear-gradient(135deg,#1e3a5f,#0f172a)", border:"2px solid #4ade80", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
              <div style={{ fontSize:9, fontWeight:900, color:"#4ade80", letterSpacing:"0.05em", lineHeight:1 }}>FM</div>
              <div style={{ fontSize:9, fontWeight:900, color:"#4ade80", letterSpacing:"0.05em", lineHeight:1 }}>VS</div>
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                <span style={{ fontSize:26, fontWeight:900, color:"#f1f5f9", letterSpacing:"-0.5px" }}>FM VALUE</span>
                <span style={{ fontSize:26, fontWeight:900, color:"#4ade80", letterSpacing:"-0.5px" }}>SCOUT</span>
              </div>
              <div style={{ fontSize:11, color:"#64748b", fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", marginTop:-2 }}>Moneyball Scouting Spreadsheet</div>
            </div>
          </div>

          {/* Quote */}
          <div style={{ textAlign:"center", flex:1, margin:"0 40px" }}>
            <div style={{ fontSize:13, color:"#94a3b8", fontStyle:"italic", lineHeight:1.5 }}>
              "It's not about finding the best players,<br />it's about finding the best value."
            </div>
          </div>

          {/* Info box */}
          <div style={{ background:"#0d1526", border:"1px solid #1e3a5f", borderRadius:8, padding:"10px 16px", minWidth:180 }}>
            {[
              { label:"BUDGET",  value:"£1.10M", color:"#4ade80" },
              { label:"WINDOW",  value:"Summer 2024", color:"#7dd3fc" },
              { label:"PLAYERS", value:`${MOCK_PLAYERS.length} scouted`, color:"#94a3b8" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <span style={{ fontSize:10, color:"#475569", fontWeight:700, letterSpacing:"0.08em" }}>{label}</span>
                <span style={{ fontSize:12, color, fontWeight:700, fontFamily:"monospace" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab navigation ── */}
      <div style={{ background:"#0d1526", borderBottom:"1px solid #1e3a5f" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"flex" }}>
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              padding:"14px 22px", border:"none", background:"none", cursor:"pointer",
              fontSize:12, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase",
              color: activeTab === i ? "#4ade80" : "#64748b",
              borderBottom: activeTab === i ? "2px solid #4ade80" : "2px solid transparent",
              display:"flex", alignItems:"center", gap:7, transition:"all 0.15s",
              marginBottom:-1,
            }}>
              <span style={{ fontSize:13 }}>{tab.icon}</span>
              {i === 0 && activeTab === 0 && (
                <span style={{ background:"#4ade80", color:"#052e16", fontSize:10, padding:"1px 6px", borderRadius:3, fontWeight:700 }}>
                  {MOCK_PLAYERS.length}
                </span>
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"20px 24px" }}>

        {/* Section number + title */}
        <div style={{ marginBottom:16 }}>
          <SectionHeader
            number={activeTab + 1}
            title={tabs[activeTab].label}
            icon={tabs[activeTab].icon}
          />
        </div>

        {/* Panel */}
        <div style={{ background:"#0d1526", border:"1px solid #1e3a5f", borderRadius:10, overflow:"hidden" }}>
          <div style={{ padding:"16px 20px" }}>
            {activeTab === 0 && <MasterShortlist players={MOCK_PLAYERS} />}
            {activeTab === 1 && <MoneyballMetrics players={MOCK_PLAYERS} />}
            {activeTab === 2 && <ValueScoreModel players={MOCK_PLAYERS} />}
            {activeTab === 3 && <TransferWindowBoard targets={MOCK_TARGETS} />}
            {activeTab === 4 && <SoldTracker sold={MOCK_SOLD} />}
          </div>
        </div>

        {/* All 5 sections stacked (full view) */}
        <div style={{ marginTop:24 }}>
          <div style={{ fontSize:10, color:"#334155", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16, textAlign:"center" }}>── Full Dashboard View ──</div>

          {[
            { number:1, title:"Master Shortlist",       icon:"☰",  content:<MasterShortlist players={MOCK_PLAYERS}/> },
            { number:2, title:"Moneyball Metrics",      icon:"📊", content:<MoneyballMetrics players={MOCK_PLAYERS}/> },
            { number:3, title:"Value Score Model",      icon:"🧮", content:<ValueScoreModel players={MOCK_PLAYERS}/> },
            { number:4, title:"Transfer Window Board",  icon:"🔄", content:<TransferWindowBoard targets={MOCK_TARGETS}/> },
            { number:5, title:"Sold / Success Tracker", icon:"✅", content:<SoldTracker sold={MOCK_SOLD}/> },
          ].map(({ number, title, icon, content }) => (
            <div key={number} style={{ marginBottom:20 }}>
              <SectionHeader number={number} title={title} icon={icon} />
              <div style={{ background:"#0d1526", border:"1px solid #1e3a5f", borderRadius:10, overflow:"hidden", padding:"16px 20px" }}>
                {content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ background:"#0a0f1e", borderTop:"1px solid #1e293b", padding:"20px 24px", marginTop:24 }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:24, alignItems:"start" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, background:"linear-gradient(135deg,#1e3a5f,#0f172a)", border:"2px solid #4ade80", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:10, fontWeight:900, color:"#4ade80" }}>VS</span>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"#f1f5f9" }}>FM VALUE SCOUT</div>
              <div style={{ fontSize:10, color:"#64748b" }}>Smarter Recruitment. Better Decisions.</div>
            </div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:14, color:"#94a3b8", fontStyle:"italic" }}>"We don't buy stars.<br />We build them."</div>
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Scouting Philosophy</div>
            {[
              { icon:"📊", label:"DATA", sub:"Over Reputation" },
              { icon:"💰", label:"VALUE", sub:"Over Price" },
              { icon:"⚡", label:"POTENTIAL", sub:"Over Current Ability" },
              { icon:"♻️", label:"SUSTAINABILITY", sub:"Over Short-Term Uty" },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
                <span style={{ fontSize:12 }}>{icon}</span>
                <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8" }}>{label}</span>
                <span style={{ fontSize:10, color:"#475569" }}>{sub}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Notes</div>
            {["Update data regularly","Focus on minutes played","Don't overpay for potential","Use value score as primary filter"].map(n => (
              <div key={n} style={{ fontSize:11, color:"#475569", marginBottom:4 }}>• {n}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
