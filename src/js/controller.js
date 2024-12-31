import * as model from './model';
import recipeView from './views/recipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// const recipeContainer = document.querySelector('.recipe');
/////////////////////////////////////////////////////
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
    // alert(err);
  }
};

const events = ['hashchange', 'load'];
events.forEach(eve => window.addEventListener(eve, controlRecipes));
