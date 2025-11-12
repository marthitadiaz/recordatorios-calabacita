document.addEventListener('DOMContentLoaded', () => {
  const chihuahua = document.querySelector('.chihuahua');
  const heartsContainer = document.querySelector('.hearts');
  const bubble = document.querySelector('.bubble');

  // Lista de mensajes (puedes agregar más)
  const mensajes = [
    "Hoy me toca mi vacuna 😖",
    "¡No olvides comprarme comida! 🍖",
    "Hora de jugar conmigo ❤️",
    "Acuérdate de darme agua 💧",
    "Vamos a pasear hoy 🌳"
  ];

  let indiceMensaje = 0;

  // Click en la mascota → cambia mensaje y genera corazones
  chihuahua.addEventListener('click', () => {
    // Cambiar mensaje
    bubble.textContent = mensajes[indiceMensaje];
    indiceMensaje = (indiceMensaje + 1) % mensajes.length;

    // Crear corazón flotante lateral
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = (Math.random() * 200 - 100) + 'px'; // posición aleatoria
    heartsContainer.appendChild(heart);

    setTimeout(() => heartsContainer.removeChild(heart), 3000);
  });
});
