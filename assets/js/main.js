// Interior-page reveal: soft like the original, but with a longer fade through the viewport edge.
const revealItems=[...document.querySelectorAll('.reveal')];
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver((entries,obs)=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target)}
  }),{rootMargin:'0px 0px -10% 0px',threshold:.09});
  revealItems.forEach(el=>observer.observe(el));
}else revealItems.forEach(el=>el.classList.add('visible'));

// Homepage constellation: stable by default; desktop motion is generated only by the cursor.
const graph=document.querySelector('#graph');
const svg=document.querySelector('#graph-lines');
if(graph&&svg){
  const nodes=[...graph.querySelectorAll('[data-node]')];
  const byId=Object.fromEntries(nodes.map(n=>[n.dataset.node,n]));
  const links=[
    ['raya','ai','major'],['raya','writing','major'],['raya','adoptee','major'],['raya','coaching','major'],['raya','contact','minor'],
    ['ai','judgment','idea'],['writing','judgment','idea'],['coaching','judgment','idea'],
    ['ai','systems','idea'],['writing','systems','idea'],['adoptee','systems','idea'],['coaching','systems','idea'],
    ['ai','humanity','idea'],['writing','humanity','idea'],['adoptee','humanity','idea'],
    ['adoptee','identity','idea'],['writing','identity','idea'],['coaching','identity','idea'],
    ['ai','responsibility','idea'],['writing','responsibility','idea'],['coaching','responsibility','idea'],
    ['writing','compassion','idea'],['adoptee','compassion','idea'],['coaching','compassion','idea'],
    ['coaching','curiosity','idea'],['ai','curiosity','idea'],['writing','curiosity','idea']
  ];
  const ns='http://www.w3.org/2000/svg';
  const lineEls=links.map(([a,b,type])=>{const l=document.createElementNS(ns,'line');l.dataset.a=a;l.dataset.b=b;l.classList.add(`link-${type}`);svg.appendChild(l);return l});
  const presets={
    wide:{raya:[.50,.48],coaching:[.19,.25],ai:[.76,.24],adoptee:[.20,.72],writing:[.76,.72],contact:[.88,.47],judgment:[.61,.18],systems:[.37,.38],humanity:[.66,.40],identity:[.35,.62],responsibility:[.60,.62],compassion:[.43,.79],curiosity:[.49,.27]},
    mid:{raya:[.50,.47],coaching:[.18,.24],ai:[.76,.23],adoptee:[.19,.71],writing:[.76,.71],contact:[.88,.47],judgment:[.61,.16],systems:[.36,.38],humanity:[.66,.40],identity:[.35,.61],responsibility:[.60,.61],compassion:[.43,.81],curiosity:[.49,.28]},
    narrow:{
  raya:[.50,.22],
  coaching:[.24,.42],
  ai:[.72,.42],
  adoptee:[.24,.64],
  writing:[.72,.64],
  contact:[.50,.82],

  judgment:[.50,.30],
  systems:[.36,.48],
  humanity:[.64,.47],
  identity:[.34,.73],
  responsibility:[.64,.73],
  compassion:[.50,.82],
  curiosity:[.50,.40]
}
  };
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)');
  const states={};
  let hovered=null;
  let pointer={x:0,y:0,inside:false};
  let last=performance.now();
  const getPreset=()=>innerWidth<620?presets.narrow:innerWidth<980?presets.mid:presets.wide;
  const motionEnabled=()=>!reduced && finePointer.matches && innerWidth>=700;

  function coreCenter(node,base){
    const core=node.querySelector('.node-core');
    const r=(core||node).getBoundingClientRect();
    return [r.left+r.width/2-base.left,r.top+r.height/2-base.top];
  }
  function drawLines(){
    const base=graph.getBoundingClientRect();
    lineEls.forEach(line=>{
      const a=byId[line.dataset.a],b=byId[line.dataset.b];
      if(!a||!b)return;
      const [x1,y1]=coreCenter(a,base),[x2,y2]=coreCenter(b,base);
      line.setAttribute('x1',x1);line.setAttribute('y1',y1);line.setAttribute('x2',x2);line.setAttribute('y2',y2);
    });
  }
  function targetFor(id){
    const rect=graph.getBoundingClientRect();
    const [px,py]=getPreset()[id]||[.5,.5];
    return {x:px*rect.width,y:py*rect.height};
  }
  function seed(){
    nodes.forEach(node=>{
      const t=targetFor(node.dataset.node);
      states[node.dataset.node]={x:t.x,y:t.y,vx:0,vy:0,baseX:t.x,baseY:t.y};
      node.style.left=`${t.x}px`;node.style.top=`${t.y}px`;
    });
    drawLines();
  }
  function refreshBases(){
    nodes.forEach(node=>{const t=targetFor(node.dataset.node),s=states[node.dataset.node];s.baseX=t.x;s.baseY=t.y;if(!motionEnabled()){s.x=t.x;s.y=t.y;s.vx=0;s.vy=0;node.style.left=`${t.x}px`;node.style.top=`${t.y}px`}});
    drawLines();
  }
  function highlight(id){
    hovered=id;
    const connected=new Set([id]);
    links.forEach(([a,b])=>{if(a===id)connected.add(b);if(b===id)connected.add(a)});
    nodes.forEach(n=>n.classList.toggle('dim',!connected.has(n.dataset.node)));
    lineEls.forEach(l=>{const hit=l.dataset.a===id||l.dataset.b===id;l.classList.toggle('active',hit);l.classList.toggle('dim',!hit)});
  }
  function clear(){hovered=null;nodes.forEach(n=>n.classList.remove('dim'));lineEls.forEach(l=>l.classList.remove('active','dim'))}
  nodes.forEach(n=>{n.addEventListener('mouseenter',()=>highlight(n.dataset.node));n.addEventListener('focus',()=>highlight(n.dataset.node));n.addEventListener('mouseleave',clear);n.addEventListener('blur',clear)});

  graph.addEventListener('pointermove',e=>{
    if(!motionEnabled())return;
    const r=graph.getBoundingClientRect();
    pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;pointer.inside=true;
  },{passive:true});
  graph.addEventListener('pointerleave',()=>{pointer.inside=false},{passive:true});

  function frame(now){
    const dt=Math.min((now-last)/1000,.028);last=now;
    if(motionEnabled()){
      nodes.forEach(node=>{
        const s=states[node.dataset.node];
        let tx=s.baseX,ty=s.baseY;
        if(pointer.inside){
          const dx=pointer.x-s.baseX,dy=pointer.y-s.baseY;
          const dist=Math.hypot(dx,dy);
          const radius=400;
          if(dist<radius&&dist>0){
            // Soft falloff: almost nothing at the edge, never more than a few pixels.
            const proximity=1-dist/radius;
            const eased=proximity*proximity*(3-2*proximity);
            const maxPull=node.classList.contains('anchor')?7:node.classList.contains('primary')?12:node.classList.contains('secondary')?10:6.5;
            tx+=dx/dist*maxPull*eased;
            ty+=dy/dist*maxPull*eased;
          }
        }
        // Frame-rate-independent spring and damping. No autonomous oscillation.
        const stiffness=40;
        const damping=9.5;
        s.vx+=(tx-s.x)*stiffness*dt;
        s.vy+=(ty-s.y)*stiffness*dt;
        const decay=Math.exp(-damping*dt);
        s.vx*=decay;s.vy*=decay;
        s.x+=s.vx*dt;s.y+=s.vy*dt;
        if(Math.abs(s.x-tx)<.01&&Math.abs(s.vx)<.01){s.x=tx;s.vx=0}
        if(Math.abs(s.y-ty)<.01&&Math.abs(s.vy)<.01){s.y=ty;s.vy=0}
        node.style.left=`${s.x}px`;node.style.top=`${s.y}px`;
      });
      drawLines();
    }
    requestAnimationFrame(frame);
  }
document.fonts.ready.then(() => {
  seed();
  graph.classList.add('ready');
  requestAnimationFrame(frame);
});
  let resizeTimer;
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(refreshBases,80)},{passive:true});
  finePointer.addEventListener?.('change',refreshBases);
}