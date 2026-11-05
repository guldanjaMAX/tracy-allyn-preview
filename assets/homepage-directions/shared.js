export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const actions = (ctas=[]) => `<div class="hp-actions">${ctas.map((c,i)=>`<a class="${i?'hp-link':'hp-button'}" href="${esc(c.href)}">${esc(c.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div>`;
export const background = bg => `<div class="hp-bg ${bg.src?'has-image':''}" aria-hidden="true">${bg.src?`<img src="${esc(bg.src)}" alt="" loading="lazy" style="object-position:${esc(bg.position||'center')}">`:''}</div>`;
export const heading = d => `<p class="hp-eyebrow">${esc(d.eyebrow)}</p><h2 class="hp-title">${esc(d.headline)}</h2><p class="hp-copy">${esc(d.subheadline)}</p>`;
