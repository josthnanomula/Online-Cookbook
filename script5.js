const searchForm = document.querySelector('form');
const searchInput = document.querySelector('#search');
const resultsList = document.querySelector('#results');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchRecipes();
})

async function searchRecipes() {
    const searchValue = searchInput.value.trim();
    const response = await fetch(`https://api.edamam.com/search?q=${searchValue}&app_id=7aa516a5&app_key=dc836a223fb788b11ae390504d9e97ce&from=0&to=10`);
    const data = await response.json();
    // Calculate and sort recipes by the number of missing ingredients
    const sortedRecipes = data.hits.sort((recipeA, recipeB) => {
        const missingIngredientsA = recipeA.recipe.ingredientLines.filter(ingredient => !searchValue.includes(ingredient)).length;
        const missingIngredientsB = recipeB.recipe.ingredientLines.filter(ingredient => !searchValue.includes(ingredient)).length;
        return missingIngredientsA - missingIngredientsB;
    });
    displayRecipes(sortedRecipes);
}

function displayRecipes(recipes) {
    let html = '';
    recipes.forEach((recipe) => {
        html += `
        <div>
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            <h3>${recipe.recipe.label}</h3>
            <ul>
                ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <p>Missing Ingredients: ${countMissingIngredients(searchInput.value, recipe.recipe.ingredientLines)}</p>
            <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
        </div> 
        `
    })
    resultsList.innerHTML = html;
}

function countMissingIngredients(searchValue, ingredients) {
    return ingredients.filter(ingredient => !searchValue.includes(ingredient)).length;
}