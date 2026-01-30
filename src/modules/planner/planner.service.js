import Profile from '../profile/profile.model.js';
import DailyPlan from './planner.model.js';

// Service Constraints / Constants
const DEFAULT_AGE = 30;
const DEFAULT_GENDER_IS_MALE = true;

// Sample Database for Rule-Based Generation
const MEAL_DATABASE = {
    breakfast: [
        { name: "Oatmeal with Berries", baseCalories: 350, proteinRatio: 0.15, carbRatio: 0.7, fatRatio: 0.15 },
        { name: "Scrambled Eggs on Toast", baseCalories: 400, proteinRatio: 0.3, carbRatio: 0.3, fatRatio: 0.4 },
        { name: "Greek Yogurt Parfait", baseCalories: 300, proteinRatio: 0.25, carbRatio: 0.5, fatRatio: 0.25 },
        { name: "Avocado Toast", baseCalories: 350, proteinRatio: 0.15, carbRatio: 0.45, fatRatio: 0.4 },
        { name: "Protein Pancakes", baseCalories: 450, proteinRatio: 0.4, carbRatio: 0.4, fatRatio: 0.2 },
    ],
    lunch: [
        { name: "Grilled Chicken Salad", baseCalories: 450, proteinRatio: 0.4, carbRatio: 0.2, fatRatio: 0.4 },
        { name: "Turkey Sandwich", baseCalories: 500, proteinRatio: 0.3, carbRatio: 0.4, fatRatio: 0.3 },
        { name: "Quinoa Bowl with Veggies", baseCalories: 400, proteinRatio: 0.2, carbRatio: 0.6, fatRatio: 0.2 },
        { name: "Tuna Wrap", baseCalories: 400, proteinRatio: 0.35, carbRatio: 0.35, fatRatio: 0.3 },
        { name: "Lentil Soup", baseCalories: 350, proteinRatio: 0.25, carbRatio: 0.6, fatRatio: 0.15 },
    ],
    dinner: [
        { name: "Salmon with Asparagus", baseCalories: 550, proteinRatio: 0.35, carbRatio: 0.1, fatRatio: 0.55 },
        { name: "Pasta Primavera", baseCalories: 600, proteinRatio: 0.15, carbRatio: 0.65, fatRatio: 0.2 },
        { name: "Stir-fried Tofu with Rice", baseCalories: 500, proteinRatio: 0.25, carbRatio: 0.5, fatRatio: 0.25 },
        { name: "Steak and Potatoes", baseCalories: 700, proteinRatio: 0.3, carbRatio: 0.3, fatRatio: 0.4 },
        { name: "Chicken Curry", baseCalories: 600, proteinRatio: 0.3, carbRatio: 0.4, fatRatio: 0.3 },
    ],
    snack: [
        { name: "Apple and Almonds", baseCalories: 200, proteinRatio: 0.1, carbRatio: 0.4, fatRatio: 0.5 },
        { name: "Protein Shake", baseCalories: 150, proteinRatio: 0.8, carbRatio: 0.1, fatRatio: 0.1 },
        { name: "Carrot Sticks with Hummus", baseCalories: 150, proteinRatio: 0.1, carbRatio: 0.5, fatRatio: 0.4 },
        { name: "Greek Yogurt", baseCalories: 120, proteinRatio: 0.6, carbRatio: 0.2, fatRatio: 0.2 },
        { name: "Rice Cake with Peanut Butter", baseCalories: 180, proteinRatio: 0.15, carbRatio: 0.45, fatRatio: 0.4 },
    ]
};

const WORKOUT_ROTATION = {
    underweight: [
        { type: "Strength", description: "Hypertrophy Focus (Squats, Bench, Deadlift)", durationMinutes: 45, intensity: "high" },
        { type: "Strength", description: "Full Body Mass Build", durationMinutes: 50, intensity: "high" },
        { type: "Rest", description: "Recovery & Calorie Surplus Eating", durationMinutes: 0, intensity: "low" }
    ],
    normal: [
        { type: "Cardio", description: "30 min Jogging", durationMinutes: 30, intensity: "medium" },
        { type: "Strength", description: "Upper Body Circuit", durationMinutes: 45, intensity: "high" },
        { type: "Mixed", description: "CrossFit Style WOD", durationMinutes: 40, intensity: "high" },
        { type: "Flexibility", description: "Yoga Flow", durationMinutes: 30, intensity: "low" }
    ],
    overweight: [
        { type: "Cardio", description: "HIIT Fat Burn", durationMinutes: 35, intensity: "high" },
        { type: "Strength", description: "Metabolic Conditioning", durationMinutes: 45, intensity: "high" },
        { type: "Cardio", description: "Incline Walking", durationMinutes: 45, intensity: "medium" }
    ],
    obese: [
        { type: "Cardio", description: "Low Impact Walking", durationMinutes: 45, intensity: "low" },
        { type: "Strength", description: "Seated Resistance Training", durationMinutes: 30, intensity: "low" },
        { type: "Flexibility", description: "Mobility & Stretching", durationMinutes: 20, intensity: "low" },
        { type: "Cardio", description: "Water Aerobics / Swimming", durationMinutes: 40, intensity: "low" }
    ]
};

