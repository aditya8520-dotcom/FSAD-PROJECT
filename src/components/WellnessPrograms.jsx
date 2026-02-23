import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const programsList = [
  {
    name: "Yoga Challenge 🧘",
    desc: "Improve flexibility, posture and reduce daily stress through guided yoga sessions.",
    duration: "21 Days"
  },
  {
    name: "Meditation Program 🧠",
    desc: "Practice mindfulness and mental relaxation for better emotional balance.",
    duration: "14 Days"
  },
  {
    name: "30-Day Fitness Challenge 💪",
    desc: "Build workout consistency and stamina with structured exercises.",
    duration: "30 Days"
  }
];

const WellnessPrograms = () => {
  const userEmail = localStorage.getItem("userEmail");
  const [joinedPrograms, setJoinedPrograms] = useState([]);

  /* LOAD JOINED PROGRAMS */
  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem(`wellness_${userEmail}`)) || [];
    setJoinedPrograms(saved);
  }, [userEmail]);

  /* JOIN PROGRAM */
  const joinProgram = (programName) => {
    const alreadyJoined = joinedPrograms.find(
      (p) => p.name === programName
    );

    if (alreadyJoined) {
      alert("Already joined!");
      return;
    }

    const newProgram = {
      name: programName,
      joinedDate: new Date().toLocaleDateString(),
      progress: 0,
    };

    const updated = [...joinedPrograms, newProgram];

    setJoinedPrograms(updated);

    localStorage.setItem(
      `wellness_${userEmail}`,
      JSON.stringify(updated)
    );

    alert("Program joined successfully ✅");
  };

  return (
    <div>
      <h3>Wellness Programs 🌿</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "22px",
          marginTop: "25px",
        }}
      >
        {programsList.map((p, i) => {
          const joined = joinedPrograms.find(
            (jp) => jp.name === p.name
          );

          return (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.9)",
                padding: "22px",
                borderRadius: "18px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                transition: "0.3s",
              }}
            >
              <h4>{p.name}</h4>
              <p style={{ minHeight: "60px" }}>{p.desc}</p>

              <p>
                <strong>Duration:</strong> {p.duration}
              </p>

              {joined ? (
                <>
                  <div
                    style={{
                      marginTop: "10px",
                      background: "#e8f7ff",
                      padding: "8px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    ✅ Joined on {joined.joinedDate}
                  </div>

                  <button
                    disabled
                    style={{
                      marginTop: "12px",
                      padding: "8px 15px",
                      background: "#aaa",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  >
                    Already Enrolled
                  </button>
                </>
              ) : (
                <button
                  onClick={() => joinProgram(p.name)}
                  style={{
                    marginTop: "12px",
                    padding: "10px 18px",
                    background: "#00bcd4",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Join Program
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WellnessPrograms;