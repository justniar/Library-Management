"use client";

import Image from "next/image";
import pics from "@/assets/pic.jpg"
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login with:", { username, password });

        router.push('/dashboard/user')
    };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="relative">
        <Image
          src={pics}
          alt="Login Illustration"
          fill
          className="object-cover"
        />
      </div>

      <div className="w-full flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center">Login</h2>
          <form onSubmit={handleSubmit} className="mt-6">
            <div>
              <label className="block font-medium">Username</label>
              <input
                type="username"
                className="w-full mt-2 px-3 py-2 border rounded-md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <button
              type="submit"
              className="w-full mt-6 bg-red-900 text-white py-2 rounded-md hover:bg-red-800"
            >
              Login
            </button>
          </form>
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <a href="/auth/register" className="text-red-900 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
