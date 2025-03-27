"use client";
import { useState } from "react";
import { Container, Typography, Button, TextField } from "@mui/material";
import { login } from "../../apis/loginApi";
import { useRouter } from "next/navigation";
import { User } from "@monorepo/shared/src/user";


import { login as loginApi } from "../../apis/authApi";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      setError("");

      // Get data direct to firebase
      const user: User = await login(email, password); // Panggil login function

      // validation on backend service 
      const { token } = await loginApi(user.email, password);

      localStorage.setItem("jwt", token);

      setLoading(false);
      router.push("/user"); // Redirect ke halaman dashboard setelah login
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Login gagal");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" fullWidth margin="normal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
        {loading ? 'Loading...' : 'Login'}
      </Button>
    </Container>
  );
};

export default LoginForm;
