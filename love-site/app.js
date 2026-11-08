const sb=window.sb=supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_KEY);const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let lang=localStorage.lang||'ar',S=null,P=[],route='home',gid='',err='',gm='code';
const D={title:['عالم الأميرة إبتسام','Princess Ibtissam’s World'],gateT:['صاحبة الجلالة الأميرة إبتسام','Her Majesty Princess Ibtissam'],code:['🔑 الرمز','🔑 Code'],face:['📸 الوجه','📸 Face'],ph:['الرمز الملكي','Royal passcode'],enter:['دخول','Enter'],wrong:['رمز خاطئ','Wrong code'],exit:['خروج','Exit'],
together:['معًا منذ','Together for'],days:['يوم','days'],points:['نقاط الحب','Love points'],empty:['لا شيء هنا بعد 💌','Nothing here yet 💌'],back:['← رجوع','← Back'],camMsg:['انظري إلى الكاميرا 👑','Look at the camera 👑'],
home:['الرئيسية','Home'],note:['رسائل حب','Love notes'],voice:['رسائل صوتية','Voice notes'],song:['أغاني وكاريوكي','Songs'],photo:['الصور','Gallery'],catch:['كلماتي','Catchphrases'],poem:['شعر','Poetry'],games:['ألعاب','Games'],baby:['البيبي','Baby'],
reason:['أسباب أحبك','Reasons I love you'],letter:['افتحي عندما…','Open when…'],countdown:['العد التنازلي','Countdown'],mood:['مزاجي اليوم','My mood'],another:['سبب آخر 💖','Another 💖'],moodAsk:['كيف تشعرين الآن؟','How do you feel?'],sent:['وصلت لحبيبك 💌','Sent to your love 💌'],noDate:['لم يُحدَّد موعد','No date set'],girl:['👧 بنت','👧 Girl'],boy:['👦 ولد','👦 Boy'],left:['يوم متبقٍ','days left']};
const t=k=>D[k][lang==='ar'?0:1];
const NAV=[['home','🏠'],['note','💌'],['voice','🎙️'],['song','🎵'],['photo','📷'],['catch','💬'],['poem','📜'],['games','🎮'],['baby','👶'],['reason','💖'],['letter','✉️'],['countdown','⏳'],['mood','🥰']],SPECIAL=['reason','letter','countdown','mood'];
const days=()=>Math.max(0,(Date.now()-new Date(S.start_date))/864e5);
const clk=()=>{const m=Date.now()-new Date(S.start_date);return`${Math.floor(m/36e5)%24}h ${Math.floor(m/6e4)%60}m ${Math.floor(m/1e3)%60}s`};
const cdDays=()=>S.next_date?Math.ceil((new Date(S.next_date)-Date.now())/864e5):null;
function stage(){const g=S.baby_gender==='girl',d=days(),st=[[0,['مولود','Newborn'],'👶'],[30,['رضيع','Baby'],'🍼'],[180,['طفل صغير','Toddler'],'🧒'],[365,['طفل','Kid'],g?'👧':'👦'],[730,['مراهق','Teen'],g?'👩‍🎤':'🧑‍🎤'],[1460,['كبير','Grown-up'],g?'👩':'👨']];const i=st.filter(x=>d>=x[0]).length-1,n=st[i+1];return{s:st[i],n,p:n?(d-st[i][0])/(n[0]-st[i][0])*100:100}}
async function load(){S=(await sb.from('settings').select('*').single()).data;P=(await sb.from('posts').select('*').order('id',{ascending:false})).data||[];
if(route==='games'&&gid){const e=$('pts');if(e)e.textContent=S.love_points}else render()}
const feed=k=>{const p=P.filter(x=>x.kind===k);return p.length?p.map(x=>`<div class="card">${x.title?`<h3>${esc(x.title)}</h3>`:''}${x.url?(/\.(mp3|m4a|wav|ogg|webm|aac)/i.test(x.url)?`<audio controls src="${esc(x.url)}"></audio>`:`<img src="${esc(x.url)}">`):''}${x.body?`<p class="pre">${esc(x.body)}</p>`:''}</div>`).join(''):`<p class="mut center">${t('empty')}</p>`};
const V={
home:()=>{const st=stage(),c=cdDays();return`<div class="bento"><div class="tile hero span2"><small>${t('together')}</small><h2>${Math.floor(days())} ${t('days')}</h2><p id="clk">${clk()}</p></div>
<a class="tile accent" href="#/games"><i>💎</i><b id="pts">${S.love_points}</b><small>${t('points')}</small></a><a class="tile accent" href="#/baby"><i>${st.s[2]}</i><b>${esc(S.baby_name)}</b><small>${st.s[1][lang==='ar'?0:1]}</small></a>
${NAV.slice(1).map(([k,i])=>`<a class="tile ${SPECIAL.includes(k)?'accent':''}" href="#/${k}"><i>${i}</i><b>${t(k)}</b>${k==='countdown'&&c!=null?`<small>${c} ${t('left')}</small>`:''}</a>`).join('')}</div>`},
baby:()=>{const s=stage(),g=S.baby_gender;return`<div class="card center"><div class="babe">${s.s[2]}</div><h2>${esc(S.baby_name)} · ${s.s[1][lang==='ar'?0:1]}</h2><div class="bar"><i style="width:${s.p}%"></i></div><p class="mut">${s.n?`→ ${s.n[1][lang==='ar'?0:1]} (${s.n[0]} ${t('days')})`:'💖'}</p>
<div class="row"><button class="chip ${g==='girl'?'on':''}" onclick="setBaby('girl')">${t('girl')}</button><button class="chip ${g==='boy'?'on':''}" onclick="setBaby('boy')">${t('boy')}</button></div><input id="bn" value="${esc(S.baby_name)}" onchange="setBaby('${g}',this.value)"></div>`},
games:()=>{if(gid){const g=GAMES.find(x=>x[0]===gid);return`<a class="chip" href="#/games">${t('back')}</a><div class="card"><h2>${g[1]} ${g[lang==='ar'?2:3]} <small class="mut">💎 <span id="pts">${S.love_points}</span></small></h2><div id="gm"></div></div>`}
return`<p class="center">💎 <b id="pts">${S.love_points}</b></p><div class="bento">${GAMES.map(g=>`<a class="tile" href="#/games/${g[0]}"><i>${g[1]}</i><b>${g[lang==='ar'?2:3]}</b></a>`).join('')}</div>`},
reason:()=>{const r=P.filter(x=>x.kind==='reason');return`<div class="card center"><div class="big-card" id="rs">${r.length?esc(R(r).body):t('empty')}</div><button class="gold" id="rb">${t('another')}</button></div>`},
letter:()=>{const l=P.filter(x=>x.kind==='letter');return l.length?l.map(x=>`<details class="card"><summary><h3 style="display:inline">✉️ ${esc(x.title)}</h3></summary><p class="pre">${esc(x.body)}</p></details>`).join(''):`<p class="mut center">${t('empty')}</p>`},
countdown:()=>{const c=cdDays();return`<div class="card center hero"><h2>${esc(S.next_label||'')}</h2>${c==null?`<p>${t('noDate')}</p>`:`<h2 style="font-size:4rem">${Math.max(0,c)}</h2><p>${t('left')}</p>`}</div>`},
mood:()=>`<div class="card center"><h3>${t('moodAsk')}</h3><div class="row">${['😍','🥰','😊','🤗','😘','😴','😢','😡'].map(m=>`<button class="cell" onclick="sendMood('${m}',this)">${m}</button>`).join('')}</div><p id="ms" class="mut"></p></div>`};
const setBaby=(g,n)=>sb.rpc('set_baby',{g,nm:n||$('bn').value});
const sendMood=async(m,b)=>{await sb.from('moods').insert({mood:m});$('ms').textContent=t('sent')};
const B={reason(){const r=P.filter(x=>x.kind==='reason');$('rb').onclick=()=>{if(r.length)$('rs').textContent=R(r).body}},games(){if(gid)GAMES.find(x=>x[0]===gid)[4]($('gm'))}};
function shell(body){return`<div class="wrap"><header><h1>👑 ${t('title')}</h1><div class="row"><button class="chip" onclick="setLang()">${lang==='ar'?'EN':'عربي'}</button><button class="chip" onclick="sessionStorage.clear();render()">${t('exit')}</button></div></header>
<nav class="chips">${NAV.map(([k,i])=>`<a class="chip ${route===k?'on':''}" href="#/${k}">${i} ${t(k)}</a>`).join('')}</nav>${body}</div>`}
function render(){TM.forEach(clearInterval);TM=[];document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.title=t('title');
if(!sessionStorage.ok)return gate();if(!S)return;const[r,g]=location.hash.slice(2).split('/');route=r||'home';gid=g||'';
$('app').innerHTML=shell(V[route]?V[route]():feed(route));B[route]&&B[route]();if(route==='home')iv(()=>{const c=$('clk');c&&(c.textContent=clk())},1000)}
function setLang(){lang=lang==='ar'?'en':'ar';localStorage.lang=lang;render()}
function ok(){sessionStorage.ok=1;load();sb.channel('live').on('postgres_changes',{event:'*',schema:'public'},load).subscribe()}
function gate(){$('app').innerHTML=`<div class="gate"><div class="card"><div class="row" style="justify-content:flex-end"><button class="chip" onclick="setLang()">${lang==='ar'?'EN':'عربي'}</button></div><h1 style="font-size:1.8rem">👑 ${t('gateT')}</h1>
<div class="row"><button class="chip ${gm==='code'?'on':''}" onclick="gm='code';err='';gate()">${t('code')}</button><button class="chip ${gm==='face'?'on':''}" onclick="gm='face';gate()">${t('face')}</button></div>
${gm==='face'?`<video id="cam" class="cam" autoplay muted playsinline></video><p class="mut" id="fm">…</p>`:`<input id="c" type="password" inputmode="numeric" placeholder="${t('ph')}" onkeydown="event.key==='Enter'&&tryCode()"><button class="gold" onclick="tryCode()">${t('enter')}</button>`}<p class="err">${err}</p></div></div>`;if(gm==='face')face()}
function tryCode(){if($('c').value==='080530')ok();else{err=t('wrong');gate()}}
let faceStop;async function face(){faceStop&&faceStop();let tm,st,dead=0;faceStop=()=>{dead=1;clearInterval(tm);st&&st.getTracks().forEach(x=>x.stop())};const m=$('fm');
try{const U='https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.14/model/';await Promise.all([faceapi.nets.ssdMobilenetv1,faceapi.nets.faceLandmark68Net,faceapi.nets.faceRecognitionNet].map(n=>n.loadFromUri(U)));
const rd=await faceapi.detectSingleFace(await faceapi.fetchImage('ibtissam_ref.jpg')).withFaceLandmarks().withFaceDescriptor();if(!rd)return m.textContent='ibtissam_ref.jpg: no face';
const fm=new faceapi.FaceMatcher(rd,.5);st=await navigator.mediaDevices.getUserMedia({video:true});if(dead)return faceStop();$('cam').srcObject=st;m.textContent=t('camMsg');
tm=setInterval(async()=>{const d=await faceapi.detectSingleFace($('cam')).withFaceLandmarks().withFaceDescriptor();if(d&&fm.findBestMatch(d.descriptor).label!=='unknown'){faceStop();ok()}},800)}catch(e){m&&(m.textContent='Camera / model error')}}
window.addEventListener('hashchange',()=>S&&render());gate();
