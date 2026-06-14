/* ============================================================
   GARVIVERSE — script.js
   All interactivity for 9 pages + secret systems
   ============================================================ */

'use strict';

/* ============================================================
   ✏️  SONGS CONFIGURATION
   HOW TO ADD SONGS:
   1. Create a folder called  music/  next to index.html
   2. Put your .mp3 files inside it: music/song1.mp3 etc.
   3. Update the title and src fields below.
   The 'bg' value tints the music-room background when playing.
   ============================================================ */
const SONGS = [
  { title: "♫ Song 1 — A song that I'd sing for you",   src: "music/song1.mp3", bg: "#c8b8e8" },
  { title: "♫ Song 2 — we're birds of a feather hehe",             src: "music/song2.mp3", bg: "#87ceeb" },
  { title: "♫ Song 3 — This one's for you",             src: "music/song3.mp3", bg: "#f8c8d8" },
  { title: "♫ Song 4 — you're just like this song",           src: "music/song4.mp3", bg: "#ffd878" },
  { title: "♫ Song 5 — ye sunke hsdo pewissss 🥺",               src: "music/song5.mp3", bg: "#c8e8c0" },
];

/* ============================================================
   ✏️  PHOTOS CONFIGURATION
   HOW TO ADD PHOTOS:
   1. Create a folder called  images/  next to index.html
   2. Add your photos: images/photo1.jpg etc.
   3. Update src and caption below.
   Leave src as "" to display a placeholder frame.
   ============================================================ */
const PHOTOS = [
  { src: "images/img1.jpg", caption: "ai wala bachoan cause aapne nhi diya 😔" },
  { src: "images/img2.jpg", caption: "A DIVAAAA 💅🏻"       },
  { src: "images/img3.jpg", caption: "never lose this smile"                  },
  { src: "images/img4.jpg", caption: "you look good when you smile"             },
  { src: "images/img5.jpg", caption: "this is the garvi i wanna look at"     },
  { src: "images/img6.jpg", caption: "this is how you look when you stay happy"           },
];

/* ============================================================
   GARDEN NOTES — 30 notes, one per flower
   ✏️ Edit any of these to customise the messages
   ============================================================ */
const GARDEN_NOTES = [
  "You make people feel heard.",
  "You're stronger than you think.",
  "You are my superstar, shine bright hehe.",
  "The way you care is one of your best qualities.",
  "You deserve everything in this world.",
  "Your laugh is genuinely contagious.",
  "You are the best thing that has happened to me.",
  "You're allowed to take up space in my life.",
  "Overthinking doesn't cancel your intentions out.",
  "I'm lucky that i got to meet you.",
  "Your stubbornness is genuinely so cute hehe.",
  "You don't give yourself enough credit.",
  "The little things you do matter more than you know.",
  "You're exactly what you should be.",
  "You are genuinely enchanting.",
  "Even on bad days, you're still you. That's enough.",
  "You're allowed to be proud of yourself.",
  "The things that bother you about yourself are things others admire.",
  "Your smile is magical and adorable.",
  "you are the definition of perfect.",
  "I'll never let you feel sad or unheard.",
  "You're not too much. You're just right for the right people.",
  "Your presence changes the energy of a room.",
  "It's okay to not have everything figured out.",
  "You've made it through 100% of your hard days so far.",
  "Someone thinks about you more than you realise.",
  "as ling as I'm alive, you'll never be unloved or ignored .",
  "The fact that you care this much means something.",
  "You're a great person, be proud of it.",
  "You're one of a kind. Actually. Not just as a phrase.",
];

const FLOWER_EMOJIS = [
  '🌸','🌷','🌹','🌺','💐','🌼','🌻','🌿','🍀','☘️',
  '🌱','🌾','🪷','🏵️','💮','🌸','🌷','🌹','🌼','🌻',
  '🌺','💐','🪻','🌿','🍀','🌸','🌷','💐','🌹','🌼',
];

/* ============================================================
   CONSTELLATION STARS
   Positions (% of container) that draw the letter G
   ============================================================ */
const C_STARS = [
  { id:0,  x:50, y:6  },  // top center
  { id:1,  x:72, y:13 },  // top right
  { id:2,  x:85, y:29 },  // upper right arc
  { id:3,  x:18, y:29 },  // left upper
  { id:4,  x:12, y:50 },  // left middle
  { id:5,  x:18, y:71 },  // left lower
  { id:6,  x:50, y:88 },  // bottom center
  { id:7,  x:75, y:80 },  // bottom right
  { id:8,  x:87, y:64 },  // lower right arc
  { id:9,  x:87, y:50 },  // middle right
  { id:10, x:65, y:50 },  // crossbar end (characteristic G bar)
];
/* Connection order traces the letter G */
const C_CONNECTIONS = [[2,1],[1,0],[0,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10]];

/* ============================================================
   STATE
   ============================================================ */
const S = {
  page:             'page-portal',
  portalClicks:     0,
  entered:          false,
  portalTimer:      null,

  mood:             null,

  bloomedCount:     0,

  songIndex:        0,
  playing:          false,
  audio:            null,

  litStars:         new Set(),
  consComplete:     false,

  letterOpen:       false,
  giftOpen:         false,

  secretLastWord:   '',
  secretLastTime:   0,

  konamiIdx:        0,
  konamiOpen:       false,
  konamiStarUsed:   false,
};

/* ============================================================
   KONAMI CODE SEQUENCE
   ============================================================ */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildStarsBg();
  buildFireflies(document.getElementById('fireflies-container'), 15);
  initGarden();
  initMusic();
  initGallery();
  initConstellation();
  initConfetti();
  initSecretInput();
  initKonami();
  initMiscEvents();
  console.log('✨ Welcome to Garviverse ✨');
});

