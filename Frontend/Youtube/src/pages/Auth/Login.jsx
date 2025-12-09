import { Button, Card, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useAuth";



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password })
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {login.error && (
          <div className="bg-red-100 p-3 rounded mb-4 text-red-700 ">
            {login.error.response?.data?.message || "An error occurred during login."}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            color="primary"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            color="primary"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={login.isLoading}
          >
            {login.isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?{' '} <a href="/register" className="text-blue-500">Register here</a>
        </p>
      </Card>
    </div>
  )
}



export default Login;
