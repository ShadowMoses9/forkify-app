import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1 and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateBtnMarkup('next');
    }
    //Last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateBtnMarkup('prev');
    }

    //Other pages
    if (currentPage < numPages) {
      return this._generateBtnMarkup('prev') + this._generateBtnMarkup('next');
    }

    //Page 1 and there are No other pages
    return '';
  }

  _generateBtnMarkup(direction) {
    let currentPage = this._data.page;
    const target = direction == 'prev' ? --currentPage : ++currentPage;
    const icon = direction == 'prev' ? 'icon-arrow-left' : 'icon-arrow-right';
    return `
    <button class="btn--inline pagination__btn--${direction}" data-goto="${target}">
      <svg class="search__icon">
        <use href="${icons}#${icon}"></use>
      </svg>
      <span>Page ${target}</span>
    </button>
    `;
  }
}

export default new PaginationView();
