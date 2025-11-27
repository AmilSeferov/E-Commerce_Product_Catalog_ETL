import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string>("");

  const validate = (): boolean => {
    if (!email.trim()) {
      setError("Email daxil edin!");
      return false;
    }

    if (!email.includes("@")) {
      setError("Düzgün email daxil edin!");
      return false;
    }

    if (!password.trim()) {
      setError("Şifrə daxil edin!");
      return false;
    }

    if (password.length < 4) {
      setError("Şifrə ən az 4 simvol olmalıdır!");
      return false;
    }

    return true;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    axios
      .post("http://localhost:2000/login", { email, password })
      .then((res) => {
        console.log("Login Success:", res.data);
        
        // TOKEN saxlanma (backend token göndərirsə)
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
          localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/"); // 🔥 login uğurlu oldu → Home page
      })
      .catch(() => {
        setError("Email və ya şifrə yanlışdır!");
      });
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-center p-4">

      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg border border-green-200"
      >
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Daxil ol
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-3 text-center">
            {error}
          </p>
        )}

        {/* Email */}
        <label className="block mb-2 font-medium text-green-700">
          Email
        </label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none mb-4"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="block mb-2 font-medium text-green-700">
          Şifrə
        </label>
        <input
          type="password"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none mb-4"
          placeholder="Şifrənizi daxil edin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow transition font-medium"
        >
          Daxil ol
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Hesabın yoxdur?{" "}
          <a
            href="/register"
            className="text-green-700 font-semibold hover:underline"
          >
            Qeydiyyatdan keç
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
