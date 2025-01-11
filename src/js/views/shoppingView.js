import View from './View';

class ShoppingView extends View {
  _parentElement = document.querySelector('.shop');
  _message = 'Search Recipes for Shopping List';

  _overlay = document.querySelector('.shopping-overlay');
  _window = document.querySelector('.shopping-window');
  _btnClose = document.querySelector('.btn--close-shopping');
  _btnOpen = document.querySelector('.nav__btn--shopping-recipe');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  addHandlerShoppingList(handler) {
    handler();
  }

  _toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
    this._overlay.addEventListener('click', this._toggleWindow.bind(this));
  }

  _generateMarkup() {
    return `
        <h2>Shopping List</h2>
        <ul class="shopping-lists">
          <li class="shop-list">${this._data}</li>
          <li class="shop-list">${this._data}</li>
          <li class="shop-list">${this._data}</li>
          <li class="shop-list">${this._data}</li>
          <li class="shop-list">${this._data}</li>
        </ul>
    `;
  }
}

export default new ShoppingView();
