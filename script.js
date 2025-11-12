document.addEventListener('DOMContentLoaded', () => {
  const chihuahua = document.querySelector('.chihuahua');
  const heartsContainer = document.querySelector('.hearts');
  const bubble = document.querySelector('.bubble');

  // 🌼 Tus mensajes originales
  const mensajes = [
    "Hoy me toca mi vacuna 😖",
    "¡No olvidés comprarme comida! 🍖",
    "Hora de jugar conmigo 💓",
    "Acordate de darme agua 💧",
    "Vamos a pasear hoy 🌳"
  ];

  let indiceMensaje = 0;

  // 💕 Clic en la mascota → cambia mensaje y lanza corazones
  chihuahua.addEventListener('click', () => {
    // Cambiar mensaje
    bubble.textContent = mensajes[indiceMensaje];
    indiceMensaje = (indiceMensaje + 1) % mensajes.length;

    // Crear corazón flotante
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = '💖';
    heart.style.left = (Math.random() * 200 - 100) + 'px';
    heartsContainer.appendChild(heart);

    setTimeout(() => heartsContainer.removeChild(heart), 3000);
  });
});
