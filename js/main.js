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

  // Protección extra: evita que el formulario se enganche dos veces si el navegador
  // carga el script repetido o si queda una versión antigua en caché.
  if (form.dataset.jjSubmitBound === 'true' || window.__JJ_AUTONIVELANTES_FORM_BOUND__) return;
  form.dataset.jjSubmitBound = 'true';
  window.__JJ_AUTONIVELANTES_FORM_BOUND__ = true;

  const destinationEmail = 'jjautonivelantes@gmail.com';
  let isSending = false;
  let lastSentSignature = '';
  let lastSentAt = 0;

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
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }
    }

    if (isSending || button.disabled) return;

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

    const signature = JSON.stringify({ nombre, telefono, email, preferencia, zona, tipo, mensaje });
    const now = Date.now();

    if (signature === lastSentSignature && now - lastSentAt < 30000) {
      setMessage('La solicitud ya se ha enviado. Espera unos segundos antes de mandar otra.', 'success');
      return;
    }

    isSending = true;
    lastSentSignature = signature;
    lastSentAt = now;
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Enviando...';
    setMessage('Enviando solicitud...', '');

    const payload = new URLSearchParams();
    payload.append('_subject', `Solicitud de presupuesto - ${nombre}`);
    payload.append('_template', 'table');
    payload.append('_captcha', 'false');
    payload.append('_replyto', email || destinationEmail);
    payload.append('Nombre', nombre);
    payload.append('Teléfono', telefono || 'No indicado');
    payload.append('Email', email || 'No indicado');
    payload.append('Preferencia de contacto', preferencia);
    payload.append('Zona de la obra', zona || 'No indicado');
    payload.append('Tipo de trabajo', tipo);
    payload.append('Detalles', mensaje || 'No indicado');
    payload.append('Origen', window.location.href);

    try {
      // Importante: NO se usa JSON para evitar una petición previa CORS OPTIONS.
      // Así FormSubmit recibe una sola petición POST y no duplica solicitudes.
      const response = await fetch(`https://formsubmit.co/ajax/${destinationEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Accept': 'application/json'
        },
        body: payload.toString(),
        cache: 'no-store'
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false || result.success === 'false') {
        throw new Error(result.message || 'No se pudo enviar la solicitud.');
      }

      form.reset();
      setMessage('Solicitud enviada correctamente. Te contactaremos lo antes posible.', 'success');
    } catch (error) {
      setMessage('No se ha podido enviar automáticamente. Escríbenos a jjautonivelantes@gmail.com.', 'error');
      isSending = false;
      button.disabled = false;
      button.textContent = originalText;
      return;
    }

    setTimeout(() => {
      isSending = false;
      button.disabled = false;
      button.textContent = originalText;
    }, 3000);
  }

  form.addEventListener('submit', sendDirectRequest, { capture: true });
});