/* ============================================================
   BACKGROUND PARTICLES
   ============================================================ */
function buildStarsBg() {
  const c = document.getElementById('stars-bg');
  for (let i = 0; i < 90; i++) {
    const s = document.createElement('div');
    s.className = 'star-p';
    s.style.left   = rnd(100) + '%';
    s.style.top    = rnd(100) + '%';
    const sz = rnd(2.2) + 0.4;
    s.style.width  = sz + 'px';
    s.style.height = sz + 'px';
    s.style.setProperty('--sd', (2 + rnd(4)) + 's');
    s.style.setProperty('--sl', rnd(6) + 's');
    c.appendChild(s);
  }
}

function buildFireflies(container, count) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const f = document.createElement('div');
    f.className = 'firefly';
    f.style.left = (8 + rnd(84)) + '%';
    f.style.top  = (8 + rnd(84)) + '%';
    f.style.setProperty('--dx',  ((Math.random()-0.5)*100) + 'px');
    f.style.setProperty('--dy',  ((Math.random()-0.5)*80)  + 'px');
    f.style.setProperty('--dx2', ((Math.random()-0.5)*80)  + 'px');
    f.style.setProperty('--dy2', (-45 - rnd(55))           + 'px');
    f.style.setProperty('--fd',  (5  + rnd(8))  + 's');
    f.style.setProperty('--fl',  rnd(9) + 's');
    container.appendChild(f);
  }
}

/* ============================================================
   PAGE NAVIGATION
   ============================================================ */
function navigateTo(pageId) {
  if (S.page === pageId) return;

  const from = document.getElementById(S.page);
  const to   = document.getElementById(pageId);
  if (!to) return;

  /* Animate out */
  if (from) {
    from.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
    from.style.opacity    = '0';
    from.style.transform  = 'translateX(-20px)';
    setTimeout(() => {
      from.classList.remove('active');
      from.style.cssText = '';
    }, 290);
  }

  /* Animate in */
  setTimeout(() => {
    to.classList.add('active');
    to.scrollTop = 0;
    to.style.opacity   = '0';
    to.style.transform = 'translateX(20px)';
    to.style.transition = 'none';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      to.style.transition = 'opacity 0.38s ease, transform 0.38s ease';
      to.style.opacity    = '1';
      to.style.transform  = 'translateX(0)';
      setTimeout(() => { to.style.cssText = ''; }, 400);
    }));
  }, 220);

  S.page = pageId;
  updateNav(pageId);
  onPageEnter(pageId);
}

function updateNav(pageId) {
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('current', b.dataset.page === pageId);
  });
}

function onPageEnter(pageId) {
  if (pageId === 'page-constellation') resizeConsCanvas();
  if (pageId === 'page-memory') restartTimelineAnim();
}

function restartTimelineAnim() {
  document.querySelectorAll('.timeline-item').forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = '';
  });
}

/* ============================================================
   PAGE 1 — PORTAL
   ============================================================ */
function bindPortal() {
  const btn = document.getElementById('portal-star');
  if (!btn) return;
  btn.addEventListener('click',   handleStarClick);
  btn.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') handleStarClick(); });
}
bindPortal();

function handleStarClick() {
  S.portalClicks++;

  if (S.entered) return;

  /* Visual pulse on every click */
  pulsePortalStar();

  /* Easter egg: exactly 5 clicks before entering → popup */
  if (S.portalClicks === 5) {
    clearTimeout(S.portalTimer);
    S.portalTimer = null;
    const msgs = [
      "I knew you'd click it again.",
      "Curiosity detected. Very Garvi behaviour.",
      "Still clicking? That's very on brand.",
    ];
    showSecretPopup(msgs[Math.floor(Math.random() * msgs.length)]);
    return; // don't enter yet
  }

  /* First click → schedule entry after short build-up delay */
  if (S.portalClicks === 1) {
    S.portalTimer = setTimeout(enterSite, 1100);
  }
}

function pulsePortalStar() {
  const core = document.querySelector('.star-core');
  if (!core) return;
  core.style.transition = 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)';
  core.style.transform  = 'scale(1.4)';
  setTimeout(() => { core.style.transform = ''; }, 220);
}

function showSecretPopup(msg) {
  document.getElementById('secret-popup-text').textContent = msg;
  const pop = document.getElementById('secret-popup');
  pop.classList.add('open');
  pop.setAttribute('aria-hidden', 'false');
}

function closeSecretPopup() {
  const pop = document.getElementById('secret-popup');
  pop.classList.remove('open');
  pop.setAttribute('aria-hidden', 'true');
  if (!S.entered) setTimeout(enterSite, 350);
}

function enterSite() {
  if (S.entered) return;
  S.entered = true;

  /* Star explode effect */
  const core = document.querySelector('.star-core');
  if (core) {
    core.style.transition  = 'transform 0.7s ease, opacity 0.5s ease';
    core.style.transform   = 'scale(6)';
    core.style.opacity     = '0';
  }

  /* Light burst overlay */
  const burst = document.createElement('div');
  burst.style.cssText = `
    position:fixed;inset:0;z-index:9100;pointer-events:none;
    background:radial-gradient(circle at 50% 50%, rgba(255,216,120,0.9), transparent 65%);
    animation:lightBurst 0.85s ease forwards;
  `;
  document.body.appendChild(burst);
  if (!document.getElementById('lb-style')) {
    const st = document.createElement('style');
    st.id = 'lb-style';
    st.textContent = '@keyframes lightBurst{0%{opacity:0;transform:scale(0.1)}40%{opacity:0.85}100%{opacity:0;transform:scale(3)}}';
    document.head.appendChild(st);
  }
  setTimeout(() => burst.remove(), 900);

  /* Show nav and transition */
  setTimeout(() => {
    document.getElementById('main-nav').classList.add('visible');
    navigateTo('page-mood');
  }, 700);
}

