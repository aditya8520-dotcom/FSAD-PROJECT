import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [studentData, setStudentData] = useState([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkouts: 0,
    totalCalories: 0,
  });

  /* ================= HEALTH SCORE ================= */
  const calculateHealthScore = (workouts, moods) => {
    const workoutPoints = workouts.length * 10;

    const caloriesPoints =
      workouts.reduce((sum, w) => sum + (w.calories || 0), 0) / 50;

    const moodPoints = moods.length * 5;

    let score = workoutPoints + caloriesPoints + moodPoints;

    if (score > 100) score = 100;

    return Math.round(score);
  };

  const getHealthStatus = (score) => {
    if (score >= 80) return "🟢 Excellent";
    if (score >= 50) return "🟡 Moderate";
    return "🔴 Needs Attention";
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const storedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    let workoutsCount = 0;
    let caloriesSum = 0;

    const collectedStudents = [];

    storedUsers.forEach((user) => {
      if (user.role === "student") {

        const workouts =
          JSON.parse(
            localStorage.getItem(`workouts_${user.email}`)
          ) || [];

        const moods =
          JSON.parse(
            localStorage.getItem(`moods_${user.email}`)
          ) || [];

        /* ⭐ NEW — WELLNESS PROGRAMS */
        const wellness =
          JSON.parse(
            localStorage.getItem(`wellness_${user.email}`)
          ) || [];

        workoutsCount += workouts.length;

        workouts.forEach((w) => {
          caloriesSum += Number(w.calories || 0);
        });

        const healthScore = calculateHealthScore(
          workouts,
          moods
        );

        collectedStudents.push({
          email: user.email,
          workouts,
          moods,
          wellness,
          healthScore,
          status: getHealthStatus(healthScore),
        });
      }
    });

    setUsers(storedUsers);
    setStudentData(collectedStudents);

    setStats({
      totalUsers: storedUsers.length,
      totalWorkouts: workoutsCount,
      totalCalories: caloriesSum,
    });
  }, []);

  /* ================= SEND ADMIN MESSAGE ================= */
  const handleSendSuggestion = () => {
    if (!suggestion.trim()) {
      alert("Write suggestion first");
      return;
    }

    localStorage.setItem("adminSuggestion", suggestion);
    alert("Suggestion sent to students ✅");
    setSuggestion("");
  };

  /* ================= UI ================= */
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">

        <h1>Admin Control Panel 👨‍💼</h1>
        <p>Student wellness monitoring dashboard</p>

        {/* STATS */}
        <div className="dashboard-tab-buttons">
          <button>👥 Users: {stats.totalUsers}</button>
          <button>🏋️ Workouts: {stats.totalWorkouts}</button>
          <button>🔥 Calories: {stats.totalCalories}</button>
        </div>

        {/* USERS TABLE */}
        <div className="dashboard-widget">
          <h3>Registered Users</h3>

          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* STUDENT REVIEW */}
        <div className="dashboard-widget">
          <h3>Student Wellness Review 📊</h3>

          {studentData.map((student, index) => (
            <div
              key={index}
              style={{
                background: "#f7fbff",
                padding: "18px",
                borderRadius: "12px",
                marginBottom: "20px",
                textAlign: "left",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <h4>👤 {student.email}</h4>

              <p><strong>Health Score:</strong> {student.healthScore}/100</p>
              <p><strong>Status:</strong> {student.status}</p>

              <p><strong>Workouts Logged:</strong> {student.workouts.length}</p>
              <p><strong>Mood Entries:</strong> {student.moods.length}</p>

              {student.moods.length > 0 && (
                <p>
                  <strong>Latest Mood:</strong>{" "}
                  {student.moods[student.moods.length - 1].mood}
                </p>
              )}

              {/* ⭐ NEW PROGRAM DISPLAY */}
              {student.wellness.length > 0 && (
                <>
                  <p><strong>Programs Enrolled:</strong></p>
                  <ul>
                    {student.wellness.map((p, i) => (
                      <li key={i}>🌿 {p}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Workout History */}
              {student.workouts.length > 0 && (
                <>
                  <h5>Workout History:</h5>
                  <ul>
                    {student.workouts.map((w, i) => (
                      <li key={i}>
                        🏃 <strong>
                          {w.workoutName ||
                           w.name ||
                           w.exercise ||
                           "Workout"}
                        </strong>
                        {" — "}
                        {w.duration} mins
                        {" — "}
                        🔥 {w.calories} kcal
                        {" — "}
                        📅 {w.date || "No date"}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>

        {/* ADMIN MESSAGE */}
        <div className="dashboard-widget">
          <h3>Send Wellness Suggestion 💬</h3>

          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Write advice for students..."
            style={{
              width: "100%",
              height: "120px",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "15px",
            }}
          />

          <button
            onClick={handleSendSuggestion}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "#00bcd4",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Send Suggestion
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;