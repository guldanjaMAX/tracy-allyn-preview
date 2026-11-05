import {esc,actions,background} from './shared.js';

const copy=d=>`<p class="hp-eyebrow">${esc(d.eyebrow||'')}</p><h2 class="hp-title">${esc(d.headline)}</h2><p class="hp-copy">${esc(d.subheadline)}</p>`;
const photo=(src,alt,cls='')=>src?`<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`:'';
const section=(id,n,d,bg,html)=>`<section class="hp-section hp-${id} hp-${id}-${n} theme-${esc(bg.tone||'dark')}" data-bg="${esc(bg.id||'')}">${background(bg)}${html}</section>`;
const articles=d=>(d.articles||[]).slice(0,3);
const articleVisual=(a,index)=>a.image?photo(a.image,a.alt||'', 'hp-b-article-image'):`<div class="hp-b-type-cover hp-b-cover-${index}" aria-hidden="true"><span>Unabashedly<br>Embodied</span><i>${String(index+1).padStart(2,'0')}</i></div>`;
const articleLink=(a,cls,content)=>`<a class="${cls}" href="${esc(a.url)}" target="_blank" rel="noopener">${content}<span class="hp-b-read">Read on Substack <span aria-hidden="true">↗</span></span></a>`;

function speaking(n,d,bg){
 const image=d.speakingImage||d.portrait||bg.src;
 if(n===0)return section('speaking',n,d,bg,`<div class="hp-inner hp-b-stage"><div class="hp-b-stage-copy">${copy(d)}${actions(d.ctas)}</div><p class="hp-b-stage-caption">Presence. Connection. Leadership.</p></div>`);
 if(n===1)return section('speaking',n,d,bg,`<div class="hp-inner hp-b-speaking-split"><figure class="hp-b-speaking-photo">${photo(image,'Tracy sharing a conversation with a group.')}<figcaption>A conversation to be part of.</figcaption></figure><div class="hp-b-speaking-copy">${copy(d)}${actions(d.ctas)}</div></div>`);
 return section('speaking',n,d,bg,`<div class="hp-inner hp-b-speaking-center"><div class="hp-b-center-copy">${copy(d)}${actions(d.ctas)}</div><figure class="hp-b-speaking-wide">${photo(image,'Tracy sharing a conversation with a group.')}<figcaption>For leadership teams, peer groups and retreats.</figcaption></figure></div>`);
}

function writing(n,d,bg){
 const list=articles(d);
 if(n===0)return section('writing',n,d,bg,`<div class="hp-inner hp-b-writing-grid"><div class="hp-b-writing-head">${copy(d)}${actions(d.ctas)}</div><div class="hp-b-article-grid">${list.map((a,i)=>articleLink(a,'hp-b-article-card',`<div class="hp-b-article-art">${articleVisual(a,i)}</div><div class="hp-b-article-copy"><p class="hp-b-publication">Unabashedly Embodied</p><h3>${esc(a.title)}</h3><p>${esc(a.description||'')}</p></div>`)).join('')}</div></div>`);
 if(n===1){const lead=list[0];return section('writing',n,d,bg,`<div class="hp-inner hp-b-writing-feature"><div class="hp-b-writing-head">${copy(d)}</div><div class="hp-b-feature-grid">${lead?articleLink(lead,'hp-b-feature-article',`<div class="hp-b-feature-art">${articleVisual(lead,0)}</div><div class="hp-b-feature-copy"><p class="hp-b-publication">From Tracy’s writing</p><h3>${esc(lead.title)}</h3><p>${esc(lead.description||'')}</p></div>`):''}<div class="hp-b-reading-side"><p class="hp-eyebrow">Spend a little time here</p>${list.slice(1).map(a=>articleLink(a,'hp-b-side-article',`<h3>${esc(a.title)}</h3><p>${esc(a.description||'')}</p>`)).join('')}${actions(d.ctas)}</div></div></div>`);}
 return section('writing',n,d,bg,`<div class="hp-inner hp-b-writing-list"><div class="hp-b-writing-head">${copy(d)}${actions(d.ctas)}</div><div class="hp-b-article-list">${list.map((a,i)=>articleLink(a,'hp-b-article-row',`<span class="hp-b-row-number" aria-hidden="true">0${i+1}</span><div class="hp-b-row-copy"><p class="hp-b-publication">Writing from Tracy</p><h3>${esc(a.title)}</h3><p>${esc(a.description||'')}</p></div><div class="hp-b-row-art">${articleVisual(a,i)}</div>`)).join('')}</div></div>`);
}

function closing(n,d,bg){
 if(n===0)return section('closing',n,d,bg,`<div class="hp-inner hp-b-closing-quiet"><div class="hp-b-closing-center">${copy(d)}${actions(d.ctas)}<p class="hp-b-closing-small">At your own pace.</p></div></div>`);
 if(n===1)return section('closing',n,d,bg,`<div class="hp-inner hp-b-closing-letter"><figure class="hp-b-letter-portrait">${photo(d.portrait||bg.src,'Tracy Allyn.')}<figcaption>Tracy Allyn</figcaption></figure><div class="hp-b-letter-copy">${copy(d)}${actions(d.ctas)}<p class="hp-b-letter-signoff">A little more room to be yourself.</p></div></div>`);
 const links=d.ctas||[];
 return section('closing',n,d,bg,`<div class="hp-inner hp-b-closing-doors"><div class="hp-b-center-copy">${copy(d)}</div><div class="hp-b-doors">${links.slice(0,2).map((a,i)=>`<a class="hp-b-door hp-b-door-${i}" href="${esc(a.href)}"><span class="hp-eyebrow">${i===0?'Something to read':'Something to notice'}</span><h3>${esc(a.label)}</h3><p>${i===0?'Follow a thought. Stay with a question.':'Begin with a reflection that feels familiar.'}</p><span class="hp-b-door-arrow" aria-hidden="true">↗</span></a>`).join('')}</div><p class="hp-b-closing-small">Choose what feels useful today.</p></div>`);
}

export function renderB(id,variant,d,bg){
 const n=Number.isInteger(variant)&&variant>=0&&variant<3?variant:0;
 if(id==='speaking')return speaking(n,d,bg);
 if(id==='writing')return writing(n,d,bg);
 if(id==='closing')return closing(n,d,bg);
 throw new Error(`Unknown homepage section: ${id}`);
}
