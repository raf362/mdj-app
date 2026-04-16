import { useState, useEffect } from "react";

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;

// --- Tes constantes de données ---
const FS=[{id:'internet',t:'Internet & Web',lv:1,d:[],rm:'fs'},{id:'html',t:'HTML',lv:1,d:['internet'],rm:'fs'},{id:'css',t:'CSS',lv:2,d:['html'],rm:'fs'},{id:'js',t:'JavaScript',lv:2,d:['html'],rm:'fs'},{id:'git',t:'Git & GitHub',lv:2,d:['internet'],rm:'fs'},{id:'react',t:'React',lv:3,d:['js'],rm:'fs'},{id:'node',t:'Node.js',lv:3,d:['js'],rm:'fs'},{id:'express',t:'Express.js',lv:4,d:['node'],rm:'fs'},{id:'sql',t:'SQL & PostgreSQL',lv:4,d:['node'],rm:'fs'},{id:'mongo',t:'MongoDB',lv:4,d:['node'],rm:'fs'},{id:'rest',t:'REST APIs',lv:5,d:['express'],rm:'fs'},{id:'auth',t:'Authentification',lv:5,d:['rest'],rm:'fs'},{id:'deploy',t:'Déploiement Web',lv:5,d:['git','rest'],rm:'fs'}];
const DV=[{id:'linux',t:'Linux Basics',lv:1,d:[],rm:'dv'},{id:'net_dv',t:'Réseaux & DNS',lv:1,d:['linux'],rm:'dv'},{id:'git_dv',t:'Git avancé',lv:2,d:['linux'],rm:'dv'},{id:'docker',t:'Docker',lv:2,d:['linux'],rm:'dv'},{id:'cicd',t:'CI/CD',lv:3,d:['docker','git_dv'],rm:'dv'},{id:'k8s',t:'Kubernetes',lv:3,d:['docker'],rm:'dv'},{id:'cloud',t:'Cloud (AWS/GCP)',lv:4,d:['cicd'],rm:'dv'},{id:'monitor',t:'Monitoring',lv:4,d:['cloud'],rm:'dv'},{id:'iac',t:'Infra as Code',lv:5,d:['cloud'],rm:'dv'}];
const NET=[{id:'osi',t:'Modèle OSI',lv:1,d:[],rm:'net'},{id:'tcpip',t:'TCP/IP',lv:1,d:['osi'],rm:'net'},{id:'dns_h',t:'DNS & HTTP',lv:2,d:['tcpip'],rm:'net'},{id:'proto',t:'Protocoles réseau',lv:2,d:['tcpip'],rm:'net'},{id:'fw',t:'Pare-feu & VPN',lv:3,d:['dns_h'],rm:'net'},{id:'wifi',t:'Sécurité Wi-Fi',lv:3,d:['proto'],rm:'net'},{id:'shark',t:'Wireshark',lv:4,d:['fw'],rm:'net'},{id:'narch',t:'Architecture réseau',lv:4,d:['fw'],rm:'net'}];
const SEC=[{id:'sbase',t:'Fondamentaux sécu',lv:1,d:[],rm:'sec'},{id:'crypt',t:'Cryptographie',lv:2,d:['sbase'],rm:'sec'},{id:'owasp',t:'Sécu Web (OWASP)',lv:2,d:['sbase'],rm:'sec'},{id:'lsec',t:'Linux & Permissions',lv:2,d:['sbase'],rm:'sec'},{id:'ptest',t:'Pentest bases',lv:3,d:['owasp','crypt'],rm:'sec'},{id:'foren',t:'Forensics',lv:3,d:['sbase'],rm:'sec'},{id:'ctf',t:'CTF Basics',lv:4,d:['ptest'],rm:'sec'},{id:'csec',t:'Sécurité Cloud',lv:4,d:['ptest'],rm:'sec'},{id:'sops',t:'SecOps & SOC',lv:5,d:['foren','csec'],rm:'sec'}];
const ALL=[...FS,...DV,...NET,...SEC];

const RMS={
  fs:{label:'Full Stack',icon:'🌐',nodes:FS,color:'#cf6679'},
  dv:{label:'DevOps',icon:'⚙️',nodes:DV,color:'#5a9e6f'},
  net:{label:'Réseaux',icon:'🔌',nodes:NET,color:'#5b8dd9'},
  sec:{label:'Cybersécurité',icon:'🔐',nodes:SEC,color:'#c17f3e'},
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
  return <div className="prose-mdj" style={{textAlign:'left'}}>
    {txt.split('\n').map((l, i) => {
      if (l.startsWith('## ')) return <h2 key={i} style={{color:'#c96442',fontWeight:700,fontSize:'1.1rem',marginTop:'1.5rem',marginBottom:'0.5rem',textAlign:'left'}}>{l.slice(3)}</h2>;
      if (l.startsWith('### ')) return <h3 key={i} style={{color:'#8b5e3c',fontWeight:600,fontSize:'1rem',marginTop:'1.2rem',marginBottom:'0.4rem',textAlign:'left'}}>{l.slice(4)}</h3>;
      if (l.startsWith('- ')||l.startsWith('* ')) return <li key={i} style={{color:'#3d2b1f',fontSize:'0.9rem',marginLeft:'1rem',marginBottom:'0.3rem'}}>{l.slice(2)}</li>;
      if (l.trim() === '') return <br key={i}/>;
      return <p key={i} style={{color:'#3d2b1f',fontSize:'0.9rem',lineHeight:'1.6',marginBottom:'0.8rem',textAlign:'left'}}>{l.replace(/\*\*/g, '')}</p>;
    })}
  </div>;
};

