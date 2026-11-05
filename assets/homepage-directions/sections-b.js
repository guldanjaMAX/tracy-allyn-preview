import {esc,actions,background} from './shared.js?v=simple2';

const copy=d=>`<h2 class="hp-title">${esc(d.headline)}</h2><p class="hp-copy">${esc(d.subheadline)}</p>`;
const action=d=>actions((d.ctas||[]).slice(0,1));
const photo=(src,alt,cls='')=>src?`<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`:'';
const section=(id,n,bg,html)=>`<section class="hp-section hp-${id} hp-${id}-${n} theme-${esc(bg.tone||'dark')}" data-bg="${esc(bg.id||'')}">${background(bg)}${html}</section>`;
const articles=d=>(d.articles||[]).slice(0,3);
const articleVisual=(a,index)=>a.image?photo(a.image,a.alt||'', 'hp-b-article-image'):`<div class="hp-b-type-cover hp-b-cover-${index}" aria-hidden="true"></div>`;
const articleLink=(a,cls,content)=>`<a class="${cls}" href="${esc(a.url)}" target="_blank" rel="noopener">${content}<span class="hp-b-read" aria-hidden="true">↗</span></a>`;

function speaking(n,d,bg){
 const image=d.speakingImage||d.portrait||bg.src;
 if(n===0)return section('speaking',n,bg,`<div class="hp-inner hp-b-stage"><div class="hp-b-stage-copy">${copy(d)}${action(d)}</div></div>`);
 if(n===1)return section('speaking',n,bg,`<div class="hp-inner hp-b-speaking-split"><figure class="hp-b-speaking-photo">${photo(image,'Tracy speaking with her hands out to a group.')}</figure><div class="hp-b-speaking-copy">${copy(d)}${action(d)}</div></div>`);
 return section('speaking',n,bg,`<div class="hp-inner hp-b-speaking-center"><div class="hp-b-center-copy">${copy(d)}${action(d)}</div><figure class="hp-b-speaking-wide">${photo(image,'Tracy speaking with her hands out to a group.')}</figure></div>`);
}

function writing(n,d,bg){
 const list=articles(d);
 if(n===0)return section('writing',n,bg,`<div class="hp-inner hp-b-writing-grid"><div class="hp-b-writing-head">${copy(d)}${action(d)}</div><div class="hp-b-article-grid">${list.map((a,i)=>articleLink(a,'hp-b-article-card',`<div class="hp-b-article-art">${articleVisual(a,i)}</div><div class="hp-b-article-copy"><h3>${esc(a.title)}</h3></div>`)).join('')}</div></div>`);
 if(n===1){const lead=list[0];return section('writing',n,bg,`<div class="hp-inner hp-b-writing-feature"><div class="hp-b-writing-head">${copy(d)}${action(d)}</div><div class="hp-b-feature-grid">${lead?articleLink(lead,'hp-b-feature-article',`<div class="hp-b-feature-art">${articleVisual(lead,0)}</div><div class="hp-b-feature-copy"><h3>${esc(lead.title)}</h3></div>`):''}<div class="hp-b-reading-side">${list.slice(1).map(a=>articleLink(a,'hp-b-side-article',`<h3>${esc(a.title)}</h3>`)).join('')}</div></div></div>`);}
 return section('writing',n,bg,`<div class="hp-inner hp-b-writing-list"><div class="hp-b-writing-head">${copy(d)}${action(d)}</div><div class="hp-b-article-list">${list.map((a,i)=>articleLink(a,'hp-b-article-row',`<div class="hp-b-row-copy"><h3>${esc(a.title)}</h3></div><div class="hp-b-row-art">${articleVisual(a,i)}</div>`)).join('')}</div></div>`);
}

function closing(n,d,bg){
 if(n===0)return section('closing',n,bg,`<div class="hp-inner hp-b-closing-quiet"><div class="hp-b-closing-center">${copy(d)}${action(d)}</div></div>`);
 if(n===1)return section('closing',n,bg,`<div class="hp-inner hp-b-closing-letter"><figure class="hp-b-letter-portrait">${photo(d.portrait||bg.src,'Tracy Allyn.')}</figure><div class="hp-b-letter-copy">${copy(d)}${action(d)}</div></div>`);
 return section('closing',n,bg,`<div class="hp-inner hp-b-closing-band"><div>${copy(d)}</div>${action(d)}</div>`);
}

export function renderB(id,variant,d,bg){
 const n=Number.isInteger(variant)&&variant>=0&&variant<3?variant:0;
 if(id==='speaking')return speaking(n,d,bg);
 if(id==='writing')return writing(n,d,bg);
 if(id==='closing')return closing(n,d,bg);
 throw new Error(`Unknown homepage section: ${id}`);
}
