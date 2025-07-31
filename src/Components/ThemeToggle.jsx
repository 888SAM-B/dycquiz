import { useEffect, useState } from "react";

const url = import.meta.env.VITE_URL;
const token = localStorage.getItem('token'); 
export default function ThemeToggle() {
  const [theme, setTheme] = useState("light-mode");

  // Fetch default theme from DB on first load
  useEffect(() => {
    fetch(`${url}/get-theme`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.theme) {
          setTheme(data.theme);
          document.body.className = data.theme; // Apply theme to body
        }
      })
      .catch((err) => console.error("Error fetching theme:", err));
  }, []);

  // Toggle logic
  const toggleTheme = () => {
    const newTheme = theme === "dark-mode" ? "light-mode" : "dark-mode";
    setTheme(newTheme);
    console.log(newTheme)
    document.body.className = newTheme;

    fetch(`${url}/update-theme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ theme: newTheme }),
    });
  };

  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={theme === "dark-mode"}
        onChange={toggleTheme}
      />
      <span className="slider" />
    </label>
  );
}
