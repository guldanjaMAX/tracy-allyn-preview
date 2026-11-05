export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const image = (key='welcome', cls='') => `<img class="${esc(cls)}" src="assets/magnet-header-ideas/${esc(key)}.png" alt="" loading="eager" decoding="async">`;
export const eyebrow = text => `<p class="eyebrow">${esc(text)}</p>`;
export const action = (text='Continue',target='#next') => `<a class="study-action" href="${esc(target)}">${esc(text)} <span aria-hidden="true">↗</span></a>`;
export const lines = arr => arr.map(x=>`<p>${esc(x)}</p>`).join('');