const calculateBMI = (weightKg, heightCm) => {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    let category = 'normal';
    if (bmi < 18.5) category = 'underweight';
    else if (bmi < 25) category = 'normal';
    else if (bmi < 30) category = 'overweight';
    else category = 'obese';

    return { bmi, category };
};

/**
 * Generates a meal plan based on calorie target using standard splits.
 */
const generateMeals = (targetCalories) => {
    const mealPlan = [];
    const ratios = { breakfast: 0.3, lunch: 0.35, dinner: 0.25, snack: 0.1 };

    for (const [type, ratio] of Object.entries(ratios)) {
        const targetMealCals = targetCalories * ratio;
        const potentialMeals = MEAL_DATABASE[type];
        // Simple random selection
        const template = potentialMeals[Math.floor(Math.random() * potentialMeals.length)];

        // Scale to target calories
        // Note: Simple linear scaling of macros
        const scaleFactor = targetMealCals / template.baseCalories;

        mealPlan.push({
            name: template.name,
            type: type,
            calories: Math.round(targetMealCals),
            // Approximating macros from ratios of base item
            protein: Math.round(template.baseCalories * template.proteinRatio * scaleFactor / 4), // 4 kcal per g protein
            carbs: Math.round(template.baseCalories * template.carbRatio * scaleFactor / 4), // 4 kcal per g carb
            fats: Math.round(template.baseCalories * template.fatRatio * scaleFactor / 9) // 9 kcal per g fat
        });
    }
    return mealPlan;
};

/**
 * Selects a workout based on BMI Category and day rotation.
 */
const generateWorkout = (date, bmiCategory) => {
    const options = WORKOUT_ROTATION[bmiCategory];
    const dayIndex = date.getDate() % options.length;
    const template = options[dayIndex];
    return {
        type: template.type,
        durationMinutes: template.durationMinutes,
        intensity: template.intensity,
        description: template.description
    };
};

export const generatePlan = async (userId, date = new Date()) => {
    // 1. Fetch Profile to calculate needs
    const profile = await Profile.findOne({ userId });

    // Default values if no profile exists (Fallback logic as per "Assumed Single User")
    const weight = profile?.startingWeight || 70;
    const height = profile?.height || 170;
    const weeklyGoal = profile?.weeklyGoal || 0;
    const activityLevel = profile?.activityLevel || 'moderately_active';

    // 2. Calculate Calories (Mifflin-St Jeor Equation)
    // BMR = 10W + 6.25H - 5A + 5 (Men) / -161 (Women)
    const bmr = (10 * weight) + (6.25 * height) - (5 * DEFAULT_AGE) + (DEFAULT_GENDER_IS_MALE ? 5 : -161);

    const activityMultipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extra_active': 1.9
    };

    const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

    // Adjust for goal: 1kg fat ~ 7700kcal. Weekly goal is in kg.
    // Daily deficit = (Goal * 7700) / 7
    // Example: -0.5kg/week -> -550 kcal/day
    const calorieAdjustment = (weeklyGoal * 7700) / 7;
    const targetCalories = Math.round(tdee + calorieAdjustment);

    // Safety checks for calories (don't go too low or high)
    const finalCalories = Math.max(1200, Math.min(4000, targetCalories));

    // 3. Generate Plan Components
    const { category } = calculateBMI(weight, height);
    const meals = generateMeals(finalCalories);
    const workout = generateWorkout(date, category);

    // 4. Persistence
    // Normalize date to midnight to ensure one plan per calendar day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const plan = await DailyPlan.findOneAndUpdate(
        { userId, date: startOfDay },
        {
            userId,
            date: startOfDay,
            calorieTarget: finalCalories,
            meals: meals,
            workout: workout
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return plan;
};

export const getPlan = async (userId, date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return DailyPlan.findOne({ userId, date: startOfDay });
};
