import { useState, useEffect } from "react";

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;

// --- Données ---
const FS=[{id:'internet',t:'Internet & Web',lv:1,d:[],rm:'fs'},{id:'html',t:'HTML',lv:1,d:['internet'],rm:'fs'},{id:'css',t:'CSS',lv:2,d:['html'],rm:'fs'},{id:'js',t:'JavaScript',lv:2,d:['html'],rm:'fs'},{id:'git',t:'Git & GitHub',lv:2,d:['internet'],rm:'fs'},{id:'react',t:'React',lv:3,d:['js'],rm:'fs'},{id:'node',t:'Node.js',lv:3,d:['js'],rm:'fs'},{id:'express',t:'Express.js',lv:4,d:['node'],rm:'fs'},{id:'sql',t:'SQL & PostgreSQL',lv:4,d:['node'],rm:'fs'},{id:'mongo',t:'MongoDB',lv:4,d:['node'],rm:'fs'},{id:'rest',t:'REST APIs',lv:5,d:['express'],rm:'fs'},{id:'auth',t:'Authentification',lv:5,d:['rest'],rm:'fs'},{id:'deploy',t:'Déploiement Web',lv:5,d:['git','rest'],rm:'fs'}];
const DV=[{id:'linux',t:'Linux Basics',lv:1,d:[],rm:'dv'},{id:'net_dv',t:'Réseaux & DNS',lv:1,d:['linux'],rm:'dv'},{id:'git_dv',t:'Git avancé',lv:2,d:['linux'],rm:'dv'},{id:'docker',t:'Docker',lv:2,d:['linux'],rm:'dv'},{id:'cicd',t:'CI/CD',lv:3,d:['docker','git_dv'],rm:'dv'},{id:'k8s',t:'Kubernetes',lv:3,d:['docker'],rm:'dv'},{id:'cloud',t:'Cloud (AWS/GCP)',lv:4,d:['cicd'],rm:'dv'},{id:'monitor',t:'Monitoring',lv:4,d:['cloud'],rm:'dv'},{id:'iac',t:'Infra as Code',lv:5,d:['cloud'],rm:'dv'}];
const NET=[{id:'osi',t:'Modèle OSI',lv:1,d:[],rm:'net'},{id:'tcpip',t:'TCP/IP',lv:1,d:['osi'],rm:'net'},{id:'dns_h',t:'DNS & HTTP',lv:2,d:['tcpip'],rm:'net'},{id:'proto',t:'Protocoles réseau',lv:2,d:['tcpip'],rm:'net'},{id:'fw',t:'Pare-feu & VPN',lv:3,d:['dns_h'],rm:'net'},{id:'wifi',t:'Sécurité Wi-Fi',lv:3,d:['proto'],rm:'net'},{id:'shark',t:'Wireshark',lv:4,d:['fw'],rm:'net'},{id:'narch',t:'Architecture réseau',lv:4,d:['fw'],rm:'net'}];
const SEC=[{id:'sbase',t:'Fondamentaux sécu',lv:1,d:[],rm:'sec'},{id:'crypt',t:'Cryptographie',lv:2,d:['sbase'],rm:'sec'},{id:'owasp',t:'Sécu Web (OWASP)',lv:2,d:['sbase'],rm:'sec'},{id:'lsec',t:'Linux & Permissions',lv:2,d:['sbase'],rm:'sec'},{id:'ptest',t:'Pentest bases',lv:3,d:['owasp','crypt'],rm:'sec'},{id:'foren',t:'Forensics',lv:3,d:['sbase'],rm:'sec'},{id:'ctf',t:'CTF Basics',lv:4,d:['ptest'],rm:'sec'},{id:'csec',t:'Sécurité Cloud',lv:4,d:['ptest'],rm:'sec'},{id:'sops',t:'SecOps & SOC',lv:5,d:['foren','csec'],rm:'sec'}];
const ALL=[...FS,...DV,...NET,...SEC];

const RMS={
  fs:{label:'Full Stack',nodes:FS,color:'#cf6679'},
  dv:{label:'DevOps',nodes:DV,color:'#5a9e6f'},
  net:{label:'Réseaux',nodes:NET,color:'#5b8dd9'},
  sec:{label:'Cybersécurité',nodes:SEC,color:'#c17f3e'},
};

