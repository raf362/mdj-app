import { useState, useEffect } from "react";

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;

// --- Tes constantes de données (FS, DV, NET, SEC, ALL, RMS, CERTS) ---
const FS=[
  {id:'internet',t:'Internet & Web',lv:1,d:[],rm:'fs'},
  {id:'html',t:'HTML',lv:1,d:['internet'],rm:'fs'},
  {id:'css',t:'CSS',lv:2,d:['html'],rm:'fs'},
  {id:'js',t:'JavaScript',lv:2,d:['html'],rm:'fs'},
  {id:'git',t:'Git & GitHub',lv:2,d:['internet'],rm:'fs'},
  {id:'react',t:'React',lv:3,d:['js'],rm:'fs'},
  {id:'node',t:'Node.js',lv:3,d:['js'],rm:'fs'},
  {id:'express',t:'Express.js',lv:4,d:['node'],rm:'fs'},
  {id:'sql',t:'SQL & PostgreSQL',lv:4,d:['node'],rm:'fs'},
  {id:'mongo',t:'MongoDB',lv:4,d:['node'],rm:'fs'},
  {id:'rest',t:'REST APIs',lv:5,d:['express'],rm:'fs'},
  {id:'auth',t:'Authentification',lv:5,d:['rest'],rm:'fs'},
  {id:'deploy',t:'Déploiement Web',lv:5,d:['git','rest'],rm:'fs'},
];
const DV=[
  {id:'linux',t:'Linux Basics',lv:1,d:[],rm:'dv'},
  {id:'net_dv',t:'Réseaux & DNS',lv:1,d:['linux'],rm:'dv'},
  {id:'git_dv',t:'Git avancé',lv:2,d:['linux'],rm:'dv'},
  {id:'docker',t:'Docker',lv:2,d:['linux'],rm:'dv'},
  {id:'cicd',t:'CI/CD',lv:3,d:['docker','git_dv'],rm:'dv'},
  {id:'k8s',t:'Kubernetes',lv:3,d:['docker'],rm:'dv'},
  {id:'cloud',t:'Cloud (AWS/GCP)',lv:4,d:['cicd'],rm:'dv'},
  {id:'monitor',t:'Monitoring',lv:4,d:['cloud'],rm:'dv'},
  {id:'iac',t:'Infra as Code',lv:5,d:['cloud'],rm:'dv'},
];
const NET=[
  {id:'osi',t:'Modèle OSI',lv:1,d:[],rm:'net'},
  {id:'tcpip',t:'TCP/IP',lv:1,d:['osi'],rm:'net'},
  {id:'dns_h',t:'DNS & HTTP',lv:2,d:['tcpip'],rm:'net'},
  {id:'proto',t:'Protocoles réseau',lv:2,d:['tcpip'],rm:'net'},
  {id:'fw',t:'Pare-feu & VPN',lv:3,d:['dns_h'],rm:'net'},
  {id:'wifi',t:'Sécurité Wi-Fi',lv:3,d:['proto'],rm:'net'},
  {id:'shark',t:'Wireshark',lv:4,d:['fw'],rm:'net'},
  {id:'narch',t:'Architecture réseau',lv:4,d:['fw'],rm:'net'},
];
const SEC=[
  {id:'sbase',t:'Fondamentaux sécu',lv:1,d:[],rm:'sec'},
  {id:'crypt',t:'Cryptographie',lv:2,d:['sbase'],rm:'sec'},
  {id:'owasp',t:'Sécu Web (OWASP)',lv:2,d:['sbase'],rm:'sec'},
  {id:'lsec',t:'Linux & Permissions',lv:2,d:['sbase'],rm:'sec'},
  {id:'ptest',t:'Pentest bases',lv:3,d:['owasp','crypt'],rm:'sec'},
  {id:'foren',t:'Forensics',lv:3,d:['sbase'],rm:'sec'},
  {id:'ctf',t:'CTF Basics',lv:4,d:['ptest'],rm:'sec'},
  {id:'csec',t:'Sécurité Cloud',lv:4,d:['ptest'],rm:'sec'},
  {id:'sops',t:'SecOps & SOC',lv:5,d:['foren','csec'],rm:'sec'},
];
const ALL=[...FS,...DV,...NET,...SEC];