/* ============================================================
   PAGE 2 — MOOD FIXER
   ============================================================ */
function setMood(mood) {
  S.mood = mood;
  const area = document.getElementById('mood-response');
  if (!area) return;
  area.innerHTML = '';

  const cfg = {
    sad: {
      build: () => {
        const d = div('mood-result glass-card');
        d.innerHTML = `
          <div class="alert-strip">🚨 EMERGENCY ALERT 🚨</div>
          <div class="alert-strip" style="animation-delay:.12s;color:#a0d0a0;border-color:rgba(80,200,80,.4);background:rgba(80,200,80,.12)">Garvi Happiness Protocol Activated ✓</div>
          <span class="mood-big-emoji" style="margin-top:.9rem">🌈</span>
          <h3 class="mood-title">Hey. It's okay.</h3>
          <p class="mood-text">Whatever it is — it won't stay forever.<br>
          You've survived every single hard day so far.<br>
          <strong style="color:var(--lavender)">That's a 100% success rate.</strong> Not bad at all.</p>
          <p style="font-size:1.6rem;margin-top:.8rem;animation:floatBob .8s ease infinite alternate">🫂💜🌸</p>`;
        return d;
      }
    },
    angry: {
      build: () => {
        const d = div('mood-result glass-card');
        d.innerHTML = `
          <span class="mood-big-emoji">🦆</span>
          <h3 class="mood-title">I'm sorry.</h3>
          <p class="mood-text">I know. I know.<br>You're right to be annoyed.<br><br>
          Now please don't be mad at me specifically 🥺<br><br>
          Here's a duck. He understands completely.</p>
          <p style="font-size:2rem;margin-top:.8rem;animation:floatBob .9s ease infinite alternate">🦆💢 → 🦆💛</p>`;
        return d;
      }
    },
    tired: {
      build: () => {
        const d = div('mood-result glass-card');
        d.innerHTML = `
          <span class="mood-big-emoji">🐰</span>
          <h3 class="mood-title">Can I give you a huggy?</h3>
          <p class="mood-text">Being tired is allowed.<br>
          You don't have to be okay all the time.<br><br>
          The bunny is very soft and has zero opinions<br>about your productivity today.</p>
          <p style="font-size:2.2rem;margin-top:.8rem;animation:floatBob 1.1s ease infinite alternate">🐰🤗</p>`;
        return d;
      }
    },
    overthinking: {
      build: () => {
        const d = div('mood-result glass-card');
        d.innerHTML = `
          <span class="mood-big-emoji">✨</span>
          <h3 class="mood-title">Hey. Come on.</h3>
          <p class="mood-text">
            You're special.<br>
            You're <strong style="color:var(--gold)">Garvi</strong>.<br>
            Remember?<br><br>
            <strong style="color:var(--lavender)">You've got this.</strong><br><br>
            The spiral is lying to you. You always figure it out.
          </p>
          <div class="star-row" id="overthink-stars"></div>`;
        setTimeout(() => {
          const sr = document.getElementById('overthink-stars');
          if (sr) ['⭐','✨','💫','🌟','⭐','✨'].forEach((s,i) => {
            const sp = document.createElement('span');
            sp.className = 'star-orbit';
            sp.textContent = s;
            sp.style.animationDelay = (i * 0.35) + 's';
            sr.appendChild(sp);
          });
        }, 60);
        return d;
      }
    }
  };

  const fn = cfg[mood];
  if (!fn) return;
  const card = fn.build();
  area.appendChild(card);
  setTimeout(() => area.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 200);
}

/* ============================================================
   PAGE 3 — MEMORY TIMELINE
   ============================================================ */
function toggleMemory(card) {
  const body = card.querySelector('.memory-body');
  if (!body) return;
  const open = body.classList.contains('open');

  /* Close all others */
  document.querySelectorAll('.memory-body.open').forEach(b => {
    if (b !== body) {
      b.classList.remove('open');
      b.closest('.memory-card')?.setAttribute('aria-expanded', 'false');
    }
  });

  body.classList.toggle('open', !open);
  card.setAttribute('aria-expanded', String(!open));

  if (!open) {
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
  }
}
/* Keyboard support for memory cards */
document.querySelectorAll('.memory-card').forEach(c => {
  c.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); toggleMemory(c); } });
});

/* ============================================================
   PAGE 4 — SECRET GARDEN
   ============================================================ */
function initGarden() {
  const grid = document.getElementById('garden-grid');
  if (!grid) return;
  GARDEN_NOTES.forEach((note, i) => {
    const btn = document.createElement('button');
    btn.className = 'flower-btn';
    btn.setAttribute('aria-label', `Flower ${i+1}`);
    btn.setAttribute('role', 'listitem');
    btn.textContent = FLOWER_EMOJIS[i];
    btn.style.setProperty('--fw',  (2.2 + rnd(2))  + 's');
    btn.style.setProperty('--fd2', rnd(2)           + 's');

    const open = () => openFlower(i, btn, note);
    btn.addEventListener('click', open);
    btn.addEventListener('touchend', e => { e.preventDefault(); open(); });
    grid.appendChild(btn);
  });
}

function openFlower(i, btn, note) {
  if (!btn.classList.contains('bloomed')) {
    btn.classList.add('bloomed');
    S.bloomedCount++;
    const prog = document.getElementById('garden-progress');
    if (prog) prog.textContent = `${S.bloomedCount} / 30 bloomed`;
  }
  document.getElementById('note-flower-display').textContent = FLOWER_EMOJIS[i];
  document.getElementById('note-text').textContent = note;
  openOverlay('note-modal');
}

