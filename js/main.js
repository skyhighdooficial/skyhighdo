// Funcionalidad de botones flotantes y modal (vanilla JS)

document.addEventListener('DOMContentLoaded', function(){
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Floating WhatsApp behavior
  const fab = document.getElementById('fabWhats');
  const list = document.getElementById('whatsList');
  let open = false;

  fab.addEventListener('click', function(e){
    open = !open;
    list.style.display = open ? 'block' : 'none';
    fab.setAttribute('aria-expanded', String(open));
    list.setAttribute('aria-hidden', String(!open));
  });

  // When a number is clicked, open wa.me with prefilled text
  document.querySelectorAll('#whatsList button').forEach(btn=>{
    btn.addEventListener('click', function(){
      const number = this.dataset.number;
      const text = this.dataset.text || 'Hola';
      const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener');
      // close dropdown
      list.style.display = 'none';
      open = false;
      fab.setAttribute('aria-expanded','false');
    });
  });

  // Reserve button -> opens wa.me with booking message (primary)
  const reserveBtn = document.getElementById('reserveBtn');
  reserveBtn.addEventListener('click', function(){
    const number = '14323161990';
    const text = 'Hola, Skyhighdo. Estoy interesado en reservar un vuelo. ¿Podrían darme más información?';
    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });

  // Modal handlers
  const loginBtn = document.getElementById('loginBtn');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  loginBtn.addEventListener('click', ()=>openModal());
  modalClose.addEventListener('click', ()=>closeModal());
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });

  function openModal(){
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
  }

  // Accessibility: close dropdown when click outside
  document.addEventListener('click', (e)=>{
    if(!e.target.closest('.whatsapp')){
      list.style.display = 'none';
      open = false;
      fab.setAttribute('aria-expanded','false');
    }
  });

});
