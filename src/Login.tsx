import React, { useState } from "react";
import { TextField, PrimaryButton, Stack } from "@fluentui/react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset
    try {
      const response = await fetch("https://localhost:7147/api/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        navigate("/navigate");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Stack horizontal styles={{ root: { height: "100vh" } }}>
      <Stack.Item
        grow
        styles={{
          root: {
            backgroundImage:
              'url("https://lvivity.com/wp-content/uploads/2021/06/hospital-CRM.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          },
        }}
      ></Stack.Item>

      <Stack.Item
        grow
        styles={{
          root: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{ maxWidth: "300px", width: "100%" }}
        >
          <Stack tokens={{ childrenGap: 15 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e, newValue) => setUsername(newValue || "")}
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e, newValue) => setPassword(newValue || "")}
              required
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <PrimaryButton text="Login" type="submit" />
          </Stack>
        </form>
      </Stack.Item>
    </Stack>
  );
};

export default LoginPage;
