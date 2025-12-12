import { CloudUpload } from "@mui/icons-material";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useAuth";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    avatar: null,
    coverImage: null,
  })
  const navigate = useNavigate();
  const register = useRegister();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register.mutateAsync(formData);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': { borderColor: '#4d4d4d' },
      '&:hover fieldset': { borderColor: '#aaaaaa' },
      '&.Mui-focused fieldset': { borderColor: '#3ea6ff' },
    },
    '& .MuiInputLabel-root': { color: '#aaaaaa' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#3ea6ff' },
  };

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
        <div className="flex items-center gap-1 mb-4">
          <div className="bg-red-600 text-white rounded-lg p-1">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[12px] border-l-white border-b-[6px] border-b-transparent ml-[3px]"></div>
          </div>
          <span className="text-white text-2xl font-bold tracking-tighter font-sans">YouTube</span>
        </div>

        <Typography variant="h5" sx={{ fontWeight: 400, mb: 1 }}>Create your Account</Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#aaaaaa' }}>to continue to YouTube</Typography>

        {register.error && (
          <div className="w-full bg-[#ff00001a] border border-red-900 text-red-500 p-3 rounded mb-4 text-sm">
            {register.error.response?.data?.message || register.error.message || "Registration failed."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
            sx={inputStyles}
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
            sx={inputStyles}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
            sx={inputStyles}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
            sx={inputStyles}
          />

          <div className="flex gap-4">
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{
                color: '#aaaaaa',
                borderColor: '#4d4d4d',
                textTransform: 'none',
                '&:hover': { borderColor: '#aaaaaa', color: 'white' }
              }}
            >
              {formData.avatar ? "Avatar Selected" : "Upload Avatar*"}
              <input type="file" hidden name="avatar" onChange={handleFileChange} accept="image/*" />
            </Button>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{
                color: '#aaaaaa',
                borderColor: '#4d4d4d',
                textTransform: 'none',
                '&:hover': { borderColor: '#aaaaaa', color: 'white' }
              }}
            >
              {formData.coverImage ? "Cover Selected" : "Cover Image"}
              <input type="file" hidden name="coverImage" onChange={handleFileChange} accept="image/*" />
            </Button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ color: '#3ea6ff', fontWeight: 500, cursor: 'pointer' }}>
                Sign in instead
              </Typography>
            </Link>

            <Button
              type="submit"
              variant="contained"
              disabled={register.isPending}
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
              {register.isPending ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </div>
        </form>
      </Box>
    </div>
  )
}

export default Register;
