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
      "https://tasty.p.rapidapi.com/recipes/list?from=0&size=30&tags=under_30_minutes",
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

  for (const recipe of recipesData) {
    const { name, thumbnail_url, id, tags} = recipe;

    const createRecipeDiv = (name, thumbnail_url) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.className = "recipeDiv";

      const recipeName = document.createElement("button");
      recipeName.innerText = name;
      recipeName.className = "recipeName";
      recipeName.onclick = () => {
        getRecipeDetails(id);
      };
     
      const tagsTable=[];
      for(const el of tags){tagsTable.push(el.name)};
    
      const tagsDiv = document.createElement("div");
      tagsDiv.className="tagsDiv";
      tagsDiv.innerText=`#${tagsTable.join(" #")}`;

      const recipeImage = document.createElement("img");
      recipeImage.src = thumbnail_url;
      recipeImage.className = "recipeImage";

      recipeDiv.append(recipeName, recipeImage, tagsDiv);
      
      return recipeDiv;
    };

    document
      .querySelector(".recipes-list")
      .append(createRecipeDiv(name, thumbnail_url));
  }
};

const getRecipeDetails = async (id) => {
  try {
    const response = await fetch(
      `https://tasty.p.rapidapi.com/recipes/get-more-info?id=${id}`,
      options
    );
    const data = await response.json();
    showInstructions(data);
  } catch (error) {
    console.log(error);
  }
};

const onErrorCallback = (error) => console.log(error);

loadData(onSuccessCallback, onErrorCallback);

const showInstructions = (data) => {
  const instructionsDiv = document.querySelector(".instructions");

  const title = document.createElement("h3");
  title.innerHTML = data.name;

  const instructions = document.createElement("h4");
  instructions.innerText = "Instructions:";

  instructionsDiv.append(title, instructions);

  for (const instructions of data.instructions) {
    const { position, display_text } = instructions;
    const instructionsStep = document.createElement("p");
    instructionsStep.innerHTML = `${position}. ${display_text}`;
    instructionsDiv.append(instructionsStep);
  }
};
