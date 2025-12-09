import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useAuth";
import { TextField, Button, CircularProgress, Card} from "@mui/material";



function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    avatar: null,
  })
  const navigate = useNavigate();
  const register = useRegister();
  const handleChange = (e) => {
    const {name,value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
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

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        {register.error && (
          <div className="bg-red-100 p-3 rounded mb-4 text-red-700">
            {register.error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={register.isPending}
          >
            {register.isPending ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </Card>
    </div>
  )
}


export default Register;
