import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

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
    resultsView.renderSpinner();
    // GET QUERY
    const query = searchView.getQuery();
    if (!query) return;

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

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchRecipes);
  paginationView.addHandlerClick(controlPagination);
};

init();
