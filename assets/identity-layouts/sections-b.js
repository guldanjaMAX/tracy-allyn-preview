import { esc, image, eyebrow, action } from './shared.js';

export const metadataB = {
  now: [
    { name: 'A page from your life', reason: 'An editorial image and a readable story make recognition feel personal, with room for Tracy’s natural voice.', tradeoff: 'Needs a meaningful image and enough writing to support the split.', recommended: true },
    { name: 'The honest sentence', reason: 'One recognizable thought leads, followed by a quiet passage with very little visual competition.', tradeoff: 'The opening sentence must carry the section; a vague line will feel oversized.', recommended: false },
    { name: 'Three familiar moments', reason: 'Three open columns make distinct situations easy to scan and compare.', tradeoff: 'Works only when the content contains three genuinely different moments.', recommended: false },
    { name: 'The annotated letter', reason: 'A continuous narrative preserves nuance while margin notes give a quicker route through it.', tradeoff: 'The notes must add emphasis without repeating every sentence.', recommended: false },
    { name: 'An invitation to read', reason: 'A short visible reflection invites deeper reading without making a long page feel dense.', tradeoff: 'Some readers will miss the expanded writing, so the essentials must stay visible.', recommended: false }
  ],
  practice: [
    { name: 'The open guide', reason: 'The prompt and all steps are visible together, making the first useful action easy to understand.', tradeoff: 'Requires concise steps; long instructions need their own practice page.', recommended: true },
    { name: 'One quiet prompt', reason: 'A single question creates a deliberate pause and removes the pressure to complete a task list.', tradeoff: 'Best for reflection; it cannot carry a complex practice.', recommended: false },
    { name: 'A guided sequence', reason: 'Readers can open one step at a time while keeping the overall sequence in view.', tradeoff: 'Extra taps slow comparison and can conceal useful instructions.', recommended: false },
    { name: 'Alongside your day', reason: 'Pairs the first step with an existing everyday pause, reflecting the call’s routine-based approach.', tradeoff: 'Tracy needs to confirm a suitable routine and actual practice instructions.', recommended: false },
    { name: 'The pocket practice', reason: 'A compact, self-contained reminder keeps the prompt close and puts extra detail within reach.', tradeoff: 'Less immersive than the open guide; essential instructions should not be hidden.', recommended: false }
  ],
  path: [
    { name: 'One open door', reason: 'One clear invitation gives the visitor a gentle way forward without presenting a menu of offers.', tradeoff: 'Needs a confirmed next resource before this can become a live offer.', recommended: true },
    { name: 'A gentle progression', reason: 'A vertical sequence shows how one small step can lead naturally into further exploration.', tradeoff: 'Can imply a required sequence unless the optional nature remains clear.', recommended: false },
    { name: 'The next chapter', reason: 'An editorial closing connects this reflection to the wider relationship with Tracy.', tradeoff: 'The invitation can become abstract unless the next action is specific.', recommended: false },
    { name: 'Now, next, when you’re ready', reason: 'Separates the immediate useful step from later possibilities so nothing feels urgent.', tradeoff: 'Three columns need enough distinct, confirmed content to earn their space.', recommended: false },
    { name: 'Choose your depth', reason: 'Expandable pathways let readers explore at their own pace without choosing an offer immediately.', tradeoff: 'More choices can weaken momentum; use only when the pathways are meaningfully different.', recommended: false }
  ]
};

const safeLines = (value = []) => value.map(esc);
const p = text => `<p>${esc(text)}</p>`;
const steps = d => (d.practice?.steps || []).map((text, i) => `<li><span class="b-step-number" aria-hidden="true">0${i + 1}</span><div>${p(text)}</div></li>`).join('');
// Source and illustrative-copy notices are supplied by the surrounding review board.
const note = () => '';
const pathItems = d => d.path?.steps || [];
const practiceCta = () => action('Return to your first step', '#practice');

