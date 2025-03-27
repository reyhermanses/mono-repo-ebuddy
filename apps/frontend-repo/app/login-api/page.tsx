"use client"
import { useState } from "react";
import { Container, Typography, Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "../../apis/authApi";
import { useRouter } from "next/navigation";

const LoginFormApi = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true)
    try {
      setError("");
      const { token } = await login(email, password);
      localStorage.setItem("jwt", token);
      setLoading(false)
      router.push("/user");
    } catch (err: any) {
      setLoading(false)
      setError(err.message || "Login gagal");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        fullWidth
        margin="normal"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
        {loading ? 'Loading...' : 'Login'}
      </Button>
    </Container>
  );
};

export default LoginFormApi;