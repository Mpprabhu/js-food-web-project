import previewView from './previewView';
import View from './View';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No Recipes found!! Please search with other recipes :)`;
  _message = '';

  addHandlerDefaultResults(handler) {
    handler();
  }
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