function now(variant, d) {
  const x = d.now || {}, ls = safeLines(x.lines);
  if (variant === 0) return `<section class="study-block b-study b-now-1"><div class="b-now-photo">${image(d.image || 'space')}<span class="b-photo-label">A little room to recognize yourself.</span></div><div class="b-now-reading">${eyebrow('Where you are now')}<h2>${esc(x.headline)}</h2><div class="b-prose">${p(x.text)}</div><div class="b-underlined-thought">${ls[0] || ''}</div>${action('Begin with one small step', '#practice')}</div></section>`;
  if (variant === 1) return `<section class="study-block b-study b-now-2">${eyebrow('Where you are now')}<h2>${esc(x.headline)}</h2><p class="b-honest-line">${ls[0] || ''}</p><div class="b-honest-body"><span class="b-small-rule" aria-hidden="true"></span><div class="b-prose">${p(x.text)}</div></div><p class="b-closing-line">${ls[1] || ''}</p></section>`;
  if (variant === 2) return `<section class="study-block b-study b-now-3"><header>${eyebrow('Where you are now')}<h2>${esc(x.headline)}</h2><p class="b-section-intro">A few places you may recognize yourself.</p></header><div class="b-moment-columns">${ls.map((line,i)=>`<article><span class="b-moment-index">0${i+1}</span><p>${line}</p></article>`).join('')}</div><details class="b-full-reflection"><summary>Read the full reflection</summary><div class="b-prose">${p(x.text)}</div></details></section>`;
  if (variant === 3) return `<section class="study-block b-study b-now-4"><div class="b-letter-title">${eyebrow('Where you are now')}<h2>${esc(x.headline)}</h2></div><div class="b-annotated-letter"><div class="b-letter-copy b-prose">${p(x.text)}<p class="b-letter-ending">You can recognize a part of yourself here without making it your whole story.</p></div><aside class="b-margin-notes" aria-label="Points to sit with">${ls.map((line,i)=>`<p><span aria-hidden="true">${String(i+1).padStart(2,'0')}</span>${line}</p>`).join('')}</aside></div></section>`;
  return `<section class="study-block b-study b-now-5"><div class="b-invitation-copy">${eyebrow('Where you are now')}<h2>${esc(x.headline)}</h2><div class="b-visible-reflection">${ls.slice(0,2).map(line=>`<p>${line}</p>`).join('')}</div><details class="b-reading-details"><summary>Stay with the full reflection <span aria-hidden="true">+</span></summary><div class="b-prose">${p(x.text)}</div></details></div><div class="b-image-ribbon">${image(d.image || 'space')}</div></section>`;
}

function practice(variant, d) {
  const x = d.practice || {};
  if (variant === 0) return `<section class="study-block b-study b-practice-1"><div class="b-practice-intro">${eyebrow('One place to begin')}<h2>${esc(x.title)}</h2><p class="b-practice-question">${esc(x.prompt)}</p>${note(d)}</div><div class="b-open-instructions"><p class="b-instruction-label">Keep it simple.</p><ol class="b-step-list">${steps(d)}</ol>${action('See what comes next', '#path')}</div></section>`;
  if (variant === 1) return `<section class="study-block b-study b-practice-2"><div class="b-prompt-orbit" aria-hidden="true"></div><div class="b-quiet-prompt">${eyebrow('One place to begin')}<h2>${esc(x.title)}</h2><p class="b-quiet-question">${esc(x.prompt)}</p><div class="b-quiet-first">${p(x.steps?.[0] || '')}</div><details class="b-quiet-details"><summary>A little more guidance <span aria-hidden="true">+</span></summary><ol>${(x.steps || []).slice(1).map(s=>`<li>${esc(s)}</li>`).join('')}</ol></details>${note(d)}</div></section>`;
  if (variant === 2) return `<section class="study-block b-study b-practice-3"><header>${eyebrow('One place to begin')}<h2>${esc(x.title)}</h2><p class="b-section-intro">${esc(x.prompt)}</p></header><div class="b-guided-steps">${(x.steps || []).map((step,i)=>`<details ${i===0?'open':''}><summary><span class="b-step-number" aria-hidden="true">0${i+1}</span><span>Step ${i+1}</span><span class="b-expand" aria-hidden="true">+</span></summary><div>${p(step)}</div></details>`).join('')}</div><footer>${note(d)}${action('Continue at your pace', '#path')}</footer></section>`;
  if (variant === 3) return `<section class="study-block b-study b-practice-4"><header>${eyebrow('One place to begin')}<h2>${esc(x.title)}</h2></header><div class="b-routine-pair"><div class="b-existing-moment"><span class="b-routine-word">Already<br>in your day.</span><p>Choose a familiar pause that gives this reflection a little room.</p><span class="b-routine-line" aria-hidden="true"></span></div><div class="b-added-moment"><span class="b-routine-plus" aria-hidden="true">+</span><p class="b-routine-question">${esc(x.prompt)}</p></div></div><div class="b-routine-guide"><p class="b-instruction-label">A small beginning</p><ol>${(x.steps || []).map(s=>`<li>${esc(s)}</li>`).join('')}</ol></div>${note(d)}</section>`;
  return `<section class="study-block b-study b-practice-5"><div class="b-pocket-lead">${eyebrow('One place to begin')}<h2>${esc(x.title)}</h2><p>A small reflection you can return to.</p></div><article class="b-pocket"><span class="b-pocket-mark" aria-hidden="true">01</span><p class="b-pocket-question">${esc(x.prompt)}</p><p class="b-pocket-first">${esc(x.steps?.[0] || '')}</p><details><summary>Read the remaining steps <span aria-hidden="true">+</span></summary><ol>${(x.steps || []).slice(1).map(s=>`<li>${esc(s)}</li>`).join('')}</ol></details><div class="b-pocket-footer">${action('Take the next small step', '#path')}</div></article>${note(d)}</section>`;
}