function closeNoteModal()  { closeOverlay('note-modal');  }
function closePhotoModal() { closeOverlay('photo-modal'); }

function openOverlay(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  el.setAttribute('aria-hidden', 'false');
}
function closeOverlay(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  el.setAttribute('aria-hidden', 'true');
}

/* ============================================================
   PAGE 5 — MUSIC PLAYER
   ============================================================ */
function initMusic() {
  S.audio = new Audio();
  S.audio.preload = 'metadata';
  S.audio.addEventListener('timeupdate',     updateSeek);
  S.audio.addEventListener('loadedmetadata', updateTotalTime);
  S.audio.addEventListener('ended',          nextSong);
  S.audio.addEventListener('error', () => {
    S.playing = false;
    /* Show visible feedback instead of failing silently */
    const title = document.getElementById('song-title');
    if (title) title.textContent = '⚠ File not found — check path in script.js';
    const label = document.getElementById('cassette-label-text');
    if (label) label.textContent = '⚠ file missing';
    refreshPlayerUI();
  });

  buildPlaylist();
  initSeekTouch();
}

function buildPlaylist() {
  const pl = document.getElementById('playlist');
  if (!pl) return;
  pl.innerHTML = '';
  SONGS.forEach((song, i) => {
    const it = document.createElement('div');
    it.className = 'pl-item';
    it.setAttribute('role', 'listitem');
    it.dataset.idx = i;
    it.innerHTML = `<span class="pl-num">${i+1}.</span>${song.title}`;
    /* click for desktop, touchend for Android (no 300ms delay) */
    it.addEventListener('click',    ()  => playSong(i));
    it.addEventListener('touchend', (e) => { e.preventDefault(); playSong(i); });
    pl.appendChild(it);
  });
}

function playSong(idx) {
  S.songIndex = idx;
  const song = SONGS[idx];
  if (!song) return;

  /* Stop whatever is currently playing cleanly before switching */
  S.audio.pause();

  /* Setting src already triggers an implicit load — calling load()
     explicitly right before play() causes an AbortError on mobile Chrome
     which silently kills playback without triggering the error event.
     Removed: S.audio.load() */
  S.audio.src = song.src;

  const p = S.audio.play();
  if (p !== undefined) {
    p.then(() => { S.playing = true;  refreshPlayerUI(); })
     .catch(err => {
       /* AbortError = browser interrupted us (e.g. rapid song switching).
          Any other error = genuine problem (file missing, decode error). */
       S.playing = false;
       refreshPlayerUI();
     });
  }
  refreshPlayerUI();
}

function togglePlay() {
  if (!S.audio) return;
  if (S.playing) {
    S.audio.pause(); S.playing = false; refreshPlayerUI(); return;
  }
  /* currentSrc is "" until a source has actually been assigned and loaded.
     More reliable than checking .src which can return the page URL on some
     Android browsers when no source has been set. */
  if (!S.audio.currentSrc) {
    playSong(0); return;
  }
  S.audio.play()
    .then(() => { S.playing = true;  refreshPlayerUI(); })
    .catch(() => { S.playing = false; refreshPlayerUI(); });
}

function prevSong() { playSong((S.songIndex - 1 + SONGS.length) % SONGS.length); }
function nextSong() { playSong((S.songIndex + 1) % SONGS.length); }

function refreshPlayerUI() {
  const song = SONGS[S.songIndex];
  if (!song) return;

  const playBtn = document.getElementById('btn-play');
  if (playBtn) playBtn.textContent = S.playing ? '⏸' : '▶';

  const title   = document.getElementById('song-title');
  const counter = document.getElementById('song-counter');
  const label   = document.getElementById('cassette-label-text');

  if (title)   title.textContent   = song.title;
  if (counter) counter.textContent = `${S.songIndex+1} / ${SONGS.length}`;
  if (label)   label.textContent   = song.title;

  /* Spin reels */
  document.getElementById('reel-left')?.classList.toggle('spinning',  S.playing);
  document.getElementById('reel-right')?.classList.toggle('spinning', S.playing);

  /* Highlight playlist item */
  document.querySelectorAll('.pl-item').forEach((it, i) => it.classList.toggle('active', i === S.songIndex));
}

function updateSeek() {
  const { currentTime, duration } = S.audio;
  if (!isFinite(duration) || duration === 0) return;
  const pct = (currentTime / duration) * 100;
  const fill  = document.getElementById('seek-fill');
  const thumb = document.getElementById('seek-thumb');
  if (fill)  fill.style.width = pct + '%';
  if (thumb) thumb.style.left = pct + '%';
  const cur = document.getElementById('time-current');
  if (cur) cur.textContent = fmtTime(currentTime);
}

function updateTotalTime() {
  const dur = S.audio?.duration;
  const el  = document.getElementById('time-total');
  if (el && isFinite(dur)) el.textContent = fmtTime(dur);
}

function fmtTime(s) {
  if (!isFinite(s)) return '0:00';
  return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
}

/* Seek via click or touch */
function initSeekTouch() {
  const wrap = document.getElementById('seek-wrap');
  const track = wrap?.querySelector('.seek-track');
  if (!track) return;

  const seek = (e) => {
    const rect = track.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (S.audio && isFinite(S.audio.duration)) {
      S.audio.currentTime = pct * S.audio.duration;
    }
  };

  track.addEventListener('click',      seek);
  track.addEventListener('touchstart', e => { e.preventDefault(); seek(e); }, { passive: false });
  track.addEventListener('touchmove',  e => { e.preventDefault(); seek(e); }, { passive: false });
}

