import { featureLabels, readingPlans } from '../data/research';
import type { Research } from '../lib/research';

document.querySelectorAll<HTMLElement>('[data-atlas]').forEach(root => {
  const data = JSON.parse(root.querySelector('[data-atlas-data]')!.textContent!) as Research;
  const compact = root.dataset.compact === 'true';
  const query = root.querySelector<HTMLInputElement>('[data-atlas-query]');
  const status = root.querySelector<HTMLSelectElement>('[data-atlas-status]');
  const year = root.querySelector<HTMLSelectElement>('[data-atlas-year]');
  const preprints = root.querySelector<HTMLInputElement>('[data-atlas-preprints]');
  const svg = root.querySelector<SVGSVGElement>('[data-atlas-svg]')!;
  const canvas = root.querySelector<HTMLElement>('[data-atlas-canvas]')!;
  const list = root.querySelector<HTMLElement>('[data-atlas-list]')!;
  const detail = root.querySelector<HTMLElement>('[data-atlas-detail]')!;
  const nodes = [...root.querySelectorAll<SVGGElement>('[data-paper-id]')];
  const rows = [...root.querySelectorAll<HTMLButtonElement>('[data-list-id]')];
  const edges = [...root.querySelectorAll<SVGLineElement>('[data-edge-source]')];
  const params = new URLSearchParams(location.search);
  let mode = !compact && ['topic','pca','list'].includes(params.get('view') || '') ? params.get('view')! : 'topic';
  let group = !compact && data.groups.some(g=>g.id===params.get('group')) ? params.get('group')! : 'all';
  let selected = !compact && data.nodes.some(p=>p.id===params.get('paper')) ? params.get('paper')! : 'baclip';
  let visible = new Set<string>();
  let zoom = 1, panX = 0, panY = 0;
  const narrow = matchMedia('(max-width: 600px)');
  const mobileCenters: Record<string, number[]> = { alignment:[150,140],ovcos:[440,140],structure:[150,390],foundation:[440,390],learning:[150,650],transfer:[440,650] };
  const size=()=>narrow.matches && mode==='topic' ? [600,810] : [900,540];
  const position=(paper: Research['nodes'][number])=>{
    if(mode==='pca')return paper.pca;
    if(!narrow.matches)return paper.topic;
    const original=data.groups.find(g=>g.id===paper.group)!,target=mobileCenters[paper.group]!;
    return [paper.topic[0]!-original.x+target[0]!,paper.topic[1]!-original.y+target[1]!];
  };
  let drag: { x: number; y: number; px: number; py: number } | null = null;
  let wasDragged = false;
  if (!compact) {
    if (query) query.value = params.get('q') || '';
    if (status && ['reviewed','queued'].includes(params.get('status') || '')) status.value = params.get('status')!;
    if (year && [...year.options].some(o=>o.value===params.get('year'))) year.value = params.get('year')!;
    if (preprints) preprints.checked = params.get('preprints') !== '0';
  }
  const text = (selector: string, value: string) => { root.querySelector<HTMLElement>(selector)!.textContent = value; };
  const url = () => {
    if (compact) return;
    const next = new URL(location.href);
    for (const [key,value] of Object.entries({ view: mode === 'topic' ? '' : mode, group: group === 'all' ? '' : group,
      paper: selected, q: query?.value.trim() || '', status: status?.value === 'all' ? '' : status?.value || '',
      year: year?.value === 'all' ? '' : year?.value || '', preprints: preprints?.checked ? '' : '0' })) {
      if (value) next.searchParams.set(key,value); else next.searchParams.delete(key);
    }
    history.replaceState(null,'',next);
  };
  function showDetail() {
    const paper = data.nodes.find(p=>p.id===selected && visible.has(p.id));
    detail.hidden = !paper;
    nodes.forEach(n=>n.setAttribute('aria-pressed', String(n.dataset.paperId===selected)));
    rows.forEach(n=>n.setAttribute('aria-pressed', String(n.dataset.listId===selected)));
    if (!paper) return;
    text('[data-detail-group]',data.groups.find(g=>g.id===paper.group)!.ko);
    text('[data-detail-state]',paper.review?'리뷰 있음':paper.preprint?'프리프린트':'읽을 논문');
    text('[data-detail-venue]',paper.venue);
    text('[data-detail-short]',paper.short);
    text('[data-detail-title]',paper.title);
    text('[data-detail-summary]',paper.summary);
    text('[data-detail-question]',paper.question);
    text('[data-detail-evidence]',paper.evidence || '');
    const featureBox=root.querySelector('[data-detail-features]')!;
    featureBox.replaceChildren(...paper.features.map(f=>{const el=document.createElement('span');el.textContent=featureLabels[f];return el;}));
    const source=root.querySelector<HTMLAnchorElement>('[data-detail-source]')!;
    source.href=paper.source;
    const review=root.querySelector<HTMLAnchorElement>('[data-detail-review]')!;
    review.hidden=!paper.review;
    if (paper.review) review.href=paper.review;
    const plan=readingPlans.find(p=>(p.papers as readonly string[]).includes(paper.id));
    const planLink=root.querySelector<HTMLAnchorElement>('[data-detail-plan]')!;
    planLink.hidden=!plan;
    if (plan) planLink.href=`${import.meta.env.BASE_URL.replace(/\/$/,'')}/reading/#${plan.id}`;
  }
  function drawEdges() {
    edges.forEach(edge=>{
      const a=data.nodes.find(p=>p.id===edge.dataset.edgeSource)!,b=data.nodes.find(p=>p.id===edge.dataset.edgeTarget)!;
      const show=visible.has(a.id)&&visible.has(b.id)&&(a.id===selected||b.id===selected);
      edge.toggleAttribute('data-hidden',!show);
      const ap=position(a),bp=position(b);
      edge.setAttribute('x1',String(ap[0]));edge.setAttribute('y1',String(ap[1]));edge.setAttribute('x2',String(bp[0]));edge.setAttribute('y2',String(bp[1]));
    });
  }
  function renderViewBox() { const [w,h]=size();svg.setAttribute('viewBox',`${panX} ${panY} ${w!/zoom} ${h!/zoom}`);svg.style.aspectRatio=`${w}/${h}`;svg.style.touchAction=zoom>1?'none':'pan-y'; }
  function update() {
    const terms=(query?.value.trim().toLocaleLowerCase()||'').split(/\s+/).filter(Boolean);
    visible=new Set(data.nodes.filter(p=>(group==='all'||p.group===group) &&
      (!status || status.value==='all' || (status.value==='reviewed'?!!p.review:!p.review)) &&
      (!year || year.value==='all' || p.year===Number(year.value)) &&
      (!preprints || preprints.checked || !p.preprint) &&
      terms.every(term=>[p.short,p.title,p.summary,p.venue,...p.features].join(' ').toLocaleLowerCase().includes(term))).map(p=>p.id));
    if (!visible.has(selected)) selected=data.nodes.find(p=>visible.has(p.id))?.id || '';
    nodes.forEach(node=>{
      const p=data.nodes.find(p=>p.id===node.dataset.paperId)!;
      node.toggleAttribute('data-hidden',!visible.has(p.id));
      const point=position(p);
      node.style.transform=`translate(${point[0]}px,${point[1]}px)`;
    });
    root.querySelectorAll<SVGGElement>('[data-cluster-id]').forEach(cluster=>{
      const original=data.groups.find(g=>g.id===cluster.dataset.clusterId)!,target=mobileCenters[original.id]!;
      cluster.setAttribute('transform',narrow.matches ? `translate(${target[0]!-original.x},${target[1]!-original.y})` : 'translate(0,0)');
    });
    renderViewBox();
    rows.forEach(row=>row.hidden=!visible.has(row.dataset.listId!));
    root.querySelectorAll<HTMLButtonElement>('[data-atlas-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.atlasMode===mode)));
    root.querySelectorAll<HTMLButtonElement>('[data-atlas-group]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.atlasGroup===group)));
    canvas.hidden=mode==='list';list.hidden=mode!=='list';
    root.querySelector('[data-cluster-labels]')!.toggleAttribute('data-hidden',mode==='pca');
    root.querySelector('[data-pca-axes]')!.toggleAttribute('data-hidden',mode!=='pca');
    root.querySelector<HTMLElement>('[data-atlas-empty]')!.hidden=visible.size>0;
    let emptyList=list.querySelector('[data-list-empty]');
    if (!emptyList) {emptyList=document.createElement('p');emptyList.setAttribute('data-list-empty','');emptyList.textContent='조건에 맞는 논문이 없습니다.';list.append(emptyList);}
    emptyList.toggleAttribute('hidden',visible.size>0);
    text('[data-atlas-count]',`${visible.size} / ${data.nodes.length} entries`);
    text('[data-atlas-caption]',mode==='pca'?'수동 연구 특성 10개 → PCA · 선은 특성 유사도 · 성능 순위가 아닙니다':mode==='list'?'같은 자료를 목록으로 탐색 · 논문을 선택해 상세 보기':'주제별 편집 분류 · 선은 특성 유사도 · 점을 선택해 탐색');
    showDetail();drawEdges();url();
  }
  function select(id: string) {selected=id;showDetail();drawEdges();url();}
  nodes.forEach(node=>{
    node.addEventListener('click',()=>{if(!wasDragged)select(node.dataset.paperId!);});
    node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(node.dataset.paperId!);}});
  });
  rows.forEach(row=>row.addEventListener('click',()=>select(row.dataset.listId!)));
  root.querySelectorAll<HTMLButtonElement>('[data-atlas-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.atlasMode!;zoom=1;panX=panY=0;renderViewBox();update();}));
  root.querySelectorAll<HTMLButtonElement>('[data-atlas-group]').forEach(b=>b.addEventListener('click',()=>{group=b.dataset.atlasGroup!;update();}));
  query?.addEventListener('input',update);status?.addEventListener('change',update);year?.addEventListener('change',update);preprints?.addEventListener('change',update);
  root.querySelector('[data-atlas-reset]')?.addEventListener('click',()=>{group='all';if(query)query.value='';if(status)status.value='all';if(year)year.value='all';if(preprints)preprints.checked=true;zoom=1;panX=panY=0;renderViewBox();update();});
  root.querySelectorAll<HTMLButtonElement>('[data-atlas-zoom]').forEach(b=>b.addEventListener('click',()=>{
    const before=zoom;zoom=b.dataset.atlasZoom==='reset'?1:Math.max(1,Math.min(3,zoom+(b.dataset.atlasZoom==='in'?0.4:-0.4)));
    const [w,h]=size();panX+=(w!/before-w!/zoom)/2;panY+=(h!/before-h!/zoom)/2;
    if(zoom===1)panX=panY=0;renderViewBox();
  }));
  svg.addEventListener('pointerdown',e=>{
    // Keep one-finger page scrolling available on phones at the default scale.
    if(e.pointerType==='touch'&&zoom===1){wasDragged=false;return;}
    drag={x:e.clientX,y:e.clientY,px:panX,py:panY};wasDragged=false;
  });
  svg.addEventListener('pointermove',e=>{
    if(!drag)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(Math.abs(dx)+Math.abs(dy)<5)return;
    wasDragged=true;svg.setPointerCapture(e.pointerId);
    const scale=size()[0]!/zoom/svg.getBoundingClientRect().width;
    panX=Math.max(-300,Math.min(800,drag.px-dx*scale));panY=Math.max(-180,Math.min(480,drag.py-dy*scale));renderViewBox();
  });
  const endDrag=()=>{drag=null;};svg.addEventListener('pointerup',endDrag);svg.addEventListener('pointercancel',endDrag);
  root.querySelector('[data-atlas-copy]')?.addEventListener('click',async e=>{
    const button=e.currentTarget as HTMLButtonElement;
    try{await navigator.clipboard.writeText(location.href);button.textContent='링크를 복사했습니다';}
    catch{button.textContent='주소창에서 링크를 복사해 주세요';}
    setTimeout(()=>button.textContent='현재 보기 링크 복사 ↗',2000);
  });
  narrow.addEventListener('change',()=>{zoom=1;panX=panY=0;update();});
  update();
});