const RMS={
  fs:{label:'Full Stack',icon:'🌐',nodes:FS,color:'#cf6679',light:'#fdf2f4'},
  dv:{label:'DevOps',icon:'⚙️',nodes:DV,color:'#5a9e6f',light:'#f0faf3'},
  net:{label:'Réseaux',icon:'🔌',nodes:NET,color:'#5b8dd9',light:'#f0f5fd'},
  sec:{label:'Cybersécurité',icon:'🔐',nodes:SEC,color:'#c17f3e',light:'#fdf6ee'},
};

const CERTS={
  html:[{n:'Responsive Web Design',o:'freeCodeCamp',u:'https://freecodecamp.org/learn/2022/responsive-web-design/'}],
  css:[{n:'Responsive Web Design',o:'freeCodeCamp',u:'https://freeCodeCamp.org/learn/2022/responsive-web-design/'}],
  js:[{n:'JS Algorithms & DS',o:'freeCodeCamp',u:'https://freecodecamp.org/learn/javascript-algorithms-and-data-structures/'},{n:'JavaScript Essentials 1',o:'Cisco NetAcad',u:'https://netacad.com'}],
  react:[{n:'Front End Dev Libraries',o:'freeCodeCamp',u:'https://freecodecamp.org/learn/front-end-development-libraries/'}],
  node:[{n:'Back End Dev & APIs',o:'freeCodeCamp',u:'https://freecodecamp.org/learn/back-end-development-and-apis/'}],
  sql:[{n:'SQL Basic to Advanced',o:'HackerRank',u:'https://hackerrank.com/skills-verification/sql_basic'}],
  git:[{n:'GitHub Skills',o:'GitHub',u:'https://skills.github.com/'}],
  deploy:[{n:'Cloud Digital Leader',o:'Google Cloud',u:'https://cloud.google.com/learn/training'}],
  linux:[{n:'NDG Linux Unhatched',o:'Cisco NetAcad',u:'https://netacad.com/courses/ndg-linux-unhatched'}],
  docker:[{n:'Docker Essentials',o:'IBM Cognitiveclass',u:'https://cognitiveclass.ai/courses/docker-essentials'}],
  k8s:[{n:'Intro to Kubernetes',o:'Linux Foundation',u:'https://training.linuxfoundation.org/training/introduction-to-kubernetes/'}],
  cloud:[{n:'AWS Cloud Practitioner',o:'AWS Training',u:'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/'}],
  cicd:[{n:'GitHub Actions',o:'GitHub Skills',u:'https://skills.github.com/'}],
  osi:[{n:'Networking Basics',o:'Cisco NetAcad',u:'https://netacad.com/courses/networking-basics'}],
  tcpip:[{n:'CCNA Intro to Networks',o:'Cisco NetAcad',u:'https://netacad.com/courses/ccna-introduction-to-networks'}],
  shark:[{n:'Network Analysis',o:'Coursera (audit)',u:'https://coursera.org/learn/network-analysis-wireshark'}],
  fw:[{n:'Network Defense',o:'Cisco NetAcad',u:'https://netacad.com/courses/network-defense'}],
  sbase:[{n:'Intro to Cybersecurity',o:'Cisco NetAcad',u:'https://netacad.com/courses/introduction-to-cybersecurity'}],
  crypt:[{n:'Cryptography I',o:'Coursera (audit)',u:'https://coursera.org/learn/crypto'}],
  owasp:[{n:'Web Security Fundamentals',o:'edX (audit)',u:'https://edx.org/course/web-security-fundamentals'}],
  ptest:[{n:'Ethical Hacking Essentials',o:'EC-Council',u:'https://codered.eccouncil.org/course/ethical-hacking-essentials'}],
  ctf:[{n:'TryHackMe Learning Paths',o:'TryHackMe',u:'https://tryhackme.com/'}],
};

const store={get:k=>{try{return localStorage.getItem(k);}catch{return null;}},set:(k,v)=>{try{localStorage.setItem(k,v);}catch{}}};

