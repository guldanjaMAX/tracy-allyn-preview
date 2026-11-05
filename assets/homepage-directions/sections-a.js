import {esc,actions,background,heading} from './shared.js';
const image=(src,alt,cl='',position='')=>`<img class="${cl}" ${position?`style="object-position:${esc(position)}"`:""} src="${esc(src)}" alt="${esc(alt)}" loading="lazy">`;
export function renderA(id,v,d,bg){
 let inner='';
 if(id==='hero'){
  if(v===0) inner=`${background(bg)}<div class="hp-film-mark">${image('assets/logos/tracy-allyn-selected-signature.png','Tracy Allyn')}</div><div class="hp-inner hp-welcome-center">${heading(d)}${actions(d.ctas)}<span class="hp-scroll">Begin with curiosity <span aria-hidden="true">↓</span></span></div>`;
  if(v===1) inner=`<div class="hp-portrait-cover">${image(bg.src||d.portrait,'Tracy Allyn','',bg.position)}</div><div class="hp-inner hp-welcome-side">${heading(d)}${actions(d.ctas)}</div>`;
  if(v===2) inner=`<div class="hp-cover-top">${image(bg.src||d.portrait,'Tracy Allyn','',bg.position)}</div><div class="hp-cover-band"><div>${heading(d)}</div>${actions(d.ctas)}</div>`;
 }
 if(id==='bridge'){
  if(v===0) inner=`${background(bg)}<div class="hp-inner hp-bridge-center">${heading(d)}${actions(d.ctas)}</div>`;
  if(v===1) inner=`${background(bg)}<div class="hp-inner"><p class="hp-eyebrow">${esc(d.eyebrow)}</p><h2 class="hp-title">${esc(d.headline)}</h2><div class="hp-life-columns">${[['With yourself.','Notice what you want more of.'],['With the people you love.','Make room for connection.'],['In the rooms you lead.','Bring more of yourself.']].map(([title,body],i)=>`<div><span class="hp-life-number">0${i+1}</span><h3>${title}</h3><p>${body}</p></div>`).join('')}</div><p class="hp-copy hp-bridge-invitation">Begin with what you want more of.</p>${actions(d.ctas)}</div>`;
  if(v===2) inner=`${background(bg)}<div class="hp-gesture">${image(d.portrait,'Tracy with her hand at her heart')}</div><div class="hp-inner"><div class="hp-reading-panel">${heading(d)}${actions(d.ctas)}</div></div>`;
 }
 if(id==='about'){
  if(v===0) inner=`<div class="hp-about-face">${image(bg.src||d.portrait,'Tracy Allyn','',bg.position)}</div><div class="hp-inner hp-about-intro">${heading(d)}${actions(d.ctas)}</div>`;
  if(v===1) inner=`${background(bg)}<div class="hp-inner hp-about-quote"><p class="hp-eyebrow">${esc(d.eyebrow)}</p><h2 class="hp-title">${esc(d.headline)}</h2><blockquote>“${esc(d.quote)}”</blockquote><div class="hp-quote-person">${image(d.smilePortrait,'Tracy Allyn')}<div><p class="hp-copy">${esc(d.subheadline)}</p>${actions(d.ctas)}</div></div></div>`;
  if(v===2) inner=`${background(bg)}<div class="hp-inner hp-about-diptych"><div class="hp-diptych-main">${image(d.portrait,'Tracy outdoors in Bali')}</div><div class="hp-diptych-copy">${heading(d)}${actions(d.ctas)}</div><div class="hp-diptych-small">${image(d.speakingImage,'Tracy speaking with a group')}</div></div>`;
 }
 return `<section class="hp-section hp-${id} hp-${id}-${v} theme-${bg.tone}" data-bg="${esc(bg.id)}">${inner}</section>`;
}
