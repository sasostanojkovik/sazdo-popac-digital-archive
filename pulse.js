const DATA_URL='data/pulse.json';
const LOCAL_KEY='spPulseSnapshotsV1';
const WEIGHTS={retention:25,ctr:20,viewVelocity:20,subscriberConversion:15,engagement:10,externalTraffic:10};
const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
const num=v=>v===null||v===undefined||v===''?null:Number(v);
const fmt=n=>n===null||n===undefined||Number.isNaN(n)?'—':new Intl.NumberFormat('mk-MK',{maximumFractionDigits:1}).format(n);
const pct=n=>n===null||n===undefined||Number.isNaN(n)?'—':fmt(n)+'%';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function localSnapshots(){try{return JSON.parse(localStorage.getItem(LOCAL_KEY)||'[]')}catch{return[]}}
function saveLocalSnapshots(items){localStorage.setItem(LOCAL_KEY,JSON.stringify(items))}
function sortSnapshots(items){return [...items].sort((a,b)=>new Date(a.capturedAt)-new Date(b.capturedAt))}
function findVideo(snapshot,id){return snapshot?.videos?.find(v=>v.archiveId===id)||null}
function hoursBetween(a,b){return Math.max(0,(new Date(b)-new Date(a))/36e5)}

function deriveVelocity(current,previous,id){
  if(!current||!previous)return null;
  const c=findVideo(current,id),p=findVideo(previous,id);
  if(!c||!p||num(c.views)===null||num(p.views)===null)return null;
  const h=hoursBetween(previous.capturedAt,current.capturedAt);
  if(h<0.25)return null;
  return Math.max(0,(Number(c.views)-Number(p.views))/h);
}
function median(arr){
  const a=arr.filter(v=>Number.isFinite(v)).sort((x,y)=>x-y);
  if(!a.length)return null;
  const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;
}
function scale(v,min,max){if(v===null||!Number.isFinite(v))return null;return clamp((v-min)/(max-min)*100)}
function velocityScore(v,med){
  if(v===null||!Number.isFinite(v)||med===null||med<=0)return null;
  const ratio=Math.max(.05,v/med);
  return clamp(50+35*Math.log2(ratio));
}
function signalScores(v,velocity,velocityMedian){
  const views=Math.max(0,num(v.views)||0);
  const ctr=num(v.ctr),ret=num(v.retention),subs=num(v.subscribersGained);
  const likes=num(v.likes),comments=num(v.comments),shares=num(v.shares),ext=num(v.externalTraffic);
  const engagement=(views>0&&[likes,comments,shares].some(x=>x!==null))?((likes||0)+(comments||0)+(shares||0))/views*100:null;
  const subPerK=(views>0&&subs!==null)?subs/views*1000:null;
  return {
    retention:scale(ret,20,60),
    ctr:scale(ctr,2,10),
    viewVelocity:velocityScore(velocity,velocityMedian),
    subscriberConversion:scale(subPerK,0,20),
    engagement:scale(engagement,0,10),
    externalTraffic:scale(ext,0,30)
  };
}
function pulseScore(signals){
  let weighted=0,available=0;
  Object.entries(WEIGHTS).forEach(([k,w])=>{const s=signals[k];if(s!==null&&Number.isFinite(s)){weighted+=s*w;available+=w}});
  if(!available)return {score:null,availableWeight:0};
  return {score:weighted/available,availableWeight:available};
}
function latestPair(snapshots){
  const s=sortSnapshots(snapshots);
  return {current:s.at(-1)||null,previous:s.at(-2)||null};
}
function snapshotLabel(iso){
  if(!iso)return '—';
  return new Intl.DateTimeFormat('mk-MK',{dateStyle:'short',timeStyle:'short'}).format(new Date(iso));
}

