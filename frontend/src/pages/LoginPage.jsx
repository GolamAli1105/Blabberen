import { Chats, Eye } from 'phosphor-react';
import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import chatbotSayingHello from "../assets/chatbotSayingHello.jpg"
import { motion } from "motion/react"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {login, isLoggingIn} = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="mt-4 h-[calc(100vh-4rem)] pt-20 grid lg:grid-cols-[2fr_1fr] overflow-hidden">
      {/*Left*/}
      <div className="flex flex-col flex-1 justify-center items-center p-6 overflow-hidden">
        <div className="w-full max-w-md space-y-8">
          {/*Logo*/}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <Chats className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/*Right*/}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-primary/30 to-primary/60 text-white p-6 rounded-l-3xl shadow-lg overflow-hidden"
      >
        <img 
          src={chatbotSayingHello}
          alt="Chatbot"
          className="max-h-[200px] w-auto h-auto object-contain rounded-2xl shadow-lg mb-4"
        />

        <div className="flex flex-col w-full max-w-xs">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
            className="bg-white text-primary rounded-xl px-4 py-2 mb-2 shadow-md text-sm self-start"
          >
            <p>🤖 Hey! Ready to chat?</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
            className="bg-primary text-white rounded-xl px-4 py-2 shadow-md text-sm self-end"
          >
            <p>🙋 Yes! Logging in now...</p>
          </motion.div>
        </div>

        <p className="text-base max-w-md text-center mt-4">
          Connect instantly and pick up where you left off.
        </p>

        <Link
          to="/signup"
          className="inline-block bg-white text-primary font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition mt-6"
        >
          New here? Sign up!
        </Link>
      </motion.div>


    </div>
  )
}

export default LoginPage