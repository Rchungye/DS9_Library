import { validateSession } from '../../utils/utils.js';

(() => {
  const StatisticsApp = {
    elements: {
      totalBooksSpan: document.getElementById('totalBooks'),
      avgPagesSpan: document.getElementById('avgPages'),
      barRecommend: document.getElementById('barRecommend'),
      barNotRecommend: document.getElementById('barNotRecommend'),
    },

    init() {
      validateSession();
      this.loadStats();
    },

    loadStats() {
      const username = localStorage.getItem('sessionUser');
      if (!username) return;

      const booksKey = `libros_${username}`;
      const books = JSON.parse(localStorage.getItem(booksKey)) || [];
      const total = books.length;

      this.elements.totalBooksSpan.textContent = total;

      if (total === 0) {
        this.elements.avgPagesSpan.textContent = '0';
        this.setBarWidth(0, 0);
        return;
      }

      const totalPages = books.reduce((sum, book) => sum + book.pages, 0);
      const avgPages = (totalPages / total).toFixed(2);
      this.elements.avgPagesSpan.textContent = avgPages;

      const recommended = books.filter(book => book.recommended).length;
      const notRecommended = total - recommended;

      this.setBarWidth(recommended, notRecommended);
    },

    setBarWidth(rec, noRec) {
      const max = Math.max(rec, noRec, 1);
      const percentRec = (rec / max) * 100;
      const percentNoRec = (noRec / max) * 100;

      this.elements.barRecommend.style.width = percentRec + '%';
      this.elements.barRecommend.textContent = rec > 0 ? rec : '';

      this.elements.barNotRecommend.style.width = percentNoRec + '%';
      this.elements.barNotRecommend.textContent = noRec > 0 ? noRec : '';
    }
  };

  StatisticsApp.init();
})();
