(() => {
  const canonicalYouTube = {
    'MPS-0003': 'HSZyC6Aswqg'
  };

  const applyCanonicalYouTube = () => {
    document.querySelectorAll('#video-grid .video-card').forEach(card => {
      if (card.dataset.canonicalYoutubeApplied === '1') return;
      const meta = card.querySelector('.video-body .meta')?.textContent?.trim() || '';
      const archiveId = Object.keys(canonicalYouTube).find(id => meta.startsWith(id));
      if (!archiveId) return;

      const youtubeId = canonicalYouTube[archiveId];
      const visual = card.querySelector('.video-visual');
      if (!visual) return;

      card.dataset.type = 'youtube';
      card.dataset.canonicalYoutubeApplied = '1';

      const button = document.createElement('button');
      button.className = 'video-placeholder youtube-poster';
      button.type = 'button';
      button.setAttribute('aria-label', 'Пушти YouTube видео ' + archiveId);
      button.innerHTML =
        '<img class="youtube-thumbnail" loading="lazy" src="https://i.ytimg.com/vi/' +
        encodeURIComponent(youtubeId) +
        '/hqdefault.jpg" alt="">' +
        '<span class="play-orbit" aria-hidden="true"></span>' +
        '<span class="video-id">YOUTUBE · ' + youtubeId + '</span>';

      button.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' +
          encodeURIComponent(youtubeId) +
          '?autoplay=1&rel=0';
        iframe.title = 'YouTube archive video';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        visual.replaceChildren(iframe);
      }, { once: true });

      visual.replaceChildren(button);
    });
  };

  const observer = new MutationObserver(applyCanonicalYouTube);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  applyCanonicalYouTube();
})();
