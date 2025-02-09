import { API_URL, RESULTS_PER_PAGE, KEY } from './config';
import { AJAX } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
  shopping: [],
  recents: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}`);
    // const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    if (state.shopping.some(shop => shop.id === id))
      state.recipe.shopped = true;
    else state.recipe.shopped = false;
  } catch (err) {
    console.error(`${err} 💣💣💣`);
    throw err;
  }
};

export const loadSearch = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}`);
    // const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💣💣💣`);
    throw err;
  }
};

export const loadDefaultContent = async function (recents) {
  try {
    if (!recents || recents.length === 0) {
      state.search.results = [];
      return;
    }

    const randomIndex = Math.floor(Math.random() * recents.length);
    const data = await AJAX(`${API_URL}?search=${recents[randomIndex]}`);

    state.search.results = data.data.recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
    }));
  } catch (err) {
    console.error('Error loading recent searches:', err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // start = 0
  const end = page * state.search.resultsPerPage; //end = 9 (slice ignores the last)

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const persistRecents = function () {
  localStorage.setItem('recents', JSON.stringify(state.recents));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// RECENTS
export const addRecents = function (query) {
  if (!state.recents.includes(query)) {
    state.recents.push(query);
    persistRecents();
  }
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storageBookmarks = localStorage.getItem('bookmarks');
  if (storageBookmarks) state.bookmarks = JSON.parse(storageBookmarks);
  const storageRecents = localStorage.getItem('recents');
  if (storageRecents) state.recents = JSON.parse(storageRecents);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipes) {
  try {
    const ingredients = Object.entries(newRecipes)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong Ingredient Format given, Please use proper format :)'
          );
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipes.title,
      publisher: newRecipes.publisher,
      source_url: newRecipes.sourceUrl,
      image_url: newRecipes.image,
      servings: +newRecipes.servings,
      cooking_time: +newRecipes.cookingTime,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// checking shopping list

// export const addShopping = function (recipe) {
//   state.shopping.push(recipe.ingredients);
// };

export const addShopping = function (recipe) {
  state.shopping.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.shopped = true;
};

export const deleteShopping = function (id) {
  const index = state.shopping.findIndex(shop => shop.id === id);
  state.shopping.splice(index, 1);
  if (id === state.recipe.id) state.recipe.shopped = false;
};
