import { useState, useEffect } from "react";

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;

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
  const deleteCurrentCache = () => {
    if (!node) return;
    
    // 1. On vide les états React pour l'affichage immédiat
    setContent(null);
    setQz({q:[],a:{},done:false,score:0,err:false});
    
    // 2. On supprime précisément les entrées du localStorage
    // en utilisant ta fonction ck(id, type)
    const types = ['course', 'quiz', 'lab', 'test'];
    types.forEach(t => {
      localStorage.removeItem(ck(node.id, t));
    });
    
    alert(`Cache vidé pour ${node.t}. Tu peux relancer le module.`);
  };
  const saveCerts=nc=>{setMyCerts(nc);store.set('mdj_certs',JSON.stringify(nc));};
  const unlocked=n=>n.d.length===0||n.d.every(id=>prog[id]?.completed);
  const statusOf=id=>{if(prog[id]?.completed)return'done';const n=ALL.find(x=>x.id===id);return n&&unlocked(n)?'open':'locked';};
  const total=ALL.length,done=Object.values(prog).filter(p=>p.completed).length,pct=Math.round(done/total*100);
  const ck=(id,t)=>`mdj_c_${id}_${t}`;

  const loadTab=async(n,t)=>{
    setLoading(true);setContent(null);setQz({q:[],a:{},done:false,score:0,err:false});
    const cached=store.get(ck(n.id,t));
    if(cached){if(t==='course'||t==='lab'){setContent(cached);setLoading(false);return;}try{setQz(p=>({...p,q:JSON.parse(cached)}));setLoading(false);return;}catch{}}
    if(offline||noKey){setContent(noKey?'⚠️ Clé Groq manquante — ajoute VITE_GROQ_KEY dans ton fichier .env':'📡 Hors ligne — contenu pas encore mis en cache.');setLoading(false);return;}
    try{
      if(t==='course'){const txt=await callAI(`Tu es un tuteur expert pour débutants francophones. Explique "${n.t}" simplement en markdown:\n## 📘 C'est quoi ?\n(analogie du quotidien)\n## 🎯 Pourquoi c'est important ?\n## 🛠️ Les bases essentielles\n(3-5 points numérotés)\n## 💡 Exemple concret\n(code commenté)\n## ✅ Ce que tu dois retenir\nMax 400 mots. Débutant absolu.`);setContent(txt);store.set(ck(n.id,t),txt);}
      else if(t==='lab'){const txt=await callAI(`Crée un mini-lab sur "${n.t}" pour débutant francophone en markdown:\n## 🧪 Mini-Lab\n### 🎯 Objectif\n### 🛠️ Ce qu'il faut\n### 📋 Étapes\n### 💻 Code de départ\n### ✅ Résultat attendu\n### 💡 Aide\n15-20 min.`);setContent(txt);store.set(ck(n.id,t),txt);}
      else{
        const cnt=t==='test'?8:5;
        const txt=await callAI(`Génère exactement ${cnt} questions QCM sur "${n.t}" pour débutant francophone. Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après, sans backticks, sans markdown. Format strict:\n{"questions":[{"q":"texte de la question","options":["option A","option B","option C","option D"],"answer":0}]}\nLe champ answer est l'index (0,1,2 ou 3) de la bonne réponse.`);
        const match=txt.match(/\{[\s\S]*\}/);
        if(!match)throw new Error('Réponse invalide');
        const q=JSON.parse(match[0]).questions;
        setQz(p=>({...p,q}));store.set(ck(n.id,t),JSON.stringify(q));
      }
    }catch(e){if(t==='course'||t==='lab')setContent(`❌ Erreur : ${e.message}`);else setQz(p=>({...p,err:true}));}
    setLoading(false);
  };

  const openNode=n=>{if(!unlocked(n))return;setNode(n);setTab('course');setContent(null);setView('node');loadTab(n,'course');};
  const submitQz=isTest=>{let ok=0;qz.q.forEach((q,i)=>{if(qz.a[i]===q.answer)ok++;});const score=Math.round(ok/qz.q.length*100);setQz(p=>({...p,done:true,score}));if(isTest&&score>=70)saveProg({...prog,[node.id]:{completed:true,score,date:new Date().toLocaleDateString('fr-FR')}});};
  const startRev=async()=>{
    if(!revSel.length)return;setLoading(true);setRevStep('quiz');setRevQz(null);
    let allQ=[];
    for(const id of revSel){const c=store.get(ck(id,'quiz'));if(c)try{allQ.push(...JSON.parse(c).slice(0,3).map(x=>({...x,topic:ALL.find(n=>n.id===id)?.t})));}catch{}}
    if(allQ.length<4&&!offline&&!noKey){try{const topics=revSel.map(id=>ALL.find(n=>n.id===id)?.t).join(', ');const txt=await callAI(`Génère ${revSel.length*3} QCM de révision sur ces sujets: ${topics}. UNIQUEMENT un objet JSON valide sans texte ni backticks:\n{"questions":[{"q":"...","topic":"nom du sujet","options":["A","B","C","D"],"answer":0}]}`);const match=txt.match(/\{[\s\S]*\}/);if(match)allQ=JSON.parse(match[0]).questions;}catch{}}
    setRevQz({q:allQ.sort(()=>Math.random()-0.5).slice(0,15),a:{},done:false,score:0});setLoading(false);
  };
  const submitRev=()=>{let ok=0;revQz.q.forEach((q,i)=>{if(revQz.a[i]===q.answer)ok++;});setRevQz(p=>({...p,done:true,score:Math.round(ok/p.q.length*100)}));setRevStep('result');};

  const navItems=[{id:'dash',icon:'🏠',l:'Accueil'},{id:'rm',icon:'🗺️',l:'Roadmap'},{id:'revise',icon:'🔁',l:'Révision'},{id:'carte',icon:'📊',l:'Carte'},{id:'certs',icon:'🏅',l:'Certifs'}];

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
        <div style={{fontSize:'0.68rem',color:'#b0907a',marginTop:'4px'}}>{done}/{total} nœuds complétés</div>
      </div>
    </aside>
  );

  const mainStyle=mobile?s.mainMobile:{...s.main};

  /* NODE VIEW */
  if(view==='node'&&node){
    const c2=CERTS[node.id],np=prog[node.id],R=RMS[node.rm];
    return<div style={s.app}>
      <Sidebar/>
      <main style={{...mainStyle,paddingTop:mobile?'1rem':'2rem'}}>
        {/* breadcrumb */}
        <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'1rem',flexWrap:'wrap'}}>
          <button onClick={()=>setView('rm')} style={{background:'none',border:'none',cursor:'pointer',color:'#c96442',fontSize:'0.8rem',padding:0}}>← Roadmap</button>
          <span style={{color:'#b0907a',fontSize:'0.8rem'}}>/</span>
          <span style={s.tag(R.color)}>{R.icon} {R.label}</span>
          <span style={{color:'#b0907a',fontSize:'0.8rem'}}>/</span>
          <span style={{fontSize:'0.875rem',fontWeight:600,color:'#3d2b1f'}}>{node.t}</span>
          {np?.completed&&<span style={{marginLeft:'auto',...s.tag('#2d7a47')}}>✅ Validé · {np.score}%</span>}
        </div>
        {/* tabs */}
        <div style={{display:'flex',gap:'4px',background:'#fdf6f0',padding:'4px',borderRadius:'10px',marginBottom:'1.25rem',border:'1px solid #e8d5c4'}}>
          {[['course','📘 Cours'],['quiz','❓ Quiz'],['lab','🧪 Lab'],['test','🎯 Test']].map(([t,l])=>(
            <button key={t} onClick={()=>{setTab(t);loadTab(node,t);}} style={{flex:1,padding:'0.45rem',borderRadius:'7px',border:'none',cursor:'pointer',fontSize:'0.78rem',fontWeight:tab===t?600:400,background:tab===t?'#fff':' transparent',color:tab===t?R.color:'#9c7b6b',boxShadow:tab===t?'0 1px 3px rgba(0,0,0,0.08)':'none',transition:'all 0.15s'}}>{l}</button>
          ))}
        </div>
        {/* content */}
        <div style={{...s.card,minHeight:'200px'}}>
          {loading?<div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'3rem',gap:'1rem'}}>
            <div style={{width:32,height:32,border:`3px solid ${R.color}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
            <p style={{color:'#9c7b6b',fontSize:'0.875rem'}}>Génération du contenu…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>:(tab==='course'||tab==='lab')?<div>
            <MD txt={content}/>
            {/* Bouton de suppression du cache */}
            <div style={{marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e8d5c4', textAlign: 'right'}}>
              <button 
                onClick={deleteCurrentCache}
                style={{
                  background: 'transparent',
                  border: '1px solid #c96442',
                  color: '#c96442',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  opacity: 0.7
                }}
              >
                🗑️ Effacer le cache de ce module
              </button>
            </div>  
            {tab==='course'&&c2&&<div style={{marginTop:'1.5rem',padding:'1rem',background:'#fffbf5',border:'1px solid #f0d9b5',borderRadius:'10px'}}>
              <p style={{fontWeight:600,color:'#c17f3e',fontSize:'0.85rem',marginBottom:'0.75rem'}}>🏅 Certifications recommandées</p>
              {c2.map((c3,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.6rem 0.75rem',background:'#fff',borderRadius:'8px',marginBottom:'0.5rem',border:'1px solid #f0d9b5'}}>
                <div><p style={{fontSize:'0.825rem',fontWeight:500,color:'#3d2b1f',margin:0}}>{c3.n}</p><p style={{fontSize:'0.72rem',color:'#9c7b6b',margin:0}}>{c3.o} · Gratuite</p></div>
                <a href={c3.u} target="_blank" rel="noopener noreferrer" style={{fontSize:'0.75rem',padding:'4px 10px',background:'#c17f3e',color:'#fff',borderRadius:'6px',textDecoration:'none',fontWeight:500}}>Voir →</a>
              </div>)}
            </div>}
          </div>:<div>
            {qz.err&&<p style={{color:'#c0392b',fontSize:'0.875rem'}}>Erreur de génération. Réessaie.</p>}
            {qz.q.map((q,i)=><div key={i} style={{marginBottom:'1rem',padding:'0.875rem',background:'#fdf6f0',borderRadius:'10px',border:'1px solid #e8d5c4'}}>
              <p style={{fontWeight:600,fontSize:'0.875rem',color:'#3d2b1f',marginBottom:'0.5rem'}}>{i+1}. {q.q}</p>
              {q.options.map((opt,j)=>{
                let bg='#fff',col='#3d2b1f',br='#e8d5c4';
                if(!qz.done){if(qz.a[i]===j){bg=R.color+'18';col=R.color;br=R.color;}}
                else if(j===q.answer){bg='#e8f5ec';col='#2d7a47';br='#b8dfc5';}
                else if(qz.a[i]===j){bg='#fdecea';col='#c0392b';br='#f5b8b5';}
                return<button key={j} onClick={()=>!qz.done&&setQz(p=>({...p,a:{...p.a,[i]:j}}))} style={{display:'block',width:'100%',textAlign:'left',padding:'0.5rem 0.75rem',marginBottom:'0.35rem',borderRadius:'7px',border:`1px solid ${br}`,background:bg,color:col,fontSize:'0.825rem',cursor:qz.done?'default':'pointer',transition:'all 0.1s'}}>{['A','B','C','D'][j]}. {opt}</button>;
              })}
            </div>)}
            {qz.q.length>0&&!qz.done&&<button onClick={()=>submitQz(tab==='test')} disabled={Object.keys(qz.a).length<qz.q.length} style={{...s.btn(),width:'100%',padding:'0.65rem',opacity:Object.keys(qz.a).length<qz.q.length?0.4:1}}>Soumettre les réponses</button>}
            {qz.done&&<div style={{marginTop:'1rem',padding:'1.25rem',borderRadius:'10px',textAlign:'center',background:qz.score>=70?'#e8f5ec':'#fdecea',border:`1px solid ${qz.score>=70?'#b8dfc5':'#f5b8b5'}`}}>
              <p style={{fontSize:'2.5rem',fontWeight:700,color:qz.score>=70?'#2d7a47':'#c0392b',margin:0}}>{qz.score}%</p>
              <p style={{fontSize:'0.875rem',color:'#3d2b1f',marginTop:'0.25rem'}}>{tab==='test'?qz.score>=70?'🎉 Nœud validé ! Suite débloquée.':'❌ Score insuffisant (70% requis). Relis le cours.':qz.score>=70?'✅ Bonne maîtrise !':'📖 Revois le cours avant le test.'}</p>
            </div>}
          </div>}
        </div>
      </main>
    </div>;
  }

  /* CERTS */
  if(view==='certs')return<div style={s.app}>
    <Sidebar/>
    <main style={mainStyle}>
      <h1 style={{fontSize:'1.4rem',fontWeight:700,color:'#3d2b1f',marginBottom:'0.25rem'}}>🏅 Mes Certifications</h1>
      <p style={{color:'#9c7b6b',fontSize:'0.875rem',marginBottom:'1.5rem'}}>Ajoute ici les certifications que tu as obtenues.</p>
      {!certForm?<button onClick={()=>setCertForm(true)} style={{...s.btn(),marginBottom:'1.25rem'}}>+ Ajouter une certification</button>
      :<div style={{...s.card,border:'1px solid #f5c5a8',marginBottom:'1.25rem'}}>
        <p style={{fontWeight:600,color:'#c96442',fontSize:'0.875rem',marginBottom:'0.75rem'}}>Nouvelle certification</p>
        {[['name','Nom de la certification *'],['org','Organisme (ex: freeCodeCamp)'],['date',"Date d'obtention"],['link','Lien du certificat (optionnel)']].map(([k,ph])=>(
          <input key={k} style={s.input} placeholder={ph} value={newC[k]} onChange={e=>setNewC(p=>({...p,[k]:e.target.value}))}/>
        ))}
        <div style={{display:'flex',gap:'8px',marginTop:'4px'}}>
          <button onClick={()=>{if(!newC.name.trim())return;saveCerts([...myCerts,{...newC,id:Date.now()}]);setNewC({name:'',org:'',date:'',link:''});setCertForm(false);}} style={s.btn()}>Ajouter</button>
          <button onClick={()=>setCertForm(false)} style={s.btn('ghost')}>Annuler</button>
        </div>
      </div>}
      {myCerts.length===0?<div style={{textAlign:'center',padding:'3rem',color:'#b0907a'}}>
        <p style={{fontSize:'3rem'}}>🏅</p><p style={{fontWeight:500}}>Aucune certification ajoutée.</p>
        <p style={{fontSize:'0.8rem',marginTop:'0.25rem'}}>Complète des modules et décroche tes premières certifs !</p>
      </div>:<div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
        {myCerts.map(c2=><div key={c2.id} style={{...s.card,display:'flex',alignItems:'center',gap:'1rem',margin:0,border:'1px solid #f0d9b5'}}>
          <span style={{fontSize:'2rem'}}>🎖️</span>
          <div style={{flex:1}}>
            <p style={{fontWeight:600,color:'#3d2b1f',fontSize:'0.9rem',margin:0}}>{c2.name}</p>
            <p style={{color:'#9c7b6b',fontSize:'0.775rem',margin:'2px 0 0'}}>{c2.org}{c2.date?` · ${c2.date}`:''}</p>
            {c2.link&&<a href={c2.link} target="_blank" rel="noopener noreferrer" style={{color:'#c96442',fontSize:'0.775rem'}}>Voir le certificat →</a>}
          </div>
          <button onClick={()=>saveCerts(myCerts.filter(x=>x.id!==c2.id))} style={{background:'none',border:'none',cursor:'pointer',color:'#c0392b',fontSize:'1rem',padding:'4px'}}>✕</button>
        </div>)}
      </div>}
    </main>
  </div>;

  /* ROADMAP */
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
        <p style={{fontSize:'0.78rem',color:'#b0907a',marginBottom:'1rem'}}>🔒 Verrouillé · 🔓 Disponible · ✅ Validé — 70% requis au test</p>
        {lvls.map(lv=><div key={lv} style={{marginBottom:'1.5rem'}}>
          <p style={{fontSize:'0.72rem',color:'#b0907a',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:600,marginBottom:'0.5rem'}}>Niveau {lv}</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'0.625rem'}}>
            {R.nodes.filter(n=>n.lv===lv).map(n=>{
              const st=statusOf(n.id),p2=prog[n.id];
              const bdg=s.badge(st);
              return<button key={n.id} onClick={()=>openNode(n)} disabled={st==='locked'} style={{padding:'0.875rem',borderRadius:'10px',border:`1px solid ${st==='done'?'#b8dfc5':st==='open'?R.color+'60':'#e8d5c4'}`,background:st==='done'?'#f0faf3':st==='open'?R.color+'0a':'#faf6f2',cursor:st==='locked'?'not-allowed':'pointer',textAlign:'left',transition:'all 0.15s',opacity:st==='locked'?0.6:1}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.35rem'}}>
                  <span style={{fontSize:'0.9rem'}}>{st==='done'?'✅':st==='open'?'🔓':'🔒'}</span>
                  {p2?.score&&<span style={{fontSize:'0.7rem',fontWeight:600,color:st==='done'?'#2d7a47':R.color}}>{p2.score}%</span>}
                </div>
                <p style={{fontWeight:500,fontSize:'0.825rem',color:st==='locked'?'#b0907a':'#3d2b1f',margin:0}}>{n.t}</p>
                {p2?.date&&<p style={{fontSize:'0.68rem',color:'#b0907a',margin:'3px 0 0'}}>{p2.date}</p>}
              </button>;
            })}
          </div>
        </div>)}
      </main>
    </div>;
  }

  /* RÉVISION */
  if(view==='revise')return<div style={s.app}>
    <Sidebar/>
    <main style={mainStyle}>
      <h1 style={{fontSize:'1.4rem',fontWeight:700,color:'#3d2b1f',marginBottom:'0.25rem'}}>🔁 Révision</h1>
      {revStep==='pick'&&<>
        <p style={{color:'#9c7b6b',fontSize:'0.875rem',marginBottom:'1.25rem'}}>Sélectionne les sujets débloqués à réviser.</p>
        {Object.entries(RMS).map(([k,R])=>{
          const av=R.nodes.filter(n=>unlocked(n));if(!av.length)return null;
          return<div key={k} style={{marginBottom:'1.25rem'}}>
            <p style={{fontSize:'0.72rem',color:'#b0907a',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:600,marginBottom:'0.5rem'}}>{R.icon} {R.label}</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
              {av.map(n=>{const sel=revSel.includes(n.id);return<button key={n.id} onClick={()=>setRevSel(s2=>sel?s2.filter(x=>x!==n.id):[...s2,n.id])} style={{padding:'0.35rem 0.75rem',borderRadius:'20px',border:`1px solid ${sel?R.color:R.color+'40'}`,background:sel?R.color+'18':'transparent',color:sel?R.color:'#9c7b6b',fontSize:'0.8rem',cursor:'pointer',fontWeight:sel?600:400}}>{n.t}</button>;})}
            </div>
          </div>;
        })}
        <button onClick={startRev} disabled={!revSel.length||loading} style={{...s.btn(),padding:'0.65rem 1.5rem',opacity:!revSel.length||loading?0.4:1}}>
          {loading?'Génération…':`Lancer la révision (${revSel.length} sujet${revSel.length>1?'s':''})`}
        </button>
      </>}
      {revStep==='quiz'&&revQz&&<div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
          <p style={{fontWeight:600,color:'#3d2b1f',fontSize:'0.9rem'}}>{revQz.q.length} questions mélangées</p>
          <button onClick={()=>{setRevStep('pick');setRevSel([]);setRevQz(null);}} style={{...s.btn('ghost'),fontSize:'0.8rem'}}>← Changer</button>
        </div>
        {revQz.q.map((q,i)=><div key={i} style={{...s.card,marginBottom:'0.75rem'}}>
          {q.topic&&<p style={{fontSize:'0.72rem',color:'#c96442',fontWeight:600,marginBottom:'0.35rem'}}>{q.topic}</p>}
          <p style={{fontWeight:600,fontSize:'0.875rem',color:'#3d2b1f',marginBottom:'0.5rem'}}>{i+1}. {q.q}</p>
          {q.options.map((opt,j)=>{
            let bg='#fff',col='#3d2b1f',br='#e8d5c4';
            if(!revQz.done){if(revQz.a[i]===j){bg='#fff3ee';col='#c96442';br='#c96442';}}
            else if(j===q.answer){bg='#e8f5ec';col='#2d7a47';br='#b8dfc5';}
            else if(revQz.a[i]===j){bg='#fdecea';col='#c0392b';br='#f5b8b5';}
            return<button key={j} onClick={()=>!revQz.done&&setRevQz(p=>({...p,a:{...p.a,[i]:j}}))} style={{display:'block',width:'100%',textAlign:'left',padding:'0.5rem 0.75rem',marginBottom:'0.3rem',borderRadius:'7px',border:`1px solid ${br}`,background:bg,color:col,fontSize:'0.825rem',cursor:revQz.done?'default':'pointer'}}>{['A','B','C','D'][j]}. {opt}</button>;
          })}
        </div>)}
        {!revQz.done&&<button onClick={submitRev} disabled={Object.keys(revQz.a).length<revQz.q.length} style={{...s.btn(),width:'100%',padding:'0.65rem',opacity:Object.keys(revQz.a).length<revQz.q.length?0.4:1}}>Soumettre</button>}
      </div>}
      {revStep==='result'&&revQz&&<div style={{textAlign:'center',padding:'3rem 1rem'}}>
        <p style={{fontSize:'5rem',fontWeight:700,color:revQz.score>=70?'#2d7a47':'#c0392b',margin:0}}>{revQz.score}%</p>
        <p style={{color:'#9c7b6b',fontSize:'1.1rem',margin:'0.5rem 0 2rem'}}>{revQz.score>=80?'🏆 Excellent !':revQz.score>=60?'👍 Continue !':'📖 Revois ces notions.'}</p>
        <button onClick={()=>{setRevStep('pick');setRevSel([]);setRevQz(null);}} style={s.btn()}>Nouvelle révision</button>
      </div>}
    </main>
  </div>;

  /* CARTE */
  if(view==='carte')return<div style={s.app}>
    <Sidebar/>
    <main style={mainStyle}>
      <h1 style={{fontSize:'1.4rem',fontWeight:700,color:'#3d2b1f',marginBottom:'0.25rem'}}>📊 Carte de progression</h1>
      <p style={{color:'#9c7b6b',fontSize:'0.875rem',marginBottom:'1.25rem'}}>Vue globale de toutes les roadmaps.</p>
      <div style={{...s.card,marginBottom:'1rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
          <span style={{fontSize:'0.875rem',color:'#3d2b1f',fontWeight:500}}>Progression totale</span>
          <span style={{fontWeight:700,color:'#c96442'}}>{pct}%</span>
        </div>
        <div style={{height:10,background:'#e8d5c4',borderRadius:5,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#c96442,#e8956a,#5b8dd9)',borderRadius:5,transition:'width 0.5s'}}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.75rem',marginTop:'1rem'}}>
          {[{l:'Complétés',v:done,c:'#2d7a47'},{l:'Disponibles',v:ALL.filter(n=>unlocked(n)&&!prog[n.id]?.completed).length,c:'#c96442'},{l:'Total',v:total,c:'#5b8dd9'},{l:'Certifs',v:myCerts.length,c:'#c17f3e'}].map(x=><div key={x.l} style={{textAlign:'center',padding:'0.75rem 0.5rem',background:'#fdf6f0',borderRadius:'8px',border:'1px solid #e8d5c4'}}>
            <p style={{fontSize:'1.4rem',fontWeight:700,color:x.c,margin:0}}>{x.v}</p>
            <p style={{fontSize:'0.7rem',color:'#9c7b6b',margin:'2px 0 0'}}>{x.l}</p>
          </div>)}
        </div>
      </div>
      {Object.entries(RMS).map(([k,R])=>{
        const d=R.nodes.filter(n=>prog[n.id]?.completed).length,p=Math.round(d/R.nodes.length*100);
        return<div key={k} style={{...s.card,border:`1px solid ${R.color}30`,marginBottom:'0.875rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.5rem'}}>
            <span style={{fontWeight:600,color:'#3d2b1f',fontSize:'0.9rem'}}>{R.icon} {R.label}</span>
            <span style={{fontWeight:700,color:R.color,fontSize:'0.9rem'}}>{p}% <span style={{color:'#b0907a',fontWeight:400,fontSize:'0.78rem'}}>({d}/{R.nodes.length})</span></span>
          </div>
          <div style={{height:6,background:'#e8d5c4',borderRadius:3,overflow:'hidden',marginBottom:'0.875rem'}}>
            <div style={{height:'100%',width:`${p}%`,background:R.color,borderRadius:3,transition:'width 0.5s'}}/>
          </div>
          {[...new Set(R.nodes.map(n=>n.lv))].sort().map(lv=><div key={lv} style={{marginBottom:'0.625rem'}}>
            <p style={{fontSize:'0.68rem',color:'#b0907a',marginBottom:'0.35rem',fontWeight:500}}>Niveau {lv}</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>
              {R.nodes.filter(n=>n.lv===lv).map(n=>{
                const st=statusOf(n.id),p2=prog[n.id];
                return<button key={n.id} onClick={()=>openNode(n)} disabled={st==='locked'} style={{padding:'3px 8px',borderRadius:'6px',border:`1px solid ${st==='done'?'#b8dfc5':st==='open'?R.color+'60':'#e0cfc4'}`,background:st==='done'?'#e8f5ec':st==='open'?R.color+'10':'#f5f0eb',color:st==='done'?'#2d7a47':st==='open'?R.color:'#b0907a',fontSize:'0.72rem',cursor:st==='locked'?'not-allowed':'pointer',fontWeight:500}}>
                  {st==='done'?'✅':st==='open'?'🔓':'🔒'} {n.t}{p2?.score?` · ${p2.score}%`:''}
                </button>;
              })}
            </div>
          </div>)}
        </div>;
      })}
    </main>
  </div>;

  /* DASHBOARD */
  return<div style={s.app}>
    <Sidebar/>
    <main style={mainStyle}>
      {noKey&&<div style={{padding:'0.75rem 1rem',background:'#fff8ee',border:'1px solid #f0d9b5',borderRadius:'10px',marginBottom:'1rem',fontSize:'0.8rem',color:'#8b5e3c'}}>⚠️ Clé Groq manquante — ajoute <code style={{background:'#f0e8df',padding:'1px 4px',borderRadius:'3px'}}>VITE_GROQ_KEY</code> dans ton <code style={{background:'#f0e8df',padding:'1px 4px',borderRadius:'3px'}}>.env</code></div>}
      {offline&&<div style={{padding:'0.75rem 1rem',background:'#fff8ee',border:'1px solid #f0d9b5',borderRadius:'10px',marginBottom:'1rem',fontSize:'0.8rem',color:'#8b5e3c'}}>📡 Mode hors ligne — contenu disponible depuis le cache</div>}
      <div style={{marginBottom:'1.75rem'}}>
        <p style={{color:'#9c7b6b',fontSize:'0.875rem',marginBottom:'2px'}}>Bienvenue,</p>
        <h1 style={{fontSize:mobile?'1.5rem':'1.875rem',fontWeight:700,color:'#3d2b1f',margin:0}}>Moucharaf <span style={{color:'#c96442'}}>Dev Journey</span> 🚀</h1>
        <p style={{color:'#9c7b6b',fontSize:'0.875rem',marginTop:'4px'}}>Ton espace d'apprentissage personnel — Full Stack · DevOps · Réseaux · Cybersécurité</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:mobile?'1fr 1fr':'repeat(4,1fr)',gap:'0.75rem',marginBottom:'1rem'}}>
        {Object.entries(RMS).map(([k,R])=>{
          const d=R.nodes.filter(n=>prog[n.id]?.completed).length,p=Math.round(d/R.nodes.length*100);
          return<button key={k} onClick={()=>{setRm(k);setView('rm');}} style={{padding:'1rem',borderRadius:'12px',border:`1px solid ${R.color}30`,background:'#fffaf7',cursor:'pointer',textAlign:'left',transition:'all 0.15s'}}>
            <p style={{fontSize:'1.5rem',margin:'0 0 6px'}}>{R.icon}</p>
            <p style={{fontWeight:600,fontSize:'0.85rem',color:'#3d2b1f',margin:'0 0 2px'}}>{R.label}</p>
            <p style={{fontSize:'0.72rem',color:R.color,fontWeight:500,margin:'0 0 8px'}}>{d}/{R.nodes.length} complétés</p>
            <div style={{height:4,background:'#e8d5c4',borderRadius:2,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${p}%`,background:R.color,borderRadius:2}}/>
            </div>
          </button>;
        })}
      </div>
      <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr',gap:'0.75rem',marginBottom:'1rem'}}>
        <button onClick={()=>setView('revise')} style={{...s.card,cursor:'pointer',display:'flex',alignItems:'center',gap:'1rem',margin:0,border:'1px solid #e8d5c4'}}>
          <span style={{fontSize:'1.75rem'}}>🔁</span>
          <div><p style={{fontWeight:600,color:'#3d2b1f',margin:0,fontSize:'0.9rem'}}>Révision</p><p style={{fontSize:'0.78rem',color:'#9c7b6b',margin:'2px 0 0'}}>{ALL.filter(n=>unlocked(n)).length} sujets disponibles</p></div>
        </button>
        <button onClick={()=>setView('certs')} style={{...s.card,cursor:'pointer',display:'flex',alignItems:'center',gap:'1rem',margin:0,border:'1px solid #f0d9b5'}}>
          <span style={{fontSize:'1.75rem'}}>🏅</span>
          <div><p style={{fontWeight:600,color:'#3d2b1f',margin:0,fontSize:'0.9rem'}}>Certifications</p><p style={{fontSize:'0.78rem',color:'#9c7b6b',margin:'2px 0 0'}}>{myCerts.length} obtenue{myCerts.length!==1?'s':''}</p></div>
        </button>
      </div>
      {done>0&&<div style={s.card}>
        <p style={{fontWeight:600,color:'#3d2b1f',fontSize:'0.9rem',marginBottom:'0.75rem'}}>📈 Récemment complétés</p>
        {Object.entries(prog).filter(([,v])=>v.completed).slice(-5).reverse().map(([id,v])=>{
          const n=ALL.find(x=>x.id===id),R=RMS[n?.rm];
          return<div key={id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.6rem 0',borderBottom:'1px solid #f0e8df'}}>
            <div><p style={{fontSize:'0.875rem',color:'#3d2b1f',margin:0,fontWeight:500}}>{n?.t}</p><p style={{fontSize:'0.72rem',color:'#b0907a',margin:'1px 0 0'}}>{R?.icon} {R?.label}</p></div>
            <div style={{textAlign:'right'}}><p style={{fontSize:'0.825rem',fontWeight:600,color:'#2d7a47',margin:0}}>{v.score}%</p><p style={{fontSize:'0.7rem',color:'#b0907a',margin:'1px 0 0'}}>{v.date}</p></div>
          </div>;
        })}
      </div>}
      {done===0&&<div style={{...s.card,textAlign:'center',padding:'2.5rem'}}>
        <p style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>🎯</p>
        <p style={{color:'#9c7b6b',fontSize:'0.9rem'}}>Commence par choisir une roadmap ci-dessus !</p>
      </div>}
    </main>
  </div>;

  /* CARTE */
  if (view === 'carte') return (
    <div style={s.app}>
      <Sidebar />
      <main style={mainStyle}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#3d2b1f', marginBottom: '0.25rem' }}>📊 Carte de progression</h1>
        <p style={{ color: '#9c7b6b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Vue globale de tes roadmaps.</p>
        <div style={{ ...s.card, marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#3d2b1f', fontWeight: 500 }}>Progression globale</span>
            <span style={{ fontWeight: 700, color: '#c96442' }}>{pct}%</span>
          </div>
          <div style={{ height: 10, background: '#e8d5c4', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#c96442,#e8956a)', borderRadius: 5, transition: 'width 0.5s' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
          {Object.entries(RMS).map(([k, R]) => {
            const nodes = R.nodes;
            const d = nodes.filter(n => prog[n.id]?.completed).length;
            const p = Math.round((d / nodes.length) * 100);
            return (
              <div key={k} style={{ padding: '1rem', background: R.light, borderRadius: '12px', border: `1px solid ${R.color}40` }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: R.color }}>{R.icon} {R.label}</p>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: R.color, margin: '4px 0' }}>{p}%</div>
                <div style={{ height: 4, background: '#fff', borderRadius: 2, margin: '8px 0', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p}%`, background: R.color, borderRadius: 2 }} />
                </div>
                <p style={{ fontSize: '0.7rem', color: '#9c7b6b' }}>{d} sur {nodes.length} modules validés</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
} // Fin du composant App
