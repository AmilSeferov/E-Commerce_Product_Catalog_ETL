import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, AlertCircle, ArrowLeft } from "lucide-react";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

    setLoading(true);

    axios
      .post("http://localhost:2000/login", { email, password })
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/");
      })
      .catch(() => {
        setError("Email və ya şifrə yanlışdır!");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-xl border-2 border-gray-200 transition-all shadow-md"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Ana səhifə</span>
      </button>

      <div className="w-full max-w-md">
        
        {/* LOGO / HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl mb-4 shadow-2xl">
            <span className="text-4xl font-bold text-white">S</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Xoş gəlmisiniz
          </h1>
          <p className="text-gray-600">ShahStore hesabınıza daxil olun</p>
        </div>

        {/* LOGIN FORM */}
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 space-y-6"
        >
          
          {/* ERROR MESSAGE */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="text-red-600 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-red-800">Xəta baş verdi</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition outline-none"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">
              Şifrə
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="text-right">
            <a
              href="#"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
            >
              Şifrəni unutmusunuz?
            </a>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Yoxlanılır...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Daxil ol</span>
              </>
            )}
          </button>

          {/* REGISTER LINK */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Hesabınız yoxdur?{" "}
              <a
                href="/register"
                className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
              >
                Qeydiyyatdan keçin
              </a>
            </p>
          </div>
        </form>

        {/* FOOTER NOTE */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Daxil olmaqla siz{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              İstifadə Şərtləri
            </a>{" "}
            və{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Gizlilik Siyasəti
            </a>
            ni qəbul edirsiniz
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;