const s={
  app:{display:'flex',minHeight:'100vh',background:'#f5ede6',fontFamily:'"Inter", -apple-system, sans-serif'},
  sidebar:{width:'240px',background:'#fdf6f0',borderRight:'1px solid #e8d5c4',display:'flex',flexDirection:'column',position:'fixed',height:'100vh',zIndex:100},
  main:{flex:1,marginLeft:'240px',padding:'2rem',maxWidth:'860px'},
  logo:{padding:'1.5rem',fontWeight:800,color:'#c96442',borderBottom:'1px solid #e8d5c4'},
  navBtn:(active)=>({width:'100%',padding:'0.75rem 1.25rem',background:active?'#fde8df':'transparent',color:active?'#c96442':'#6b4c38',fontWeight:active?600:400,border:'none',cursor:'pointer',textAlign:'left',fontSize:'0.9rem'}),
  card:{background:'#fffaf7',border:'1px solid #e8d5c4',borderRadius:'12px',padding:'1.5rem',marginBottom:'1rem'},
  btn:()=>({padding:'0.6rem 1.2rem',borderRadius:'8px',border:'none',cursor:'pointer',background:'#c96442',color:'#fff',fontSize:'0.85rem',fontWeight:500}),
  tag:(color)=>({padding:'4px 12px',borderRadius:'20px',fontSize:'0.75rem',fontWeight:600,background:color+'18',color:color,border:`1px solid ${color}30`}),
  tabBtn:(active)=>({flex:1,padding:'0.6rem',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'0.75rem',fontWeight:active?700:500,background:active?'#fff':'transparent',color:active?'#c96442':'#9c7b6b'}),
  // Fix des options de quiz (Couleur du texte corrigée)
  optionBtn:(active, color)=>({display:'block',width:'100%',textAlign:'left',padding:'0.8rem',marginTop:'8px',borderRadius:'10px',border:'1px solid #e8d5c4',background:active?color+'15':'#fff',color:'#3d2b1f',fontSize:'0.85rem',cursor:'pointer',transition:'background 0.2s'}),
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

  const ck=(id,t)=>`mdj_c_${id}_${t}`;
  const total=ALL.length,done=Object.values(prog).filter(p=>p.completed).length,pct=Math.round(done/total*100);

  const deleteCurrentCache=()=>{
    if(!node)return;
    ['course','quiz','lab','test'].forEach(t=>localStorage.removeItem(ck(node.id,t)));
    setContent(null);setQz({q:[],a:{},done:false,score:0});
    alert("Cache vidé.");
  };

  const loadTab=async(n,t)=>{
    const key=ck(n.id,t);
    const cached=store.get(key);
    if(cached){
      if(t==='quiz'||t==='test')setQz({...JSON.parse(cached),a:{},done:false});
      else setContent(cached);
      return;
    }
    setLoading(true);
    try{
      let p;
      if(t==='course') p=`Tu es un professeur expert. Crée un cours simple sur ${n.t}. Structure : ## Concept, ### Fonctionnement, ### Exemple, ### Résumé. Alignement à gauche. Markdown.`;
      else{
        let c=store.get(ck(n.id,'course'));
        if(!c){c=await callAI(`Cours sur ${n.t}`);store.set(ck(n.id,'course'),c);}
        p=`Basé sur ce cours : "${c}", génère un ${t} sur ${n.t}. JSON pour quiz/test : {"questions":[{"q":"","options":[],"answer":0}]}. Les questions doivent porter sur les notions du cours.`;
      }
      const res=await callAI(p);
      if(t==='quiz'||t==='test'){
        const m=res.match(/\{[\s\S]*\}/);
        if(m){const d={q:JSON.parse(m[0]).questions};setQz({...d,a:{},done:false});store.set(key,JSON.stringify(d));}
      }else{setContent(res);store.set(key,res);}
    }catch(e){console.error(e)}
    setLoading(false);
  };

  const openNode=n=>{setNode(n);setTab('course');setContent(null);setView('node');loadTab(n,'course');};
  
  const Sidebar=()=>(
    <aside style={s.sidebar}>
      <div style={s.logo}>DEV JOURNEY</div>
      <button style={s.navBtn(view==='dash')} onClick={()=>setView('dash')}>🏠 Accueil</button>
      <button style={s.navBtn(view==='rm'||view==='node')} onClick={()=>setView('rm')}>🗺️ Roadmap</button>
      <div style={{marginTop:'auto',padding:'1.5rem',borderTop:'1px solid #e8d5c4'}}>
        <div style={{fontSize:'0.7rem',color:'#9c7b6b',marginBottom:'5px'}}>Progression: {pct}%</div>
        <div style={{height:6,background:'#e8d5c4',borderRadius:3}}><div style={{height:'100%',width:`${pct}%`,background:'#c96442',borderRadius:3}}/></div>
      </div>
    </aside>
  );

  if(view==='node'&&node){
    const R=RMS[node.rm];
    return(
      <div style={s.app}>
        <Sidebar/>
        <main style={s.main}>
          <button onClick={()=>setView('rm')} style={{background:'none',border:'none',color:'#c96442',cursor:'pointer',marginBottom:'1rem',fontSize:'0.9rem',textAlign:'left'}}>← Retour</button>
          <div style={{marginBottom:'1.5rem',textAlign:'left'}}><span style={s.tag(R.color)}>{node.t}</span></div>
          <div style={{display:'flex',gap:'4px',background:'#fdf6f0',padding:'5px',borderRadius:'12px',marginBottom:'1.5rem',border:'1px solid #e8d5c4'}}>
            {['course','quiz','lab','test'].map(t=>(
              <button key={t} onClick={()=>{setTab(t);loadTab(node,t);}} style={s.tabBtn(tab===t)}>{t.toUpperCase()}</button>
            ))}
          </div>
          <div style={s.card}>
            {loading ? <p style={{color:'#9c7b6b',textAlign:'center'}}>IA en action...</p> : (tab==='course'||tab==='lab' ? 
              <div>
                <MD txt={content}/>
                <button onClick={deleteCurrentCache} style={{marginTop:'2rem',background:'none',border:'none',color:'#c96442',fontSize:'0.7rem',cursor:'pointer',opacity:0.6,display:'block'}}>🗑️ Effacer le cache</button>
              </div> : 
              <div style={{textAlign:'left'}}>
                {qz.q.map((q,i)=>(
                  <div key={i} style={{marginBottom:'2rem'}}>
                    <p style={{fontWeight:700,color:'#3d2b1f',marginBottom:'0.8rem',fontSize:'1rem'}}>{i+1}. {q.q}</p>
                    {q.options.map((opt,j)=>(
                       <button key={j} onClick={()=>!qz.done&&setQz(p=>({...p,a:{...p.a,[i]:j}}))} style={s.optionBtn(qz.a[i]===j, R.color)}>{opt}</button>
                    ))}
                  </div>
                ))}
                {!qz.done && <button onClick={()=>{
                   let ok=0; qz.q.forEach((q,i)=>{if(qz.a[i]===q.answer)ok++;});
                   const sc=Math.round(ok/qz.q.length*100);
                   setQz(p=>({...p,done:true,score:sc}));
                   if(tab==='test'&&sc>=70){const np={...prog,[node.id]:{completed:true}};setProg(np);localStorage.setItem('mdj_prog',JSON.stringify(np));}
                }} style={s.btn()}>Valider le test</button>}
                {qz.done && <div style={{padding:'1rem',background:qz.score>=70?'#e8f5ec':'#fdecea',borderRadius:'10px',textAlign:'center',marginTop:'1.5rem',color:qz.score>=70?'#2d7a47':'#c94242',fontWeight:700}}>Score : {qz.score}%</div>}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  if(view==='rm'){
    return(
      <div style={s.app}>
        <Sidebar/>
        <main style={s.main}>
          <div style={{display:'flex',gap:'8px',marginBottom:'2rem',flexWrap:'wrap'}}>
            {Object.entries(RMS).map(([k,v])=><button key={k} onClick={()=>setRm(k)} style={{...s.btn(),background:rm===k?v.color:'#fdf6f0',color:rm===k?'#fff':v.color,border:`1px solid ${v.color}`}}>{v.label}</button>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'1rem'}}>
            {RMS[rm].nodes.map(n=>(
              <button key={n.id} onClick={()=>openNode(n)} style={{...s.card,cursor:'pointer',textAlign:'center',border:prog[n.id]?.completed?`2px solid #5a9e6f`:`1px solid #e8d5c4`}}>
                <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>{prog[n.id]?.completed?'✅':'📖'}</div>
                <div style={{fontWeight:600,fontSize:'0.9rem',color:'#3d2b1f'}}>{n.t}</div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return(
    <div style={s.app}>
      <Sidebar/>
      <main style={s.main}>
        <h1 style={{color:'#3d2b1f',fontSize:'1.8rem'}}>Salut, Moucharaf 👋</h1>
        <div style={s.card}>
          <p style={{color:'#6b4c38'}}>Continuons là où tu t'es arrêté.</p>
          <button onClick={()=>setView('rm')} style={{...s.btn(),marginTop:'1rem'}}>Ouvrir la Roadmap</button>
        </div>
      </main>
    </div>
  );
}