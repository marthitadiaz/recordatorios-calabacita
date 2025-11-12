document.addEventListener('DOMContentLoaded', () => {
  const chihuahua = document.querySelector('.chihuahua');
  const heartsContainer = document.querySelector('.hearts');
  const bubble = document.querySelector('.bubble');

  // Lista de mensajes (puedes agregar más)
  const mensajes = [
    "Hoy me toca mi vacuna 😖",
    "¡No olvidés comprarme comida! 🍖",
    "Hora de jugar conmigo 💓",
    "Acordate de darme agua 💧",
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

// ---------- Configuración del calendario (flatpickr) ----------
document.addEventListener('DOMContentLoaded', () => {
  // Elementos UI
  const openBtn = document.getElementById('openCalendarBtn');
  const modal = document.getElementById('calendarModal');
  const closeModal = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelReminder');
  const saveBtn = document.getElementById('saveReminder');
  const textInput = document.getElementById('reminderText');
  const datetimeInput = document.getElementById('reminderDatetime');
  const remindersUl = document.getElementById('remindersUl');
  const remindersKey = 'kawaii_reminders_v1';

  // Inicia flatpickr con selector de fecha y hora
  flatpickr(datetimeInput, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today"
  });

  // Mostrar modal
  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });
  closeModal.addEventListener('click', () => modal.classList.add('hidden'));
  cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

  // pedir permiso de notificaciones si no tenemos
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  // Leer/guardar recordatorios en localStorage
  function loadReminders() {
    const raw = localStorage.getItem(remindersKey);
    return raw ? JSON.parse(raw) : [];
  }
  function saveReminders(list) {
    localStorage.setItem(remindersKey, JSON.stringify(list));
  }

  // Render lista
  function renderReminders() {
    const list = loadReminders().sort((a,b)=> new Date(a.datetime) - new Date(b.datetime));
    remindersUl.innerHTML = '';
    list.forEach((r, idx) => {
      const li = document.createElement('li');
      const left = document.createElement('div');
      left.innerHTML = `<strong>${r.text}</strong><div class="date">${new Date(r.datetime).toLocaleString()}</div>`;
      const removeBtn = document.createElement('button');
      removeBtn.className = 'reminder-remove';
      removeBtn.textContent = 'Eliminar';
      removeBtn.addEventListener('click', () => {
        list.splice(idx,1);
        saveReminders(list);
        renderReminders();
      });
      li.appendChild(left);
      li.appendChild(removeBtn);
      remindersUl.appendChild(li);
    });
  }

  // Guardar nuevo recordatorio
  saveBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    const datetime = datetimeInput.value.trim();
    if (!text || !datetime) {
      alert('Completa mensaje y fecha/hora');
      return;
    }
    const list = loadReminders();
    list.push({ text, datetime });
    saveReminders(list);
    renderReminders();
    modal.classList.add('hidden');
    textInput.value = '';
    datetimeInput.value = '';
  });

  // Chequeador: cada 30s revisa recordatorios pendientes y dispara notifs
  function checkReminders() {
    const now = new Date();
    const list = loadReminders();
    const remaining = [];
    for (const r of list) {
      const d = new Date(r.datetime);
      // si la hora ya llegó o pasó por menos de 60s
      if (d <= now && (now - d) < 1000 * 60 * 60 * 24) { // llega si ya pasó (diferencia < 24h)
        // dispara notificación (si permitido) o burbuja
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Calabacita 💛', { body: r.text, icon: 'calabacita-icon.png' });
        } else {
          // fallback: burbuja en la página (usa la .bubble existente)
          const bubble = document.querySelector('.bubble');
          if (bubble) {
            bubble.textContent = r.text;
            bubble.style.opacity = 1;
            setTimeout(()=>bubble.style.opacity = 0, 5000);
          } else {
            alert(r.text);
          }
        }
      } else {
        // aún no llegó
        remaining.push(r);
      }
    }
    // si no quieres eliminar recordatorios una vez disparados, quita esta línea:
    saveReminders(remaining);
    renderReminders();
  }

  // inicial
  renderReminders();
  // check inmediato + cada 30s
  checkReminders();
  setInterval(checkReminders, 30 * 1000);
});

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registrado ✅', reg))
      .catch(err => console.log('Error al registrar el Service Worker ❌', err));
  });
}

