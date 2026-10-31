import React, { useState } from "react";
import { Button, Input } from "@heroui/react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setIsLoading(true);
    try {
      await axios.post("https://trying-task.vercel.app/forget-password", { email });
      
      toast.success("Verification code sent to your email! 📧");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "User not found or server error";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Forgot Password?</h2>
          <p className="text-gray-400 font-bold mt-2">Enter your email to receive a reset code</p>
        </div>

        <form onSubmit={handleSendCode} className="space-y-6">
          <Input 
            label="Email Address" 
            variant="bordered" size="lg" labelPlacement="outside"
            placeholder="name@example.com" className="font-bold"
            radius="xl"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />

          <Button 
            isLoading={isLoading} type="submit"
            className="w-full h-16 bg-green-600 text-white font-black rounded-2xl text-lg shadow-lg shadow-green-100 mt-4"
          >
            Send Reset Code
          </Button>

          <div className="text-center">
            <Link to="/login" className="text-gray-400 font-bold hover:text-green-600 transition-colors uppercase tracking-widest text-xs">
              Back to Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}