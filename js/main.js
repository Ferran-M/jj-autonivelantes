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

  const destinationEmail = 'ferranmendezcardona@gmail.com';
  let isSending = false;

  function setMessage(text, type = '') {
    if (!feedback) return;
    feedback.textContent = text;
    feedback.classList.remove('success', 'error');
    if (type) feedback.classList.add(type);
  }

  function getCleanValue(data, field) {
    return (data.get(field) || '').toString().trim();
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function sendDirectRequest(event) {
    if (event) event.preventDefault();
    if (isSending) return;

    const data = new FormData(form);
    const nombre = getCleanValue(data, 'nombre');
    const telefono = getCleanValue(data, 'telefono');
    const email = getCleanValue(data, 'email');
    const preferencia = getCleanValue(data, 'preferencia');
    const zona = getCleanValue(data, 'zona');
    const tipo = getCleanValue(data, 'tipo');
    const mensaje = getCleanValue(data, 'mensaje');

    if (!nombre || !preferencia || !tipo) {
      setMessage('Rellena nombre, preferencia de contacto y tipo de trabajo.', 'error');
      return;
    }

    if (preferencia === 'Teléfono' && !telefono) {
      setMessage('Indica un teléfono si prefieres que te contacten por teléfono.', 'error');
      return;
    }

    if (preferencia === 'Correo electrónico') {
      if (!email) {
        setMessage('Indica un correo electrónico si prefieres que te contacten por email.', 'error');
        return;
      }
      if (!validateEmail(email)) {
        setMessage('Escribe un correo electrónico válido.', 'error');
        return;
      }
    }

    if (email && !validateEmail(email)) {
      setMessage('Escribe un correo electrónico válido o deja el campo vacío.', 'error');
      return;
    }

    const payload = {
      _subject: `Solicitud de presupuesto - ${nombre}`,
      _template: 'table',
      _captcha: 'false',
      _replyto: email || destinationEmail,
      email: email || destinationEmail,
      Nombre: nombre,
      Telefono: telefono || 'No indicado',
      Email: email || 'No indicado',
      'Preferencia de contacto': preferencia,
      'Zona de la obra': zona || 'No indicado',
      'Tipo de trabajo': tipo,
      Detalles: mensaje || 'No indicado',
      Origen: window.location.href
    };

    isSending = true;
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Enviando...';
    setMessage('Enviando solicitud...', '');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${destinationEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false || result.success === 'false') {
        throw new Error(result.message || 'No se pudo enviar la solicitud.');
      }

      form.reset();
      setMessage('Solicitud enviada correctamente. Te contactaremos lo antes posible.', 'success');
    } catch (error) {
      setMessage('No se ha podido enviar automáticamente. Escríbenos a ferranmendezcardona@gmail.com.', 'error');
    } finally {
      isSending = false;
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  form.addEventListener('submit', sendDirectRequest);
  button.addEventListener('click', sendDirectRequest);
});
