import express from "express";
import cors from "cors";

interface Food {
    name: string;
    weight: number;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

// "מאגר" זמני בזיכרון השרת
let foods: Food[] = [];

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Backend is running" });
});

app.get("/api/foods", (req, res) => {
    res.json(foods);
});

app.post("/api/foods", (req, res) => {
    const { name, weight, calories, protein, carbs, fats } = req.body;

    // ולידציה בסיסית – כמו בפרונט
    if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ error: "Name is required" });
    }

    if (weight <= 0) {
        return res.status(400).json({ error: "Weight must be greater than 0" });
    }

    if (calories < 0 || protein < 0 || carbs < 0 || fats < 0) {
        return res
            .status(400)
            .json({ error: "Calories, protein, carbs and fats cannot be negative" });
    }

    const newFood: Food = {
        name,
        weight: Number(weight),
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fats: Number(fats),
    };

    foods.push(newFood);

    // מחזירים את המאכל שנוסף
    res.status(201).json(newFood);
});

app.delete("/api/foods/:name", (req, res) => {
    const { name } = req.params;

    const before = foods.length;
    foods = foods.filter((food) => food.name !== name);
    const after = foods.length;

    if (after === before) {
        return res.status(404).json({ error: "Food not found" });
    }

    res.status(204).send(); // 204 = הצלחה בלי תוכן
});


app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