function path(variant, d) {
  const x = d.path || {}, items = pathItems(d), first=items[0] || {};
  if (variant === 0) return `<section class="study-block b-study b-path-1"><div class="b-door-copy">${eyebrow('When you are ready')}<h2>${esc(x.invitation)}</h2><p class="b-door-support">There is no need to rush the next part.</p>${practiceCta()}</div><div class="b-door-next"><span class="b-path-small">A possible next step</span><h3>${esc(first.title)}</h3>${p(first.body)}${items.slice(1).map(item=>`<details><summary>${esc(item.title)} <span aria-hidden="true">+</span></summary>${p(item.body)}</details>`).join('')}</div></section>`;
  if (variant === 1) return `<section class="study-block b-study b-path-2"><header>${eyebrow('A path, at your pace')}<h2>${esc(x.invitation)}</h2></header><div class="b-path-timeline">${items.map((item,i)=>`<article><span class="b-timeline-point" aria-hidden="true">${i+1}</span><div><h3>${esc(item.title)}</h3>${p(item.body)}</div></article>`).join('')}</div><p class="b-path-permission">These are possibilities, not a checklist.</p>${practiceCta()}</section>`;
  if (variant === 2) return `<section class="study-block b-study b-path-3"><div class="b-chapter-image">${image(d.image || 'whole')}<span aria-hidden="true">There is room<br>for what comes next.</span></div><div class="b-chapter-writing">${eyebrow('The next chapter')}<h2>${esc(x.invitation)}</h2><div class="b-chapter-next">${items.map((item,i)=>`<article><span aria-hidden="true">0${i+1}</span><div><h3>${esc(item.title)}</h3>${p(item.body)}</div></article>`).join('')}</div>${practiceCta()}</div></section>`;
  if (variant === 3) return `<section class="study-block b-study b-path-4"><header>${eyebrow('A little direction')}<h2>${esc(x.invitation)}</h2></header><div class="b-time-columns">${items.map((item,i)=>`<article><span class="b-time-label">${['Now','Next','When you’re ready'][i] || 'Further along'}</span><h3>${esc(item.title)}</h3>${p(item.body)}</article>`).join('')}</div><footer><p>Keep what is useful. Leave room for your own pace.</p>${practiceCta()}</footer></section>`;
  return `<section class="study-block b-study b-path-5"><header>${eyebrow('Choose where to linger')}<h2>${esc(x.invitation)}</h2><p>Explore the possibility that feels most relevant to you.</p></header><div class="b-choose-path">${items.map((item,i)=>`<details ${i===0?'open':''}><summary><span class="b-path-number" aria-hidden="true">0${i+1}</span><span>${esc(item.title)}</span><span class="b-expand" aria-hidden="true">+</span></summary><div>${p(item.body)}</div></details>`).join('')}</div><div class="b-path-return">${practiceCta()}</div></section>`;
}

export function renderB(section, variant, data) {
  const i=Math.max(0, Math.min(4, Number(variant)||0));
  if(section==='now') return now(i,data);
  if(section==='practice') return practice(i,data);
  if(section==='path') return path(i,data);
  return '';
}
