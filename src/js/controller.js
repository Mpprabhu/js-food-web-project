import * as model from './model';
import recipeView from './views/recipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/////////////////////////////////////////////////////
// Rendering Loader-------------------------------------------
recipeView.renderSpinner();

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;

    recipeView.renderSpinner(recipeContainer);

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
