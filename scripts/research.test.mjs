import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { projectFeatures, similarity } from '../src/lib/projection.ts';
import { readingPlans } from '../src/data/research.ts';

const atlas=JSON.parse(await readFile(new URL('../dist/research/data.json',import.meta.url),'utf8'));
const close=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);

test('PCA recovers known orthogonal axes and explained variance',()=>{
  const result=projectFeatures([[-2,-1],[-2,1],[2,-1],[2,1]]);
  close(result.variance[0],.8);close(result.variance[1],.2);
  close(Math.abs(result.loadings[0][0]),1);close(Math.abs(result.loadings[1][1]),1);
});
test('PCA centers translations, preserves row order, and handles constant data',()=>{
  const rows=[[0,1,0],[1,0,0],[1,1,1],[0,0,1],[1,0,1]];
  const a=projectFeatures(rows),b=projectFeatures(rows.map(r=>r.map(x=>x+8)));
  a.points.forEach((p,i)=>p.forEach((v,j)=>close(v,b.points[i][j])));
  for(const axis of [0,1])close(a.points.reduce((s,p)=>s+p[axis],0),0);
  const constant=projectFeatures([[1,1],[1,1],[1,1]]);
  assert.ok(constant.points.flat().every(Number.isFinite));assert.deepEqual(constant.variance,[0,0]);
  assert.throws(()=>projectFeatures([[1,2],[1]]));
});
test('Archive coverage, unique IDs, reference status and source links remain valid',()=>{
  assert.equal(atlas.nodes.length,54);assert.equal(atlas.nodes.filter(n=>n.review).length,38);
  assert.equal(atlas.nodes.filter(n=>!n.review).length,16);assert.equal(new Set(atlas.nodes.map(n=>n.id)).size,54);
  assert.equal(atlas.nodes.find(n=>n.id==='vico-sam3').preprint,true);
  for(const node of atlas.nodes){
    assert.ok(atlas.groups.some(g=>g.id===node.group));assert.ok(node.features.length);
    assert.equal(new Set(node.features).size,node.features.length);
    assert.ok(node.features.every(f=>atlas.features.includes(f)));
    assert.ok(node.source.startsWith('https://'));assert.ok(node.evidence);
    assert.ok([...node.topic,...node.pca,...node.coordinates].every(Number.isFinite));
    if(node.review)awaitableReviewCheck(node.review);
  }
});
function awaitableReviewCheck(url){assert.match(url,/^\/papers\/[a-z0-9-]+\/$/);}
test('Published coordinates remain centered, orthogonal and explain bounded variance',()=>{
  const {loadings,variance,points}=atlas.projection;
  assert.ok(variance[0]>=variance[1]&&variance[1]>0&&variance.reduce((s,x)=>s+x,0)<=1);
  close(loadings[0].reduce((s,x,i)=>s+x*loadings[1][i],0),0);
  loadings.forEach(v=>close(v.reduce((s,x)=>s+x*x,0),1));
  for(const axis of [0,1])close(points.reduce((s,p)=>s+p[axis],0),0);
});
test('Similarity edges are not self-edges and reference real papers',()=>{
  const seen=new Set();
  for(const edge of atlas.edges){
    assert.notEqual(edge.source,edge.target);
    const a=atlas.nodes.find(n=>n.id===edge.source),b=atlas.nodes.find(n=>n.id===edge.target);
    assert.ok(a&&b);close(edge.weight,similarity(a.features,b.features));assert.ok(edge.weight>=.5);
    const key=[edge.source,edge.target].sort().join('|');assert.ok(!seen.has(key));seen.add(key);
  }
  close(similarity(['a','b'],['b','c']),1/3);close(similarity([],[]),0);
});
test('Every reading-plan source resolves and every new reference has a plan',()=>{
  assert.equal(readingPlans.length,12);
  for(const plan of readingPlans)for(const id of plan.papers)assert.ok(atlas.nodes.some(n=>n.id===id),id);
  for(const node of atlas.nodes.filter(n=>!n.review))assert.ok(readingPlans.some(p=>p.papers.includes(node.id)),node.id);
});
