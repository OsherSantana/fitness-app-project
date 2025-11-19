import { useEffect, useState } from "react";
import "./style.css";
import type React from "react";
import type { Food } from "./types";

interface FormState {
  name: string;
  weight: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
}

// אותה ולידציה כמו קודם – רק נשארת פה
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

const API_BASE = "http://localhost:3000";

function App() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "",
    weight: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // ⬇️ פעם ראשונה שהקומפוננטה נטענת – נביא את כל המאכלים מהשרת
  useEffect(() => {
    async function fetchFoods() {
      try {
        const res = await fetch(`${API_BASE}/api/foods`);
        if (!res.ok) {
          throw new Error("Failed to fetch foods");
        }
        const data: Food[] = await res.json();
        setFoods(data);
      } catch (err) {
        console.error(err);
        setErrors(["Failed to load foods from server"]);
      } finally {
        setInitialLoading(false);
      }
    }

    fetchFoods();
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;

    const key = id.replace("food", "").toLowerCase();

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  // ⬇️ עכשיו handleSubmit שולח POST לשרת
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setSuccess("");
    setLoading(true);

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
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/foods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFood),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        const message =
          errBody?.error || "Failed to add food on server";
        throw new Error(message);
      }

      const savedFood: Food = await res.json();

      // מעדכן את ה־state לפי מה שהשרת החזיר
      setFoods((prev) => [...prev, savedFood]);

      setForm({
        name: "",
        weight: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
      });
      setSuccess("Food added successfully!");
    } catch (err: any) {
      console.error(err);
      setErrors([err.message || "Failed to add food"]);
    } finally {
      setLoading(false);
    }
  }

  // ⬇️ מחיקת מאכל – DELETE לשרת ואז עדכון state
  async function handleDelete(name: string) {
    setErrors([]);
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE}/api/foods/${encodeURIComponent(name)}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 204) {
        const errBody = await res.json().catch(() => null);
        const message =
          errBody?.error || "Failed to delete food on server";
        throw new Error(message);
      }

      // אם השרת מחק בהצלחה – נעדכן גם בצד לקוח
      setFoods((prev) => prev.filter((f) => f.name !== name));
      setSuccess("Food deleted successfully!");
    } catch (err: any) {
      console.error(err);
      setErrors([err.message || "Failed to delete food"]);
    }
  }

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

      <section className="food-form">
        <h2>Add Food</h2>

        {initialLoading && <p>Loading foods from server...</p>}

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

          <button type="submit" id="submitFoodForm" disabled={loading}>
            <span className="button-text">
              {loading ? "Adding..." : "Add Food"}
            </span>
          </button>
        </form>
      </section>

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
