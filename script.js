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
  }
};
const onSuccessCallback = (data) => {
  data.results.forEach((el) => initialAppState.recipesList.push(el));
  const recipesData = initialAppState.recipesList;
  console.log(recipesData);

  for (const recipe of recipesData) {
    const { name, thumbnail_url, id } = recipe;

    const createRecipeDiv = (name, thumbnail_url) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.className = "recipeDiv";

      const recipeName = document.createElement("button");
      recipeName.innerText = name;
      recipeName.className = "recipeName";
      recipeName.onclick = () => {getRecipeDetails(id)};
    

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


// const getRecipeDetails =  (id) => {
//   console.log(id);
// }
const getRecipeDetails = async (id) => {
  try {
    const response = await fetch(`https://tasty.p.rapidapi.com/recipes/get-more-info?id=${id}`, options);
    const data = await response.json()
    console.log(data)
    
  } catch (error) {
    console.log(error)
    
  }
}



const onErrorCallback = (error) => console.log(error);

loadData(onSuccessCallback, onErrorCallback);


