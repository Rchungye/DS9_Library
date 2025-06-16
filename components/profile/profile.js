import { hashCode } from '../../utils/utils.js';
import { validateSession } from '../../utils/utils.js';

(() => {
    const App = {
        elementos: {
            welcomeP: document.getElementById('welcome'),
            fullnameInput: document.getElementById('fullname'),
            currentPasswordInput: document.getElementById('currentPassword'),
            newPasswordInput: document.getElementById('newPassword'),
            confirmPasswordInput: document.getElementById('confirmPassword'),
            profileForm: document.getElementById('profileForm'),
            messageP: document.getElementById('message'),
            logoutBtn: document.getElementById('logoutBtn'),
        },

        usuarios: [],
        userIndex: -1,
        userData: null,

        init() {
            validateSession(); // Redirige si no hay sesión válida

            const sessionUser = localStorage.getItem('sessionUser');
            if (!sessionUser) {
                window.location.href = '../login/login.html';
                return;
            }

            this.usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            this.userIndex = this.usuarios.findIndex(u => u.username === sessionUser);

            if (this.userIndex === -1) {
                localStorage.removeItem('sessionUser');
                window.location.href = '../login/login.html';
                return;
            }

            this.userData = this.usuarios[this.userIndex];

            // Llena campo con nombre actual
            this.elementos.fullnameInput.value = this.userData.fullname;

            this.elementos.profileForm.addEventListener('submit', this.handleSubmit.bind(this));
            this.elementos.logoutBtn?.addEventListener('click', this.handleLogout.bind(this));
        },

        handleSubmit(e) {
            e.preventDefault();

            const { fullnameInput, currentPasswordInput, newPasswordInput, confirmPasswordInput, messageP } = this.elementos;
            messageP.textContent = '';
            messageP.className = 'profile-message';

            const newFullname = fullnameInput.value.trim();
            const currentPass = currentPasswordInput.value;
            const newPass = newPasswordInput.value;
            const confirmPass = confirmPasswordInput.value;

            if (!newFullname) {
                messageP.textContent = 'El nombre completo no puede estar vacío.';
                messageP.classList.add('error');
                return;
            }

            // Si se intenta cambiar contraseña
            if (currentPass || newPass || confirmPass) {
                if (!currentPass || !newPass || !confirmPass) {
                    messageP.textContent = 'Completa todos los campos de contraseña.';
                    messageP.classList.add('error');
                    return;
                }

                if (hashCode(currentPass) !== this.userData.password) {
                    messageP.textContent = 'Contraseña actual incorrecta.';
                    messageP.classList.add('error');
                    return;
                }

                if (newPass !== confirmPass) {
                    messageP.textContent = 'La nueva contraseña no coincide.';
                    messageP.classList.add('error');
                    return;
                }

                this.usuarios[this.userIndex].password = hashCode(newPass); // Actualiza contraseña
            }

            this.usuarios[this.userIndex].fullname = newFullname; // Actualiza nombre
            localStorage.setItem('usuarios', JSON.stringify(this.usuarios));

            this.elementos.welcomeP.textContent = `Hola, ${newFullname}`; // Actualiza saludo

            // Limpia inputs
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';

            messageP.textContent = 'Perfil actualizado correctamente.';
            messageP.classList.add('success');
        },

        handleLogout() {
            localStorage.removeItem('sessionUser'); // Cierra sesión
            window.location.href = '../login/login.html';
        }
    };

    App.init();
})();
