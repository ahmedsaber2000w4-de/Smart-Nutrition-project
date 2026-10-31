import React, { useState, useContext } from "react";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginApi } from "../services/authservices";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../schema/LoginSchema";
import { authContext } from "../contexts/authContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(authContext);

  const { handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin(formData) {
    setIsLoading(true);
    try {
      const data = await loginApi(formData);
      // data shape: { status, token, data: { user: { fullname, role, ... }, hasProfile } }

      if (data?.token) {
        // ✅ حفظ الـ token والـ user في localStorage
        localStorage.setItem("token", data.token);

        const userInfo = data.data?.user || {};
        localStorage.setItem("user", JSON.stringify({
          fullname: userInfo.fullname || formData.email.split("@")[0],
          email:    userInfo.email    || formData.email,
          role:     userInfo.role     || "user",
        }));

        setIsLoggedIn(true);
        toast.success("Welcome Back! ✨", { position: "top-center", autoClose: 1000 });

        setTimeout(() => {
          const role       = (userInfo.role || "").toLowerCase();
          const hasProfile = data.data?.hasProfile;

          if (role === "admin") {
            navigate("/admin/dashboard");
          } else if (!hasProfile) {
            // مفيش profile → onboarding الأول
            navigate("/onboarding");
          } else {
            navigate("/home");
          }
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      toast.error(msg, { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2 tracking-tighter italic">
            <span className="text-green-600">SMART</span> Nutrition
          </h1>
          <p className="text-gray-500 font-bold">Welcome back, please sign in</p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-6">
          <Input
            isInvalid={Boolean(errors.email)}
            errorMessage={errors.email?.message}
            variant="bordered"
            label="Email Address"
            labelPlacement="outside"
            placeholder="name@example.com"
            size="lg"
            radius="xl"
            className="font-bold"
            {...register("email")}
          />

          <div className="flex flex-col gap-2">
            <Input
              isInvalid={Boolean(errors.password)}
              errorMessage={errors.password?.message}
              variant="bordered"
              label="Password"
              labelPlacement="outside"
              placeholder="••••••••"
              type="password"
              size="lg"
              radius="xl"
              className="font-bold"
              {...register("password")}
            />
            <div className="flex justify-end">
              <Link
                to="/forget-password"
                className="text-xs font-black text-gray-400 hover:text-green-600 transition-colors uppercase tracking-widest"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            isLoading={isLoading}
            type="submit"
            className="w-full h-16 bg-green-600 text-white text-xl font-black rounded-2xl shadow-lg shadow-green-100 mt-4 active:scale-95 transition-transform"
          >
            {isLoading ? "Verifying..." : "Sign In"}
          </Button>

          <p className="text-center text-gray-500 font-bold text-sm">
            New here?{" "}
            <Link to="/register" className="text-green-600 underline underline-offset-4 decoration-2">
              Create account
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
