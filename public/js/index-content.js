document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // 🔹 Logo & Favicon
  fetch('/api/settings', { headers })
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (data?.logo_path) {
        const file = data.logo_path.split(/[/\\]+/).pop();
        document.getElementById('siteLogo').src = `/assets/logos/${file}`;
        document.getElementById('faviconTag').href = `/assets/logos/${file}`;
      }

      // 🔹 Footer content
      const footer = document.getElementById('footerContact');
      if (footer) {
        footer.innerHTML = `
          ${data.hospital_name || 'Gold LTE Hospital'} © 2025<br>
          ${data.address || '1234 Wellness Avenue, Healthy City'}<br>
          Contact: ${data.contact_email || 'info@goldlte.com'} | ${data.contact_phone || '+1 (555) 123-4567'}
        `;
      }
    });

  // 🔹 Announcements
  fetch('/api/announcements?lang=en', { headers })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('announcementList');
      if (Array.isArray(data) && list) {
        list.innerHTML = '';
        data.forEach(item => {
          const div = document.createElement('div');
          div.className = 'announcement-item';
          div.textContent = item.content;
          list.appendChild(div);
        });
      }
    });

  // 🔹 About
  fetch('/api/about?lang=en', { headers })
    .then(res => res.json())
    .then(data => {
      const about = document.getElementById('aboutContent');
      if (about) about.textContent = data.content || 'About not available.';
    });

// 🔹 Videos (multi)
fetch('/api/videos', { headers })
  .then(res => res.json())
  .then(videos => {
    const container = document.getElementById('videoContainer');
    if (!Array.isArray(videos) || !container) return;

    container.innerHTML = '';
    videos
      .filter(v => v.language === 'en')
      .forEach(video => {
        const wrapper = document.createElement('div');
        wrapper.className = 'video-tile';

        // ✅ Title
        const title = document.createElement('div');
        title.className = 'video-title';
        title.textContent = video.title || 'Untitled Video';
        wrapper.appendChild(title);

        // ✅ Source
        let src = '';
        if (video.video_file) {
          src = `/assets/videos/${video.video_file.split('\\').pop()}`;
        } else if (video.video_url) {
          src = video.video_url.replace(/(\?|&)autoplay=1/, '');
        }

        if (!src) return;

        // ✅ Video or YouTube
        if (src.includes('youtube.com') || src.includes('youtu.be')) {
          const iframe = document.createElement('iframe');
          iframe.src = src;
          iframe.allow = 'autoplay; encrypted-media';
          iframe.allowFullscreen = true;
          iframe.className = 'home-video';
          wrapper.appendChild(iframe);
        } else {
          const videoTag = document.createElement('video');
          videoTag.src = src;
          videoTag.controls = true;
          videoTag.muted = true;
          videoTag.className = 'home-video';

          // 🔁 Hover behavior
          videoTag.addEventListener('mouseenter', () => videoTag.play());
          videoTag.addEventListener('mouseleave', () => {
            videoTag.pause();
            videoTag.currentTime = 0;
          });

          wrapper.appendChild(videoTag);
        }

        container.appendChild(wrapper);
      });
  });

  // 🔹 Slides
  fetch('/api/slides?lang=en', { headers })
    .then(res => res.json())
    .then(slides => {
      const container = document.getElementById('slideContainer');
      if (!Array.isArray(slides) || !container) return;

      slides.forEach((slide, i) => {
        const div = document.createElement('div');
        div.className = 'hero-slide' + (i === 0 ? ' active' : '');
        div.style.backgroundImage = `url('/assets/slides/${slide.image_path.split('\\').pop()}')`;
        div.innerHTML = `<div class="hero-text">Welcome to Gold LTE</div>`;
        container.appendChild(div);
      });

      const slideEls = document.querySelectorAll('.hero-slide');
      let index = 0;
      setInterval(() => {
        if (slideEls.length === 0) return;
        slideEls[index].classList.remove('active');
        index = (index + 1) % slideEls.length;
        slideEls[index].classList.add('active');
      }, 5000);
    });

  // 🔹 Locations
  fetch('/api/locations', { headers })
    .then(res => res.json())
    .then(locations => {
      const container = document.getElementById('locationList');
      if (!Array.isArray(locations) || !container) return;

      container.innerHTML = '';
      locations.forEach(loc => {
        const div = document.createElement('div');
        div.className = 'location-item';
        div.innerHTML = `<strong>${loc.name}</strong><br/>${loc.address}<br/><small>Lat: ${loc.latitude}, Lng: ${loc.longitude}</small>`;
        container.appendChild(div);
      });
    });

  // 🔹 Mobile Menu
  document.getElementById('mobileToggle')?.addEventListener('click', () => {
    document.getElementById('mobileMenu')?.classList.toggle('show');
  });

  loadServices();
});

// 🔹 Load Services
function loadServices() {
  const lang = document.getElementById('lang')?.value || 'en';
  fetch('/api/services')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('serviceList');
      container.innerHTML = '';
      if (!Array.isArray(data)) return;

      data
        .filter(s => s.language === lang)
        .forEach(service => {
          const div = document.createElement('div');
          div.className = 'service-item';
          div.style.marginBottom = '1rem';
          div.innerHTML = `
            ${service.icon ? `<img src="/assets/services/${service.icon?.split('\\').pop()}" style="width:50px;height:50px;margin-right:10px;float:left;border-radius:6px;">` : ''}
            <strong>${service.title}</strong><br/>
            <span>${service.description}</span>
          `;
          container.appendChild(div);
        });
    })
    .catch(() => {
      document.getElementById('serviceList').innerHTML = '<p>Unable to load services.</p>';
    });
}
