const q = (s, root = document) => root.querySelector(s);
const qa = (s, root = document) => [...root.querySelectorAll(s)];

const menu = q('.menu-btn');
const nav = q('.site-header nav');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
qa('.site-header nav a').forEach(a => a.addEventListener('click', () => {
  nav?.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
}));
q('#year').textContent = new Date().getFullYear();

const pad = n => String(n).padStart(2, '0');
const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

fetch('data/media.json', { cache: 'no-store' })
  .then(r => {
    if (!r.ok) throw new Error(`media.json: ${r.status}`);
    return r.json();
  })
  .then(data => {
    renderStats(data);
    renderBooks(data.books || []);
    renderMusic(data.music || []);
    renderResearch(data.researchLeads || []);
    renderVideos(data.videos || []);
    renderGallery(data.gallery || []);
  })
  .catch(err => console.error('Archive data could not be loaded:', err));

function renderStats(data) {
  const photoCount = (data.gallery || []).filter(x => x.image).length;
  q('#stat-books').textContent = pad((data.books || []).length);
  q('#stat-videos').textContent = pad((data.videos || []).length);
  q('#stat-photos').textContent = pad(photoCount);
}

function renderBooks(items) {
  const host = q('#books-grid');
  if (!host) return;
  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'book-card';
    const meta = [item.year, item.material, item.language].filter(Boolean).join(' · ');
    const details = item.detailsUrl ? `<a class="btn small secondary" href="${esc(item.detailsUrl)}">Детали · MK/EN</a>` : '';
    const preview = item.previewUrl ? `<a class="btn small secondary" href="${esc(item.previewUrl)}" target="_blank" rel="noopener">${esc(item.previewLabel || 'PDF преглед')}</a>` : '';
    const order = item.orderUrl ? `<a class="btn small primary" href="${esc(item.orderUrl)}">Прашај за достапност</a>` : `<span class="book-status">Материјалите се дополнуваат</span>`;
    card.innerHTML = `
      <div class="book-cover"><img loading="lazy" src="${esc(item.cover)}" alt="${esc(item.title)}"></div>
      <div class="book-body">
        <div class="book-label">${esc(item.label || '')}</div>
        <h3>${esc(item.title)}</h3>
        ${item.subtitle ? `<p class="book-subtitle">${esc(item.subtitle)}</p>` : ''}
        <p class="book-meta">${esc(meta)}</p>
        ${item.status ? `<p class="book-status">${esc(item.status)}</p>` : ''}
        <div class="book-actions">${details}${preview}${order}</div>
      </div>`;
    host.appendChild(card);
  });
}

function renderMusic(items) {
  const host = q('#music-grid');
  if (!host) return;
  items.forEach((item, idx) => {
    const card = document.createElement('article');
    card.className = 'music-card';
    card.innerHTML = `
      <div class="music-num">${pad(idx + 1)}</div>
      <div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></div>
      <div class="status">${esc(item.status || 'чека каталогизација')}</div>`;
    host.appendChild(card);
  });
}

function renderResearch(items) {
  const host = q('#research-grid');
  if (!host) return;
  items.forEach((item, idx) => {
    const card = document.createElement('article');
    card.className = 'research-card';
    const urls = item.urls || (item.url ? [item.url] : []);
    const links = urls.map((url, i) => `<a class="research-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Извор ${urls.length > 1 ? i + 1 : ''} ↗</a>`).join('');
    card.innerHTML = `
      <div class="research-code">DISCOVERY ${pad(idx + 1)} · ${esc(item.id || '')}</div>
      <h3>${esc(item.title || '')}</h3>
      <div class="research-status">${esc(item.status || 'pending-verification')}</div>
      ${item.evidence ? `<p class="research-evidence">${esc(item.evidence)}</p>` : ''}
      ${item.nextAction ? `<p class="research-next"><strong>Следно:</strong> ${esc(item.nextAction)}</p>` : ''}
      ${links ? `<div class="research-links">${links}</div>` : ''}
    `;
    host.appendChild(card);
  });
}

function videoType(item) {
  if (item.youtubeId) return 'youtube';
  if (item.localFile) return 'local';
  if (item.externalUrl && item.externalUrl.includes('facebook.com')) return 'facebook';
  if (item.poster) return 'archive';
  return 'external';
}

