
let foods = [];

function addFood(food) {
    foods.push(food);
    console.log("Current foods: ", foods);
}

function removeFood(foodToRemove) {
    foods = foods.filter(food => food.name !== foodToRemove);
    console.log("Current foods: ", foods);
}

function getAllFoods() {
    return foods;
}

function saveToLocalStorage() {
    localStorage.setItem('foods', JSON.stringify(foods));
}

const testFood = {
    name: "Banana",
    weight: 100,
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fats: 0.3
};



addFood(testFood);
console.log("Getting all foods:", getAllFoods());

export { addFood, removeFood, getAllFoods };

