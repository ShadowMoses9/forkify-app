import { async } from 'regenerator-runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeViews.js';
import searchView from './views/searchViews.js';
import searchResaultsViews from './views/searchResaultsViews.js';
import paginationViews from './views/paginationViews.js';
import bookmarksViews from './views/bookmarksViews.js';
import addRecipeViews from './views/addRecipeViews.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    //1)Update results view to mark selexted search resault
    searchResaultsViews.update(model.getSearchResaultPage());

    //2)Loading recipe
    await model.loadRecipe(id);

    //3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResaults = async function () {
  try {
    //1)Loading search
    searchResaultsViews.renderSpinner();

    const query = searchView.getQuery();

    if (!query) return;

    await model.loadSearchResults(query);
    console.log(model.state.search.results);

    //2) Rendering search
    searchResaultsViews.render(model.getSearchResaultPage());

    // 3) Render initial pagination buttons
    paginationViews.render(model.state.search);
  } catch (error) {
    alert(error);
  }
};

const controlPagination = function (goToPage) {
  //2) Rendering search
  searchResaultsViews.render(model.getSearchResaultPage(goToPage));

  // 3) Render initial pagination buttons
  paginationViews.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings(in state)
  model.updateServings(newServings);
  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  //2)Update recipe view
  recipeView.update(model.state.recipe);
  //3) Render bookmarks
  bookmarksViews.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksViews.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeViews.renderSpinner();

    //Upload recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Succes msg
    addRecipeViews.renderMessage();

    //Render Bookmark view
    bookmarksViews.render(model.state.bookmarks);

    //Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form Window
    setTimeout(function () {
      addRecipeViews.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeViews.renderError(error.message);
  }
};

const init = function () {
  bookmarksViews.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResaults);
  paginationViews.addHandlerClick(controlPagination);
  addRecipeViews.addHandlerUpload(controlAddRecipe);
};

init();