/* ============================================================
   PAGE 6 — PHOTO GALLERY
   ============================================================ */
function initGallery() {
  const wall = document.getElementById('gallery-wall');
  if (!wall) return;

  const rotations = [-3, 2.5, -4, 1.8, -2.5, 3.2, -1.5, 2.8, -3.5, 1.2];
  const row1 = buildPhotoRow(PHOTOS.slice(0, 3), rotations.slice(0, 3), 0);
  const row2 = buildPhotoRow(PHOTOS.slice(3),    rotations.slice(3, 6), 3);

  wall.appendChild(row1);
  if (PHOTOS.length > 3) wall.appendChild(row2);
}

function buildPhotoRow(photoArr, rots, baseIdx) {
  const row = document.createElement('div');
  row.className = 'photo-row';
  const line = document.createElement('div');
  line.className = 'string-line'; line.setAttribute('aria-hidden','true');
  row.appendChild(line);

  const strip = document.createElement('div');
  strip.className = 'polaroid-strip';

  photoArr.forEach((photo, i) => {
    const idx = baseIdx + i;
    const pol = document.createElement('div');
    pol.className = 'polaroid';
    pol.setAttribute('role', 'listitem');
    pol.setAttribute('aria-label', photo.caption || `Photo ${idx+1}`);
    pol.style.setProperty('--pr', (rots[i] || 0) + 'deg');
    pol.style.setProperty('--pd', (idx * 0.1) + 's');

    const imgWrap = document.createElement('div');
    imgWrap.className = 'polaroid-img-wrap';

    if (photo.src) {
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption || '';
      img.loading = 'lazy';
      /* Graceful fallback if file path is wrong or file is missing */
      img.onerror = () => {
        imgWrap.innerHTML = '';
        const ph = document.createElement('div');
        ph.className = 'pol-placeholder';
        ph.innerHTML = `📷<span>Image not found</span>`;
        imgWrap.appendChild(ph);
      };
      imgWrap.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'pol-placeholder';
      ph.innerHTML = `📷<span>Add photo here</span>`;
      imgWrap.appendChild(ph);
    }

    const cap = document.createElement('p');
    cap.className = 'polaroid-cap';
    cap.textContent = photo.caption || '';

    pol.appendChild(imgWrap);
    pol.appendChild(cap);

    pol.addEventListener('click', () => openPhoto(photo, idx));
    pol.addEventListener('touchend', e => { e.preventDefault(); openPhoto(photo, idx); });
    strip.appendChild(pol);
  });

  row.appendChild(strip);
  return row;
}

function openPhoto(photo, idx) {
  const wrap = document.getElementById('lightbox-img-wrap');
  const cap  = document.getElementById('lightbox-caption');
  if (!wrap) return;

  wrap.innerHTML = '';
  if (photo.src) {
    const img = document.createElement('img');
    img.src = photo.src; img.alt = photo.caption || '';
    img.onerror = () => {
      wrap.innerHTML = '<div class="lightbox-placeholder">📷</div>';
    };
    wrap.appendChild(img);
  } else {
    const ph = document.createElement('div');
    ph.className = 'lightbox-placeholder';
    ph.textContent = '📷';
    wrap.appendChild(ph);
  }
  if (cap) cap.textContent = photo.caption || '';
  openOverlay('photo-modal');
}

/* ============================================================
   PAGE 7 — CONSTELLATION
   ============================================================ */
function initConstellation() {
  const map = document.getElementById('cons-map');
  if (!map) return;

  C_STARS.forEach(star => {
    const el = document.createElement('button');
    el.className = 'cons-star';
    el.id = `cs-${star.id}`;
    el.textContent = '★';
    el.style.left = star.x + '%';
    el.style.top  = star.y + '%';
    el.setAttribute('aria-label', `Star ${star.id + 1}`);

    const click = () => clickConsStar(star.id, el);
    el.addEventListener('click', click);
    el.addEventListener('touchend', e => { e.preventDefault(); click(); });
    map.appendChild(el);
  });
}

function resizeConsCanvas() {
  const map    = document.getElementById('cons-map');
  const canvas = document.getElementById('cons-canvas');
  if (!map || !canvas) return;
  const r = map.getBoundingClientRect();
  canvas.width  = r.width;
  canvas.height = r.height;
  /* NOTE: deliberately NOT calling drawConstellationLines here —
     doing so would create infinite recursion since drawConstellationLines
     calls resizeConsCanvas. Redraw on resize is handled by the window
     resize listener below. */
}

function clickConsStar(id, el) {
  if (S.litStars.has(id) || S.consComplete) return;
  S.litStars.add(id);
  el.classList.add('lit');

  const remaining = C_STARS.length - S.litStars.size;
  const msg = document.getElementById('cons-msg-text');
  if (msg) msg.textContent = remaining > 0 ? `${remaining} star${remaining===1?'':'s'} remaining…` : 'Connecting…';

  if (S.litStars.size === C_STARS.length) {
    S.consComplete = true;
    setTimeout(() => {
      resizeConsCanvas();
      drawConstellationLines();
    }, 400);
  }
}