function renderVideos(items) {
  const host = q('#video-grid');
  const interviewHost = q('#interviews-grid');
  const sashoHost = q('#sasho-video-grid');
  const popacHost = q('#popac-video-grid');
  if (!host) return;
  items.forEach(item => {
    const type = videoType(item);
    const card = document.createElement('article');
    card.className = 'video-card';
    card.dataset.type = type;

    let visual = '';
    if (type === 'local') {
      visual = `<div class="video-visual"><video controls preload="none" poster="${esc(item.poster || '')}" src="${esc(item.localFile)}"></video></div>`;
    } else if (type === 'youtube') {
      const thumb = `https://i.ytimg.com/vi/${encodeURIComponent(item.youtubeId)}/hqdefault.jpg`;
      visual = `<div class="video-visual"><button class="video-placeholder youtube-poster" type="button" data-youtube="${esc(item.youtubeId)}" aria-label="Пушти YouTube видео ${esc(item.archiveId || '')}"><img class="youtube-thumbnail" loading="lazy" src="${esc(thumb)}" alt=""><span class="play-orbit" aria-hidden="true"></span><span class="video-id">YOUTUBE · ${esc(item.youtubeId)}</span></button></div>`;
    } else if (type === 'facebook') {
      visual = `<div class="video-visual"><div class="external-video-card facebook-poster"><span class="facebook-play" aria-hidden="true"></span><span class="external-video-badge">FACEBOOK VIDEO</span><strong class="facebook-poster-title">${esc(item.title || 'Facebook видео')}</strong><p>Канонски надворешен запис</p><a class="btn small primary" href="${esc(item.externalUrl)}" target="_blank" rel="noopener noreferrer">Отвори оригинал</a></div></div>`;
    } else if (type === 'archive') {
      visual = `<div class="video-visual"><div class="external-video-card archive-video-card" style="background-image:linear-gradient(rgba(8,10,14,.28),rgba(8,10,14,.82)),url('${esc(item.poster || '')}')"><span class="external-video-badge">ARCHIVE MASTER</span><p>Видео-мастерот е зачуван надвор од GitHub. Public player ќе се активира преку проверен YouTube/Rumble извор по проверка на правата.</p></div></div>`;
    } else {
      visual = `<div class="video-visual"><div class="external-video-card"><span class="external-video-badge">EXTERNAL</span><p>Изворот се проверува.</p></div></div>`;
    }

    card.innerHTML = `${visual}<div class="video-body"><div class="meta">${esc(item.archiveId || '')} · ${type}</div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p>${item.duration ? `<p>Траење: ${esc(item.duration)}</p>` : ''}</div>`;
    let targetHost = host;
    if (item.section === 'popac-interviews' && interviewHost) targetHost = interviewHost;
    else if (item.section === 'sasho-videos' && sashoHost) targetHost = sashoHost;
    else if (item.section === 'popac-videos' && popacHost) targetHost = popacHost;
    targetHost.appendChild(card);
  });

  qa('.video-placeholder', q('#video') || document).forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.youtube;
      const wrap = button.parentElement;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
      iframe.title = 'YouTube archive video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      wrap.replaceChildren(iframe);
    }, { once: true });
  });

  qa('.filter-chip').forEach(button => {
    button.addEventListener('click', () => {
      qa('.filter-chip').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      qa('.video-card', q('#video') || document).forEach(card => {
        card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.type !== filter);
      });
    });
  });
}

function makeArtworkPoster(record) {
  const id = esc(record.archiveId || 'ARCHIVE');
  const title = esc(record.posterLabel || record.title || 'Архивско видео');
  const subtitle = esc(record.posterSubtitle || 'Саздо & Попац · дигитална архива');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#080808"/>
        <stop offset="1" stop-color="#241812"/>
      </linearGradient>
    </defs>
    <rect width="960" height="720" fill="url(#g)"/>
    <rect x="44" y="44" width="872" height="632" fill="none" stroke="#6e5e51" stroke-width="2"/>
    <circle cx="480" cy="305" r="74" fill="none" stroke="#d8c3ad" stroke-width="3"/>
    <path d="M462 266 L462 344 L525 305 Z" fill="#f0e2d3"/>
    <text x="70" y="90" fill="#9f8c7c" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="3">${id} · ARCHIVE VIDEO</text>
    <text x="480" y="470" fill="#ffffff" font-family="Georgia, serif" font-size="42" text-anchor="middle">${title}</text>
    <text x="480" y="515" fill="#b6a99b" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" letter-spacing="1">${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function setupArtworkVideoPosters() {
  qa('.artwork-video video[data-poster-time]').forEach(video => {
    const requested = Number(video.dataset.posterTime);
    if (!Number.isFinite(requested) || requested < 0) return;

    let finished = false;
    const captureFrame = () => {
      if (finished || !video.videoWidth || !video.videoHeight) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 960;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.poster = canvas.toDataURL('image/jpeg', .9);
        finished = true;
        try { video.currentTime = 0; } catch {}
      } catch {}
    };

    const seekForPoster = () => {
      const maxTime = Number.isFinite(video.duration) && video.duration > .3
        ? Math.max(0, video.duration - .25)
        : requested;
      const target = Math.min(requested, maxTime);
      video.addEventListener('seeked', captureFrame, { once: true });
      try { video.currentTime = target; } catch {}
    };

    if (video.readyState >= 1) seekForPoster();
    else video.addEventListener('loadedmetadata', seekForPoster, { once: true });
  });
}

