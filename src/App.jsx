import { useState, useEffect } from "react";

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;

// --- DONNÉES DES ROADMAPS ---
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
  css:[{n:'Responsive Web Design',o:'freeCodeCamp',u:'https://freecodecamp.org/learn/2022/responsive-web-design/'}],
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

// --- UTILITAIRES ---
const store={get:k=>{try{return localStorage.getItem(k);}catch{return null;}},set:(k,v)=>{try{localStorage.setItem(k,v);}catch{}}};

const callAI=async p=>{
  const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_KEY}`},body:JSON.stringify({model:'llama-3.1-8b-instant',messages:[{role:'user',content:p}],max_tokens:1000})});
  const d=await r.json();
  if(d.error)throw new Error(d.error.message);
  return d.choices[0].message.content;
};

// --- PROMPTS ---
const coursePrompt = (topic) => `Tu es un professeur expert. Crée un cours simple, complet et pédagogique sur : ${topic}. 
Structure : 
## 💡 Concept : Définition simple. 
### 🔍 Analogie : Explique avec une image concrète. 
### 🛠️ Points clés : Liste à puces. 
### 💻 Exemple : Code ou cas pratique. 
### 📝 Résumé : 3 points essentiels. 
Réponds en Markdown.`;

const dependentPrompt = (topic, type, courseContent) => `
CONTENU RÉFÉRENCE : "${courseContent}"
TÂCHE : Génère un ${type} sur ${topic} basé strictement sur le cours ci-dessus. 
${type === 'lab' ? 'Réponds en Markdown.' : 'Réponds UNIQUEMENT en JSON : {"questions":[{"q":"...","options":[],"answer":0}]}'}`;

// --- COMPOSANTS UI ---
const MD = ({ txt }) => {
  if (!txt) return null;
  return <div className="prose-mdj">{txt.split('\n').map((l, i) => {
    if (l.startsWith('## ')) return <h2 key={i} style={{color:'#c96442',fontWeight:700,fontSize:'1rem',marginTop:'1.25rem'}}>{l.slice(3)}</h2>;
    if (l.startsWith('### ')) return <h3 key={i} style={{color:'#8b5e3c',fontWeight:600,fontSize:'0.9rem',marginTop:'1rem'}}>{l.slice(4)}</h3>;
    if (l.startsWith('- ')||l.startsWith('* ')) return <li key={i} style={{color:'#3d2b1f',fontSize:'0.875rem',marginLeft:'1rem'}}>{l.slice(2)}</li>;
    return <p key={i} style={{color:'#3d2b1f',fontSize:'0.875rem',lineHeight:'1.7'}}>{l}</p>;
  })}</div>;
};

const s={
  app:{display:'flex',minHeight:'100vh',background:'#f5ede6',fontFamily:'"Inter", sans-serif'},
  sidebar:{width:'240px',background:'#fdf6f0',borderRight:'1px solid #e8d5c4',display:'flex',flexDirection:'column',position:'fixed',height:'100vh',zIndex:100},
  main:{flex:1,marginLeft:'240px',padding:'2rem',maxWidth:'860px'},
  navBtn:(active)=>({width:'100%',padding:'0.75rem 1.25rem',background:active?'#fde8df':'transparent',color:active?'#c96442':'#6b4c38',fontWeight:active?600:400,border:'none',cursor:'pointer',textAlign:'left'}),
  card:{background:'#fffaf7',border:'1px solid #e8d5c4',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'},
  btn:()=>({padding:'0.5rem 1rem',borderRadius:'8px',border:'none',cursor:'pointer',background:'#c96442',color:'#fff',fontSize:'0.8rem'}),
  tag:(color)=>({padding:'2px 8px',borderRadius:'20px',fontSize:'0.7rem',background:color+'18',color:color,border:`1px solid ${color}30`}),
};

// --- COMPOSANT PRINCIPAL ---
export default function App(){
  const[view,setView]=useState('dash');
  const[rm,setRm]=useState('fs');
  const[node,setNode]=useState(null);
  const[tab,setTab]=useState('course');
  const[prog,setProg]=useState(()=>JSON.parse(localStorage.getItem('mdj_prog')||'{}'));
  const[loading,setLoading]=useState(false);
  const[content,setContent]=useState(null);
  const[qz,setQz]=useState({q:[],a:{},done:false,score:0});
  const[mobile,setMobile]=useState(window.innerWidth < 768);

  const ck=(id,t)=>`mdj_c_${id}_${t}`;
  const unlocked=n=>n.d.length===0||n.d.every(id=>prog[id]?.completed);
  const statusOf=id=>{if(prog[id]?.completed)return'done';const n=ALL.find(x=>x.id===id);return n&&unlocked(n)?'open':'locked';};
  const total=ALL.length,done=Object.values(prog).filter(p=>p.completed).length,pct=Math.round(done/total*100);

  const loadTab = async (n, t) => {
    const key = ck(n.id, t);
    const cached = store.get(key);
    if (cached) {
      if (t === 'quiz' || t === 'test') setQz({ ...JSON.parse(cached), a: {}, done: false });
      else setContent(cached);
      return;
    }

    setLoading(true);
    try {
      let prompt;
      if (t === 'course') prompt = coursePrompt(n.t);
      else {
        let course = store.get(ck(n.id, 'course'));
        if (!course) { course = await callAI(coursePrompt(n.t)); store.set(ck(n.id, 'course'), course); }
        prompt = dependentPrompt(n.t, t, course);
      }
      const res = await callAI(prompt);
      if (t === 'quiz' || t === 'test') {
        const match = res.match(/\{[\s\S]*\}/);
        if (match) {
          const data = { q: JSON.parse(match[0]).questions };
          setQz({ ...data, a: {}, done: false });
          store.set(key, JSON.stringify(data));
        }
      } else { setContent(res); store.set(key, res); }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const openNode=n=>{if(!unlocked(n))return;setNode(n);setTab('course');setContent(null);setView('node');loadTab(n,'course');};
  const submitQz=isTest=>{
    let ok=0; qz.q.forEach((q,i)=>{if(qz.a[i]===q.answer)ok++;});
    const score=Math.round(ok/qz.q.length*100);
    setQz(p=>({...p,done:true,score}));
    if(isTest&&score>=70){
      const np = {...prog,[node.id]:{completed:true,score,date:new Date().toLocaleDateString()}};
      setProg(np); localStorage.setItem('mdj_prog', JSON.stringify(np));
    }
  };

  const Sidebar=()=>(
    <aside style={s.sidebar}>
      <div style={{padding:'1.5rem', fontWeight:800, color:'#c96442', borderBottom:'1px solid #e8d5c4'}}>DEV JOURNEY</div>
      <button style={s.navBtn(view==='dash')} onClick={()=>setView('dash')}>🏠 Accueil</button>
      <button style={s.navBtn(view==='rm'||view==='node')} onClick={()=>setView('rm')}>🗺️ Roadmap</button>
      <div style={{marginTop:'auto', padding:'1rem'}}>
         <div style={{fontSize:'0.7rem', color:'#9c7b6b'}}>Progression: {pct}%</div>
         <div style={{height:6, background:'#e8d5c4', borderRadius:3, marginTop:4}}><div style={{height:'100%', width:`${pct}%`, background:'#c96442', borderRadius:3}}/></div>
      </div>
    </aside>
  );

  if(view==='node'&&node){
    const R=RMS[node.rm];
    return (
      <div style={s.app}>
        <Sidebar/>
        <main style={s.main}>
          <button onClick={()=>setView('rm')} style={{background:'none', border:'none', color:'#c96442', cursor:'pointer', marginBottom:'1rem'}}>← Retour</button>
          <div style={{display:'flex', gap:'10px', marginBottom:'1rem'}}>
             <span style={s.tag(R.color)}>{node.t}</span>
             {prog[node.id]?.completed && <span style={s.tag('#2d7a47')}>Complété</span>}
          </div>
          <div style={{display:'flex', gap:'5px', background:'#fdf6f0', padding:4, borderRadius:8, marginBottom:15}}>
             {['course','quiz','lab','test'].map(t=>(
               <button key={t} onClick={()=>{setTab(t);loadTab(node,t);}} style={{flex:1, padding:8, border:'none', borderRadius:6, background:tab===t?'#fff':'transparent', cursor:'pointer', fontWeight:tab===t?700:400}}>{t.toUpperCase()}</button>
             ))}
          </div>
          <div style={s.card}>
            {loading ? <p>Chargement...</p> : (tab==='course'||tab==='lab' ? <MD txt={content}/> : 
              <div>
                {qz.q.map((q,i)=>(
                  <div key={i} style={{marginBottom:15}}>
                    <p style={{fontWeight:600}}>{i+1}. {q.q}</p>
                    {q.options.map((o,j)=>(
                      <button key={j} onClick={()=>!qz.done&&setQz(p=>({...p,a:{...p.a,[i]:j}}))} style={{display:'block', width:'100%', textAlign:'left', padding:8, margin:'4px 0', borderRadius:6, border:'1px solid #e8d5c4', background:qz.a[i]===j?R.color+'18':'#fff'}}>{o}</button>
                    ))}
                  </div>
                ))}
                {!qz.done && <button onClick={()=>submitQz(tab==='test')} style={s.btn()}>Valider</button>}
                {qz.done && <div style={{padding:10, background:qz.score>=70?'#e8f5ec':'#fdecea', textAlign:'center', borderRadius:8}}>Score: {qz.score}%</div>}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  if(view==='rm'){
    const R=RMS[rm];
    return (
      <div style={s.app}>
        <Sidebar/>
        <main style={s.main}>
          <div style={{display:'flex', gap:10, marginBottom:20}}>
            {Object.entries(RMS).map(([k,v])=>(
              <button key={k} onClick={()=>setRm(k)} style={{...s.btn(), background:rm===k?v.color:'#f0e8df', color:rm===k?'#fff':'#6b4c38'}}>{v.label}</button>
            ))}
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:15}}>
            {R.nodes.map(n=>(
              <button key={n.id} onClick={()=>openNode(n)} disabled={statusOf(n.id)==='locked'} style={{...s.card, cursor:statusOf(n.id)==='locked'?'not-allowed':'pointer', opacity:statusOf(n.id)==='locked'?0.5:1, textAlign:'center'}}>
                <div style={{fontSize:'1.2rem'}}>{statusOf(n.id)==='done'?'✅':statusOf(n.id)==='open'?'🔓':'🔒'}</div>
                <div style={{fontWeight:600, fontSize:'0.8rem'}}>{n.t}</div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={s.app}>
      <Sidebar/>
      <main style={s.main}>
        <h1 style={{color:'#3d2b1f'}}>Bienvenue, Moucharaf</h1>
        <div style={s.card}>
           <p>Ton parcours est complété à {pct}%</p>
           <button onClick={()=>setView('rm')} style={s.btn()}>Continuer l'apprentissage</button>
        </div>
      </main>
    </div>
  );
}