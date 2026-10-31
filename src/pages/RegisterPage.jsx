import React, { useState } from "react";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { scheme } from "../schema/registerSchema";
import { registerApi } from "../services/authservices";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { handleSubmit, register, formState: { errors }, reset } = useForm({
    defaultValues: { fullname: "", email: "", password: "", confirmPassword: "" },
    resolver: zodResolver(scheme),
  });

  async function handleRegister(formData) {
    setIsLoading(true);
    try {
      await registerApi(formData);

      toast.success("Account created! 🎉", { position: "top-center", autoClose: 1000 });
      reset();
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Try again.";
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
          <h1 className="text-3xl font-black mb-2 tracking-tighter italic">
            Join <span className="text-green-600">SMART</span> Nutrition
          </h1>
          <p className="text-gray-500 font-bold">Start your fitness journey today</p>
        </div>

        <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-5">
          <Input
            isInvalid={Boolean(errors.fullname)}
            errorMessage={errors.fullname?.message}
            variant="bordered"
            label="Full Name"
            labelPlacement="outside"
            placeholder="Ahmed Mahfouz"
            size="lg"
            radius="xl"
            className="font-bold"
            {...register("fullname")}
          />

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

          <Input
            isInvalid={Boolean(errors.password)}
            errorMessage={errors.password?.message}
            variant="bordered"
            label="Password"
            labelPlacement="outside"
            type="password"
            placeholder="••••••••"
            size="lg"
            radius="xl"
            className="font-bold"
            {...register("password")}
          />

          <Input
            isInvalid={Boolean(errors.confirmPassword)}
            errorMessage={errors.confirmPassword?.message}
            variant="bordered"
            label="Confirm Password"
            labelPlacement="outside"
            type="password"
            placeholder="••••••••"
            size="lg"
            radius="xl"
            className="font-bold"
            {...register("confirmPassword")}
          />

          <Button
            isLoading={isLoading}
            type="submit"
            className="w-full h-16 bg-gray-900 text-white text-lg font-black rounded-2xl mt-4 shadow-xl active:scale-95 transition-transform"
          >
            Create Account
          </Button>

          <p className="text-center text-gray-500 font-bold text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 underline underline-offset-4 decoration-2">
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
