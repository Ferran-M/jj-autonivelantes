document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainMenu = document.querySelector('#mainMenu');

  if (nav && menuToggle && mainMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    mainMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
      });
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target)) {
        nav.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
      }
    });
  }

  const form = document.querySelector('#contactForm');
  const button = document.querySelector('#sendRequest');
  const feedback = document.querySelector('#formMessage');

  if (!form || !button) return;

  let opening = false;

  function setMessage(text) {
    if (feedback) feedback.textContent = text;
  }

  function openGmailRequest(event) {
    if (event) event.preventDefault();
    if (opening) return;

    const data = new FormData(form);
    const nombre = (data.get('nombre') || '').toString().trim();
    const telefono = (data.get('telefono') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const preferencia = (data.get('preferencia') || '').toString().trim();
    const zona = (data.get('zona') || '').toString().trim();
    const tipo = (data.get('tipo') || '').toString().trim();
    const mensaje = (data.get('mensaje') || '').toString().trim();

    if (!nombre || !preferencia || !tipo) {
      setMessage('Rellena nombre, preferencia de contacto y tipo de trabajo.');
      return;
    }

    if (preferencia === 'Teléfono' && !telefono) {
      setMessage('Indica un teléfono si prefieres que te contacten por teléfono.');
      return;
    }

    if (preferencia === 'Correo electrónico' && !email) {
      setMessage('Indica un correo electrónico si prefieres que te contacten por email.');
      return;
    }

    opening = true;
    setTimeout(() => { opening = false; }, 1000);

    const subject = `Solicitud de presupuesto - ${nombre}`;
    const body = [
      'Nueva solicitud de presupuesto desde la web:',
      '',
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono || 'No indicado'}`,
      `Correo electrónico: ${email || 'No indicado'}`,
      `Preferencia de contacto: ${preferencia}`,
      `Zona de la obra: ${zona || 'No indicado'}`,
      `Tipo de trabajo: ${tipo}`,
      '',
      'Detalles:',
      mensaje || 'No indicado'
    ].join('\n');

    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: 'ferranmendezcardona@gmail.com',
      su: subject,
      body
    });

    window.open(`https://mail.google.com/mail/?${params.toString()}`, '_blank', 'noopener,noreferrer');

    setMessage('Se ha abierto Gmail con la solicitud preparada. Solo falta pulsar Enviar.');
  }

  button.addEventListener('click', openGmailRequest);
  form.addEventListener('submit', openGmailRequest);
});
