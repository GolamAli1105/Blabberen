import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Mail, MessageSquare, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Chats } from "phosphor-react";
import { Link } from 'react-router-dom';
import { motion } from "motion/react"
import toast from 'react-hot-toast';
import chatbotSayingHello from "../assets/chatbotSayingHello.jpg"

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const {signup, isSigningUp} = useAuthStore();

    const validateForm = () => {
        if(!formData.fullName.trim()) return toast.error("Full name is required");
        if(!formData.email.trim()) return toast.error("Email is required");
        if(!formData.password) return toast.error("Password is required");
        if(formData.password.length < 8) return toast.error("Password must be atleast 8 characters long");
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = validateForm();

        if(success){
            signup(formData)
            Navigate("/");
        }
    }

    return (
        <div className="mt-4 h-[calc(100vh-4rem)] pt-20 grid lg:grid-cols-[2fr_1fr] overflow-hidden">
            {/*Left*/}
            <div className="flex flex-col flex-1 justify-center items-center p-6 overflow-hidden">
                <div className="min h-screen w-full max-w-md space-y-8">
                    {/*Logo*/}
                    <div className="text-center mb-8 flex-shrink-0">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors overflow-hidden">
                                <Chats className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Sign up to Blabberen</h1>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 max-h-[calc(100vh-10rem)] overflow-auto">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-base-content/40" />
                                </div>
                                <input 
                                    type="text"
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>
                            
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40" />
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
                                <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input 
                                    type={showPassword? "text" : "password"}
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
                                    {showPassword? (
                                        <EyeOff className="size-5 text-base-content/40" />
                                    ) : (
                                        <Eye className="size-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                        </div>
                    
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSigningUp}
                        >
                            {isSigningUp? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            Already have an account?{" "}
                            <Link to="/login" className="link link-primary">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-primary/30 to-primary/60  text-white p-6 rounded-l-3xl shadow-lg max-h-full overflow-y-auto"
            >
                <img 
                    src={chatbotSayingHello}
                    alt="Chatbot"
                    className="max-h-[200px] w-auto h-auto object-contain rounded-2xl shadow-lg mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">Connect with your friends</h2>
                <p className="text-base max-w-md text-center mb-4">
                    Join our community and start chatting instantly!
                </p>

                <Link
                    to="/profile"
                    className="inline-block bg-white text-primary font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition"
                >
                    Already have an account?
                </Link>
            </motion.div>

        </div>
    )
}

export default SignUpPage