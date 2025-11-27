import React, { useState } from "react";
import axios, { AxiosError } from "axios";

// Form data tipi
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
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    phone: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors({ ...errors, [e.target.name]: "" });
    setSuccess("");
  };

  const validate = (): FormErrors => {
    let newErrors: FormErrors = {};

    if (!form.username.trim()) newErrors.username = "İstifadəçi adı tələb olunur";

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

    try {
      await axios.post("http://localhost:2000/adduser", form);

      setSuccess("Qeydiyyat uğurla tamamlandı!");
      setForm({ username: "", email: "", password: "", phone: "" });
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      if (err.response?.data?.error) {
        setErrors({ email: err.response.data.error });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50 p-4">
      <div className="w-full max-w-md bg-white border border-green-300 rounded-lg shadow-lg p-6">
        
        <h2 className="text-2xl font-bold text-center text-green-700 mb-4">
          İstifadəçi Qeydiyyatı
        </h2>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-2 rounded mb-3">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block font-medium text-green-700 mb-1">İstifadəçi adı</label>
            <input placeholder="İstifadəçi adınızı daxil edin"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-green-300 focus:border-green-600 focus:ring-1 focus:ring-green-500 rounded p-2"
            />
            {errors.username && (
              <p className="text-red-600 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium text-green-700 mb-1">Email</label>
            <input placeholder="Emailinizi daxil edin"
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-green-300 focus:border-green-600 focus:ring-1 focus:ring-green-500 rounded p-2"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium text-green-700 mb-1">Şifrə</label>
            <input placeholder="Şifrənizi daxil edin"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-green-300 focus:border-green-600 focus:ring-1 focus:ring-green-500 rounded p-2"
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium text-green-700 mb-1">Telefon (opsional)</label>
            <input
            placeholder="Telefon nömrənizi daxil edin"
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-green-300 focus:border-green-600 focus:ring-1 focus:ring-green-500 rounded p-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition text-white rounded p-2 font-semibold shadow"
          >
            Qeydiyyat
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
