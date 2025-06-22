import { validateSession } from '../../utils/utils.js';

(() => {
  const App = {
    elementos: {
      booksTableBody: document.querySelector('#booksTable tbody'),
      bookForm: document.getElementById('bookForm'),
      modal: document.getElementById('bookModal'),
      openModalBtn: document.getElementById('openModalBtn'),
      closeBtn: document.getElementById('closeModalBtn'),
      modalTitle: document.querySelector('.modal__content h3'),
      btnSubmit: document.querySelector('.book-form button[type="submit"]'),
    },

    sessionUser: null,
    usuarios: [],
    userData: null,
    librosKey: '',
    libros: [],
    editIndex: -1,

    init() {
      validateSession();

      this.sessionUser = localStorage.getItem('sessionUser');
      if (!this.sessionUser) {
        window.location.href = '../login/login.html';
        return;
      }

      this.usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      this.userData = this.usuarios.find(user => user.username === this.sessionUser);

      if (!this.userData) {
        localStorage.removeItem('sessionUser');
        window.location.href = '../login/login.html';
        return;
      }

      this.librosKey = `libros_${this.sessionUser}`;
      this.libros = JSON.parse(localStorage.getItem(this.librosKey)) || [];

      this.bindEvents();
      this.renderBooks();
    },

    bindEvents() {
      this.elementos.openModalBtn.addEventListener('click', this.openAddModal.bind(this));
      this.elementos.closeBtn.addEventListener('click', this.closeModal.bind(this));
      window.addEventListener('click', this.handleOutsideClick.bind(this));
      this.elementos.bookForm.addEventListener('submit', this.handleFormSubmit.bind(this));
      this.elementos.booksTableBody.addEventListener('click', this.handleTableClick.bind(this));
    },

    renderBooks() {
      const tbody = this.elementos.booksTableBody;
      tbody.innerHTML = '';

      if (this.libros.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No hay libros registrados.</td></tr>`;
        return;
      }

      this.libros.forEach((libro, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${libro.title}</td>
          <td>${libro.author}</td>
          <td>${libro.readDate}</td>
          <td>${libro.pages}</td>
          <td>${libro.recommended ? 'Sí' : 'No'}</td>
          <td>
            <button data-index="${index}" class="edit-btn">Editar</button>
            <button data-index="${index}" class="delete-btn">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    },

    saveBooks() {
      localStorage.setItem(this.librosKey, JSON.stringify(this.libros));
    },

    openAddModal() {
      this.editIndex = -1;
      this.elementos.modalTitle.textContent = 'Agregar nuevo libro';
      this.elementos.btnSubmit.textContent = 'Agregar libro';
      this.elementos.bookForm.reset();
      this.elementos.modal.style.display = 'block';
    },

    openEditModal(index) {
      this.editIndex = index;
      const libro = this.libros[index];

      this.elementos.modalTitle.textContent = 'Editar libro';
      this.elementos.btnSubmit.textContent = 'Guardar cambios';

      this.elementos.bookForm.title.value = libro.title;
      this.elementos.bookForm.author.value = libro.author;
      this.elementos.bookForm.readDate.value = libro.readDate;
      this.elementos.bookForm.pages.value = libro.pages;
      this.elementos.bookForm.recommended.checked = libro.recommended;

      this.elementos.modal.style.display = 'block';
    },

    closeModal() {
      this.elementos.modal.style.display = 'none';
      this.elementos.bookForm.reset();
      this.editIndex = -1;
    },

    handleOutsideClick(e) {
      if (e.target === this.elementos.modal) this.closeModal();
    },

    handleFormSubmit(e) {
      e.preventDefault();

      const form = this.elementos.bookForm;
      const title = form.title.value.trim();
      const author = form.author.value.trim();
      const readDate = form.readDate.value;
      const pages = parseInt(form.pages.value);
      const recommended = form.recommended.checked;

      if (!title || !author || !readDate || !pages || pages <= 0) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
      }

      const existeLibro = this.libros.some((libro, idx) => {
        if (this.editIndex === idx) return false;
        return (
          libro.title.toLowerCase() === title.toLowerCase() &&
          libro.author.toLowerCase() === author.toLowerCase()
        );
      });

      if (existeLibro) {
        alert('Este libro ya está registrado.');
        return;
      }

      if (this.editIndex === -1) {
        this.libros.push({ title, author, readDate, pages, recommended });
        this.saveBooks();
        this.renderBooks();
        this.closeModal();
        return;
      }

      this.libros[this.editIndex] = { title, author, readDate, pages, recommended };
      this.saveBooks();
      this.renderBooks();
      this.closeModal();
    },

    handleTableClick(e) {
      const index = parseInt(e.target.dataset.index);
      if (e.target.classList.contains('delete-btn') && index >= 0) {
        if (confirm('¿Seguro que deseas eliminar este libro?')) {
          this.libros.splice(index, 1);
          this.saveBooks();
          this.renderBooks();
        }
        return;
      }

      if (e.target.classList.contains('edit-btn') && index >= 0) {
        this.openEditModal(index);
      }
    },
  };

  App.init();
})();
