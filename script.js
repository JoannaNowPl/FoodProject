const initialAppState = {
  recipesList: [],
  isLoading: false,
};

const loadingSpinner = () => {
  if (initialAppState.isLoading) {
    document.querySelector("#loader").style.visibility = "visible";
  } else {
    setTimeout(() => {
      document.querySelector("#loader").style.visibility = "hidden";
      document.querySelector("body").style.visibility = "visible";
    }, 500);
  }
};

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "12c9c6d2fdmsh353138efd4d68d7p189610jsn6b8bd151a6c6",
    "X-RapidAPI-Host": "tasty.p.rapidapi.com",
  },
};

loadData = async (onSuccessCallback, onErrorCallback) => {
  try {
    initialAppState.isLoading = true;
    loadingSpinner();
    const response = await fetch(
      "https://tasty.p.rapidapi.com/recipes/list?from=0&size=30&tags=under_30_minutes",
      options
    );
    const data = await response.json();
    if (onSuccessCallback) onSuccessCallback(data);
  } catch (error) {
    if (onErrorCallback) onErrorCallback(error);
  } finally {
    initialAppState.isLoading = false;
    loadingSpinner();
  }
};

const createImage = (thumbnail_url, recipeName) => {
  const recipeImage = document.createElement("img");
  recipeImage.src = thumbnail_url;
  recipeImage.className = "recipeImage"
  recipeImage.alt = `Image of ${recipeName}`;
  return recipeImage;
}

const onSuccessCallback = (data) => {
  data.results.forEach((el) => initialAppState.recipesList.push(el));
  const recipesData = initialAppState.recipesList;

  for (const recipe of recipesData) {
    const { name, thumbnail_url, id, tags } = recipe;

    const createRecipeDiv = (name, thumbnail_url) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.className = "recipeDiv";

      const recipeName = document.createElement("button");
      recipeName.innerHTML = name;
      recipeName.className = "recipeName";
      recipeName.onclick = () => {
        getRecipeDetails(id);
      };

      const recipeImage = createImage(thumbnail_url, name);    

      const tagsTable = [];
      for (const el of tags) {
        tagsTable.push(el.display_name);
      }

      const tagsDiv = document.createElement("div");
      tagsDiv.className = "tagsDiv";
      tagsDiv.innerHTML = `#${tagsTable.join(" #")}`;

      recipeDiv.append(recipeName, recipeImage, tagsDiv);

      return recipeDiv;
    };

    document
      .querySelector(".recipes-list")
      .append(createRecipeDiv(name, thumbnail_url));
  }
};

const onErrorCallback = (error) => console.log(error);

loadData(onSuccessCallback, onErrorCallback);

const getRecipeDetails = async (id) => {
  try {
    const response = await fetch(
      `https://tasty.p.rapidapi.com/recipes/get-more-info?id=${id}`,
      options
    );
    const data = await response.json();
    showInstructions(data);
    location.href = "#details";
  } catch (error) {
    console.log(error);
  }
};

const showInstructions = (data) => {
  const instructionsDiv = document.querySelector(".instructionsDiv");

  const instructions = document.createElement("div");
  instructions.className = "instructions";

  instructionsDiv.append(instructions);

  const closeButton = document.createElement("button");
  closeButton.className = "closeButton";
  closeButton.innerHTML = "&times";
  closeButton.onclick = function () {
    this.parentNode.remove();
    return false;
  };

  const title = document.createElement("h3");
  title.innerHTML = data.name;

  const recipeImage = createImage(data.thumbnail_url, data.name);    

  const ingredientsHeader = document.createElement("h4");
  ingredientsHeader.innerHTML = "Ingredients:";

  instructions.append(closeButton, title, recipeImage, ingredientsHeader);

  const componentsTable = data.sections[0].components;

  for (const element of componentsTable) {
    const { raw_text } = element;

    const ingredient = document.createElement("p");
    ingredient.innerHTML = `${raw_text}`;
    instructions.append(ingredient);
  }

  const instructionsHeader = document.createElement("h4");
  instructionsHeader.innerHTML = "Instructions:";

  instructions.append(instructionsHeader);

  for (const step of data.instructions) {
    const { position, display_text } = step;
    const instructionsStep = document.createElement("p");
    instructionsStep.innerHTML = `${position}. ${display_text}`;
    instructions.append(instructionsStep);
  }

  const nutritionHeader = document.createElement("h4");
  nutritionHeader.innerHTML = "Nutrition:";
  instructions.append(nutritionHeader);

  for (const nutriKey in data.nutrition) {
    const nutriP = document.createElement("p");
    if (nutriKey === "updated_at") {
      continue;
    }
    nutriP.innerHTML = `${nutriKey}: ${data.nutrition[nutriKey]}`;
    instructions.append(nutriP);
  }
};
