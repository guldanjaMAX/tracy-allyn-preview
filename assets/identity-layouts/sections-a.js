import {esc,image,eyebrow,action,lines} from './shared.js';

const text = (value, cls='') => `<div class="a-copy ${esc(cls)}">${String(value ?? '').split(/\n\s*\n/).filter(Boolean).map(p=>`<p>${esc(p)}</p>`).join('')}</div>`;
const trio = value => Array.isArray(value) ? value.slice(0,3) : [];
const label = d => `<div class="a-identity">${eyebrow(d.name)}<p>${esc(d.descriptor)}</p></div>`;
const title = value => `<h2 class="a-title">${esc(value)}</h2>`;
const start = (section,n,extra='') => `<section class="study-block a-${section}-${n} a-study ${extra}">`;
const end = '</section>';
const numberedLines = (values,cls) => `<div class="${cls}">${trio(values).map((v,i)=>`<div class="a-line"><span class="a-number" aria-hidden="true">0${i+1}</span><p>${esc(v)}</p></div>`).join('')}</div>`;

export const metadataA = {
  opening:[
    {name:'The cinematic welcome',reason:'The image sets the atmosphere while a single centered desire gives the opening a clear focus.',tradeoff:'Needs a carefully cropped image and sufficient contrast behind every line.',recommended:true},
    {name:'An editorial introduction',reason:'Copy and imagery have separate space, so the desire remains readable without an image overlay.',tradeoff:'The stacked phone layout makes the opening longer.',recommended:false},
    {name:'The quiet declaration',reason:'A large statement and generous space put the person’s words at the center.',tradeoff:'Less immersive; the typography must carry the opening.',recommended:false},
    {name:'An open letter',reason:'A warm paper surface and a narrow reading column create a personal, unhurried invitation.',tradeoff:'Quieter than the selected cinematic direction and less image-led.',recommended:false},
    {name:'The gallery margin',reason:'The image becomes a place to pause, with the introduction composed beneath it like an editorial caption.',tradeoff:'The main statement sits below the image, so it arrives later on a phone.',recommended:false}
  ],
  best:[
    {name:'A wider horizon',reason:'An expansive image and a calm text panel let the possibility feel spacious.',tradeoff:'Requires room for both the scene and the complete reflection.',recommended:false},
    {name:'The statement ladder',reason:'Three source lines receive distinct moments of emphasis before the reader opens the longer reflection.',tradeoff:'The full text requires one deliberate expansion.',recommended:false},
    {name:'Words beside a world',reason:'The full reflection remains immediately readable beside a quiet image and one anchoring line.',tradeoff:'The side-by-side arrangement becomes a longer sequence on a phone.',recommended:true},
    {name:'A page to keep',reason:'A restrained paper layout gives the complete writing the attention of a personal reading.',tradeoff:'Offers less visual movement and relies on the strength of the prose.',recommended:false},
    {name:'A constellation of strengths',reason:'Three lines surround one central idea, offering a different way to hold the reflection together.',tradeoff:'The spatial arrangement becomes a simple reading order on small screens.',recommended:false}
  ],
  pattern:[
    {name:'The honest letter',reason:'A direct, readable account gives difficult material room without adding spectacle.',tradeoff:'The quiet composition needs specific writing to stay distinctive.',recommended:false},
    {name:'Notes in the margin',reason:'The complete reflection stays visible, while a warm paper surface gives the page a pause between darker sections.',tradeoff:'Margin notes may repeat ideas already present in the longer text.',recommended:true},
    {name:'At the threshold',reason:'A photographic pause separates the familiar pattern from a close, clear reading of it.',tradeoff:'The image is atmospheric and should not imply a literal client story.',recommended:false},
    {name:'A gentler reveal',reason:'Short lines provide orientation, and the reader chooses when to open the full reflection.',tradeoff:'Readers who do not expand the section see only the shorter lines.',recommended:false},
    {name:'Three familiar moments',reason:'A broad editorial rhythm gives each source line a clear place before the complete reflection.',tradeoff:'The three-line treatment works best when the source lines are distinct.',recommended:false}
  ]
};

function opening(n,d){
  const intro=text(d.subline,'a-opening-subline');
  switch(n){
    case 0:return start('opening',1)+`<div class="a-cinema-media">${image(d.image)}</div><div class="a-cinema-top">${eyebrow('Your reflection')}<span>${esc(d.name)}</span></div><div class="a-cinema-center">${eyebrow(d.descriptor)}${title(d.headline)}${intro}${action('Explore my reflection')}</div><div class="a-cinema-bottom"><span>A moment to see yourself.</span><span aria-hidden="true">↓</span></div>`+end;
    case 1:return start('opening',2)+`<div class="a-editorial-copy">${label(d)}${title(d.headline)}${intro}${action('Explore my reflection')}<span class="a-editorial-rule" aria-hidden="true"></span></div><div class="a-editorial-image">${image(d.image)}<p class="a-image-caption">${esc(d.name)}</p></div>`+end;
    case 2:return start('opening',3)+`<div class="a-declaration-top">${eyebrow('Your reflection')}<span>${esc(d.name)}</span></div><div class="a-declaration-main">${eyebrow(d.descriptor)}${title(d.headline)}</div><div class="a-declaration-bottom">${intro}${action('Explore my reflection')}</div><span class="a-declaration-orbit" aria-hidden="true"></span>`+end;
    case 3:return start('opening',4)+`<div class="a-letter-margin">${eyebrow(d.name)}<span class="a-letter-mark" aria-hidden="true">○</span></div><div class="a-opening-letter">${eyebrow('A reflection for you')}${title(d.headline)}${intro}<div class="a-letter-close"><p>${esc(d.descriptor)}</p>${action('Begin here')}</div></div>`+end;
    case 4:return start('opening',5)+`<div class="a-gallery-top">${eyebrow('Your reflection')}<p>${esc(d.name)}</p></div><div class="a-gallery-image">${image(d.image)}<span class="a-gallery-edge" aria-hidden="true"></span></div><div class="a-gallery-caption"><div>${eyebrow(d.descriptor)}${title(d.headline)}</div><div class="a-gallery-note">${intro}${action('Explore my reflection')}</div></div>`+end;
  }
}