const callAI=async p=>{
  const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_KEY}`},body:JSON.stringify({model:'llama-3.1-8b-instant',messages:[{role:'user',content:p}],max_tokens:1000})});
  const d=await r.json();
  if(d.error)throw new Error(d.error.message);
  return d.choices[0].message.content;
};

const MD = ({ txt }) => {
  if (!txt) return null;
  return <div className="prose-mdj">{txt.split('\n').map((l, i) => {
    if (l.startsWith('## ')) return <h2 key={`h2-${i}`} style={{color:'#c96442',fontWeight:700,fontSize:'1rem',marginTop:'1.25rem',marginBottom:'0.25rem'}}>{l.slice(3)}</h2>;
    if (l.startsWith('### ')) return <h3 key={`h3-${i}`} style={{color:'#8b5e3c',fontWeight:600,fontSize:'0.9rem',marginTop:'1rem',marginBottom:'0.25rem'}}>{l.slice(4)}</h3>;
    if (l.startsWith('- ')||l.startsWith('* ')) return <li key={`li-${i}`} style={{color:'#3d2b1f',fontSize:'0.875rem',lineHeight:'1.6',marginLeft:'1rem'}}>{l.slice(2)}</li>;
    if (/^\d+\. /.test(l)) return <li key={`lo-${i}`} style={{color:'#3d2b1f',fontSize:'0.875rem',lineHeight:'1.6',marginLeft:'1rem',listStyleType:'decimal'}}>{l.replace(/^\d+\. /,'')}</li>;
    if (!l.trim()) return <br key={`br-${i}`}/>;
    const parts = l.split(/(`[^`]+`)/g);
    return <p key={`p-${i}`} style={{color:'#3d2b1f',fontSize:'0.875rem',lineHeight:'1.7',margin:'0.2rem 0'}}>
      {parts.map((p2, j) => p2.startsWith('`') 
        ? <code key={`c-${i}-${j}`} style={{background:'#f0e8df',color:'#c96442',padding:'1px 5px',borderRadius:'4px',fontSize:'0.8rem',fontFamily:'monospace'}}>{p2.replace(/`/g,'')}</code> 
        : p2)}
    </p>;
  })}</div>;
};

const s={
  app:{display:'flex',minHeight:'100vh',background:'#f5ede6',fontFamily:'"Inter", -apple-system, sans-serif'},
  sidebar:{width:'240px',background:'#fdf6f0',borderRight:'1px solid #e8d5c4',display:'flex',flexDirection:'column',padding:'1rem 0',position:'fixed',top:0,left:0,height:'100vh',zIndex:100},
  sidebarMobile:{position:'fixed',bottom:0,left:0,right:0,background:'#fdf6f0',borderTop:'1px solid #e8d5c4',display:'flex',zIndex:100,padding:'0.25rem 0'},
  main:{flex:1,marginLeft:'240px',padding:'2rem',maxWidth:'860px'},
  mainMobile:{flex:1,paddingBottom:'70px',padding:'1rem'},
  logo:{padding:'0.75rem 1.25rem 1.25rem',borderBottom:'1px solid #e8d5c4',marginBottom:'0.5rem'},
  navBtn:(active)=>({display:'flex',alignItems:'center',gap:'0.625rem',width:'100%',padding:'0.6rem 1.25rem',background:active?'#fde8df':'transparent',color:active?'#c96442':'#6b4c38',fontWeight:active?600:400,fontSize:'0.875rem',border:'none',cursor:'pointer',textAlign:'left',borderRadius:0,transition:'background 0.15s'}),
  navBtnMob:(active)=>({flex:1,display:'flex',flexDirection:'column',alignItems:'center',padding:'0.5rem 0.25rem',background:'transparent',border:'none',cursor:'pointer',color:active?'#c96442':'#9c7b6b',fontSize:'0.65rem',fontWeight:active?600:400,gap:'2px'}),
  card:{background:'#fffaf7',border:'1px solid #e8d5c4',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'},
  btn:(variant='primary')=>({padding:'0.5rem 1rem',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'0.8rem',fontWeight:500,background:variant==='primary'?'#c96442':variant==='ghost'?'transparent':'#f0e8df',color:variant==='primary'?'#fff':variant==='ghost'?'#9c7b6b':'#6b4c38',transition:'opacity 0.15s'}),
  input:{width:'100%',padding:'0.6rem 0.75rem',background:'#fdf6f0',border:'1px solid #e8d5c4',borderRadius:'8px',fontSize:'0.875rem',color:'#3d2b1f',outline:'none',boxSizing:'border-box',marginBottom:'0.5rem'},
  tag:(color)=>({display:'inline-flex',alignItems:'center',gap:'4px',padding:'2px 8px',borderRadius:'20px',fontSize:'0.7rem',fontWeight:500,background:color+'18',color:color,border:`1px solid ${color}30`}),
  badge:(s2)=>s2==='done'?{background:'#e8f5ec',color:'#2d7a47',border:'1px solid #b8dfc5'}:s2==='open'?{background:'#fff3ee',color:'#c96442',border:'1px solid #f5c5a8'}:{background:'#f5f0eb',color:'#b0907a',border:'1px solid #e0cfc4'},
};

export default function App(){
  const[view,setView]=useState('dash');
  const[rm,setRm]=useState('fs');
  const[node,setNode]=useState(null);
  const[tab,setTab]=useState('course');
  const[prog,setProg]=useState(()=>{try{return JSON.parse((typeof localStorage!=='undefined'?localStorage.getItem('mdj_prog'):null)||'{}');}catch{return{};}});
  const[myCerts,setMyCerts]=useState(()=>{try{return JSON.parse((typeof localStorage!=='undefined'?localStorage.getItem('mdj_certs'):null)||'[]');}catch{return[];}});
  const[loading,setLoading]=useState(false);
  const[content,setContent]=useState(null);
  const[qz,setQz]=useState({q:[],a:{},done:false,score:0,err:false});
  const[certForm,setCertForm]=useState(false);
  const[newC,setNewC]=useState({name:'',org:'',date:'',link:''});
  const[revSel,setRevSel]=useState([]);
  const[revQz,setRevQz]=useState(null);
  const[revStep,setRevStep]=useState('pick');
  const[offline,setOffline]=useState(typeof navigator!=='undefined'&&!navigator.onLine);
  const[mobile,setMobile]=useState(typeof window!=='undefined'&&window.innerWidth<768);
  const noKey=!GROQ_KEY;

  useEffect(()=>{
    const go=()=>setOffline(false),off=()=>setOffline(true);
    const resize=()=>setMobile(window.innerWidth<768);
    window.addEventListener('online',go);window.addEventListener('offline',off);
    window.addEventListener('resize',resize);
    return()=>{window.removeEventListener('online',go);window.removeEventListener('offline',off);window.removeEventListener('resize',resize);};
  },[]);

  const saveProg=np=>{setProg(np);store.set('mdj_prog',JSON.stringify(np));};
  const saveCerts=nc=>{setMyCerts(nc);store.set('mdj_certs',JSON.stringify(nc));};
  const unlocked=n=>n.d.length===0||n.d.every(id=>prog[id]?.completed);
  const statusOf=id=>{if(prog[id]?.completed)return'done';const n=ALL.find(x=>x.id===id);return n&&unlocked(n)?'open':'locked';};
  const total=ALL.length,done=Object.values(prog).filter(p=>p.completed).length,pct=Math.round(done/total*100);
  const ck=(id,t)=>`mdj_c_${id}_${t}`;

  // --- AMÉLIORATION DES PROMPTS UNIQUEMENT ---
  const loadTab = async (n, t) => {
    const key = ck(n.id, t);
    const courseKey = ck(n.id, 'course');
    const cached = store.get(key);
    
    if (cached) {
      if (t === 'quiz' || t === 'test') setQz({ ...JSON.parse(cached), a: {}, done: false });
      else setContent(cached);
      return;
    }

    setLoading(true);
    try {
      let prompt;
      if (t === 'course') {
        prompt = `Tu es un professeur expert. Crée un cours simple, complet et adapté aux débutants sur : ${n.t}.
        Règles : 
        1. Utilise une analogie concrète de la vie réelle.
        2. Structure : ## Concept, ### Fonctionnement, ### Exemple, ### Résumé (liste à puces).
        Réponds en Markdown.`;
      } else {
        let courseContent = store.get(courseKey);
        if (!courseContent) {
           courseContent = await callAI(`Crée un cours court sur ${n.t}`);
           store.set(courseKey, courseContent);
        }
        prompt = `En te basant strictement sur ce cours : "${courseContent}", génère un ${t} sur ${n.t}.
        Si c'est un quiz/test : réponds UNIQUEMENT en JSON {"questions":[{"q":"","options":[],"answer":0}]}.
        Si c'est un lab : réponds en Markdown avec des étapes pratiques.`;
      }

      const res = await callAI(prompt);
      if (t === 'quiz' || t === 'test') {
        const match = res.match(/\{[\s\S]*\}/);
        if (match) {
          const data = { q: JSON.parse(match[0]).questions };
          setQz({ ...data, a: {}, done: false });
          store.set(key, JSON.stringify(data));
        }
      } else {
        setContent(res);
        store.set(key, res);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const openNode=n=>{if(!unlocked(n))return;setNode(n);setTab('course');setContent(null);setView('node');loadTab(n,'course');};
  const submitQz=isTest=>{let ok=0;qz.q.forEach((q,i)=>{if(qz.a[i]===q.answer)ok++;});const score=Math.round(ok/qz.q.length*100);setQz(p=>({...p,done:true,score}));if(isTest&&score>=70)saveProg({...prog,[node.id]:{completed:true,score,date:new Date().toLocaleDateString('fr-FR')}});};
  
  const navItems=[{id:'dash',icon:'🏠',l:'Accueil'},{id:'rm',icon:'🗺️',l:'Roadmap'},{id:'revise',icon:'🔁',l:'Révision'},{id:'certs',icon:'🏅',l:'Certifs'}];

  const Sidebar=()=>(
    mobile
    ?<nav style={s.sidebarMobile}>{navItems.map(n=>{const act=view===n.id||(n.id==='rm'&&view==='node');return<button key={n.id} style={s.navBtnMob(act)} onClick={()=>setView(n.id)}><span style={{fontSize:'1.1rem'}}>{n.icon}</span>{n.l}</button>;})}</nav>
    :<aside style={s.sidebar}>
      <div style={s.logo}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:32,height:32,background:'linear-gradient(135deg,#c96442,#e8956a)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>🚀</div>
          <div><div style={{fontSize:'0.875rem',fontWeight:700,color:'#3d2b1f'}}>Dev Journey</div><div style={{fontSize:'0.7rem',color:'#9c7b6b'}}>Moucharaf</div></div>
        </div>
      </div>
      {navItems.map(n=>{const act=view===n.id||(n.id==='rm'&&view==='node');return<button key={n.id} style={s.navBtn(act)} onClick={()=>setView(n.id)}><span>{n.icon}</span>{n.l}</button>;})}
      <div style={{marginTop:'auto',padding:'1rem 1.25rem',borderTop:'1px solid #e8d5c4'}}>
        <div style={{fontSize:'0.7rem',color:'#b0907a'}}>Progression globale</div>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'4px'}}>
          <div style={{flex:1,height:6,background:'#e8d5c4',borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#c96442,#e8956a)',borderRadius:3,transition:'width 0.5s'}}/></div>
          <span style={{fontSize:'0.75rem',fontWeight:600,color:'#c96442'}}>{pct}%</span>
        </div>
      </div>
    </aside>
  );

  const mainStyle=mobile?s.mainMobile:s.main;

  /* DASHBOARD */
  if(view==='dash') return (
    <div style={s.app}>
      <Sidebar/>
      <main style={mainStyle}>
        <div style={s.card}>
          <h1 style={{fontSize:'1.5rem', color:'#3d2b1f'}}>Bienvenue Moucharaf 👋</h1>
          <p style={{color:'#9c7b6b', marginTop:'0.5rem'}}>Continue ton apprentissage pour valider ton parcours.</p>
          <button onClick={()=>setView('rm')} style={{...s.btn(), marginTop:'1rem'}}>Reprendre la Roadmap</button>
        </div>
      </main>
    </div>
  );

  /* ROADMAP VIEW */
  if(view==='rm'){
    const R=RMS[rm];
    const lvls=[...new Set(R.nodes.map(n=>n.lv))].sort();
    return<div style={s.app}>
      <Sidebar/>
      <main style={mainStyle}>
        <h1 style={{fontSize:'1.4rem',fontWeight:700,color:'#3d2b1f',marginBottom:'1rem'}}>🗺️ Roadmap</h1>
        <div style={{display:'flex',gap:'6px',marginBottom:'1.5rem',flexWrap:'wrap'}}>
          {Object.entries(RMS).map(([k,r])=><button key={k} onClick={()=>setRm(k)} style={{padding:'0.45rem 0.875rem',borderRadius:'20px',border:`1px solid ${rm===k?r.color:r.color+'40'}`,background:rm===k?r.color+'18':'transparent',color:rm===k?r.color:'#9c7b6b',fontSize:'0.8rem',fontWeight:rm===k?600:400,cursor:'pointer'}}>{r.icon} {r.label}</button>)}
        </div>
        {lvls.map(lv=><div key={lv} style={{marginBottom:'1.5rem'}}>
          <p style={{fontSize:'0.72rem',color:'#b0907a',textTransform:'uppercase',fontWeight:600,marginBottom:'0.5rem'}}>Niveau {lv}</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'0.625rem'}}>
            {R.nodes.filter(n=>n.lv===lv).map(n=>{
              const st=statusOf(n.id);
              return<button key={n.id} onClick={()=>openNode(n)} disabled={st==='locked'} style={{padding:'0.875rem',borderRadius:'10px',border:`1px solid ${st==='done'?'#b8dfc5':st==='open'?R.color+'60':'#e8d5c4'}`,background:st==='done'?'#f0faf3':st==='open'?R.color+'0a':'#faf6f2',cursor:st==='locked'?'not-allowed':'pointer',textAlign:'left',opacity:st==='locked'?0.6:1}}>
                <div style={{marginBottom:'0.35rem'}}>{st==='done'?'✅':st==='open'?'🔓':'🔒'}</div>
                <p style={{fontWeight:500,fontSize:'0.825rem',color:st==='locked'?'#b0907a':'#3d2b1f',margin:0}}>{n.t}</p>
              </button>;
            })}
          </div>
        </div>)}
      </main>
    </div>;
  }

  /* NODE VIEW */
  if(view==='node'&&node){
    const R=RMS[node.rm];
    return<div style={s.app}>
      <Sidebar/>
      <main style={mainStyle}>
        <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'1rem'}}>
          <button onClick={()=>setView('rm')} style={{background:'none',border:'none',cursor:'pointer',color:'#c96442',fontSize:'0.8rem'}}>← Retour</button>
          <span style={s.tag(R.color)}>{node.t}</span>
        </div>
        <div style={{display:'flex',gap:'4px',background:'#fdf6f0',padding:'4px',borderRadius:'10px',marginBottom:'1.25rem'}}>
          {[['course','📘 Cours'],['quiz','❓ Quiz'],['lab','🧪 Lab'],['test','🎯 Test']].map(([t,l])=>(
            <button key={t} onClick={()=>{setTab(t);loadTab(node,t);}} style={{flex:1,padding:'0.45rem',borderRadius:'7px',border:'none',cursor:'pointer',fontSize:'0.78rem',background:tab===t?'#fff':'transparent',fontWeight:tab===t?600:400}}>{l}</button>
          ))}
        </div>
        <div style={s.card}>
          {loading ? <p>Chargement...</p> : (tab==='course'||tab==='lab' ? <MD txt={content}/> : <div>
            {qz.q.map((q,i)=><div key={i} style={{marginBottom:'1rem'}}>
              <p style={{fontWeight:600,fontSize:'0.875rem'}}>{i+1}. {q.q}</p>
              {q.options.map((opt,j)=><button key={j} onClick={()=>!qz.done&&setQz(p=>({...p,a:{...p.a,[i]:j}}))} style={{display:'block',width:'100%',textAlign:'left',padding:'0.5rem',marginTop:'4px',borderRadius:'6px',border:'1px solid #e8d5c4',background:qz.a[i]===j?R.color+'15':'#fff'}}>{opt}</button>)}
            </div>)}
            {!qz.done && <button onClick={()=>submitQz(tab==='test')} style={s.btn()}>Valider</button>}
            {qz.done && <div style={{padding:'1rem',background:qz.score>=70?'#e8f5ec':'#fdecea',borderRadius:'8px',textAlign:'center'}}>Score: {qz.score}%</div>}
          </div>)}
        </div>
      </main>
    </div>;
  }

  return null; // Fallback par sécurité
}