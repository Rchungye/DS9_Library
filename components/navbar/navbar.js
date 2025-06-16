// navbar.js
import { validateSession } from '../../utils/utils.js';

const NavbarApp = (() => {
  const elementos = {
    container: null,
    navbar: null,
    btnDashboard: null,
    btnStatistics: null,
    btnProfile: null,
    btnLogout: null,
  };

  function validate() {
    validateSession();
  }

  function loadNavbar(containerId) {
    elementos.container = document.getElementById(containerId);
    if (!elementos.container) return;

    fetch('../navbar/navbar.html')
      .then(res => res.text())
      .then(html => {
        elementos.container.innerHTML = html;
        elementos.navbar = elementos.container.querySelector('.navbar');
        cacheElements();
        setupEvents();
        showWelcome();
      })
      .catch(console.error);
  }

  function cacheElements() {
    if (!elementos.navbar) return;

    elementos.btnDashboard = elementos.navbar.querySelector('#nav-dashboard');
    elementos.btnStatistics = elementos.navbar.querySelector('#nav-statistics');
    elementos.btnProfile = elementos.navbar.querySelector('#nav-profile');
    elementos.btnLogout = elementos.navbar.querySelector('#logoutBtn');
  }

  function setupEvents() {
    elementos.btnDashboard?.addEventListener('click', () => {
      window.location.href = '../dashboard/dashboard.html';
    });

    elementos.btnStatistics?.addEventListener('click', () => {
      window.location.href = '../statistics/statistics.html';
    });

    elementos.btnProfile?.addEventListener('click', () => {
      window.location.href = '../profile/profile.html';
    });

    elementos.btnLogout?.addEventListener('click', () => {
      const sessionData = localStorage.getItem('sessionUser');
      if (!sessionData) return;

      const usuariosStr = localStorage.getItem('usuarios');
      if (!usuariosStr) return;

      let usuarios;
      try {
        usuarios = JSON.parse(usuariosStr);
      } catch {
        usuarios = [];
      }

      const user = usuarios.find(u => u.username === sessionData);
      const name = user?.fullname || user?.username || 'Usuario';

      if (confirm(`¿Seguro que quieres cerrar sesión, ${name}?`)) {
        localStorage.removeItem('sessionUser');
        alert('Sesión cerrada correctamente.');
        window.location.href = '../../index.html';
      }
    });
  }

  function showWelcome() {
    const sessionData = localStorage.getItem('sessionUser');
    if (!sessionData) return;

    const usuariosStr = localStorage.getItem('usuarios');
    if (!usuariosStr) return;

    let usuarios;
    try {
      usuarios = JSON.parse(usuariosStr);
    } catch (error) {
      console.error('Error al parsear usuarios:', error);
      return;
    }

    const user = usuarios.find(u => u.username === sessionData);
    if (!user) return;

    const name = user.fullname || user.username || 'Usuario';
    const welcomeContainer = document.createElement('div');
    welcomeContainer.classList.add('welcome-msg');
    welcomeContainer.innerHTML = `Bienvenido👋<br>${name}`;

    const logo = elementos.navbar.querySelector('.nav-logo');
    if (logo) {
      logo.insertAdjacentElement('afterend', welcomeContainer);
      return;
    }

    elementos.navbar.prepend(welcomeContainer);
  }

  return {
    validate,
    loadNavbar,
  };
})();

NavbarApp.validate();

export const loadNavbar = NavbarApp.loadNavbar;
