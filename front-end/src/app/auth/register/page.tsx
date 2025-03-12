"use client";

import Image from "next/image";
import pics from "@/assets/pic.jpg";
import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Registering:", { username, email, password, role });
    router.push("/auth/login");
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="relative">
        <Image src={pics} alt="Register Illustration" fill className="object-cover" />
      </div>

      <div className="w-full flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center">Register</h2>
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
              <input
                type="password"
                className="w-full mt-2 px-3 py-2 border rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
              Register
            </button>
          </form>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-red-900 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
