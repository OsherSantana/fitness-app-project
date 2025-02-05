import { addFood, removeFood, getAllFoods } from './database.js';

const foodForm = document.getElementById('addFoodForm');
const foodName = document.getElementById('foodName');
const foodWeight = document.getElementById('foodWeight');
const foodCalories = document.getElementById('foodCalories');
const foodProtein = document.getElementById('foodProtein');
const foodCarbs = document.getElementById('foodCarbs');
const foodFats = document.getElementById('foodFats');

foodForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = foodName.value;
    const weight = Number(foodWeight.value);
    const calories = Number(foodCalories.value);
    const protein = Number(foodProtein.value);
    const carbs = Number(foodCarbs.value);
    const fats = Number(foodFats.value);
    console.log(name, weight, calories, protein, carbs, fats)

    const newFood = {
        name: name,
        weight: weight,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fats: fats
    };
    addFood(newFood)
});
