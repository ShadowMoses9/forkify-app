import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
import View from './View.js';

class SearchResaultsViews extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your search request! Please try again';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new SearchResaultsViews();
