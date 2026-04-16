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
    if (l.startsWith('## ')) return <h2 key={i} style={{color:'#c96442', fontWeight:700, fontSize:'1rem', marginTop:'1.25rem'}}>{l.slice(3)}</h2>;
    if (l.startsWith('### ')) return <h3 key={i} style={{color:'#8b5e3c', fontWeight:600, fontSize:'0.9rem', marginTop:'1rem'}}>{l.slice(4)}</h3>;
    if (l.startsWith('- ')||l.startsWith('* ')) return <li key={`li-${i}`} style={{color:'#3d2b1f',fontSize:'0.875rem',lineHeight:'1.6',marginLeft:'1rem'}}>{l.slice(2)}</li>;
    if (/^\d+\. /.test(l)) return <li key={`lo-${i}`} style={{color:'#3d2b1f',fontSize:'0.875rem',lineHeight:'1.6',marginLeft:'1rem',listStyleType:'decimal'}}>{l.replace(/^\d+\. /,'')}</li>;
    if (!l.trim()) return <br key={`br-${i}`}/>;
    const parts = l.split(/(`[^`]+`)/g);
    return <p key={i} style={{color:'#3d2b1f', fontSize:'0.875rem', lineHeight:'1.7'}}>{l}</p>;
  })}</div>;
};

const s={
  app:{display:'flex',minHeight:'100vh',background:'#f5ede6',fontFamily:'"Inter", -apple-system, sans-serif'},
  sidebar:{width:'240px',background:'#fdf6f0',borderRight:'1px solid #e8d5c4',display:'flex',flexDirection:'column',padding:'1rem 0',position:'fixed',top:0,left:0,height:'100vh',zIndex:100},
  sidebarMobile:{position:'fixed',bottom:0,left:0,right:0,background:'#fdf6f0',borderTop:'1px solid #e8d5c4',display:'flex',zIndex:100,padding:'0.25rem 0'},
  main:{flex:1,marginLeft:'240px',padding:'2rem',maxWidth:'860px'},
  mainMobile:{flex:1,paddingBottom:'70px',padding:'1rem'},
  // À remplacer dans l'objet "s"
logo: { 
  padding: '1.5rem', 
  fontWeight: 800, 
  color: '#c96442', 
  borderBottom: '1px solid #e8d5c4' 
},
navBtn: (active) => ({
  width: '100%',
  padding: '0.75rem 1.25rem',
  background: active ? '#fde8df' : 'transparent',
  color: active ? '#c96442' : '#6b4c38',
  fontWeight: active ? 600 : 400,
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left'
}),
  navBtnMob:(active)=>({flex:1,display:'flex',flexDirection:'column',alignItems:'center',padding:'0.5rem 0.25rem',background:'transparent',border:'none',cursor:'pointer',color:active?'#c96442':'#9c7b6b',fontSize:'0.65rem',fontWeight:active?600:400,gap:'2px'}),
  card:{background:'#fffaf7',border:'1px solid #e8d5c4',borderRadius:'12px',padding:'1.25rem',marginBottom:'1rem'},
  btn:(variant='primary')=>({padding:'0.5rem 1rem',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'0.8rem',fontWeight:500,background:variant==='primary'?'#c96442':variant==='ghost'?'transparent':'#f0e8df',color:variant==='primary'?'#fff':variant==='ghost'?'#9c7b6b':'#6b4c38',transition:'opacity 0.15s'}),
  // À remplacer dans l'objet "s"
  tag: (color) => ({
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '0.7rem',
    background: color + '18', // Utilise 18 pour l'opacité exacte
    color: color,
    border: `1px solid ${color}30`
  }),
};

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
  const total=ALL.length,done=Object.values(prog).filter(p=>p.completed).length,pct=Math.round(done/total*100);

  const deleteCurrentCache = () => {
    if (!node) return;
    setContent(null);
    setQz({q:[],a:{},done:false,score:0});
    ['course', 'quiz', 'lab', 'test'].forEach(t => localStorage.removeItem(ck(node.id, t)));
    alert(`Cache vidé pour ${node.t}. Relance le module.`);
  };

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
      if (t === 'course') {
        prompt = `Tu es professeur expert. Crée un cours simple, complet et pédagogique sur : ${n.t}. Utilise une analogie concrète. Structure: ## Concept, ### Fonctionnement, ### Exemple, ### Résumé. Réponds en Markdown.`;
      } else {
        let course = store.get(ck(n.id, 'course'));
        if (!course) { course = await callAI(`Cours court sur ${n.t}`); store.set(ck(n.id, 'course'), course); }
        prompt = `En te basant strictement sur ce cours : "${course}", génère un ${t} sur ${n.t}. JSON uniquement pour quiz/test : {"questions":[{"q":"","options":[],"answer":0}]}.`;
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

  const openNode=n=>{setNode(n);setTab('course');setContent(null);setView('node');loadTab(n,'course');};
  const submitQz=isTest=>{
    let ok=0; qz.q.forEach((q,i)=>{if(qz.a[i]===q.answer)ok++;});
    const score=Math.round(ok/qz.q.length*100);
    setQz(p=>({...p,done:true,score}));
    if(isTest&&score>=70){
      const np={...prog,[node.id]:{completed:true,score,date:new Date().toLocaleDateString()}};
      setProg(np); localStorage.setItem('mdj_prog', JSON.stringify(np));
    }
  };

  const Sidebar=()=>(
    <aside style={s.sidebar}>
      <div style={s.logo}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:32,height:32,background:'linear-gradient(135deg,#c96442,#e8956a)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px'}}>🚀</div>
          <div><div style={{fontSize:'0.875rem',fontWeight:700,color:'#3d2b1f'}}>Dev Journey</div></div>
        </div>
      </div>
      <button style={s.navBtn(view==='dash')} onClick={()=>setView('dash')}>🏠 Accueil</button>
      <button style={s.navBtn(view==='rm'||view==='node')} onClick={()=>setView('rm')}>🗺️ Roadmap</button>
      <div style={{marginTop:'auto',padding:'1rem'}}>
        <div style={{fontSize:'0.7rem',color:'#9c7b6b'}}>Progression: {pct}%</div>
        <div style={{height:6,background:'#e8d5c4',borderRadius:3,marginTop:4}}><div style={{height:'100%',width:`${pct}%`,background:'#c96442',borderRadius:3}}/></div>
      </div>
    </aside>
  );

  if(view==='node'&&node){
    const R=RMS[node.rm];
    return (
      <div style={s.app}>
        <Sidebar/>
        <main style={s.main}>
          <button onClick={()=>setView('rm')} style={{background:'none',border:'none',cursor:'pointer',color:'#c96442',marginBottom:'1rem'}}>← Retour</button>
          <div style={{display:'flex',gap:'10px',marginBottom:'1rem'}}>
            <span style={s.tag(R.color)}>{node.t}</span>
          </div>
          <div style={{display:'flex',gap:'4px',background:'#fdf6f0',padding:'4px',borderRadius:'10px',marginBottom:'1.25rem'}}>
            {['course','quiz','lab','test'].map(t=>(
              <button key={t} onClick={()=>{setTab(t);loadTab(node,t);}} style={{flex:1,padding:'0.45rem',borderRadius:'7px',border:'none',cursor:'pointer',fontSize:'0.78rem',background:tab===t?'#fff':'transparent',fontWeight:tab===t?600:400}}>{t.toUpperCase()}</button>
            ))}
          </div>
          <div style={s.card}>
            {loading ? <p>Génération...</p> : (tab==='course'||tab==='lab' ? 
              <div>
                <MD txt={content}/>
                <div style={{marginTop:'2rem', paddingTop:'1rem', borderTop:'1px solid #e8d5c4', textAlign:'right'}}>
                  <button onClick={deleteCurrentCache} style={{background:'transparent', border:'1px solid #c96442', color:'#c96442', padding:'5px 12px', borderRadius:'6px', fontSize:'0.75rem', cursor:'pointer', opacity:0.7}}>🗑️ Effacer le cache de ce module</button>
                </div>
              </div> : 
              <div>
                {qz.q.map((q,i)=>(
                  <div key={i} style={{marginBottom:'1rem'}}>
                    <p style={{fontWeight:600}}>{i+1}. {q.q}</p>
                    {q.options.map((opt,j)=><button key={j} onClick={()=>!qz.done&&setQz(p=>({...p,a:{...p.a,[i]:j}}))} style={{display:'block',width:'100%',textAlign:'left',padding:'0.5rem',marginTop:'4px',borderRadius:'6px',border:'1px solid #e8d5c4',background:qz.a[i]===j?R.color+'15':'#fff'}}>{opt}</button>)}
                  </div>
                ))}
                {!qz.done && <button onClick={()=>submitQz(tab==='test')} style={s.btn()}>Valider</button>}
                {qz.done && <div style={{padding:'1rem',background:qz.score>=70?'#e8f5ec':'#fdecea',borderRadius:'8px',textAlign:'center'}}>Score: {qz.score}%</div>}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  if(view==='rm') {
    const R=RMS[rm];
    return (
      <div style={s.app}>
        <Sidebar/>
        <main style={s.main}>
          <div style={{display:'flex',gap:'6px',marginBottom:'1.5rem'}}>
            {Object.entries(RMS).map(([k,r])=><button key={k} onClick={()=>setRm(k)} style={{padding:'0.45rem 0.875rem',borderRadius:'20px',border:`1px solid ${rm===k?r.color:'#e8d5c4'}`,background:rm===k?r.color+'18':'transparent',color:rm===k?r.color:'#9c7b6b',fontSize:'0.8rem',cursor:'pointer'}}>{r.label}</button>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'1rem'}}>
            {R.nodes.map(n=>(
              <button key={n.id} onClick={()=>openNode(n)} style={{...s.card, cursor:'pointer', textAlign:'center'}}>
                <div style={{fontWeight:600}}>{n.t}</div>
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
        <h1>Salut Moucharaf 👋</h1>
        <div style={s.card}>
          <p>Prêt à continuer ?</p>
          <button onClick={()=>setView('rm')} style={s.btn()}>Ouvrir la Roadmap</button>
        </div>
      </main>
    </div>
  );
}