function best(n,d){
  const b=d.best;
  switch(n){
    case 0:return start('best',1)+`<div class="a-horizon-image">${image(d.image)}<div class="a-horizon-heading">${eyebrow('At your best')}${title(b.headline)}</div></div><div class="a-horizon-reading">${text(b.text)}<div class="a-horizon-lines">${lines(trio(b.lines))}</div></div>`+end;
    case 1:return start('best',2)+`<div class="a-ladder-header">${eyebrow('At your best')}${title(b.headline)}</div>${numberedLines(b.lines,'a-ladder')}<details class="a-expand"><summary>Read the full reflection <span aria-hidden="true">+</span></summary>${text(b.text)}</details>`+end;
    case 2:return start('best',3)+`<div class="a-world-reading">${eyebrow('At your best')}${title(b.headline)}${text(b.text)}<div class="a-world-signoff"><span aria-hidden="true"></span><p>${esc(trio(b.lines)[0]||'')}</p></div></div><div class="a-world-image">${image(d.image)}<div class="a-world-caption">${lines(trio(b.lines).slice(1))}</div></div>`+end;
    case 3:return start('best',4)+`<div class="a-keepsake-top">${eyebrow(d.name)}<p>At your best</p></div><div class="a-keepsake-page">${title(b.headline)}<div class="a-keepsake-rule" aria-hidden="true"></div>${text(b.text)}<p class="a-keepsake-pull">${esc(trio(b.lines)[0]||'')}</p></div><div class="a-keepsake-bottom"><span>A reflection to return to.</span><span aria-hidden="true">○</span></div>`+end;
    case 4:return start('best',5)+`<div class="a-constellation"><div class="a-constellation-core">${eyebrow('At your best')}${title(b.headline)}</div>${trio(b.lines).map((v,i)=>`<div class="a-constellation-note a-note-${i+1}"><span aria-hidden="true"></span><p>${esc(v)}</p></div>`).join('')}</div>${text(b.text,'a-constellation-reading')}`+end;
  }
}

function pattern(n,d){
  const p=d.pattern;
  switch(n){
    case 0:return start('pattern',1)+`<div class="a-honest-heading">${eyebrow('When it feels difficult')}${title(p.headline)}</div><div class="a-honest-body">${text(p.text)}<div class="a-honest-margin"><span class="a-honest-line" aria-hidden="true"></span><p>${esc(trio(p.lines)[0]||'')}</p></div></div><div class="a-honest-close">${lines(trio(p.lines).slice(1))}</div>`+end;
    case 1:return start('pattern',2)+`<header class="a-margin-heading">${eyebrow('A closer look')}${title(p.headline)}</header><div class="a-margin-page"><div class="a-margin-main">${text(p.text)}</div><aside class="a-margin-notes" aria-label="Lines from this reflection">${trio(p.lines).map((v,i)=>`<div><span class="a-number" aria-hidden="true">0${i+1}</span><p>${esc(v)}</p></div>`).join('')}</aside></div>`+end;
    case 2:return start('pattern',3)+`<div class="a-threshold-image">${image(d.image)}<div>${eyebrow('When it feels difficult')}${title(p.headline)}</div></div><div class="a-threshold-body">${text(p.text)}<div class="a-threshold-echo">${lines(trio(p.lines))}</div></div>`+end;
    case 3:return start('pattern',4)+`<div class="a-reveal-header">${eyebrow('A familiar pattern')}${title(p.headline)}</div><div class="a-reveal-lines">${trio(p.lines).map(v=>`<p><span aria-hidden="true"></span>${esc(v)}</p>`).join('')}</div><details class="a-reveal-letter"><summary><span>Open this part of the reflection</span><span class="a-reveal-plus" aria-hidden="true">+</span></summary>${text(p.text)}</details>`+end;
    case 4:return start('pattern',5)+`<div class="a-moments-top">${eyebrow('When it feels difficult')}<span class="a-moments-rule" aria-hidden="true"></span></div>${title(p.headline)}<div class="a-moments-columns">${trio(p.lines).map((v,i)=>`<article><span class="a-number" aria-hidden="true">0${i+1}</span><p>${esc(v)}</p></article>`).join('')}</div><div class="a-moments-reading">${text(p.text)}</div>`+end;
  }
}

export function renderA(section,variant,d){
  const n=Math.max(0,Math.min(4,Number(variant)||0));
  if(section==='opening')return opening(n,d);
  if(section==='best')return best(n,d);
  if(section==='pattern')return pattern(n,d);
  throw new Error(`Unknown section: ${section}`);
}
