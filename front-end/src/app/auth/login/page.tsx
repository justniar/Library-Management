"use client";

import Image from "next/image";
import pics from "@/assets/pic.jpg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RingLoader } from "react-spinners";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email,
      password_hash: password,
    };

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const token = data.token;

      if (!token) {
        throw new Error("Invalid token received.");
      }

      const decodedToken: any = jwtDecode(token);
      const role = decodedToken.role;
      const username = decodedToken.username;
      const id = decodedToken.id;

      if (!role) {
        throw new Error("Role not found in token.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      localStorage.setItem("id", id);

      console.log(localStorage.getItem("token"))
      toast.success("Login success! Go to dashboard...", { autoClose: 1000 });

      setTimeout(() => {
        if (role.toLowerCase() === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/user");
        }
      }, 2000);
    } catch (error: any) {
      toast.error(error.message, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="relative hidden md:block">
        <Image src={pics} alt="Login Illustration" fill className="object-cover" />
      </div>

      <div className="w-full h-full flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center">Login</h2>
          
          {loading && (
            <div className="flex justify-center mt-4">
              <RingLoader color="#9f0707" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6">
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                className="w-full mt-2 px-3 py-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mt-4">
              <label className="block font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full mt-2 px-3 py-2 border rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-red-900 text-white py-2 rounded-md hover:bg-red-950"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <a href="/auth/register" className="text-red-900 hover:underline">
              Register
            </a>
          </p>
        </div>
        <ToastContainer />
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
