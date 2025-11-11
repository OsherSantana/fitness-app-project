import { addFood, removeFood, getAllFoods } from './database.js';

// DOM Elements
const foodForm = document.getElementById('addFoodForm');
const foodName = document.getElementById('foodName');
const foodWeight = document.getElementById('foodWeight');
const foodCalories = document.getElementById('foodCalories');
const foodProtein = document.getElementById('foodProtein');
const foodCarbs = document.getElementById('foodCarbs');
const foodFats = document.getElementById('foodFats');
const errorContainer = document.getElementById('errorMessages')
const successContainer = document.getElementById('successMessages')



function showErrors(errors) {
    errorContainer.innerHTML = Array.isArray(errors) ? errors.join('<br>') : errors;
    errorContainer.style.display = 'block';

    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 3000);
}

function showSuccess(message) {
    successContainer.innerHTML = message;
    successContainer.style.display = 'block';

    setTimeout(() => {
        successContainer.style.display = 'none';
    }, 3000);
}


function validateFoodData(foodData) {
    const errors = [];

    if (!foodData.name.trim()) {
        errors.push('Name is required');
    }

    if (foodData.weight <= 0) {
        errors.push('Weight must be greater than 0');
    }

    if (foodData.calories < 0) {
        errors.push('Calories cannot be negative');
    }

    if (foodData.protein < 0) {
        errors.push('Protein cannot be negative');
    }

    if (foodData.carbs < 0) {
        errors.push('Carbs cannot be negative');
    }

    if (foodData.fats < 0) {
        errors.push('Fats cannot be negative');
    }

    return errors;
}

// Display Functions
function displayDailyFoods() {
    const foods = getAllFoods();
    const foodList = document.getElementById('foodList');

    foodList.innerHTML = `
        <div class="food-grid">
            ${foods.map(food => `
            <div class="food-item">
                <h3>${food.name}</h3>
                <p>Weight: ${food.weight}g</p>
                <p>Calories: ${food.calories}</p>
                <p>Protein: ${food.protein}g</p>
                <p>Carbs: ${food.carbs}g</p>
                <p>Fats: ${food.fats}g</p>
                <button class="delete-btn" data-name="${food.name}">Delete</button>
            </div>
        `).join('')
        }
        </div >
        `;

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

function displayDailyMacros() {
    const totalDailyMacros = document.getElementById('macroTotals')
    const foods = getAllFoods();
    const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
    }

    foods.forEach(food => {
        totals.calories += food.calories;
        totals.protein += food.protein;
        totals.carbs += food.carbs;
        totals.fats += food.fats;
    })

    totalDailyMacros.innerHTML = `
        <div class="macro-total">
            <p>Total Calories: ${totals.calories}</p>
            <p>Total Protein: ${totals.protein}g</p>
            <p>Total Carbs: ${totals.carbs}g</p>
            <p>Total Fats: ${totals.fats}g</p>
        </div >
        `;
}

// Event Handlers
async function handleSubmit(event) {
    event.preventDefault();

    // Get form and button elements
    const form = event.currentTarget;
    const submitButton = form.querySelector('#submitFoodForm');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');

    try {
        // Disable form and show loading
        form.querySelectorAll('input').forEach(input => input.disabled = true);
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline';

        // Your existing form handling code here
        const newFood = {
            name: foodName.value,
            weight: Number(foodWeight.value),
            calories: Number(foodCalories.value),
            protein: Number(foodProtein.value),
            carbs: Number(foodCarbs.value),
            fats: Number(foodFats.value)
        };

        const errors = validateFoodData(newFood);
        if (errors.length > 0) {
            showErrors(errors);
            return;
        }

        addFood(newFood);
        foodForm.reset();
        updateDisplay();
        showSuccess('Food added successfully!');

    } catch (error) {
        showErrors(['Failed to add food']);
    } finally {
        // Re-enable form and hide loading
        form.querySelectorAll('input').forEach(input => input.disabled = false);
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoader.style.display = 'none';
    }
}

function handleDelete(event) {
    const foodName = event.currentTarget.dataset.name;
    removeFood(foodName);
    updateDisplay();
}

// Helper Functions
function updateDisplay() {
    displayDailyFoods();
    displayDailyMacros();
}

// Event Listeners
foodForm.addEventListener('submit', handleSubmit);

// Initial Display
updateDisplay();