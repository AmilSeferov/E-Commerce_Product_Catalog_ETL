import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, UserPlus, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  phone: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

interface ApiError {
  error: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSuccess("");
  };

  const validate = (): FormErrors => {
    let newErrors: FormErrors = {};

    if (!form.username.trim())
      newErrors.username = "İstifadəçi adı tələb olunur";

    if (!form.email.trim()) {
      newErrors.email = "Email tələb olunur";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email düzgün deyil";
    }

    if (!form.password.trim()) {
      newErrors.password = "Şifrə tələb olunur";
    } else if (form.password.length < 4) {
      newErrors.password = "Şifrə ən az 4 simvol olmalıdır";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:2000/adduser", form);
      setSuccess("Qeydiyyat uğurla tamamlandı!");
      setForm({ username: "", email: "", password: "", phone: "" });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      if (err.response?.data?.error) {
        setErrors({ email: err.response.data.error });
      }
    } finally {
      setLoading(false);
    }
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
            Qeydiyyat
          </h1>
          <p className="text-gray-600">ShahStore ailəsinə qoşulun</p>
        </div>

        {/* REGISTER FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 space-y-5"
        >
          
          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
              <CheckCircle className="text-green-600 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-green-800">Uğurlu!</p>
                <p className="text-sm text-green-600">{success}</p>
              </div>
            </div>
          )}

          {/* USERNAME */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">
              İstifadəçi adı
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="username"
                placeholder="İstifadəçi adınızı daxil edin"
                value={form.username}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition outline-none ${
                  errors.username
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                }`}
              />
            </div>
            {errors.username && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.username}</span>
              </div>
            )}
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition outline-none ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                }`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">Şifrə</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition outline-none ${
                  errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                }`}
              />
            </div>
            {errors.password && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">
              Telefon <span className="text-sm text-gray-500">(opsional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="phone"
                placeholder="+994 XX XXX XX XX"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition outline-none"
              />
            </div>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Qeydiyyat edilir...</span>
              </>
            ) : (
              <>
                <UserPlus size={20} />
                <span>Qeydiyyatdan keç</span>
              </>
            )}
          </button>

          {/* LOGIN LINK */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Artıq hesabınız var?{" "}
              <a
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
              >
                Daxil olun
              </a>
            </p>
          </div>
        </form>

        {/* FOOTER NOTE */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Qeydiyyatdan keçməklə siz{" "}
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

export default Register;