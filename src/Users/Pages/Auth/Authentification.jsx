import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext.jsx";
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  LoadingOverlay,
  PasswordInput,
} from "@mantine/core";
import { GoogleButton } from "./GoogleButton.tsx";
import { TwitterButton } from "./TwitterButton.tsx";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";
import { PasswordStrength } from "../../Components/Password/PasswordStrength.tsx"; 

export const AuthPage = () => {
  const { setUserData } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [type, toggle] = useToggle(["login", "register"]);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      name: '',
      terms: false,
    },
    validate: {
      email: (val) => (/^\S+@\S+\.\S+$/.test(val) ? null : "Invalid email"),
      password: (val) => (val.length >= 8 ? null : "Password must be at least 8 characters"),
    },
  });

  // Make sure form.values.password is passed and is never undefined
  const password = form.values.password || ''; // Ensure default value is set

  useEffect(() => {
    form.clearErrors();
    console.log("Form type:", type);
  }, [type]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const profileResponse = await fetch("https://www.ticketopia.store/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (profileResponse.ok) {
      const userData = await profileResponse.json();
      localStorage.setItem("userData", JSON.stringify(userData));
      setUserData(userData);
    }
  };

  const handleSubmit = async (values) => {
    console.log("Form type before submit:", type);
    setLoading(true);

    // Ensure terms are accepted before submitting registration
    if (type === 'register' && !values.terms) {
      form.setErrors({ terms: "You must accept the terms and conditions." });
      setLoading(false);
      return; // Prevent form submission if terms are not accepted
    }

    const endpoint = type === 'login' ? 'login' : 'register';
    const requestData = {
      email: values.email,
      password: values.password,
      ...(type === 'register' && { name: values.name }),
    };

    try {
      const response = await fetch(`https://www.ticketopia.store/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        form.setErrors({ email: data.message || "Registration failed" });
        return;
      }

      if (type === 'register') {
        // After successful registration, log the user in automatically if terms are accepted
        const loginResponse = await fetch("https://www.ticketopia.store/api/login", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        const loginData = await loginResponse.json();
        if (loginResponse.ok) {
          localStorage.setItem('auth_token', loginData.token);
          await fetchUserProfile();
          navigate('/');  // Navigate to the homepage after login
        } else {
          form.setErrors({ email: "Login failed after registration" });
        }
      } else {
        localStorage.setItem('auth_token', data.token);
        await fetchUserProfile();
        navigate('/');  // Navigate to homepage after login
      }
    } catch (error) {
      form.setErrors({ email: "An error occurred while processing your request" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#242424]">
      <Paper
        radius="md"
        p="xl"
        withBorder
        style={{ width: 400, background: '#1E1E1E' }}
      >
        <LoadingOverlay visible={loading} />
        <Text size="lg" fw={500} align="center" style={{ color: 'white' }}>
          {type === 'login' ? 'Welcome Back!' : 'Create an Account'}
        </Text>
        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
          <TwitterButton radius="xl">Twitter</TwitterButton>
        </Group>
        <Divider label="Or continue with email" labelPosition="center" my="lg" />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Username"
                placeholder="Username..."
                value={form.values.name}
                onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
                radius="md"
                styles={{
                  label: { color: 'white' },
                  input: { backgroundColor: '#333', color: 'white', borderColor: '#555' },
                }}
              />
            )}
            <TextInput
              label="Email"
              placeholder="Email..."
              value={form.values.email}
              onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
              error={form.errors.email}
              radius="md"
              styles={{
                label: { color: 'white' },
                input: { backgroundColor: '#333', color: 'white', borderColor: '#555' },
              }}
            />
            {type === 'register' ? (
              <PasswordStrength
                password={password}  // Pass password to PasswordStrength, ensuring it is never undefined
                setPassword={(password) => form.setFieldValue('password', password)}
              />
            ) : (
              <PasswordInput
                label="Password"
                placeholder="Password..."
                value={form.values.password}
                onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
                error={form.errors.password}
                radius="md"
                styles={{
                  label: { color: 'white' },
                  input: { backgroundColor: '#333', color: 'white', borderColor: '#555' },
                }}
              />
            )}
            {type === 'register' && (
              <Checkbox
                label="I accept the terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue("terms", event.currentTarget.checked)}
                styles={{
                  label: { color: 'white' },
                  input: { borderColor: '#555' },
                }}
              />
            )}
          </Stack>
          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === 'register'
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
};

export default AuthPage;