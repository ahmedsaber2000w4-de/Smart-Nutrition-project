
import React, { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    code: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state?.email) {
      toast.error("Please start from the Forgot Password page");
      navigate("/forget-password");
    }
  }, [state, navigate]);

  const handleReset = async () => {
    const { code, newPassword, confirmPassword } = formData;

    if (!code || !newPassword || !confirmPassword) {
      return toast.error("Please fill in all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setIsLoading(true);
    try {
      await axios.post("https://trying-task.vercel.app/reset-password", { 
        email: state.email, 
        code: code, 
        newPassword: newPassword, 
        confirmPassword: confirmPassword
      });

      toast.success("Password changed successfully! ✅");
      navigate("/login", { replace: true });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid code or reset failed";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-green-600 italic">Reset Password</h2>
          <p className="text-gray-400 text-sm font-bold mt-1">Sent to: {state?.email}</p>
        </div>

        <div className="space-y-4">
          <Input 
            label="Verification Code" variant="bordered" size="lg" radius="xl"
            placeholder="Enter code from email" className="font-bold"
            value={formData.code} 
            onChange={(e) => setFormData({...formData, code: e.target.value})} 
          />
          <Input 
            label="New Password" type="password" variant="bordered" size="lg" radius="xl"
            placeholder="••••••••" className="font-bold"
            value={formData.newPassword} 
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
          />
          <Input 
            label="Confirm Password" type="password" variant="bordered" size="lg" radius="xl"
            placeholder="••••••••" className="font-bold"
            value={formData.confirmPassword} 
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
          />
          <Button 
            isLoading={isLoading} onClick={handleReset} 
            className="w-full h-16 bg-green-600 text-white font-black rounded-2xl text-lg shadow-lg shadow-green-100 mt-4"
          >
            Update Password
          </Button>
        </div>
      </motion.div>
    </div>
  );
}