function drawConstellationLines() {
  const canvas = document.getElementById('cons-canvas');
  const map    = document.getElementById('cons-map');
  if (!canvas || !map) return;

  /* Size the canvas directly here — no call to resizeConsCanvas to avoid
     the mutual-recursion loop that was causing a stack overflow. */
  const rect  = map.getBoundingClientRect();
  const W     = Math.max(rect.width,  120);
  const H     = Math.max(rect.height, 220);
  canvas.width  = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  /* Draw all lines in one smooth animation (~1.5 s total).
     Each frame: clear and redraw every completed segment plus the
     currently-in-progress one. No per-segment timeouts needed. */
  const TOTAL_MS = 1500;
  const t0 = performance.now();

  function frame(now) {
    const progress = Math.min((now - t0) / TOTAL_MS, 1); // 0 → 1 over 1.5 s
    ctx.clearRect(0, 0, W, H);

    C_CONNECTIONS.forEach((conn, i) => {
      /* Each segment occupies an equal slice of the total progress range */
      const segStart = i       / C_CONNECTIONS.length;
      const segEnd   = (i + 1) / C_CONNECTIONS.length;
      if (progress <= segStart) return; // Not started yet

      const segProg = Math.min((progress - segStart) / (segEnd - segStart), 1);

      const s1 = C_STARS[conn[0]];
      const s2 = C_STARS[conn[1]];
      const x1 = (s1.x / 100) * W,  y1 = (s1.y / 100) * H;
      const x2 = (s2.x / 100) * W,  y2 = (s2.y / 100) * H;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + (x2 - x1) * segProg, y1 + (y2 - y1) * segProg);
      ctx.strokeStyle = 'rgba(255, 216, 120, 0.85)';
      ctx.lineWidth   = 2;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = 'rgba(255, 216, 120, 0.55)';
      ctx.stroke();
    });

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      setTimeout(showConsMessage, 350);
    }
  }

  requestAnimationFrame(frame);
}
/* animLine is no longer used — drawing is now handled entirely inside
   drawConstellationLines with a single requestAnimationFrame loop. */

function showConsMessage() {
  const wrap = document.getElementById('cons-message');
  if (!wrap) return;
  wrap.innerHTML = `
    <span class="cons-g-letter">G</span>
    <span class="cons-final-line">Some stars shine a little differently.</span>
  `;
}

window.addEventListener('resize', debounce(() => {
  if (S.page === 'page-constellation') {
    resizeConsCanvas();
    if (S.consComplete) drawConstellationLines(); // safe here — not called from within drawConstellationLines
  }
}, 300));

/* ============================================================
   PAGE 8 — LETTER
   ============================================================ */
function openLetter() {
  if (S.letterOpen) return;
  S.letterOpen = true;

  const env   = document.getElementById('letter-envelope');
  const paper = document.getElementById('letter-paper');
  if (!env || !paper) return;

  env.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  env.style.opacity    = '0';
  env.style.transform  = 'scale(0.85) translateY(-15px)';

  setTimeout(() => {
    env.style.display = 'none';
    paper.classList.add('open');
    paper.setAttribute('aria-hidden', 'false');
    paper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 500);
}
/* keyboard support */
document.getElementById('letter-envelope')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLetter(); }
});

/* ============================================================
   PAGE 9 — GIFT BOX
   ============================================================ */
function openGift() {
  if (S.giftOpen) return;
  S.giftOpen = true;

  const box     = document.getElementById('gift-box');
  const msgArea = document.getElementById('gift-message');
  const moreBtn = document.getElementById('btn-one-more');
  if (!box) return;

  box.classList.add('opened');

  setTimeout(() => {
    if (msgArea) {
      msgArea.innerHTML = `
        <p class="gift-msg-txt">
          Things haven't been easy lately.<br><br>
          But I wanted to remind you that you're<br>
          <span class="highlight">loved, appreciated, annoying, dramatic, stubborn</span><br>
          and <span class="highlight">important</span>.<br><br>
          In exactly that order.
        </p>
      `;
    }
    if (moreBtn) { moreBtn.style.display = 'inline-block'; }
  }, 950);
}

function oneMoreThing() {
  const btn = document.getElementById('btn-one-more');
  if (btn) btn.disabled = true;

  /* Confetti explosion */
  launchConfetti();

  /* Wish Granted text */
  const msgArea = document.getElementById('gift-message');
  if (msgArea) {
    setTimeout(() => {
      const span = document.createElement('span');
      span.className = 'gift-wish-txt';
      span.textContent = 'Wish Granted ✨';
      msgArea.appendChild(span);
    }, 350);
  }

  /* Transition to Little Corner after pause */
  setTimeout(revealLittleCorner, 3500);
}

function revealLittleCorner() {
  const giftSec = document.getElementById('gift-section');
  const corner  = document.getElementById('little-corner');
  if (!giftSec || !corner) return;

  giftSec.style.transition = 'opacity 0.9s ease';
  giftSec.style.opacity    = '0';

  setTimeout(() => {
    giftSec.style.display = 'none';
    corner.style.display  = 'flex';
    corner.style.opacity  = '0';
    corner.style.transition = 'opacity 0.9s ease';

    requestAnimationFrame(() => requestAnimationFrame(() => {
      corner.style.opacity = '1';

      /* Build corner atmosphere */
      buildFireflies(document.getElementById('corner-bg-flies'), 12);
      buildStarsIn(document.getElementById('corner-bg-stars'), 55);
      buildFloatingParticles(document.getElementById('corner-particles'), 18);
    }));
  }, 900);
}

function buildStarsIn(container, count) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star-p';
    s.style.left = rnd(100) + '%'; s.style.top = rnd(100) + '%';
    const sz = rnd(2) + 0.4;
    s.style.width = sz + 'px'; s.style.height = sz + 'px';
    s.style.setProperty('--sd', (2 + rnd(4)) + 's');
    s.style.setProperty('--sl', rnd(6) + 's');
    container.appendChild(s);
  }
}

