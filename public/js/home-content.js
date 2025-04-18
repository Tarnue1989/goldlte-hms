// ✅ Set backend API base URL manually
const BASE_URL = 'https://goldlte-hms.onrender.com';

const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };
const langSelect = document.getElementById('langSelect');

let originalSettings = null;

let aboutId = null;

console.log('✅ home-content.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  // Settings
  document.getElementById('btnUploadLogo')?.addEventListener('click', uploadLogo);
  document.getElementById('btnUploadSlides')?.addEventListener('click', uploadSlides);
  document.getElementById('btnSaveSettings')?.addEventListener('click', saveSettings);
  document.getElementById('btnCancelSettings')?.addEventListener('click', cancelSettings);
  document.getElementById('btnAddVideo')?.addEventListener('click', createOrUpdateVideo);
  document.getElementById('btnDeleteSettings')?.addEventListener('click', () => {
    if (!confirm('⚠️ Are you sure you want to delete all system settings?')) return;

    fetch(`${BASE_URL}/api/settings`, {
      method: 'DELETE',
      headers
    })
      .then(res => res.json())
      .then(data => {
        showAlert(data.message || 'Settings deleted.');
        loadSettings(); // Refresh the form view
      })
      .catch(() => showAlert('❌ Failed to delete settings.'));
  });


  // About
  document.getElementById('btnSaveAbout')?.addEventListener('click', handleAboutSubmit);
  document.getElementById('btnCancelAbout')?.addEventListener('click', clearAboutForm);

  // Announcements
  document.getElementById('btnAddAnnouncement')?.addEventListener('click', handleAnnouncementSubmit);
  document.getElementById('btnCancelAnnouncement')?.addEventListener('click', clearAnnouncementForm);

  // Videos
  document.getElementById('btnCancelVideo')?.addEventListener('click', clearVideoForm);

  // Services
  document.getElementById('btnAddService')?.addEventListener('click', handleServiceSubmit);
  document.getElementById('btnCancelService')?.addEventListener('click', clearServiceForm);

  // Locations
  document.getElementById('btnAddLocation')?.addEventListener('click', handleLocationSubmit);
  document.getElementById('btnCancelLocation')?.addEventListener('click', clearLocationForm);

  // Language selector
  langSelect?.addEventListener('change', () => loadAllContent(langSelect.value));

  // Initial load
  loadAllContent(langSelect.value);
});


function cancelSettings() {
  if (!originalSettings) return;

  document.getElementById('hospitalName').value = originalSettings.hospital_name || '';
  document.getElementById('contactPhone').value = originalSettings.contact_phone || '';
  document.getElementById('contactEmail').value = originalSettings.contact_email || '';
  document.getElementById('contactAddress').value = originalSettings.address || '';
  document.getElementById('websiteUrl').value = originalSettings.website_url || '';
  document.getElementById('operatingHours').value = originalSettings.operating_hours || '';
  document.getElementById('primaryColor').value = originalSettings.primary_color || '#003366';

  const cancelBtn = document.getElementById('btnCancelSettings');
  if (cancelBtn) cancelBtn.style.display = 'none';
}


function showAlert(msg) {
  alert(msg);
}

function uploadLogo() {
  const input = document.getElementById('logoInput');
  const file = input.files[0];
  if (!file) return showAlert('Select a logo image.');
  const formData = new FormData();
  formData.append('logo', file);
  fetch(`${BASE_URL}/api/settings/logo`, { method: 'POST', body: formData, headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.json())
    .then(data => {
      const fileName = data.data.logo_path.split('\\').pop();
      document.getElementById('logoPreview').src = `/assets/logos/${fileName}`;
      showAlert('✅ Logo uploaded.');
    })
    .catch(console.error);
}

let editingAnnouncementId = null;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnAddAnnouncement')?.addEventListener('click', handleAnnouncementSubmit);
  document.getElementById('btnCancelAnnouncement')?.addEventListener('click', clearAnnouncementForm);
  loadAnnouncements();
});

