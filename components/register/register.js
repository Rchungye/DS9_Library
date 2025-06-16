import { hashCode } from '../../utils/utils.js';

const RegisterApp = (() => {
  const elements = {
    form: document.getElementById('registerForm'),
    errorP: document.getElementById('error'),
    successP: document.getElementById('success'),
  };

  const methods = {
    checkSession() {
      if (localStorage.getItem('sessionUser')) {
        window.location.href = '../dashboard/dashboard.html'; // Evita que usuario logueado se registre de nuevo
      }
    },

    validateForm(data) {
      const { username, fullname, password, passwordConfirm } = data;
      if (!username || !fullname || !password || !passwordConfirm) {
        this.showError('Por favor completa todos los campos.');
        return false;
      }
      if (password !== passwordConfirm) {
        this.showError('Las contraseñas no coinciden.');
        return false;
      }
      return true;
    },

    showError(message) {
      elements.errorP.textContent = message;
      elements.successP.textContent = '';
    },

    showSuccess(message) {
      elements.successP.textContent = message;
      elements.errorP.textContent = '';
    },

    userExists(username) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      return usuarios.some(u => u.username === username);
    },

    registerUser(data) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const newUser = {
        username: data.username,
        fullname: data.fullname,
        password: hashCode(data.password) // Encripta contraseña
      };
      usuarios.push(newUser);
      localStorage.setItem('usuarios', JSON.stringify(usuarios)); // Guarda nuevo usuario
    },

    onSubmit(e) {
      e.preventDefault();
      const data = {
        username: elements.form.username.value.trim(),
        fullname: elements.form.fullname.value.trim(),
        password: elements.form.password.value,
        passwordConfirm: elements.form.passwordConfirm.value,
      };
      if (!this.validateForm(data)) return;
      if (this.userExists(data.username)) {
        this.showError('El usuario ya existe.');
        return;
      }
      this.registerUser(data);
      this.showSuccess('Registro exitoso. Redirigiendo...');
      elements.form.reset();
      setTimeout(() => {
        window.location.href = '../login/login.html'; // Redirige tras registro
      }, 1200);
    },

    addListeners() {
      elements.form.addEventListener('submit', this.onSubmit.bind(this));
    }
  };

  const init = () => {
    methods.checkSession();
    methods.addListeners();
  };

  return { init };
})();

RegisterApp.init();
