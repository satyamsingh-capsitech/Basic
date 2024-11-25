import React from "react";
import { useFormik } from "formik";
import { TextField, PrimaryButton, Stack } from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const validate = (values: { username: string; password: string }) => {
  const errors: { username?: string; password?: string } = {};
  if (!values.username) {
    errors.username = "Username is required";
  }
  if (!values.password) {
    errors.password = "Password is required";
  }
  return errors;
};

const LoginPage = () => {
  const navigate = useNavigate();

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        // Send login  API
        const response = await axios.post(
          "https://localhost:7147/api/Login/login",
          {
            username: values.username,
            password: values.password,
          }
        );
        console.log("API response:", response);

        if (response.status === 200) {
          const { token } = response.data;

          localStorage.setItem("token", token);

          localStorage.setItem("user", JSON.stringify(response.data));

          navigate("/navigate");
        } else {
          alert("Invalid username or password");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Invalid username or password ");
      }
    },
  });

  return (
    <Stack horizontal styles={{ root: { height: "70vh" } }}>
      <Stack.Item
        grow={1}
        styles={{ root: { paddingTop: "50px", paddingLeft: "650px" } }}
      >
        <Stack
          tokens={{ childrenGap: 20 }}
          styles={{ root: { maxWidth: 400 } }}
        >
          <TextField
            label="Username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={formik.touched.username && formik.errors.username}
            autoComplete="username"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={formik.touched.password && formik.errors.password}
            autoComplete="current-password"
          />
          <PrimaryButton
            text="Login"
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting || !formik.isValid}
          />
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

export default LoginPage;
