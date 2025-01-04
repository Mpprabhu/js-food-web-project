import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';

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

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchRecipes);
  paginationView.addHandlerClick(controlPagination);
};

init();
