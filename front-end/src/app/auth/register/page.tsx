"use client";

import Image from "next/image";
import pics from "@/assets/pic.jpg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const RegisterPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      username,
      email,
      password_hash: password,
      role
    };

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      toast.success("Registration successful!", { autoClose: 2000 } );
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.message, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="relative hidden md:block">
        <Image src={pics} alt="Register Illustration" fill className="object-cover" />
      </div>

      <div className="w-full h-full flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center">Register</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-6">
            <div>
              <label className="block font-medium">Username</label>
              <input
                type="text"
                className="w-full mt-2 px-3 py-2 border rounded-md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
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
            <div className="mt-4">
              <label className="block font-medium">Register as</label>
              <div className="flex space-x-4 mt-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md w-full cursor-pointer ${
                    role === "user" ? "bg-red-900 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setRole("user")}
                >
                  User
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md w-full cursor-pointer ${
                    role === "admin" ? "bg-red-900 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setRole("admin")}
                >
                  Admin
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-red-900 text-white py-2 rounded-md hover:bg-red-800"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/auth/login" className="text-red-900 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