const store={get:k=>{try{return localStorage.getItem(k);}catch{return null;}},set:(k,v)=>{try{localStorage.setItem(k,v);}catch{}}};

const callAI=async p=>{
  const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_KEY}`},body:JSON.stringify({model:'llama-3.1-8b-instant',messages:[{role:'user',content:p}],max_tokens:2000,temperature:0.3})});
  const d=await r.json();
  if(d.error)throw new Error(d.error.message);
  return d.choices[0].message.content;
};

const MD = ({ txt }) => {
  if (!txt) return null;
  return <div style={{textAlign:'left'}}>
    {txt.split('\n').map((l, i) => {
      if (l.startsWith('## ')) return <h2 key={i} style={{color:'#c96442',fontWeight:700,fontSize:'1.1rem',marginTop:'1.2rem',marginBottom:'0.5rem'}}>{l.slice(3)}</h2>;
      if (l.startsWith('### ')) return <h3 key={i} style={{color:'#8b5e3c',fontWeight:600,fontSize:'0.95rem',marginTop:'1rem',marginBottom:'0.4rem'}}>{l.slice(4)}</h3>;
      if (l.startsWith('- ')||l.startsWith('* ')) return <li key={i} style={{color:'#3d2b1f',fontSize:'0.85rem',marginLeft:'1rem',marginBottom:'0.3rem'}}>{l.slice(2)}</li>;
      return <p key={i} style={{color:'#3d2b1f',fontSize:'0.85rem',lineHeight:'1.5',marginBottom:'0.6rem'}}>{l.replace(/\*\*/g, '')}</p>;
    })}
  </div>;
};

const s={
  app:(isMob)=>({display:'flex',flexDirection:isMob?'column':'row',minHeight:'100vh',background:'#f5ede6',fontFamily:'-apple-system, sans-serif'}),
  sidebar:{width:'240px',background:'#fdf6f0',borderRight:'1px solid #e8d5c4',position:'fixed',height:'100vh',display:'flex',flexDirection:'column'},
  mobileNav:{position:'fixed',bottom:0,left:0,right:0,height:'65px',background:'#fdf6f0',borderTop:'1px solid #e8d5c4',display:'flex',justifyContent:'space-around',alignItems:'center',zIndex:1000,paddingBottom:'env(safe-area-inset-bottom)'},
  main:(isMob)=>({flex:1,marginLeft:isMob?0:'240px',padding:isMob?'1rem':'2rem',paddingBottom:isMob?'100px':'2rem'}),
  card:{background:'#fffaf7',border:'1px solid #e8d5c4',borderRadius:'16px',padding:'1.25rem',marginBottom:'1rem'},
  btn:{padding:'0.8rem 1.5rem',borderRadius:'12px',border:'none',cursor:'pointer',background:'#c96442',color:'#fff',fontSize:'0.85rem',fontWeight:600,width:'100%'},
  optionBtn:(active, color, isDone, isCorrect, isUserChoice)=>({
    display:'block',width:'100%',textAlign:'left',padding:'1rem',marginTop:'10px',borderRadius:'12px',
    border: isDone ? (isCorrect ? '2px solid #2d7a47' : isUserChoice ? '2px solid #c94242' : '1px solid #e8d5c4') : (active ? `2px solid ${color}` : '1px solid #e8d5c4'),
    background: isDone ? (isCorrect ? '#e8f5ec' : isUserChoice ? '#fdecea' : '#fff') : (active ? color+'10' : '#fff'),
    color:'#3d2b1f',fontSize:'0.85rem',cursor:'pointer'
  }),
  tabBtn:(active)=>({flex:1,padding:'0.6rem',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'0.7rem',fontWeight:active?700:500,background:active?'#fff':'transparent',color:active?'#c96442':'#9c7b6b'}),
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
  const[isMob,setIsMob]=useState(window.innerWidth < 768);

  useEffect(() => {
    const h = () => setIsMob(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const ck=(id,t)=>`mdj_c_${id}_${t}`;
  const delCache=()=>{
    if(!node)return;
    ['course','quiz','lab','test'].forEach(t=>localStorage.removeItem(ck(node.id,t)));
    setContent(null); setQz({q:[],a:{},done:false,score:0});
    loadTab(node, tab);
  };

  const loadTab=async(n,t)=>{
    const key=ck(n.id,t);
    const cached=store.get(key);
    setLoading(true);
    if(t==='course'||t==='lab'){ setContent(null); } else { setQz({q:[],a:{},done:false,score:0}); }

    if(cached && t !== 'lab'){
      if(t==='quiz'||t==='test') setQz({...JSON.parse(cached),a:{},done:false});
      else setContent(cached);
      setLoading(false);
      return;
    }

    try{
      let p;
      if(t==='course') p=`Cours simple sur ${n.t}. ## Concept, ### Fonctionnement, ### Exemple, ### Résumé. Markdown.`;
      else if(t==='lab') p=`Propose 3 exercices pratiques (TP) pour s'entraîner sur ${n.t}. Utilise des puces et du Markdown. Pas de JSON.`;
      else {
        let ctx = store.get(ck(n.id, 'course')) || n.t;
        p=`Génère un Quiz JSON de 10 questions sur "${n.t}" (Contexte: ${ctx}). Format STRICT: {"questions":[{"q":"Question?","options":["A","B","C","D"],"answer":0}]}`;
      }
      
      const res=await callAI(p);
      if(t==='quiz'||t==='test'){
        const start = res.indexOf('{');
        const end = res.lastIndexOf('}') + 1;
        const parsed = JSON.parse(res.substring(start, end));
        setQz({q:parsed.questions, a:{}, done:false});
        store.set(key, JSON.stringify({q:parsed.questions}));
      } else {
        setContent(res);
        if(t!=='lab') store.set(key, res);
      }
    }catch(e){ console.error(e); }
    setLoading(false);
  };

  const Nav = () => (
    isMob ? (
      <nav style={s.mobileNav}>
        <button onClick={()=>setView('dash')} style={{background:'none',border:'none',color:view==='dash'?'#c96442':'#9c7b6b',fontSize:'0.75rem',display:'flex',flexDirection:'column',alignItems:'center'}}><span>🏠</span><span>Accueil</span></button>
        <button onClick={()=>setView('rm')} style={{background:'none',border:'none',color:view==='rm'?'#c96442':'#9c7b6b',fontSize:'0.75rem',display:'flex',flexDirection:'column',alignItems:'center'}}><span>🗺️</span><span>Roadmap</span></button>
        <div style={{color:'#c96442',fontWeight:700,fontSize:'0.8rem'}}>{Math.round(Object.values(prog).filter(p=>p.completed).length/ALL.length*100)}%</div>
      </nav>
    ) : (
      <aside style={s.sidebar}>
        <div style={{padding:'1.5rem',fontWeight:800,color:'#c96442',borderBottom:'1px solid #e8d5c4'}}>DEV JOURNEY</div>
        <button onClick={()=>setView('dash')} style={{padding:'1rem',background:view==='dash'?'#fde8df':'none',border:'none',textAlign:'left',color:'#6b4c38',cursor:'pointer'}}>🏠 Accueil</button>
        <button onClick={()=>setView('rm')} style={{padding:'1rem',background:view==='rm'?'#fde8df':'none',border:'none',textAlign:'left',color:'#6b4c38',cursor:'pointer'}}>🗺️ Roadmap</button>
      </aside>
    )
  );

  if(view==='node'&&node){
    const R=RMS[node.rm];
    return (
      <div style={s.app(isMob)}>
        <Nav/>
        <main style={s.main(isMob)}>
          <button onClick={()=>setView('rm')} style={{background:'none',border:'none',color:'#c96442',marginBottom:'1rem',fontSize:'0.85rem'}}>← Retour</button>
          <div style={{marginBottom:'1rem'}}><span style={{padding:'4px 12px', borderRadius:'20px', background:R.color+'20', color:R.color, border:`1px solid ${R.color}40`, fontSize:'0.75rem', fontWeight:700}}>{node.t}</span></div>
          <div style={{display:'flex',gap:'4px',background:'#fdf6f0',padding:'4px',borderRadius:'12px',marginBottom:'1rem',border:'1px solid #e8d5c4'}}>
            {['course','quiz','lab','test'].map(t=>(
              <button key={t} onClick={()=>{setTab(t);loadTab(node,t);}} style={s.tabBtn(tab===t)}>{t.toUpperCase()}</button>
            ))}
          </div>
          <div style={s.card}>
            {loading ? <p style={{textAlign:'center',padding:'2rem',color:'#9c7b6b'}}>Chargement...</p> : (
              (tab==='course'||tab==='lab') ? <div><MD txt={content}/></div> : (
                <div style={{textAlign:'left'}}>
                  {qz.q.map((q,i)=>(
                    <div key={i} style={{marginBottom:'1.5rem'}}>
                      <p style={{fontWeight:700,color:'#3d2b1f',marginBottom:'0.8rem',fontSize:'0.95rem'}}>{i+1}. {q.q}</p>
                      {q.options.map((opt,j)=>(
                         <button key={j} onClick={()=>!qz.done && setQz(p=>({...p,a:{...p.a,[i]:j}}))} 
                                 style={s.optionBtn(qz.a[i]===j, R.color, qz.done, j===q.answer, qz.a[i]===j)}>
                           {opt} {qz.done && j===q.answer && " ✅"}
                           {qz.done && qz.a[i]===j && j!==q.answer && " ❌"}
                         </button>
                      ))}
                    </div>
                  ))}
                  {!qz.done && <button onClick={()=>{
                     let ok=0; qz.q.forEach((q,i)=>{if(qz.a[i]===q.answer)ok++;});
                     const sc=Math.round(ok/qz.q.length*100);
                     setQz(p=>({...p,done:true,score:sc}));
                     if(tab==='test'&&sc>=70){
                       const nP={...prog,[node.id]:{completed:true}};
                       setProg(nP); localStorage.setItem('mdj_prog',JSON.stringify(nP));
                     }
                  }} style={s.btn}>Valider mes réponses</button>}
                  {qz.done && <div style={{padding:'1rem',background:qz.score>=70?'#e8f5ec':'#fdecea',borderRadius:'12px',textAlign:'center',color:qz.score>=70?'#2d7a47':'#c94242',fontWeight:800,marginTop:'1rem'}}>Score : {qz.score}%</div>}
                </div>
              )
            )}
            <button onClick={delCache} style={{marginTop:'2rem',background:'none',border:'none',color:'#c96442',fontSize:'0.7rem',opacity:0.5,width:'100%',cursor:'pointer'}}>Effacer et recharger le module</button>
          </div>
        </main>
      </div>
    );
  }

  if(view==='rm'){
    return (
      <div style={s.app(isMob)}>
        <Nav/>
        <main style={s.main(isMob)}>
          <div style={{display:'flex',gap:'6px',marginBottom:'1.5rem',overflowX:'auto',paddingBottom:'8px'}}>
            {Object.entries(RMS).map(([k,v])=>(
              <button key={k} onClick={()=>setRm(k)} style={{...s.btn,width:'auto',background:rm===k?v.color:'#fdf6f0',color:rm===k?'#fff':v.color,border:`1px solid ${v.color}`,padding:'0.5rem 1rem',whiteSpace:'nowrap'}}>{v.label}</button>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'0.8rem'}}>
            {RMS[rm].nodes.map(n=>(
              <button key={n.id} onClick={()=>{setNode(n);setTab('course');loadTab(n,'course');setView('node');}} style={{...s.card,textAlign:'center',cursor:'pointer',border:prog[n.id]?.completed?`2px solid #5a9e6f`:`1px solid #e8d5c4`}}>
                <div style={{fontSize:'1.2rem',marginBottom:'0.4rem'}}>{prog[n.id]?.completed?'✅':'📖'}</div>
                <div style={{fontWeight:600,fontSize:'0.85rem',color:'#3d2b1f'}}>{n.t}</div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={s.app(isMob)}>
      <Nav/>
      <main style={s.main(isMob)}>
        <h1 style={{color:'#3d2b1f',fontSize:'1.5rem',marginTop:'1rem'}}>Salut Moucharaf 👋</h1>
        <div style={s.card}>
          <p style={{color:'#6b4c38',fontSize:'0.9rem'}}>Prêt pour une session de code ?</p>
          <button onClick={()=>setView('rm')} style={{...s.btn, marginTop:'1.5rem'}}>Ouvrir la Roadmap</button>
        </div>
      </main>
    </div>
  );
}