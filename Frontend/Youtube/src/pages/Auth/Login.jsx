import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f0f0f] text-white p-4">
      <Box
        sx={{
          width: '100%',
          maxWidth: '450px',
          bgcolor: '#0f0f0f',
          border: { sm: '1px solid #303030' },
          borderRadius: '8px',
          p: { xs: 2, sm: 5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-1 mb-4">
          <div className="bg-red-600 text-white rounded-lg p-1">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[12px] border-l-white border-b-[6px] border-b-transparent ml-[3px]"></div>
          </div>
          <span className="text-white text-2xl font-bold tracking-tighter font-sans">YouTube</span>
        </div>

        <Typography variant="h5" sx={{ fontWeight: 400, mb: 1 }}>Sign in</Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#aaaaaa' }}>to continue to YouTube</Typography>

        {login.error && (
          <div className="w-full bg-[#ff00001a] border border-red-900 text-red-500 p-3 rounded mb-4 text-sm">
            {login.error.response?.data?.message || "Login failed. Check your credentials."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <TextField
            fullWidth
            label="Email or Username"
            type="text" // Changed to text to allow username login if supported, or keep email
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: '#4d4d4d' },
                '&:hover fieldset': { borderColor: '#aaaaaa' },
                '&.Mui-focused fieldset': { borderColor: '#3ea6ff' },
              },
              '& .MuiInputLabel-root': { color: '#aaaaaa' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#3ea6ff' },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: '#4d4d4d' },
                '&:hover fieldset': { borderColor: '#aaaaaa' },
                '&.Mui-focused fieldset': { borderColor: '#3ea6ff' },
              },
              '& .MuiInputLabel-root': { color: '#aaaaaa' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#3ea6ff' },
            }}
          />

          <div className="flex justify-between items-center mt-2">
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ color: '#3ea6ff', fontWeight: 500, cursor: 'pointer' }}>
                Create account
              </Typography>
            </Link>

            <Button
              type="submit"
              variant="contained"
              disabled={login.isLoading}
              sx={{
                textTransform: 'none',
                bgcolor: '#3ea6ff',
                color: 'black',
                fontWeight: 600,
                px: 3,
                '&:hover': { bgcolor: '#65b8ff' },
                '&.Mui-disabled': { bgcolor: '#203a54', color: '#606060' }
              }}
            >
              {login.isLoading ? <CircularProgress size={24} color="inherit" /> : "Next"}
            </Button>
          </div>
        </form>
      </Box>
    </div>
  )
}

export default Login;