function renderGallery(items) {
  const host = q('#gallery-grid');
  if (!host) return;
  items.forEach(item => {
    if (item.collectionId === 'ARTWORKS-POPAC') {
      const card = document.createElement('section');
      card.className = 'gallery-item gallery-collection';
      card.id = 'artworks-popac';
      const records = (item.items || []).map(record => `
        <article class="artwork-record">
          <div class="meta">${esc(record.archiveId || '')} · ARCHIVE VIDEO MASTER</div>
          ${record.localFile ? `
            <div class="artwork-video">
              <video
                controls
                preload="metadata"
                playsinline
                poster="${esc(makeArtworkPoster(record))}"
                data-poster-time="${esc(record.posterTime ?? '')}"
                src="${esc(record.localFile)}"
                aria-label="${esc(record.title || 'Архивско видео')}">
                Вашиот прелистувач не поддржува HTML5 видео.
              </video>
            </div>` : ''}
          <strong>${esc(record.title || '')}</strong>
          <p>${esc(record.description || '')}</p>
          ${record.duration ? `<span class="artwork-duration">Траење: ${esc(record.duration)}</span>` : ''}
          ${record.youtubeUrl ? `<a class="btn small primary" href="${esc(record.youtubeUrl)}" target="_blank" rel="noopener noreferrer">Официјално YouTube видео ↗</a>` : ''}
          <span class="note">${esc(record.rightsStatus || 'Изворот и правата се проверуваат.')}</span>
        </article>`).join('');
      card.innerHTML = `
        <div class="gallery-collection-head">
          <span class="meta">COLLECTION 05</span>
          <strong>${esc(item.title || '')}</strong>
          <span class="note">${esc(item.description || '')}</span>
        </div>
        <div class="artwork-record-list">${records}</div>`;
      host.appendChild(card);
      return;
    }

    const card = document.createElement(item.image ? 'button' : 'div');
    card.className = `gallery-item${item.image ? ' has-image' : ''}`;
    if (item.image) {
      card.type = 'button';
      card.dataset.image = item.image;
      card.dataset.title = item.title || '';
      card.dataset.description = item.description || '';
      card.setAttribute('aria-label', `Отвори фотографија: ${item.title || 'архивска фотографија'}`);
      card.innerHTML = `
        <img class="gallery-photo" loading="lazy" src="${esc(item.image)}" alt="${esc(item.title || 'Архивска фотографија')}">
        <div class="gallery-overlay"><span class="meta">${esc(item.archiveId || 'PHOTO ARCHIVE')}</span><strong>${esc(item.title || '')}</strong><span class="note">${esc(item.rightsStatus || '')}</span></div>`;
    } else {
      card.innerHTML = `<div class="gallery-placeholder"><span class="meta">COLLECTION</span><strong>${esc(item.title || '')}</strong><span class="note">${esc(item.description || '')}</span></div>`;
    }
    host.appendChild(card);
  });
  setupArtworkVideoPosters();
  setupLightbox();
}

function setupLightbox() {
  const dialog = q('#lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = q('#lightbox-image');
  const title = q('#lightbox-title');
  const description = q('#lightbox-description');
  qa('.gallery-item.has-image').forEach(card => {
    card.addEventListener('click', () => {
      image.src = card.dataset.image || '';
      image.alt = card.dataset.title || 'Архивска фотографија';
      title.textContent = card.dataset.title || '';
      description.textContent = card.dataset.description || '';
      dialog.showModal();
    });
  });
  q('.lightbox-close', dialog)?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}
