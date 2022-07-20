const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "a30370d761mshe2f4a36a878186bp14d136jsn7d1a9ba8b0e7",
    "X-RapidAPI-Host": "tasty.p.rapidapi.com",
  },
};

const initialAppState = {
  recipesList: [],
};

loadData = async (onSuccessCallback, onErrorCallback) => {
  try {
    const response = await fetch(
      "https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes",
      options
    );
    const data = await response.json();
    if (onSuccessCallback) onSuccessCallback(data);
  } catch (error) {
    if (onErrorCallback) onErrorCallback(error);
    // if(!response.ok){
    // 	throw new Error(`Error status ${response.status}`)};
  }
};
const onSuccessCallback = (data) => {
  data.results.forEach((el) => initialAppState.recipesList.push(el));
  const recipesData = initialAppState.recipesList;

  for (const recipe of recipesData) {
    const { name, thumbnail_url } = recipe;

    const createRecipeDiv = (name, thumbnail_url) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.className = "recipeDiv";

      const recipeName = document.createElement("h4");
      recipeName.innerText = name;
      recipeName.className = "recipeName";

      const recipeImage = document.createElement("img");
      recipeImage.src = thumbnail_url;
      recipeImage.className = "recipeImage";

      recipeDiv.append(recipeName);
      recipeDiv.append(recipeImage);

      return recipeDiv;
    };

    document
      .querySelector(".recipes-list")
      .append(createRecipeDiv(name, thumbnail_url));
  }
};


const onErrorCallback = (error) => console.log(error);

console.log(loadData(onSuccessCallback, onErrorCallback));
