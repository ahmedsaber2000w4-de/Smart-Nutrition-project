import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Dumbbell, Utensils, Video, BarChart2, Activity, LogOut, User, Settings, ChevronDown } from "lucide-react"; 
import { authContext } from "../contexts/authContext";
import { toast } from "react-toastify";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsLoggedIn, isLoggedIn } = useContext(authContext);
  const [showDropdown, setShowDropdown] = useState(false); 

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : "US";

  const navItems = [
    { name: "Home", path: "/main", icon: <Home size={20} /> },
    { name: "Workout", path: "/workout", icon: <Dumbbell size={20} /> },
    { name: "Meal", path: "/meal", icon: <Utensils size={20} /> },
    { name: "Status", path: "/status", icon: <Activity size={20} /> }, 
    { name: "Upload", path: "/upload", icon: <Video size={20} /> },
    { name: "Progress", path: "/progress", icon: <BarChart2 size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    toast.info("Logged out! See you soon 👋");
    navigate("/", { replace: true });
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <Link to={isLoggedIn ? "/main" : "/"} className="flex items-center gap-2">
          <div className="bg-green-600 p-2 rounded-xl shadow-lg shadow-green-100">
            <Dumbbell className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter">
            SMART<span className="text-green-600">Nutrition</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-black transition-all ${
                  isActive 
                  ? "bg-green-600 text-white shadow-lg shadow-green-200" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 p-1.5 pr-3 rounded-2xl border border-gray-100 transition-all active:scale-95"
          >
            {user.image ? (
              <img src={user.image} alt="Profile" className="w-9 h-9 rounded-xl object-cover border-2 border-white shadow-sm" />
            ) : (
              <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white text-xs font-black">
                {userInitials}
              </div>
            )}
            <span className="text-xs font-black text-gray-700 hidden sm:inline">{user?.name?.split(' ')[0] || "Account"}</span>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] shadow-2xl border border-gray-50 p-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-150">
                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                </div>
                
                <button 
                  onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors"
                >
                  <User size={18} /> My Profile
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? "text-green-600 scale-110" : "text-gray-400"
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.name}</span>
            </Link>
          );
        })}
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-red-400">
          <LogOut size={18} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Exit</span>
        </button>
      </div>
    </nav>
  );
}