function buildFloatingParticles(container, count) {
  if (!container) return;
  const emojis = ['✨','💫','⭐','🌟','💜','🌸'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      left:${rnd(100)}%;
      top:${rnd(100)}%;
      font-size:${0.7 + rnd(0.8)}rem;
      opacity:0;
      animation:drift ${6+rnd(7)}s ease-in-out infinite;
      animation-delay:${rnd(8)}s;
      pointer-events:none;
    `;
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.setProperty('--dx',  ((Math.random()-0.5)*80)+'px');
    p.style.setProperty('--dy',  ((Math.random()-0.5)*60)+'px');
    p.style.setProperty('--dx2', ((Math.random()-0.5)*60)+'px');
    p.style.setProperty('--dy2', (-40-rnd(40))+'px');
    container.appendChild(p);
  }
}

/* keyboard support for gift box */
document.getElementById('gift-box')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGift(); }
});

/* ============================================================
   SECRET WORD SYSTEM
   ============================================================ */
function initSecretInput() {
  const input = document.getElementById('secret-input');
  if (!input) return;
  input.addEventListener('input',   debounce(checkSecret, 180));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') checkSecret(); });
}

const SECRET_WORDS = {
  'monster':      doMonster,
  'sundae':       doSundae,
  'wish granted': doWishGranted,
  'garvi':        doGarvi,
};

function checkSecret() {
  const input = document.getElementById('secret-input');
  if (!input) return;
  const val = input.value.toLowerCase().trim();

  for (const [word, fn] of Object.entries(SECRET_WORDS)) {
    if (val === word) {
      /* Prevent rapid re-trigger */
      if (S.secretLastWord === word && Date.now() - S.secretLastTime < 3500) return;
      S.secretLastWord = word;
      S.secretLastTime = Date.now();
      input.value = '';
      fn();
      return;
    }
  }
}

function setSecretMsg(html) {
  const el = document.getElementById('secret-response');
  if (!el) return;
  el.innerHTML = '';
  setTimeout(() => {
    el.innerHTML = html;
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'fadeSlideUp 0.65s ease both';
  }, 50);
}

function clearAnimArea(delay = 3200) {
  setTimeout(() => {
    const a = document.getElementById('secret-anim');
    if (a) a.innerHTML = '';
  }, delay);
}

/* 🥤 MONSTER */
function doMonster() {
  setSecretMsg(`Emergency hydration delivered.<br><small style="color:var(--text-muted);font-size:.8rem">As requested by absolutely nobody.</small>`);
  const area = document.getElementById('secret-anim');
  if (!area) return;
  area.innerHTML = '';

  const positions = [18, 36, 56, 74];
  positions.forEach((lp, i) => {
    const can = document.createElement('div');
    can.className = 'sw-can';
    can.textContent = '🥤';
    can.style.left = lp + '%';
    can.style.setProperty('--cd', (i * 0.18) + 's');
    area.appendChild(can);

    /* Sparkles */
    for (let j = 0; j < 3; j++) {
      const sp = document.createElement('div');
      sp.className = 'sw-sparkle';
      sp.textContent = ['✨','💫','⭐'][j % 3];
      sp.style.left = (lp + (Math.random()-0.5)*12) + '%';
      sp.style.top  = (48 + rnd(18)) + '%';
      sp.style.animationDelay = (i*0.18 + 0.55 + j*0.12) + 's';
      area.appendChild(sp);
    }
  });
  clearAnimArea(3500);
}

/* 🍨 SUNDAE */
function doSundae() {
  setSecretMsg(`<span style="font-size:1.55rem">AAGYAAAAAA 🍨</span>`);
  const area = document.getElementById('secret-anim');
  if (!area) return;
  area.innerHTML = '';

  const el = document.createElement('div');
  el.className = 'sw-sundae';
  el.textContent = '🍨';
  area.appendChild(el);

  setTimeout(() => {
    for (let i = 0; i < 6; i++) {
      const sp = document.createElement('div');
      sp.className = 'sw-sparkle';
      sp.textContent = ['✨','💫','🌟','⭐'][i % 4];
      sp.style.left = (38 + (Math.random()-0.5)*22) + '%';
      sp.style.top  = (50 + rnd(15)) + '%';
      sp.style.animationDelay = (i * 0.1) + 's';
      area.appendChild(sp);
    }
  }, 750);
  clearAnimArea(3500);
}

/* 🏎️ WISH GRANTED */
function doWishGranted() {
  setSecretMsg(`Some wishes have a habit of coming true.`);
  const area = document.getElementById('secret-anim');
  if (!area) return;
  area.innerHTML = '';

  const car = document.createElement('div');
  car.className = 'sw-car';
  car.textContent = '🏎️';
  car.style.bottom = (22 + rnd(8)) + '%';
  area.appendChild(car);

  /* Sparkle trail */
  let count = 0;
  const iv = setInterval(() => {
    if (count > 18) { clearInterval(iv); return; }
    const tr = document.createElement('div');
    tr.className = 'sw-trail';
    tr.textContent = ['✨','💫','⭐'][count % 3];
    tr.style.left   = ((count / 19) * 100) + '%';
    tr.style.bottom = (22 + rnd(8) + rnd(6)) + '%';
    tr.style.animationDelay = '0s';
    area.appendChild(tr);
    count++;
  }, 165);

  clearAnimArea(4000);
}

/* ⭐ GARVI */
function doGarvi() {
  /* Dim fireflies */
  document.querySelectorAll('.firefly').forEach(f => f.style.animationPlayState = 'paused');

  const area = document.getElementById('secret-anim');
  if (!area) return;
  area.innerHTML = '';

  /* Scatter stars from edges */
  const numStars = 14;
  const targetX  = window.innerWidth  / 2;
  const targetY  = window.innerHeight * 0.38;

  for (let i = 0; i < numStars; i++) {
    const star  = document.createElement('div');
    const startX = rnd(window.innerWidth);
    const startY = rnd(window.innerHeight);
    star.style.cssText = `
      position:fixed; font-size:1.15rem; pointer-events:none; z-index:200;
      left:${startX}px; top:${startY}px; opacity:0.85;
      transition:left ${0.85+rnd(0.5)}s cubic-bezier(0.4,0,0.2,1) ${rnd(0.45)}s,
                 top  ${0.85+rnd(0.5)}s cubic-bezier(0.4,0,0.2,1) ${rnd(0.45)}s;
    `;
    star.textContent = '⭐';
    area.appendChild(star);

    /* trigger movement on next frame */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      star.style.left = targetX + 'px';
      star.style.top  = targetY + 'px';
    }));
  }

  /* Show message after gather */
  setTimeout(() => {
    area.innerHTML = '';
    setSecretMsg(`<div class="garvi-msg">Hey.<br>You're one of my favourite people.</div>`);
    /* Restore fireflies */
    setTimeout(() => {
      document.querySelectorAll('.firefly').forEach(f => f.style.animationPlayState = 'running');
    }, 2500);
  }, 1900);
}

