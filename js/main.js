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

    const mailto = `mailto:ferranmendezcardona@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (feedback) feedback.textContent = 'Se abrirá tu aplicación de correo con la solicitud preparada.';
    window.location.href = mailto;
  });
});
