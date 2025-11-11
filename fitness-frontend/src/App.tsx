import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import "./style.css";
import type { Food } from "./types";
import type React from "react";


// This matches the values of your form inputs.
// We keep them as strings because inputs always give us strings.
interface FormState {
  name: string;
  weight: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
}

// Same validation rules you had in app.js, but in TypeScript.
function validateFoodData(food: Food): string[] {
  const errors: string[] = [];

  if (!food.name.trim()) {
    errors.push("Name is required");
  }

  if (food.weight <= 0) {
    errors.push("Weight must be greater than 0");
  }

  if (food.calories < 0) {
    errors.push("Calories cannot be negative");
  }

  if (food.protein < 0) {
    errors.push("Protein cannot be negative");
  }

  if (food.carbs < 0) {
    errors.push("Carbs cannot be negative");
  }

  if (food.fats < 0) {
    errors.push("Fats cannot be negative");
  }

  return errors;
}

function App() {
  // This replaces your old "foods" array in database.js
  const [foods, setFoods] = useState<Food[]>([]);

  // This holds the current form values (replaces document.getElementById stuff)
  const [form, setForm] = useState<FormState>({
    name: "",
    weight: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  // Messages for the user (same idea as errorContainer / successContainer)
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");

  // 🔹 Load foods from localStorage when the app first loads
  useEffect(() => {
    const stored = localStorage.getItem("foods");
    if (stored) {
      try {
        const parsed: Food[] = JSON.parse(stored);
        setFoods(parsed);
      } catch (e) {
        console.error("Failed to parse foods from localStorage", e);
      }
    }
  }, []);

  // 🔹 Save foods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("foods", JSON.stringify(foods));
  }, [foods]);

  function handleInputChange(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const { id, value } = e.target;

  const key = id.replace("food", "").toLowerCase();

  setForm((prev) => ({
    ...prev,
    [key]: value,
  }));
}

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setErrors([]);
  setSuccess("");

  const newFood: Food = {
    name: form.name,
    weight: Number(form.weight),
    calories: Number(form.calories),
    protein: Number(form.protein),
    carbs: Number(form.carbs),
    fats: Number(form.fats),
  };

  const validationErrors = validateFoodData(newFood);
  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    return;
  }

  setFoods((prev) => [...prev, newFood]);
  setForm({
    name: "",
    weight: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  setSuccess("Food added successfully!");
}


  // Replaces removeFood() + updateDisplay()
  function handleDelete(name: string) {
    setFoods((prev) => prev.filter((f) => f.name !== name));
  }

  // Same idea as displayDailyMacros in app.js
  const totals = foods.reduce(
    (acc, food) => {
      acc.calories += food.calories;
      acc.protein += food.protein;
      acc.carbs += food.carbs;
      acc.fats += food.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="container">
      <header>
        <h1>Macro Tracker</h1>
      </header>

      {/* ADD FOOD FORM */}
      <section className="food-form">
        <h2>Add Food</h2>

        {errors.length > 0 && (
          <div className="message error-message">
            {errors.map((err) => (
              <p key={err}>{err}</p>
            ))}
          </div>
        )}

        {success && (
          <div className="message success-message">
            <p>{success}</p>
          </div>
        )}

        <form id="addFoodForm" onSubmit={handleSubmit}>
          <input
            type="text"
            id="foodName"
            placeholder="Food Name"
            required
            value={form.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            id="foodWeight"
            placeholder="Food Weight"
            required
            value={form.weight}
            onChange={handleInputChange}
          />
          <input
            type="number"
            id="foodCalories"
            placeholder="Calories"
            required
            value={form.calories}
            onChange={handleInputChange}
          />
          <input
            type="number"
            id="foodProtein"
            placeholder="Protein In Grams"
            required
            value={form.protein}
            onChange={handleInputChange}
          />
          <input
            type="number"
            id="foodCarbs"
            placeholder="Carbs In Grams"
            required
            value={form.carbs}
            onChange={handleInputChange}
          />
          <input
            type="number"
            id="foodFats"
            placeholder="Fats In Grams"
            required
            value={form.fats}
            onChange={handleInputChange}
          />

          <button type="submit" id="submitFoodForm">
            <span className="button-text">Add Food</span>
          </button>
        </form>
      </section>

      {/* FOOD LIST */}
      <section className="food-list">
        <h2>Today&apos;s Foods</h2>
        <div id="foodList">
          <div className="food-grid">
            {foods.map((food) => (
              <div className="food-item" key={food.name}>
                <h3>{food.name}</h3>
                <p>Weight: {food.weight}g</p>
                <p>Calories: {food.calories}</p>
                <p>Protein: {food.protein}g</p>
                <p>Carbs: {food.carbs}g</p>
                <p>Fats: {food.fats}g</p>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(food.name)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DAILY TOTALS */}
      <section className="daily-totals">
        <h2>Daily Totals</h2>
        <div id="macroTotals">
          <div className="macro-total">
            <p>Total Calories: {totals.calories}</p>
            <p>Total Protein: {totals.protein}g</p>
            <p>Total Carbs: {totals.carbs}g</p>
            <p>Total Fats: {totals.fats}g</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
