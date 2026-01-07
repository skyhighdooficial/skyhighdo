// Main JS for SkyHigh
(() => {
  const jetsContainer = document.getElementById('jets');
  const detailsBackdrop = document.getElementById('detailsBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalDesc = document.getElementById('modalDesc');
  const modalSpecs = document.getElementById('modalSpecs');
  const reserveForm = document.getElementById('reserveForm');
  const resName = document.getElementById('resName');
  const resDate = document.getElementById('resDate');
  const closeModal = document.getElementById('closeModal');

  const adminPanel = document.getElementById('adminPanel');
  const reservationsList = document.getElementById('reservationsList');
  const clearAllBtn = document.getElementById('clearAll');

  let jets = [];
  let currentJet = null;

  // Load jets from assets/jets.json
  function loadJets() {
    fetch('assets/jets.json')
      .then(r => r.json())
      .then(data => {
        jets = data;
        renderJets();
      })
      .catch(err => {
        console.error('Failed loading jets', err);
        jetsContainer.innerHTML = '<p>Unable to load jets data.</p>';
      });
  }

  function renderJets() {
    jetsContainer.innerHTML = '';
    jets.forEach(j => {
      const card = document.createElement('article');
      card.className = 'card';
      card.tabIndex = 0;
      card.innerHTML = `
        <img src="${j.image}" alt="${j.name}">
        <h3>${j.name}</h3>
        <p class="meta">${j.capacity} passengers · ${j.range} range · $${j.price}/hr</p>
      `;
      card.addEventListener('click', () => openDetails(j));
      card.addEventListener('keypress', (e) => { if (e.key === 'Enter') openDetails(j); });
      jetsContainer.appendChild(card);
    });
  }

  // Details modal
  function openDetails(jet) {
    currentJet = jet;
    modalTitle.textContent = jet.name;
    modalImage.src = jet.image || '';
    modalImage.alt = jet.name;
    modalDesc.textContent = jet.description || '';
    modalSpecs.textContent = `${jet.capacity} pax · ${jet.speed} · ${jet.range} range · $${jet.price}/hr`;
    resName.value = '';
    resDate.value = '';
    detailsBackdrop.style.display = 'flex';
  }

  function closeDetails() {
    detailsBackdrop.style.display = 'none';
    currentJet = null;
  }

  closeModal.addEventListener('click', closeDetails);
  document.getElementById('cancelReserve').addEventListener('click', closeDetails);
  detailsBackdrop.addEventListener('click', (e) => { if (e.target === detailsBackdrop) closeDetails(); });

  reserveForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentJet) return;
    const name = resName.value.trim();
    const date = resDate.value;
    if (!name || !date) return alert('Please provide your name and a date.');

    const reservation = {
      id: `r_${Date.now()}`,
      jetId: currentJet.id,
      jetName: currentJet.name,
      name,
      date,
      createdAt: new Date().toISOString()
    };
    saveReservation(reservation);
    alert('Reservation saved locally.');
    closeDetails();
    if (adminPanel.style.display === 'block') renderReservations();
  });

  // LocalStorage helpers
  const STORAGE_KEY = 'skyhigh_reservations';

  function readReservations() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed parsing reservations', e);
      return [];
    }
  }

  function saveReservation(res) {
    const all = readReservations();
    all.push(res);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function deleteReservation(id) {
    const all = readReservations().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function clearAllReservations() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Admin panel
  function toggleAdmin() {
    const isOpen = adminPanel.style.display === 'block';
    adminPanel.style.display = isOpen ? 'none' : 'block';
    adminPanel.setAttribute('aria-hidden', String(isOpen));
    if (!isOpen) renderReservations();
  }

  function renderReservations() {
    const items = readReservations();
    if (!items.length) {
      reservationsList.innerHTML = '<p class="small">No reservations yet.</p>';
      return;
    }
    reservationsList.innerHTML = '';
    items.forEach(r => {
      const el = document.createElement('div');
      el.className = 'reservation';
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong>${r.jetName}</strong>
            <div class="small">${r.name} — ${r.date}</div>
            <div class="small">Created: ${new Date(r.createdAt).toLocaleString()}</div>
          </div>
          <div style="text-align:right">
            <button data-id="${r.id}" class="btn secondary btn-delete">Delete</button>
          </div>
        </div>
      `;
      reservationsList.appendChild(el);
    });

    document.querySelectorAll('.btn-delete').forEach(b => {
      b.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (!confirm('Delete this reservation?')) return;
        deleteReservation(id);
        renderReservations();
      });
    });
  }

  clearAllBtn.addEventListener('click', () => {
    if (!confirm('Clear all reservations?')) return;
    clearAllReservations();
    renderReservations();
  });

  // Triple-click to open admin — use event.detail
  document.addEventListener('click', (e) => {
    if (e.detail === 3) toggleAdmin();
  });

  // Init
  loadJets();
})();
