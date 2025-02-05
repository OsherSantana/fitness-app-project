let foods = [];  // Start fresh

function addFood(food) {
    foods.push(food);
    saveToLocalStorage();
    console.log("Current foods: ", foods);
}

function removeFood(foodToRemove) {
    foods = foods.filter(food => food.name !== foodToRemove);
    saveToLocalStorage();
    console.log("Current foods: ", foods);
}

function getAllFoods() {
    return foods;
}

function saveToLocalStorage() {
    localStorage.setItem('foods', JSON.stringify(foods));
}

// Test Data - you can remove this after testing
const testFood1 = {
    name: "Banana",
    weight: 100,
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fats: 0.3
};

const testFood2 = {
    name: "Pineapple",
    weight: 100,
    calories: 50,
    protein: 0.5,
    carbs: 13,
    fats: 0.1
};

addFood(testFood1);
addFood(testFood2);

export { addFood, removeFood, getAllFoods };