document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contactForm');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const nombre = (data.get('nombre') || '').toString().trim();
    const telefono = (data.get('telefono') || '').toString().trim();
    const zona = (data.get('zona') || '').toString().trim();
    const tipo = (data.get('tipo') || '').toString().trim();
    const mensaje = (data.get('mensaje') || '').toString().trim();
    const feedback = document.querySelector('#formMessage');

    if (!nombre || !telefono || !tipo) {
      if (feedback) feedback.textContent = 'Rellena nombre, teléfono y tipo de trabajo.';
      return;
    }

    const subject = `Solicitud de presupuesto - ${nombre}`;
    const body = [
      'Nueva solicitud de presupuesto desde la web:',
      '',
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      `Zona de la obra: ${zona || 'No indicado'}`,
      `Tipo de trabajo: ${tipo}`,
      '',
      'Detalles:',
      mensaje || 'No indicado'
    ].join('\n');

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent('ferranmendezcardona@gmail.com')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const gmailWindow = window.open(gmailUrl, 'gmailSolicitudJjAutonivelantes');

    if (gmailWindow) {
      gmailWindow.opener = null;
      gmailWindow.focus();
      if (feedback) feedback.textContent = 'Se ha abierto Gmail con la solicitud preparada. Solo falta pulsar Enviar.';
    } else if (feedback) {
      feedback.textContent = 'El navegador ha bloqueado la pestaña de Gmail. Permite ventanas emergentes para esta web e inténtalo de nuevo.';
    }
  });
});
