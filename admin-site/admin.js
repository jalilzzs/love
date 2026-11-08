const sb=supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_KEY),$=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let lang=localStorage.alang||'ar',S,P=[],M=[],pending=null,msg='';
const D={login:['🛡️ لوحة التحكم','🛡️ Control Panel'],ph:['الرمز السري','Secret passcode'],enter:['دخول','Enter'],bad:['مرفوض','Denied'],stats:['الإحصائيات','Stats'],since:['معًا منذ','Together since'],pts:['نقاط الحب','Love points'],nd:['تاريخ الموعد القادم','Next date'],nl:['عنوان الموعد','Next date label'],baby:['اسم/جنس البيبي','Baby'],
newp:['منشور جديد','New post'],title:['العنوان / السؤال','Title / question'],body:['النص · الكلمات · الاختبار: الصحيحة|خطأ1|خطأ2','Text · lyrics · quiz: correct|wrong1|wrong2'],url:['…أو رابط ملف','…or media URL'],pub:['نشر','Publish'],ok:['تم ✅','Done ✅'],moods:['مزاج الأميرة','Princess moods'],view:['👑 موقع الحب','👑 Love site'],exit:['خروج','Exit'],posts:['المنشورات','Posts']};
const t=k=>D[k][lang==='ar'?0:1];
const K={note:['💌 رسالة حب','Love note'],voice:['🎙️ صوتية','Voice'],song:['🎵 أغنية (+كلمات)','Song'],photo:['📷 صورة','Photo'],catch:['💬 عبارة','Phrase'],poem:['📜 شعر','Poem'],quiz:['💕 سؤال اختبار','Quiz Q'],reason:['💖 سبب أحبك','Reason'],letter:['✉️ افتحي عندما','Open when']};
function setLang(){lang=lang==='ar'?'en':'ar';localStorage.alang=lang;draw()}
function draw(){document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
if(!S)return $('app').innerHTML=`<div class="gate"><div class="card"><h1>${t('login')}</h1><input id="c" type="password" placeholder="${t('ph')}" onkeydown="event.key==='Enter'&&login()"><button class="gold" onclick="login()">${t('enter')}</button><p class="err" id="e"></p></div></div>`;
const f=(k,v,ty='text')=>`<input type="${ty}" value="${esc(v??'')}" onchange="up('${k}',this.value${ty==='number'?'*1':''})">`;
$('app').innerHTML=`<div class="wrap"><header><h1>${t('login')}</h1><div class="row"><a class="chip" href="${CFG.LOVE_URL}" target="_blank">${t('view')}</a><button class="chip" onclick="setLang()">${lang==='ar'?'EN':'عربي'}</button><button class="chip" onclick="sb.auth.signOut();S=null;draw()">${t('exit')}</button></div></header>
<div class="card"><h3>${t('stats')}</h3><label>${t('since')}${f('start_date',S.start_date,'date')}</label><label>${t('pts')}${f('love_points',S.love_points,'number')}</label><label>${t('nd')}${f('next_date',S.next_date,'date')}</label><label>${t('nl')}${f('next_label',S.next_label)}</label><label>${t('baby')}${f('baby_name',S.baby_name)}<select onchange="up('baby_gender',this.value)"><option value="girl" ${S.baby_gender==='girl'?'selected':''}>👧</option><option value="boy" ${S.baby_gender==='boy'?'selected':''}>👦</option></select></label></div>
<div class="card"><h3>${t('newp')}</h3><select id="k">${Object.entries(K).map(([k,v])=>`<option value="${k}">${v[lang==='ar'?0:1]}</option>`).join('')}</select><input id="t" placeholder="${t('title')}"><textarea id="b" rows="6" dir="auto" placeholder="${t('body')}"></textarea>
<input type="file" accept="audio/*,image/*" onchange="pending=this.files[0]"><input id="u" placeholder="${t('url')}"><button class="gold" onclick="pub()">${t('pub')}</button> <span>${msg}</span></div>
<div class="card"><h3>${t('moods')}</h3><p style="font-size:1.8rem">${M.map(m=>m.mood).join(' ')||'—'}</p></div>
<div class="card"><h3>${t('posts')}</h3>${P.map(p=>`<div class="item"><span><b>[${p.kind}]</b> ${esc(p.title||p.body||'').slice(0,60)}</span><button onclick="del(${p.id})">🗑</button></div>`).join('')}</div></div>`}
async function login(){const{error}=await sb.auth.signInWithPassword({email:CFG.ADMIN_EMAIL,password:$('c').value});if(error)return $('e').textContent=t('bad');start()}
async function load(){S=(await sb.from('settings').select('*').single()).data;P=(await sb.from('posts').select('*').order('id',{ascending:false})).data||[];M=(await sb.from('moods').select('*').order('id',{ascending:false}).limit(12)).data||[];draw()}
function start(){load();sb.channel('a').on('postgres_changes',{event:'*',schema:'public',table:'moods'},load).subscribe()}
const up=async(k,v)=>{await sb.from('settings').update({[k]:v||null}).eq('id',1)};
const del=async id=>{await sb.from('posts').delete().eq('id',id);load()};
async function pub(){msg='…';let url=$('u').value||null;if(pending){const p=Date.now()+'_'+pending.name.replace(/[^\w.]/g,'_'),{error}=await sb.storage.from('media').upload(p,pending);if(error)return alert(error.message);url=sb.storage.from('media').getPublicUrl(p).data.publicUrl}
const{error}=await sb.from('posts').insert({kind:$('k').value,title:$('t').value,body:$('b').value,url});if(error)return alert(error.message);pending=null;msg=t('ok');load()}
sb.auth.getSession().then(({data})=>data.session?start():draw());
