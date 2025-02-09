import previewView from './previewView';
import View from './View';

class ShoppingView extends View {
  _parentElement = document.querySelector('.shop');
  _errorMessage = `No Shopping! Find a recipe to shop the ingredients :)`;
  _message = '';

  _overlay = document.querySelector('.shopping-overlay');
  _window = document.querySelector('.shopping-window');
  _btnClose = document.querySelector('.btn--close-shopping');
  _btnOpen = document.querySelector('.nav__btn--shopping-recipe');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
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

  addHandlerShopping(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return `
      <h2 class="shop-heading">Shopping List</h2>
      <ul class="shopping-lists">
        ${this._data
          .map(shop =>
            shop.ingredients
              .map(ingredient => this._generateList(ingredient))
              .join('')
          )
          .join('')}
      </ul>
    `;
  }

  _generateList(ingredient) {
    if (!ingredient || !ingredient.description) return '';
    return `
      <li class="shop-list">
        <span>${ingredient.description}</span>
        <button class="btn--delete-shopping" data-id="${ingredient.description}">X
        </button>
      </li>
    `;
  }

  addHandlerDeleteShopping(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--delete-shopping');
      if (!btn) return;
      const ingredientDesc = btn.dataset.id;
      handler(ingredientDesc);
    });
  }

  updateShoppingState(id) {
    const recipe = this._data.find(shop => shop.id === id);
    if (recipe) recipe.shopped = false;
  }
}

export default new ShoppingView();
