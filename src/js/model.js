export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    const response = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
      // 'https://forkify-api.herokuapp.com/api/v2/recipes/664c8f193e7aa067e94e86ba'
    );
    const data = await response.json();

    if (!response.ok) throw new Error(`${response.status}  ${data.message} `);

    const { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    console.log(state.recipe);
  } catch (err) {
    alert(err);
  }
};