/* ============================================================
   CONFETTI
   ============================================================ */
let confettiRAF = null;

function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);
}

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const colors = ['#c8b8e8','#9b7fc7','#ffd878','#f8c8d8','#87ceeb','#c8e8c0','#ffb8c8','#ffe0a8'];
  const pieces = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 120,
    w: 5 + Math.random() * 9,
    h: 4 + Math.random() * 7,
    c: colors[Math.floor(Math.random() * colors.length)],
    vx:(Math.random()-0.5) * 4,
    vy: 2.5 + Math.random() * 3,
    r: Math.random() * Math.PI * 2,
    rs:(Math.random()-0.5) * 0.14,
    op:1,
  }));

  let t0 = null;
  const TOTAL = 4200;

  if (confettiRAF) cancelAnimationFrame(confettiRAF);

  function frame(ts) {
    if (!t0) t0 = ts;
    const elapsed = ts - t0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.r  += p.rs;
      p.vy += 0.05; // gravity
      if (elapsed > TOTAL * 0.65) p.op = Math.max(0, p.op - 0.012);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.globalAlpha = p.op;
      ctx.fillStyle   = p.c;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });

    if (elapsed < TOTAL) {
      confettiRAF = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  confettiRAF = requestAnimationFrame(frame);
}

/* ============================================================
   KONAMI CODE
   Sequence: ↑ ↑ ↓ ↓ ← → ← → B A
   ============================================================ */
function initKonami() {
  document.addEventListener('keydown', e => {
    const expected = KONAMI[S.konamiIdx];
    if (e.key === expected) {
      S.konamiIdx++;
      if (S.konamiIdx === KONAMI.length) { S.konamiIdx = 0; openKonamiRoom(); }
    } else {
      S.konamiIdx = (e.key === KONAMI[0]) ? 1 : 0;
    }
  });
}

function openKonamiRoom() {
  if (S.konamiOpen) return;
  S.konamiOpen = true;

  const room = document.getElementById('konami-room');
  if (!room) return;

  /* Populate background */
  buildStarsIn(document.getElementById('konami-stars-bg'), 65);
  buildFireflies(document.getElementById('konami-flies'), 20);

  room.classList.add('open');
  room.setAttribute('aria-hidden', 'false');
}

function konamiStarClick() {
  if (S.konamiStarUsed) return;
  S.konamiStarUsed = true;

  const starBtn = document.getElementById('konami-star-btn');
  if (starBtn) {
    starBtn.style.transition = 'transform 0.6s ease, opacity 0.4s ease';
    starBtn.style.transform  = 'scale(6)';
    starBtn.style.opacity    = '0';
    setTimeout(() => { starBtn.style.display = 'none'; }, 650);
  }

  setTimeout(() => {
    const msg = document.getElementById('konami-star-msg');
    if (msg) {
      msg.textContent = 'Thank you for staying.';
      msg.style.animation = 'fadeSlideUp 0.9s ease both';
    }
  }, 750);
}

function closeKonamiRoom() {
  const room = document.getElementById('konami-room');
  if (!room) return;
  room.style.transition = 'opacity 0.5s ease';
  room.style.opacity    = '0';
  setTimeout(() => {
    room.classList.remove('open');
    room.setAttribute('aria-hidden', 'true');
    room.style.opacity    = '';
    room.style.transition = '';
    S.konamiOpen      = false;
    S.konamiStarUsed  = false;
    const star = document.getElementById('konami-star-btn');
    if (star) { star.style.cssText = ''; }
    const msg = document.getElementById('konami-star-msg');
    if (msg) msg.textContent = '';
  }, 520);
}

/* ============================================================
   MISC EVENT BINDINGS
   ============================================================ */
function initMiscEvents() {
  /* Close overlays by tapping backdrop */
  document.getElementById('note-modal')?.addEventListener('click', e => {
    if (e.target.id === 'note-modal') closeNoteModal();
  });
  document.getElementById('photo-modal')?.addEventListener('click', e => {
    if (e.target.id === 'photo-modal') closePhotoModal();
  });
  document.getElementById('secret-popup')?.addEventListener('click', e => {
    if (e.target.id === 'secret-popup') closeSecretPopup();
  });
}

/* ============================================================
   UTILITIES
   ============================================================ */
function rnd(n) { return Math.random() * n; }

function div(cls) {
  const d = document.createElement('div');
  d.className = cls;
  return d;
}

function debounce(fn, ms) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

/* ============================================================
   END — Garviverse script.js
   ============================================================ */
