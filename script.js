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

fetch('data/media.json')
  .then(r => {
    if (!r.ok) throw new Error(`media.json: ${r.status}`);
    return r.json();
  })
  .then(data => {
    renderStats(data);
    renderBooks(data.books || []);
    renderMusic(data.music || []);
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
    card.className = `book-card${item.slot > 4 ? ' book-slot-empty' : ''}`;
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

function videoType(item) {
  if (item.youtubeId) return 'youtube';
  if (item.localFile) return 'local';
  if (item.externalUrl && item.externalUrl.includes('facebook.com')) return 'facebook';
  if (item.poster) return 'archive';
  return 'external';
}

function renderVideos(items) {
  const host = q('#video-grid');
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
      visual = `<div class="video-visual"><button class="video-placeholder" type="button" data-youtube="${esc(item.youtubeId)}" aria-label="Пушти YouTube видео ${esc(item.archiveId || '')}"><span class="play-orbit" aria-hidden="true"></span><span class="video-id">YOUTUBE · ${esc(item.youtubeId)}</span></button></div>`;
    } else if (type === 'facebook') {
      visual = `<div class="video-visual"><div class="external-video-card"><span class="external-video-badge">FACEBOOK VIDEO</span><p>Канонски надворешен запис</p><a class="btn small primary" href="${esc(item.externalUrl)}" target="_blank" rel="noopener noreferrer">Отвори оригинал</a></div></div>`;
    } else if (type === 'archive') {
      visual = `<div class="video-visual"><div class="external-video-card archive-video-card" style="background-image:linear-gradient(rgba(8,10,14,.28),rgba(8,10,14,.82)),url('${esc(item.poster || '')}')"><span class="external-video-badge">ARCHIVE MASTER</span><p>Видео-мастерот е зачуван надвор од GitHub. Public player ќе се активира преку проверен YouTube/Rumble извор по проверка на правата.</p></div></div>`;
    } else {
      visual = `<div class="video-visual"><div class="external-video-card"><span class="external-video-badge">EXTERNAL</span><p>Изворот се проверува.</p></div></div>`;
    }

    card.innerHTML = `${visual}<div class="video-body"><div class="meta">${esc(item.archiveId || '')} · ${type}</div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p>${item.duration ? `<p>Траење: ${esc(item.duration)}</p>` : ''}</div>`;
    host.appendChild(card);
  });

  qa('.video-placeholder', host).forEach(button => {
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
      qa('.video-card', host).forEach(card => {
        card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.type !== filter);
      });
    });
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
          <strong>${esc(record.title || '')}</strong>
          <p>${esc(record.description || '')}</p>
          ${record.duration ? `<span class="artwork-duration">Траење: ${esc(record.duration)}</span>` : ''}
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
