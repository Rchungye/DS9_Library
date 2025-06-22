import { hashCode } from '../../utils/utils.js';

// Lógica del login: valida usuario y contraseña, guarda sesión y redirige
(() => {
  const App = {
    elementos: {
      form: document.getElementById('loginForm'),
      errorP: document.getElementById('error'),
    },

    init() {
      // Si ya hay sesión activa, redirige
      if (localStorage.getItem('sessionUser')) {
        window.location.href = '../dashboard/dashboard.html';
        return;
      }

      // Escucha envío del formulario
      this.elementos.form.addEventListener('submit', this.handleSubmit.bind(this));
    },

    handleSubmit(e) {
      e.preventDefault();

      // Captura datos del formulario
      const username = this.elementos.form.username.value.trim();
      const password = this.elementos.form.password.value;

      // Busca el usuario en localStorage
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const user = usuarios.find(u => u.username === username);

      const errorMsg = 'Usuario y/o contraseña incorrectos.';

      // Valida usuario y contraseña hasheada
      if (!user || user.password !== hashCode(password)) {
        this.elementos.errorP.textContent = errorMsg;
        return;
      }

      // Guarda sesión y redirige al dashboard
      localStorage.setItem('sessionUser', username);
      window.location.href = '../dashboard/dashboard.html';
    }
  };

  App.init();
})();