async function boot(){
  const base=await fetch(DATA_URL,{cache:'no-store'}).then(r=>r.json());
  let snapshots=sortSnapshots([...(base.snapshots||[]),...localSnapshots()]);
  render(base,snapshots);
  buildForm(base,snapshots);
  document.querySelector('#snapshot-form').addEventListener('submit',e=>{
    e.preventDefault();
    const current=latestPair(snapshots).current;
    const snap={
      capturedAt:new Date().toISOString(),
      source:document.querySelector('#input-source').value.trim()||'Manual YouTube Studio snapshot',
      subscribers:num(document.querySelector('#input-subs').value),
      videos:base.videos.map(video=>{
        const id=video.archiveId;
        const get=k=>num(document.querySelector(`[data-id="${id}"][data-field="${k}"]`).value);
        return {archiveId:id,views:get('views'),impressions:get('impressions'),ctr:get('ctr'),retention:get('retention'),subscribersGained:get('subscribersGained'),likes:get('likes'),comments:get('comments'),shares:get('shares'),externalTraffic:get('externalTraffic')};
      })
    };
    const locals=localSnapshots();locals.push(snap);saveLocalSnapshots(locals);
    snapshots=sortSnapshots([...(base.snapshots||[]),...locals]);
    render(base,snapshots);buildForm(base,snapshots);
    window.scrollTo({top:document.querySelector('.channel-strip').offsetTop-80,behavior:'smooth'});
  });
  document.querySelector('#reset-btn').addEventListener('click',()=>{if(confirm('Да се избришат локално зачуваните snapshots?')){localStorage.removeItem(LOCAL_KEY);snapshots=sortSnapshots(base.snapshots||[]);render(base,snapshots);buildForm(base,snapshots)}});
  document.querySelector('#export-btn').addEventListener('click',()=>exportData(base,snapshots));
}
function buildForm(base,snapshots){
  const {current}=latestPair(snapshots);
  document.querySelector('#input-subs').value=current?.subscribers??'';
  const host=document.querySelector('#snapshot-video-inputs');host.innerHTML='';
  base.videos.forEach(video=>{
    const v=findVideo(current,video.archiveId)||{};
    const fields=[['views','Views',v.views],['impressions','Impressions',v.impressions],['ctr','CTR %',v.ctr],['retention','Avg viewed %',v.retention],['subscribersGained','Subs gained',v.subscribersGained],['likes','Likes',v.likes],['comments','Comments',v.comments],['shares','Shares',v.shares],['externalTraffic','External %',v.externalTraffic]];
    const wrap=document.createElement('section');wrap.className='snapshot-video';
    wrap.innerHTML=`<h3>${esc(video.archiveId)} · ${esc(video.title)}</h3><div class="fields">${fields.map(([key,label,val])=>`<label>${label}<input type="number" step="0.01" min="0" data-id="${esc(video.archiveId)}" data-field="${key}" value="${val??''}"></label>`).join('')}</div>`;
    host.appendChild(wrap);
  });
}
function render(base,snapshots){
  const {current,previous}=latestPair(snapshots);
  document.querySelector('#channel-subs').textContent=fmt(current?.subscribers);
  document.querySelector('#channel-videos').textContent=base.videos.length;
  document.querySelector('#last-snapshot').textContent=snapshotLabel(current?.capturedAt);
  document.querySelector('#snapshot-source').textContent=current?.source||'—';
  const progress=clamp(base.videos.length/(base.meta?.calibrationTargetVideos||10)*100);
  document.querySelector('#calibration-bar').style.width=progress+'%';
  document.querySelector('#calibration-copy').textContent=`${base.videos.length} / ${base.meta?.calibrationTargetVideos||10} videos`;

  const velocities=base.videos.map(v=>deriveVelocity(current,previous,v.archiveId));
  const velocityMedian=median(velocities.filter(v=>v!==null&&v>0));
  const host=document.querySelector('#video-cards');host.innerHTML='';
  const summaries=[];
  base.videos.forEach((video,idx)=>{
    const cv=findVideo(current,video.archiveId)||{};
    const pv=findVideo(previous,video.archiveId)||{};
    const velocity=velocities[idx];
    const delta=(num(cv.views)!==null&&num(pv.views)!==null)?Number(cv.views)-Number(pv.views):null;
    const signals=signalScores(cv,velocity,velocityMedian);
    const ps=pulseScore(signals);
    const confidence=ps.availableWeight/100*Math.min(1,base.videos.length/(base.meta?.calibrationTargetVideos||10));
    summaries.push({video,cv,velocity,delta,signals,score:ps.score,confidence});
    const card=document.createElement('article');card.className='video-pulse-card';
    const signalLabels={retention:'Retention',ctr:'CTR',viewVelocity:'View velocity',subscriberConversion:'Sub conversion',engagement:'Engagement',externalTraffic:'External traffic'};
    card.innerHTML=`
      <header><span class="id">${esc(video.archiveId)}</span><h3>${esc(video.title)}</h3><a href="https://youtu.be/${esc(video.youtubeId)}" target="_blank" rel="noopener noreferrer">YouTube · ${esc(video.youtubeId)} ↗</a></header>
      <div class="pulse-core">
        <div><span class="metric-label">Views</span><strong class="metric-value">${fmt(cv.views)}</strong></div>
        <div><span class="metric-label">Δ since previous</span><strong class="metric-value">${delta===null?'—':(delta>=0?'+':'')+fmt(delta)}</strong></div>
        <div><span class="metric-label">Velocity</span><strong class="metric-value">${velocity===null?'—':fmt(velocity)} <small>views/h</small></strong></div>
        <div><span class="metric-label">CTR / Retention</span><strong class="metric-value">${pct(cv.ctr)} <small>/ ${pct(cv.retention)}</small></strong></div>
      </div>
      <div class="score-band">
        <div class="score-top"><div><span class="metric-label">Pulse score</span><strong class="score-number">${ps.score===null?'CAL':Math.round(ps.score)}</strong></div><span class="score-status">${base.videos.length<10?'PROVISIONAL · CALIBRATION':'ACTIVE'} · confidence ${Math.round(confidence*100)}%</span></div>
        <div class="confidence-track"><i style="width:${Math.round(confidence*100)}%"></i></div>
      </div>
      <div class="signal-grid">${Object.entries(signalLabels).map(([k,label])=>{const s=signals[k];return `<div class="signal-row"><span>${label}</span><b>${s===null?'—':Math.round(s)}</b><div class="signal-bar"><i style="width:${s===null?0:Math.round(s)}%"></i></div></div>`}).join('')}</div>`;
    host.appendChild(card);
  });
  renderRecommendations(summaries,current,previous,velocityMedian);
  renderHistory(base,snapshots);
}
function renderRecommendations(items,current,previous,velocityMedian){
  const host=document.querySelector('#recommendations');host.innerHTML='';
  const add=(title,text)=>{const d=document.createElement('div');d.className='recommendation';d.innerHTML=`<strong>${esc(title)}</strong><p>${esc(text)}</p>`;host.appendChild(d)};
  if(!previous){add('Потребен е втор snapshot','Сега имаме основна точка. Следната проверка ќе ја активира вистинската view velocity и раст по видео.')}
  const withVelocity=items.filter(x=>x.velocity!==null);
  if(withVelocity.length){
    const fastest=[...withVelocity].sort((a,b)=>b.velocity-a.velocity)[0];
    add('Најбрз раст',`${fastest.video.archiveId} моментално има најголема брзина: ${fmt(fastest.velocity)} views/h.`);
  }
  items.forEach(x=>{
    const v=x.cv,ctr=num(v.ctr),ret=num(v.retention),views=num(v.views)||0,subs=num(v.subscribersGained);
    if(ctr!==null&&ret!==null&&ctr<4&&ret>=40)add(`${x.video.archiveId}: thumbnail/title тест`,'Задржувањето е добро, но CTR е слаб. Прво менувај thumbnail или наслов, не содржината.');
    if(ctr!==null&&ret!==null&&ctr>=5&&ret<30)add(`${x.video.archiveId}: отворање на видеото`,'CTR е добар, но задржувањето е слабо. Следното видео нека има посилен прв кадар/први секунди.');
    if(views>0&&subs!==null&&subs/views*1000>=10)add(`${x.video.archiveId}: subscriber signal`,'Овој формат претвора гледачи во претплатници над поставениот ран праг. Вреди да се повтори тематскиот образец.');
  });
  if(!host.children.length)add('Нема доволно сигнали','Внеси CTR, Average percentage viewed, subscribers gained и уште еден snapshot за да почне Rule Engine да дава конкретни препораки.');
}
function renderHistory(base,snapshots){
  const host=document.querySelector('#history-table');
  const rows=[...snapshots].sort((a,b)=>new Date(b.capturedAt)-new Date(a.capturedAt)).map(s=>{
    const viewCells=base.videos.map(v=>`<td>${fmt(findVideo(s,v.archiveId)?.views)}</td>`).join('');
    return `<tr><td><strong>${snapshotLabel(s.capturedAt)}</strong><br><small>${esc(s.source||'')}</small></td><td>${fmt(s.subscribers)}</td>${viewCells}</tr>`;
  }).join('');
  host.innerHTML=`<table><thead><tr><th>Snapshot</th><th>Subs</th>${base.videos.map(v=>`<th>${esc(v.archiveId)} views</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`;
}
function exportData(base,snapshots){
  const blob=new Blob([JSON.stringify({meta:base.meta,channel:base.channel,videos:base.videos,snapshots},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='sp-pulse-export.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
boot().catch(err=>{document.body.insertAdjacentHTML('beforeend',`<pre style="color:#ff8b9b;padding:20px">PULSE ERROR: ${esc(err.message)}</pre>`)});
