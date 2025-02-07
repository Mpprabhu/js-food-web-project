import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import shoppingView from './views/shoppingView';
import { MODAL_CLOSE_SEC } from './config';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
// HOT MODULE RUN --> PARCEL
// if (module.hot) {
//   module.hot.accept();
// }

// Rendering Loader-------------------------------------------

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // UPDATION FOR SELECTED RESULT
    resultsView.update(model.getSearchResultsPage());

    // BOOKMARK UPDATION WITH RECIPES
    bookmarksView.update(model.state.bookmarks);

    // LOAD RECIPE
    await model.loadRecipe(id);

    // RENDER RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchRecipes = async function () {
  try {
    // GET QUERY
    const query = searchView.getQuery();
    if (!query) return;

    model.addRecents(query);

    resultsView.renderSpinner();

    // LOAD QUERY
    await model.loadSearch(query);

    // RENDER RESULTS

    resultsView.render(model.getSearchResultsPage());

    // RENDER PAGINATION BUTTONS
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // RENDER NEW RESULTS
  resultsView.render(model.getSearchResultsPage(goToPage));

  // RENDER NEW PAGINATION BUTTONS
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // UPDATE SERVINGS
  model.updateServings(newServings);

  // RENDERING WITH NEW SERVINGS
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlDefaultContent = async function () {
  try {
    if (!model.state.recents || model.state.recents.length === 0) {
      resultsView.renderMessage('Search your meal by ingredients');
      return;
    }

    await model.loadDefaultContent(model.state.recents);
    resultsView.render(model.getSearchResultsPage());
  } catch (err) {
    resultsView.renderError('Failed to load recent searches.');
  }
};

const controlRecipeUpload = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    // CHANGE IN URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

// checking Shopping list
const controlShopping = function () {
  shoppingView.render(model.state.shopping);
};

const controlAddShopping = function () {
  if (!model.state.recipe.shopped) model.addShopping(model.state.recipe);
  else model.deleteShopping(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  console.log(model.state.shopping);
  shoppingView.render(model.state.shopping);
};

const init = function () {
  resultsView.addHandlerDefaultResults(controlDefaultContent);
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  shoppingView.addHandlerShopping(controlShopping);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerAddShoppingList(controlAddShopping);
  searchView.addHandlerSearch(controlSearchRecipes);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlRecipeUpload);
};

init();
