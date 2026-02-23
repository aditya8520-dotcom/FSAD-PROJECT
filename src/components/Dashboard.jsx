import React, { useState, useEffect } from "react";
import "./Dashboard.css";

import CalorieCalculator from "./CalorieCalculator";
import StepsCalculator from "./StepsCalculator";
import WorkoutLogger from "./WorkoutLogger";
import WeeklyProgressChart from "./WeeklyProgressChart";
import HealthResources from "./HealthResources";
import MentalWellness from "./MentalWellness";
import NutritionGuide from "./NutritionGuide";
import WellnessPrograms from "./WellnessPrograms";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("chart");
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [healthScore, setHealthScore] = useState(0);

  const userEmail = localStorage.getItem("userEmail");
  const username = userEmail ? userEmail.split("@")[0] : "Student";

  /* ================= LOAD USER DATA ================= */
  useEffect(() => {
    if (!userEmail) return;

    const workouts =
      JSON.parse(localStorage.getItem(`workouts_${userEmail}`)) || [];

    const moods =
      JSON.parse(localStorage.getItem(`moods_${userEmail}`)) || [];

    setWorkoutLogs(workouts);
    calculateHealthScore(workouts, moods);
  }, [userEmail]);

  /* ================= HEALTH SCORE ================= */
  const calculateHealthScore = (workouts, moods) => {
    const workoutPoints = workouts.length * 10;

    const caloriesPoints =
      workouts.reduce((sum, w) => sum + (w.calories || 0), 0) / 50;

    const moodPoints = moods.length * 5;

    let score = workoutPoints + caloriesPoints + moodPoints;

    if (score > 100) score = 100;

    setHealthScore(Math.round(score));
  };

  /* ================= ADD WORKOUT ================= */
  const handleAddWorkout = (workout) => {
    const updated = [
      ...workoutLogs,
      {
        ...workout,
        duration: parseInt(workout.duration),
        calories: parseInt(workout.calories),
      },
    ];

    setWorkoutLogs(updated);

    localStorage.setItem(
      `workouts_${userEmail}`,
      JSON.stringify(updated)
    );

    const moods =
      JSON.parse(localStorage.getItem(`moods_${userEmail}`)) || [];

    calculateHealthScore(updated, moods);
  };

  /* ================= STATUS LABEL ================= */
  const getHealthStatus = () => {
    if (healthScore >= 80) return "Excellent ✅";
    if (healthScore >= 50) return "Good 👍";
    return "Needs Attention ⚠";
  };

  const totalCalories = workoutLogs.reduce(
    (sum, w) => sum + (w.calories || 0),
    0
  );

  const adminSuggestion = localStorage.getItem("adminSuggestion");

  /* ================= UI ================= */
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">

        <h1>Student Health & Wellness Dashboard</h1>
        <h3>Welcome, {username} 👋</h3>

        <p>
          Track fitness, nutrition, and mental well-being through smart
          health analytics.
        </p>

        <h4>Total Calories Burned: {totalCalories} kcal 🔥</h4>

        {/* HEALTH SCORE */}
        <div
          style={{
            background: "#e8f7ff",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          ❤️ Health Score: {healthScore}/100 — {getHealthStatus()}
        </div>

        {/* ADMIN MESSAGE */}
        {adminSuggestion && (
          <div
            style={{
              background: "#fff3cd",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            💬 <b>Admin Suggestion:</b> {adminSuggestion}
          </div>
        )}

        {/* ================= TABS ================= */}
        <div className="dashboard-tab-buttons">

          <button
            className={activeTab === "chart" ? "active" : ""}
            onClick={() => setActiveTab("chart")}
          >
            Progress Chart
          </button>

          <button
            className={activeTab === "logger" ? "active" : ""}
            onClick={() => setActiveTab("logger")}
          >
            Workout Logger
          </button>

          <button
            className={activeTab === "calories" ? "active" : ""}
            onClick={() => setActiveTab("calories")}
          >
            Calorie Calculator
          </button>

          <button
            className={activeTab === "steps" ? "active" : ""}
            onClick={() => setActiveTab("steps")}
          >
            Steps Calculator
          </button>

          <button
            className={activeTab === "resources" ? "active" : ""}
            onClick={() => setActiveTab("resources")}
          >
            Health Resources
          </button>

          <button
            className={activeTab === "mental" ? "active" : ""}
            onClick={() => setActiveTab("mental")}
          >
            Mental Wellness
          </button>

          <button
            className={activeTab === "nutrition" ? "active" : ""}
            onClick={() => setActiveTab("nutrition")}
          >
            Nutrition Guide
          </button>

          {/* ⭐ NEW TAB */}
          <button
            className={activeTab === "programs" ? "active" : ""}
            onClick={() => setActiveTab("programs")}
          >
            Wellness Programs
          </button>

        </div>

        {/* ================= TAB CONTENT ================= */}
        <div className="dashboard-widget">

          {activeTab === "chart" && (
            <WeeklyProgressChart workoutLogs={workoutLogs} />
          )}

          {activeTab === "logger" && (
            <WorkoutLogger onAddWorkout={handleAddWorkout} />
          )}

          {activeTab === "calories" && <CalorieCalculator />}
          {activeTab === "steps" && <StepsCalculator />}
          {activeTab === "resources" && <HealthResources />}
          {activeTab === "mental" && <MentalWellness />}
          {activeTab === "nutrition" && <NutritionGuide />}

          {/* ⭐ NEW COMPONENT RENDER */}
          {activeTab === "programs" && <WellnessPrograms />}

        </div>

      </div>
    </div>
  );
};

export default Dashboard;