function handleAnnouncementSubmit() {
  const content = document.getElementById('announcementText').value.trim();
  if (!content) return showAlert('Write something.');

  if (editingAnnouncementId) {
    updateAnnouncement(editingAnnouncementId, content);
  } else {
    createAnnouncement(content);
  }
}

function createAnnouncement(content) {
  fetch(`${BASE_URL}/api/announcements`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, language: langSelect.value })
  })
    .then(res => res.json())
    .then(() => {
      clearAnnouncementForm();
      loadAnnouncements();
    })
    .catch(() => showAlert('❌ Failed to add announcement.'));
}

function updateAnnouncement(id, content) {
  fetch(`${BASE_URL}/api/announcements/${id}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, language: langSelect.value })
  })
    .then(res => res.json())
    .then(() => {
      clearAnnouncementForm();
      loadAnnouncements();
    })
    .catch(() => showAlert('❌ Failed to update announcement.'));
}

function clearAnnouncementForm() {
  document.getElementById('announcementText').value = '';
  editingAnnouncementId = null;

  const addBtn = document.getElementById('btnAddAnnouncement');
  const cancelBtn = document.getElementById('btnCancelAnnouncement');
  if (addBtn) addBtn.textContent = 'Add Announcement';
  if (cancelBtn) cancelBtn.style.display = 'none';
}

function loadAnnouncements() {
  fetch(`${BASE_URL}/api/announcements?lang=${langSelect.value}`, { headers })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('announcementList');
      const annInput = document.getElementById('announcementText');
      const cancelBtn = document.getElementById('btnCancelAnnouncement');

      list.innerHTML = '';
      if (!Array.isArray(data)) return;

      // 👇 Enable cancel button on input
      if (annInput && cancelBtn) {
        annInput.addEventListener('input', () => {
          if (annInput.value.trim()) {
            cancelBtn.style.display = 'inline-block';
          }
        });
      }

      data.forEach(a => {
        const li = document.createElement('li');

        const textSpan = document.createElement('span');
        textSpan.textContent = a.content;

        const btnWrapper = document.createElement('div');
        btnWrapper.style.display = 'flex';
        btnWrapper.style.gap = '0.5rem';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-small btn-yellow';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => {
          annInput.value = a.content;
          editingAnnouncementId = a.id;

          const addBtn = document.getElementById('btnAddAnnouncement');
          if (addBtn) addBtn.textContent = 'Update Announcement';
          if (cancelBtn) cancelBtn.style.display = 'inline-block';

          annInput.scrollIntoView({ behavior: 'smooth' });
        };

        const delBtn = document.createElement('button');
        delBtn.className = 'btn-small btn-red';
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deleteItem(`/api/announcements/${a.id}`, loadAnnouncements);

        btnWrapper.appendChild(editBtn);
        btnWrapper.appendChild(delBtn);

        li.innerHTML = '';
        li.appendChild(textSpan);
        li.appendChild(btnWrapper);
        list.appendChild(li);
      });
    });
}


function handleAboutSubmit() {
  const content = document.getElementById('aboutText').value.trim();
  if (!content) return showAlert('About content is required.');

  const url = aboutId ? `${BASE_URL}/api/about/${aboutId}` : `${BASE_URL}/api/about`;
  const method = aboutId ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, language: langSelect.value })
  })
    .then(res => res.json())
    .then(() => {
      clearAboutForm();
      loadAbout();
    })
    .catch(() => showAlert('❌ Failed to save about.'));
}

function clearAboutForm() {
  document.getElementById('aboutText').value = '';
  aboutId = null;

  const saveBtn = document.getElementById('btnSaveAbout');
  const cancelBtn = document.getElementById('btnCancelAbout');
  if (saveBtn) saveBtn.textContent = 'Save About Content';
  if (cancelBtn) cancelBtn.style.display = 'none';

  // ✅ Refresh the summary below the form
  loadAbout();
}


function loadAbout() {
  fetch(`${BASE_URL}/api/about?lang=${langSelect.value}`, { headers })
    .then(res => res.json())
    .then(data => {
      const aboutInput = document.getElementById('aboutText');
      const cancelBtn = document.getElementById('btnCancelAbout');

      aboutInput.value = data.content || '';
      aboutId = data.id || null;

      // 👇 Show cancel when typing
      if (aboutInput && cancelBtn) {
        aboutInput.addEventListener('input', () => {
          if (aboutInput.value.trim()) {
            cancelBtn.style.display = 'inline-block';
          }
        });
      }

      const container = document.getElementById('aboutList');
      if (!container) return;

      container.innerHTML = '';

      const entry = document.createElement('div');
      entry.className = 'service-entry';

      const info = document.createElement('div');
      info.style.flex = '1';
      info.style.whiteSpace = 'pre-wrap';
      info.style.lineHeight = '1.5';
      info.innerHTML = `
        <strong>About Summary</strong><br/>
        <small>${data.content || 'No content available.'}</small>
      `;

      const editBtn = document.createElement('button');
      editBtn.className = 'btn-small btn-yellow';
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => {
        aboutInput.value = data.content;
        aboutId = data.id;

        const saveBtn = document.getElementById('btnSaveAbout');
        if (saveBtn) saveBtn.textContent = 'Update About Content';
        if (cancelBtn) cancelBtn.style.display = 'inline-block';
      };

      entry.appendChild(info);
      entry.appendChild(editBtn);
      container.appendChild(entry);
    })
    .catch(() => {
      document.getElementById('aboutText').value = '';
      const container = document.getElementById('aboutList');
      if (container) container.innerHTML = '';
      aboutId = null;
    });
}

function createOrUpdateVideo() {
  const title = document.getElementById('videoTitle').value.trim();
  const video_url = document.getElementById('videoUrl').value.trim();
  const videoFile = document.getElementById('videoFile').files[0]; // 🆕 new field
  const thumb = document.getElementById('videoThumb').files[0];
  const videoId = document.getElementById('videoTitle').dataset.editId;

  if (!title || (!video_url && !videoFile)) {
    return showAlert('Title and either video URL or file is required.');
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('language', langSelect.value);
  formData.append('is_featured', true);

  if (videoFile) {
    formData.append('video_file', videoFile);
  } else {
    formData.append('video_url', video_url); // Fallback if no file selected
  }

  if (thumb) formData.append('video_thumb', thumb);

  const url = videoId ? `${BASE_URL}/api/videos/${videoId}` : `${BASE_URL}/api/videos`;
  const method = videoId ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers,
    body: formData
  }).then(() => {
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoUrl').value = '';
    document.getElementById('videoFile').value = '';
    document.getElementById('videoThumb').value = '';
    delete document.getElementById('videoTitle').dataset.editId;
    loadVideos();
  }).catch(() => showAlert('❌ Failed to save video.'));
}


function saveSettings() {
  const data = {
    hospital_name: document.getElementById('hospitalName').value.trim(),
    contact_phone: document.getElementById('contactPhone').value.trim(),
    contact_email: document.getElementById('contactEmail').value.trim(),
    address: document.getElementById('contactAddress').value.trim(),
    website_url: document.getElementById('websiteUrl').value.trim(),
    operating_hours: document.getElementById('operatingHours').value.trim(),
    primary_color: document.getElementById('primaryColor').value.trim(),
  };

  fetch(`${BASE_URL}/api/settings`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) throw new Error('Save failed');
      return res.json();
    })
    .then(() => {
      showAlert('✅ Settings saved.');
      loadSettings(); // 🔄 reload both form + list
      const cancelBtn = document.getElementById('btnCancelSettings');
      if (cancelBtn) cancelBtn.style.display = 'none';
    })
    .catch(() => showAlert('❌ Error saving settings.'));
}


function loadAllContent(lang) {
  loadLogo();
  loadSlides();
  loadAnnouncements();
  loadAbout();
  loadVideos();
  loadAdminVideos(); // ✅ Add this line!
  loadSettings();
}


function loadLogo() {
  fetch(`${BASE_URL}/api/settings`, { headers })
    .then(res => res.json())
    .then(data => {
      const logoPath = data.logo_path ? data.logo_path.split('\\').pop() : 'logo.png';
      document.getElementById('logoPreview').src = `/assets/logos/${logoPath}`;
    })
    .catch(() => {
      document.getElementById('logoPreview').src = '/assets/logos/logo.png';
    });
}

function loadSlides() {
  fetch(`${BASE_URL}/api/slides?lang=${langSelect.value}`, { headers })
    .then(res => res.json())
    .then(slides => {
      if (!Array.isArray(slides)) return;
      const preview = document.getElementById('slidePreview');
      preview.innerHTML = '';
      slides.forEach(slide => {
        const div = document.createElement('div');
        const img = document.createElement('img');
        img.src = `/assets/slides/${slide.image_path.split('\\').pop()}`;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'btn-small btn-red';
        delBtn.onclick = () => deleteItem(`/api/slides/${slide.id}`, loadSlides);

        div.appendChild(img);
        div.appendChild(delBtn);
        preview.appendChild(div);
      });
    });
}
function uploadSlides() {
  const input = document.getElementById('slideInput');
  const files = Array.from(input.files);
  if (!files.length) return showAlert('Select slide images.');

  files.forEach(file => {
    const formData = new FormData();
    formData.append('slide', file); // ✅ MUST match multer.single('slide')
    formData.append('language', langSelect.value);

    fetch(`${BASE_URL}/api/slides`, {
      method: 'POST',
      headers, // ✅ token is fine here, no content-type needed for FormData
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        input.value = ''; // ✅ clear the input after upload
        loadSlides();
      })
      .catch(() => showAlert('❌ Failed to upload slide.'));
  });
}


function loadVideos() {
  fetch('/api/videos')
    .then(res => res.json())
    .then(videos => {
      const container = document.getElementById('videoContainer');
      container.innerHTML = '';

      const lang = document.getElementById('lang')?.value || 'en';
      const filtered = videos.filter(v => v.language === lang);

      if (filtered.length === 0) {
        container.innerHTML = '<p>No videos available.</p>';
        return;
      }

      filtered.forEach(v => {
        if (!v.video_file && !v.video_url) return;

        const src = v.video_file
          ? `/assets/videos/${v.video_file.split('\\').pop()}`
          : v.video_url;

        // 🧱 Tile wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'video-tile';

        // 🎬 Video player or YouTube
        let media;
        if (src.includes('youtube.com') || src.includes('youtu.be')) {
          media = document.createElement('iframe');
          media.src = src.replace(/(\?|&)autoplay=1/, '');
          media.allow = 'autoplay; encrypted-media';
          media.allowFullscreen = true;
        } else {
          media = document.createElement('video');
          media.src = src;
          media.controls = true;
          media.muted = true;

          // Hover play/pause
          media.addEventListener('mouseenter', () => media.play());
          media.addEventListener('mouseleave', () => {
            media.pause();
            media.currentTime = 0;
          });
        }

        media.style.width = '100%';
        media.style.height = '180px';
        media.style.border = 'none';
        media.style.display = 'block';

        // 🔖 Title under video
        const title = document.createElement('div');
        title.className = 'video-title';
        title.textContent = v.title || 'Untitled Video';

        // Assemble
        wrapper.appendChild(media);
        wrapper.appendChild(title);
        container.appendChild(wrapper);
      });
    })
    .catch(() => {
      document.getElementById('videoContainer').innerHTML =
        '<p>⚠️ Failed to load videos.</p>';
    });
}


function loadAdminVideos() {
  fetch(`${BASE_URL}/api/videos`, { headers })
    .then(res => res.json())
    .then(videos => {
      const list = document.getElementById('videoList');
      list.innerHTML = '';
      const filtered = videos.filter(v => v.language === langSelect.value);

      const titleInput = document.getElementById('videoTitle');
      const urlInput = document.getElementById('videoUrl');
      const cancelBtn = document.getElementById('btnCancelVideo');

      if (titleInput && cancelBtn) {
        titleInput.addEventListener('input', () => {
          if (titleInput.value.trim()) cancelBtn.style.display = 'inline-block';
        });
      }

      if (urlInput && cancelBtn) {
        urlInput.addEventListener('input', () => {
          if (urlInput.value.trim()) cancelBtn.style.display = 'inline-block';
        });
      }

      if (!filtered.length) {
        list.innerHTML = '<p>No videos uploaded.</p>';
        return;
      }

      filtered.forEach(v => {
        const wrapper = document.createElement('div');
        wrapper.className = 'video-tile';

        // 🖼 Thumbnail image
        const thumb = document.createElement('img');
        thumb.className = 'video-thumb-preview';
        thumb.src = v.thumbnail
          ? `/assets/videos/${v.thumbnail.split('\\').pop()}`
          : '/assets/fallbacks/video.png';
        thumb.alt = v.title || 'Video thumbnail';

        // 🎬 Title
        const title = document.createElement('div');
        title.className = 'video-title';
        title.textContent = v.title || 'Untitled Video';

        // 🎯 Button group
        const btnWrapper = document.createElement('div');
        btnWrapper.className = 'video-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-small btn-yellow';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => {
          titleInput.value = v.title;
          urlInput.value = v.video_url || '';
          titleInput.dataset.editId = v.id;

          const addBtn = document.getElementById('btnAddVideo');
          if (addBtn) addBtn.textContent = 'Update Video';
          if (cancelBtn) cancelBtn.style.display = 'inline-block';

          window.scrollTo({ top: titleInput.offsetTop - 100, behavior: 'smooth' });
        };

        const delBtn = document.createElement('button');
        delBtn.className = 'btn-small btn-red';
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deleteItem(`/api/videos/${v.id}`, loadAdminVideos);

        btnWrapper.appendChild(editBtn);
        btnWrapper.appendChild(delBtn);

        // 🧱 Assemble tile
        wrapper.appendChild(thumb);
        wrapper.appendChild(title);
        wrapper.appendChild(btnWrapper);
        list.appendChild(wrapper);
      });
    })
    .catch(() => {
      document.getElementById('videoList').innerHTML = '<p>⚠️ Failed to load videos.</p>';
    });
}

function createOrUpdateVideo() {
  const title = document.getElementById('videoTitle').value.trim();
  const video_url = document.getElementById('videoUrl').value.trim();
  const videoFile = document.getElementById('videoFile').files[0];
  const thumb = document.getElementById('videoThumb').files[0];
  const videoId = document.getElementById('videoTitle').dataset.editId;

  if (!title || (!video_url && !videoFile)) {
    return showAlert('Title and either video URL or file is required.');
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('language', langSelect.value);
  formData.append('is_featured', true);

  if (videoFile) {
    formData.append('video_file', videoFile);
  } else {
    formData.append('video_url', video_url);
  }

  if (thumb) formData.append('video_thumb', thumb);

  const url = videoId ? `${BASE_URL}/api/videos/${videoId}` : `${BASE_URL}/api/videos`;
  const method = videoId ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers,
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      clearVideoForm();
      loadVideos();        // ✅ reload homepage-style preview
      loadAdminVideos();   // ✅ reload admin list view
    })
    .catch(() => showAlert('❌ Failed to save video.'));
}


function clearVideoForm() {
  document.getElementById('videoTitle').value = '';
  document.getElementById('videoUrl').value = '';
  document.getElementById('videoFile').value = '';
  document.getElementById('videoThumb').value = '';
  delete document.getElementById('videoTitle').dataset.editId;

  const addBtn = document.getElementById('btnAddVideo');
  const cancelBtn = document.getElementById('btnCancelVideo');
  if (addBtn) addBtn.textContent = 'Add Video';
  if (cancelBtn) cancelBtn.style.display = 'none';

  // ✅ Also reload admin list to reflect current state
  loadAdminVideos();
}


function loadSettings() {
  fetch(`${BASE_URL}/api/settings`, { headers })
    .then(res => res.json())
    .then(data => {
      originalSettings = data;

      // Fill form fields
      document.getElementById('hospitalName').value = data.hospital_name || '';
      document.getElementById('contactPhone').value = data.contact_phone || '';
      document.getElementById('contactEmail').value = data.contact_email || '';
      document.getElementById('contactAddress').value = data.address || '';
      document.getElementById('websiteUrl').value = data.website_url || '';
      document.getElementById('operatingHours').value = data.operating_hours || '';
      document.getElementById('primaryColor').value = data.primary_color || '#003366';

      // Hide cancel button initially
      const cancelBtn = document.getElementById('btnCancelSettings');
      if (cancelBtn) cancelBtn.style.display = 'none';

      // Show cancel if anything changes
      ['hospitalName', 'contactPhone', 'contactEmail', 'contactAddress', 'websiteUrl', 'operatingHours', 'primaryColor']
        .forEach(id => {
          const input = document.getElementById(id);
          if (input) {
            input.addEventListener('input', () => {
              document.getElementById('btnCancelSettings').style.display = 'inline-block';
            });
          }
        });

      // ✅ Also show summary section below the form
      const container = document.getElementById('settingsList');
      if (container) {
        container.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'service-entry';

        const info = document.createElement('div');
        info.style.flex = '1';
        info.innerHTML = `
          <strong>${data.hospital_name || 'Hospital Name'}</strong><br/>
          <small>${data.contact_email || 'Email'}</small> | 
          <small>${data.contact_phone || 'Phone'}</small><br/>
          <small>${data.address || 'Address'}</small><br/>
          <small>Website: ${data.website_url || 'N/A'} | Hours: ${data.operating_hours || 'N/A'}</small><br/>
          <small>Primary Color: ${data.primary_color || '#003366'}</small>
        `;

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-small btn-yellow';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => {
          document.getElementById('hospitalName').value = data.hospital_name || '';
          document.getElementById('contactPhone').value = data.contact_phone || '';
          document.getElementById('contactEmail').value = data.contact_email || '';
          document.getElementById('contactAddress').value = data.address || '';
          document.getElementById('websiteUrl').value = data.website_url || '';
          document.getElementById('operatingHours').value = data.operating_hours || '';
          document.getElementById('primaryColor').value = data.primary_color || '#003366';

          const cancelBtn = document.getElementById('btnCancelSettings');
          if (cancelBtn) cancelBtn.style.display = 'inline-block';

          // Scroll to top of settings form
          window.scrollTo({ top: document.getElementById('hospitalName').offsetTop - 100, behavior: 'smooth' });
        };

        div.appendChild(info);
        div.appendChild(editBtn);
        container.appendChild(div);
      }
    });
}

function deleteItem(url, reloadCallback) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  fetch(`${BASE_URL}${url}`, { method: 'DELETE', headers })
    .then(() => reloadCallback())
    .catch(() => showAlert('❌ Failed to delete.'));
}

let editingServiceId = null;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnAddService')?.addEventListener('click', handleServiceSubmit);
  document.getElementById('btnCancelService')?.addEventListener('click', clearServiceForm);
  loadServices();
});

function handleServiceSubmit() {
  if (editingServiceId) {
    updateService(editingServiceId);
  } else {
    createService();
  }
}

function createService() {
  const title = document.getElementById('serviceTitle').value.trim();
  const description = document.getElementById('serviceDescription').value.trim();
  const icon = document.getElementById('serviceIcon').files[0];

  if (!title || !description) {
    return showAlert('Title and description are required.');
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('language', langSelect.value);
  if (icon) formData.append('service_icon', icon); // Optional icon

  fetch(`${BASE_URL}/api/services`, {
    method: 'POST',
    headers,
    body: formData,
  })
    .then(res => res.json())
    .then(() => {
      clearServiceForm();
      loadServices();
    })
    .catch(() => showAlert('❌ Failed to add service.'));
}

function updateService(id) {
  const title = document.getElementById('serviceTitle').value.trim();
  const description = document.getElementById('serviceDescription').value.trim();
  const icon = document.getElementById('serviceIcon').files[0];

  if (!title || !description) {
    return showAlert('Title and Description are required.');
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('language', langSelect.value);
  if (icon) formData.append('service_icon', icon);

  fetch(`${BASE_URL}/api/services/${id}`, {
    method: 'PUT',
    headers,
    body: formData,
  })
    .then(res => res.json())
    .then(() => {
      clearServiceForm();
      loadServices();
    })
    .catch(() => showAlert('❌ Failed to update service.'));
}

function clearServiceForm() {
  document.getElementById('serviceTitle').value = '';
  document.getElementById('serviceDescription').value = '';
  document.getElementById('serviceIcon').value = '';
  editingServiceId = null;

  const addBtn = document.getElementById('btnAddService');
  const cancelBtn = document.getElementById('btnCancelService');
  if (addBtn) addBtn.textContent = 'Add Service';
  if (cancelBtn) cancelBtn.style.display = 'none';
}

function loadServices() {
  fetch(`${BASE_URL}/api/services`, { headers })
    .then(res => res.json())
    .then(services => {
      const list = document.getElementById('serviceList');
      list.innerHTML = '';

      const titleInput = document.getElementById('serviceTitle');
      const descInput = document.getElementById('serviceDescription');
      const cancelBtn = document.getElementById('btnCancelService');

      if (titleInput && cancelBtn) {
        titleInput.addEventListener('input', () => {
          if (titleInput.value.trim()) {
            cancelBtn.style.display = 'inline-block';
          }
        });
      }

      if (descInput && cancelBtn) {
        descInput.addEventListener('input', () => {
          if (descInput.value.trim()) {
            cancelBtn.style.display = 'inline-block';
          }
        });
      }

      services
        .filter(s => s.language === langSelect.value)
        .forEach(service => {
          const div = document.createElement('div');
          div.className = 'service-entry';

          const iconSrc = service.icon
            ? `/assets/services/${service.icon.split('\\').pop()}`
            : '/assets/fallbacks/service.png';

          const img = document.createElement('img');
          img.className = 'service-icon';
          img.src = iconSrc;

          const infoDiv = document.createElement('div');
          infoDiv.style.flex = '1';
          infoDiv.innerHTML = `
            <strong>${service.title}</strong><br/>
            <small>${service.description}</small>
          `;

          const btnWrapper = document.createElement('div');
          btnWrapper.style.display = 'flex';
          btnWrapper.style.gap = '0.5rem';

          const editBtn = document.createElement('button');
          editBtn.className = 'btn-small btn-yellow';
          editBtn.textContent = 'Edit';
          editBtn.onclick = () => {
            titleInput.value = service.title;
            descInput.value = service.description;
            editingServiceId = service.id;

            const addBtn = document.getElementById('btnAddService');
            if (addBtn) addBtn.textContent = 'Update Service';
            if (cancelBtn) cancelBtn.style.display = 'inline-block';
          };

          const delBtn = document.createElement('button');
          delBtn.className = 'btn-small btn-red';
          delBtn.textContent = 'Delete';
          delBtn.onclick = () => deleteItem(`/api/services/${service.id}`, loadServices);

          btnWrapper.appendChild(editBtn);
          btnWrapper.appendChild(delBtn);

          div.appendChild(img);
          div.appendChild(infoDiv);
          div.appendChild(btnWrapper);

          list.appendChild(div);
        });
    });
}



document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnAddLocation')?.addEventListener('click', handleLocationSubmit);
  document.getElementById('btnCancelLocation')?.addEventListener('click', clearLocationForm);
  loadLocations();
});

function handleLocationSubmit() {
  if (editingLocationId) {
    updateLocation(editingLocationId);
  } else {
    createLocation();
  }
}

function createLocation() {
  const payload = getLocationFormData();
  if (!payload) return;

  fetch(`${BASE_URL}/api/locations`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
    .then(() => {
      clearLocationForm();
      loadLocations();
    })
    .catch(() => showAlert('❌ Failed to add location.'));
}

function updateLocation(id) {
  const payload = getLocationFormData();
  if (!payload) return;

  fetch(`${BASE_URL}/api/locations/${id}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
    .then(() => {
      clearLocationForm();
      loadLocations();
    })
    .catch(() => showAlert('❌ Failed to update location.'));
}

function getLocationFormData() {
  const name = document.getElementById('locationName').value.trim();
  const address = document.getElementById('locationAddress').value.trim();
  const latitude = document.getElementById('locationLat').value.trim();
  const longitude = document.getElementById('locationLng').value.trim();

  if (!name || !address || !latitude || !longitude) {
    showAlert('Fill in all location fields.');
    return null;
  }

  return { name, address, latitude, longitude };
}

function clearLocationForm() {
  document.getElementById('locationName').value = '';
  document.getElementById('locationAddress').value = '';
  document.getElementById('locationLat').value = '';
  document.getElementById('locationLng').value = '';
  editingLocationId = null;

  const addBtn = document.getElementById('btnAddLocation');
  const cancelBtn = document.getElementById('btnCancelLocation');
  if (addBtn) addBtn.textContent = 'Add Location';
  if (cancelBtn) cancelBtn.style.display = 'none';
}

function loadLocations() {
  fetch(`${BASE_URL}/api/locations`, { headers })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('locationList');
      container.innerHTML = '';
      if (!Array.isArray(data)) return;

      const nameInput = document.getElementById('locationName');
      const addressInput = document.getElementById('locationAddress');
      const latInput = document.getElementById('locationLat');
      const lngInput = document.getElementById('locationLng');
      const cancelBtn = document.getElementById('btnCancelLocation');

      // 🛠 Show cancel button when typing
      [nameInput, addressInput, latInput, lngInput].forEach(input => {
        if (input && cancelBtn) {
          input.addEventListener('input', () => {
            if (input.value.trim()) {
              cancelBtn.style.display = 'inline-block';
            }
          });
        }
      });

      data.forEach(loc => {
        const div = document.createElement('div');
        div.className = 'service-entry';
        div.innerHTML = `
          <div style="flex:1;">
            <strong>${loc.name}</strong><br/>
            <small>${loc.address}</small><br/>
            <small>Lat: ${loc.latitude}, Lng: ${loc.longitude}</small>
          </div>
        `;

        const delBtn = document.createElement('button');
        delBtn.className = 'btn-small btn-red';
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deleteItem(`/api/locations/${loc.id}`, loadLocations);

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-small btn-yellow';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => {
          nameInput.value = loc.name;
          addressInput.value = loc.address;
          latInput.value = loc.latitude;
          lngInput.value = loc.longitude;
          editingLocationId = loc.id;

          const addBtn = document.getElementById('btnAddLocation');
          if (addBtn) addBtn.textContent = 'Update Location';
          if (cancelBtn) cancelBtn.style.display = 'inline-block';
        };

        div.appendChild(editBtn);
        div.appendChild(delBtn);
        container.appendChild(div);
      });
    });
}
