document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contactForm');
  const button = document.querySelector('#sendRequest');
  const feedback = document.querySelector('#formMessage');

  if (!form || !button) return;

  function openGmailRequest() {
    const data = new FormData(form);
    const nombre = (data.get('nombre') || '').toString().trim();
    const telefono = (data.get('telefono') || '').toString().trim();
    const zona = (data.get('zona') || '').toString().trim();
    const tipo = (data.get('tipo') || '').toString().trim();
    const mensaje = (data.get('mensaje') || '').toString().trim();

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

    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: 'ferranmendezcardona@gmail.com',
      su: subject,
      body
    });

    window.open(`https://mail.google.com/mail/?${params.toString()}`, '_blank', 'noopener,noreferrer');

    if (feedback) {
      feedback.textContent = 'Se ha abierto Gmail con la solicitud preparada. Solo falta pulsar Enviar.';
    }
  }

  button.addEventListener('click', openGmailRequest);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    openGmailRequest();
  });
});
