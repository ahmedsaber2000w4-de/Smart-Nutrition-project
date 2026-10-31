// // // // import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
// // // // import "./App.css";

// // // // // Components
// // // // import Navbar from "./components/Navbar";

// // // // // Pages
// // // // import ProgressPage from "./pages/ProgressPage";
// // // // import HomePage from "./pages/HomePage";
// // // // import MainPage from "./pages/MainPage";
// // // // import WorkoutPage from "./pages/WorkoutPage";
// // // // import NotFoundPage from "./pages/NotFoundPage";
// // // // import OnboardingSlider from "./pages/OnboardingSlider";

// // // // // Protected Routes
// // // // import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
// // // // import ProtectedAuthRoute from "./ProtectedRoutes/ProtectedAuthRoute";
// // // // import LoginPage from "./pages/LoginPage";
// // // // import RegisterPage from "./pages/RegisterPage";
// // // // import MealPage from "./pages/MealPage";
// // // // import UploadPage from "./pages/UploadPage";

// // // // function Layout() {
// // // //   return (
// // // //     <>
// // // //       <Navbar />
// // // //       <main>
// // // //         <Outlet />
// // // //       </main>
// // // //     </>
// // // //   );
// // // // }

// // // // const router = createBrowserRouter([
// // // //   // ── Public (no navbar) ──────────────────────────────────────────────────────
// // // //   {
// // // //     path: "/login",
// // // //     element: <ProtectedAuthRoute><LoginPage /></ProtectedAuthRoute>,
// // // //   },
// // // //   {
// // // //     path: "/register",
// // // //     element: <ProtectedAuthRoute><RegisterPage /></ProtectedAuthRoute>,
// // // //   },

// // // //   // ── Onboarding (protected, no navbar — user should focus) ───────────────────
// // // //   {
// // // //     path: "/onboarding",
// // // //     element: <ProtectedRoute><OnboardingSlider /></ProtectedRoute>,
// // // //   },

// // // //   // ── Home transition page (protected, no navbar) ─────────────────────────────
// // // //   // This page shows "Plan Ready!" and redirects to /main
// // // //   {
// // // //     path: "/home",
// // // //     element: <ProtectedRoute><HomePage /></ProtectedRoute>,
// // // //   },

// // // //   // ── App pages (protected, with navbar) ─────────────────────────────────────
// // // //   {
// // // //     element: <Layout />,
// // // //     children: [
// // // //       { path: "/",        element: <Navigate to="/main" replace /> },
// // // //       { path: "/main",    element: <ProtectedRoute><MainPage /></ProtectedRoute> },
// // // //       { path: "/workout", element: <ProtectedRoute><WorkoutPage /></ProtectedRoute> },
// // // //       { path: "/meal",    element: <ProtectedRoute><MealPage /></ProtectedRoute> },
// // // //       { path: "/upload",  element: <ProtectedRoute><UploadPage /></ProtectedRoute> },
// // // //       { path: "/progress",element: <ProtectedRoute><ProgressPage /></ProtectedRoute> },
// // // //     ],
// // // //   },

// // // //   { path: "*", element: <NotFoundPage /> },
// // // // ]);

// // // // export default function App() {
// // // //   return <RouterProvider router={router} />;
// // // // }
// // // //   import React, { useContext } from "react";
// // // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // // // أضفنا أيقونة LogOut هنا
// // // // import { Home, Dumbbell, Utensils, Video, BarChart2, LogOut } from "lucide-react"; 
// // // // import { authContext } from "../contexts/authContext"; // تأكد من المسار
// // // // import { toast } from "react-toastify";

// // // // export default function Navbar() {
// // // //   const location = useLocation();
// // // //   const navigate = useNavigate();
// // // //   const { setIsLoggedIn } = useContext(authContext);

// // // //   // جلب بيانات المستخدم من localStorage لعرض أول حرفين من اسمه
// // // //   const user = JSON.parse(localStorage.getItem("user"));
// // // //   const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : "US";

// // // //   const navItems = [
// // // //     { name: "Home", path: "/main", icon: <Home size={20} /> },
// // // //     { name: "Workout", path: "/workout", icon: <Dumbbell size={20} /> },
// // // //     { name: "Meal", path: "/meal", icon: <Utensils size={20} /> },
// // // //     { name: "Upload", path: "/upload", icon: <Video size={20} /> },
// // // //     { name: "Progress", path: "/progress", icon: <BarChart2 size={20} /> },
// // // //   ];

// // // //   // دالة تسجيل الخروج
// // // //   const handleLogout = () => {
// // // //     localStorage.removeItem("token");
// // // //     localStorage.removeItem("user");
// // // //     setIsLoggedIn(false);
// // // //     toast.info("Logged out! See you soon 👋");
// // // //     navigate("/login", { replace: true });
// // // //   };

// // // //   return (
// // // //     <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
// // // //       <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
// // // //         {/* Logo */}
// // // //         <Link to="/main" className="flex items-center gap-2">
// // // //           <div className="bg-green-600 p-2 rounded-xl">
// // // //             <Dumbbell className="text-white" size={20} />
// // // //           </div>
// // // //           <span className="text-2xl font-black text-gray-900 tracking-tighter">
// // // //             SMART<span className="text-green-600">Nutrition</span>
// // // //           </span>
// // // //         </Link>

// // // //         {/* Desktop Links */}
// // // //         <div className="hidden md:flex gap-1">
// // // //           {navItems.map((item) => {
// // // //             const isActive = location.pathname === item.path;
// // // //             return (
// // // //               <Link
// // // //                 key={item.name}
// // // //                 to={item.path}
// // // //                 className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${
// // // //                   isActive 
// // // //                   ? "bg-green-600 text-white shadow-lg shadow-green-200" 
// // // //                   : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
// // // //                 }`}
// // // //               >
// // // //                 {item.icon}
// // // //                 {item.name}
// // // //               </Link>
// // // //             );
// // // //           })}
// // // //         </div>

// // // //         {/* User Info & Logout Button */}
// // // //         <div className="flex items-center gap-3">
// // // //           <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-2xl border border-gray-100">
// // // //             <span className="text-xs font-black text-gray-600 hidden sm:inline">
// // // //               {user?.name || "PRO USER"}
// // // //             </span>
// // // //             <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white text-xs font-black">
// // // //               {userInitials}
// // // //             </div>
// // // //           </div>
          
// // // //           {/* زر تسجيل الخروج */}
// // // //           <button 
// // // //             onClick={handleLogout}
// // // //             className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
// // // //             title="Logout"
// // // //           >
// // // //             <LogOut size={22} />
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* Mobile Menu (Bottom Bar) */}
// // // //       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
// // // //         {navItems.map((item) => {
// // // //           const isActive = location.pathname === item.path;
// // // //           return (
// // // //             <Link
// // // //               key={item.name}
// // // //               to={item.path}
// // // //               className={`flex flex-col items-center gap-1 transition-all ${
// // // //                 isActive ? "text-green-600 scale-110" : "text-gray-400"
// // // //               }`}
// // // //             >
// // // //               {item.icon}
// // // //               <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
// // // //             </Link>
// // // //           );
// // // //         })}
// // // //         {/* زر Logout للموبايل */}
// // // //         <button 
// // // //           onClick={handleLogout}
// // // //           className="flex flex-col items-center gap-1 text-red-400"
// // // //         >
// // // //           <LogOut size={20} />
// // // //           <span className="text-[10px] font-black uppercase tracking-tighter">Exit</span>
// // // //         </button>
// // // //       </div>
// // // //     </nav>
// // // //   );
// // // // }
// // // import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
// // // import "./App.css";

// // // // Components
// // // import Navbar from "./components/Navbar";

// // // // Pages
// // // import ProgressPage from "./pages/ProgressPage";
// // // import HomePage from "./pages/HomePage";
// // // import MainPage from "./pages/MainPage";
// // // import WorkoutPage from "./pages/WorkoutPage";
// // // import NotFoundPage from "./pages/NotFoundPage";
// // // import OnboardingSlider from "./pages/OnboardingSlider";
// // // import LandingPage from "./pages/LandingPage"; // الصفحة الجديدة

// // // // Protected Routes
// // // import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
// // // import ProtectedAuthRoute from "./ProtectedRoutes/ProtectedAuthRoute";
// // // import LoginPage from "./pages/LoginPage";
// // // import RegisterPage from "./pages/RegisterPage";
// // // import MealPage from "./pages/MealPage";
// // // import UploadPage from "./pages/UploadPage";

// // // function Layout() {
// // //   return (
// // //     <>
// // //       <Navbar />
// // //       <main>
// // //         <Outlet />
// // //       </main>
// // //     </>
// // //   );
// // // }

// // // const router = createBrowserRouter([
// // //   // ── Public Pages ──────────────────────────────────────────────────────────
// // //   {
// // //     path: "/",
// // //     element: <LandingPage />, // الصفحة الترحيبية هي المسار الرئيسي
// // //   },
// // //   {
// // //     path: "/login",
// // //     element: <ProtectedAuthRoute><LoginPage /></ProtectedAuthRoute>,
// // //   },
// // //   {
// // //     path: "/register",
// // //     element: <ProtectedAuthRoute><RegisterPage /></ProtectedAuthRoute>,
// // //   },

// // //   // ── Onboarding ─────────────────────────────────────────────────────────────
// // //   {
// // //     path: "/onboarding",
// // //     element: <ProtectedRoute><OnboardingSlider /></ProtectedRoute>,
// // //   },

// // //   // ── Home transition page ───────────────────────────────────────────────────
// // //   {
// // //     path: "/home",
// // //     element: <ProtectedRoute><HomePage /></ProtectedRoute>,
// // //   },

// // //   // ── App pages (protected, with navbar) ─────────────────────────────────────
// // //   {
// // //     element: <Layout />,
// // //     children: [
// // //       { path: "/main",    element: <ProtectedRoute><MainPage /></ProtectedRoute> },
// // //       { path: "/workout", element: <ProtectedRoute><WorkoutPage /></ProtectedRoute> },
// // //       { path: "/meal",    element: <ProtectedRoute><MealPage /></ProtectedRoute> },
// // //       { path: "/upload",  element: <ProtectedRoute><UploadPage /></ProtectedRoute> },
// // //       { path: "/progress",element: <ProtectedRoute><ProgressPage /></ProtectedRoute> },
// // //     ],
// // //   },

// // //   { path: "*", element: <NotFoundPage /> },
// // // ]);

// // // export default function App() {
// // //   return <RouterProvider router={router} />;
// // // }

// // import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
// // import "./App.css";

// // // Layout & Components
// // import Navbar from "./components/Navbar";

// // // Pages
// // import HomePage from "./pages/HomePage";
// // import MainPage from "./pages/MainPage";
// // import ProgressPage from "./pages/ProgressPage";
// // import WorkoutPage from "./pages/WorkoutPage";
// // import MealPage from "./pages/MealPage";
// // import UploadPage from "./pages/UploadPage";
// // import NotFoundPage from "./pages/NotFoundPage";
// // import OnboardingSlider from "./pages/OnboardingSlider";
// // import LandingPage from "./pages/LandingPage";
// // import LoginPage from "./pages/LoginPage";
// // import RegisterPage from "./pages/RegisterPage";

// // // Forget & Reset Password Pages
// // import ForgetPassword from "./pages/ForgetPassword";
// // import ResetPassword from "./pages/ResetPassword";

// // // Protected Routes
// // import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
// // import ProtectedAuthRoute from "./ProtectedRoutes/ProtectedAuthRoute";

// // // Layout Component (الذي يحتوي على النافبار والمحتوى المتغير)
// // function Layout() {
// //   return (
// //     <>
// //       <Navbar />
// //       <Outlet />
// //     </>
// //   );
// // }

// // const router = createBrowserRouter([
// //   // 1. المسارات العامة (متاحة للجميع)
// //   { path: "/", element: <LandingPage /> },

// //   // 2. مسارات المصادقة (ممنوع يدخلها لو هو مسجل دخول فعلاً)
// //   {
// //     element: <ProtectedAuthRoute> <Outlet /> </ProtectedAuthRoute>,
// //     children: [
// //       { path: "/login", element: <LoginPage /> },
// //       { path: "/register", element: <RegisterPage /> },
// //       { path: "/forget-password", element: <ForgetPassword /> },
// //       { path: "/reset-password", element: <ResetPassword /> },
// //     ],
// //   },

// //   // 3. المسارات المحمية (لازم يكون مسجل دخول عشان يشوفها)
// //   {
// //     element: <ProtectedRoute> <Layout /> </ProtectedRoute>,
// //     children: [
// //       { path: "/main", element: <MainPage /> },
// //       { path: "/progress", element: <ProgressPage /> },
// //       { path: "/workout", element: <WorkoutPage /> },
// //       { path: "/meals", element: <MealPage /> },
// //       { path: "/upload", element: <UploadPage /> },
// //       { path: "/home", element: <HomePage /> }, // صفحة الـ Spinner (Plan Ready)
// //     ],
// //   },

// //   // 4. مسار الـ Onboarding (محمي أيضاً)
// //   {
// //     path: "/onboarding",
// //     element: <ProtectedRoute> <OnboardingSlider /> </ProtectedRoute>,
// //   },

// //   // 5. صفحة الخطأ 404
// //   { path: "*", element: <NotFoundPage /> },
// // ]);

// // function App() {
// //   return <RouterProvider router={router} />;
// // }

// // export default App;
// import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import "./App.css";

// // Components
// import Navbar from "./components/Navbar";

// // Pages
// import ProgressPage from "./pages/ProgressPage";
// import HomePage from "./pages/HomePage";
// import MainPage from "./pages/MainPage";
// import WorkoutPage from "./pages/WorkoutPage";
// import NotFoundPage from "./pages/NotFoundPage";
// import OnboardingSlider from "./pages/OnboardingSlider";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import MealPage from "./pages/MealPage";
// import UploadPage from "./pages/UploadPage";
// import ForgetPassword from "./pages/ForgetPassword";
// import ResetPassword from "./pages/ResetPassword";
// import LandingPage from "./pages/LandingPage";
// import ProfilePage from "./pages/ProfilePage"; // الصفحة الجديدة

// // Protected Routes
// import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
// import ProtectedAuthRoute from "./ProtectedRoutes/ProtectedAuthRoute";

// // Layout Component (الذي يحتوي على النافبار والمحتوى المتغير)
// function Layout() {
//   return (
//     <>
//       <Navbar />
//       <main>
//         <Outlet />
//       </main>
//     </>
//   );
// }

// const router = createBrowserRouter([
//   // 1. المسارات العامة (متاحة للجميع بدون نافبار)
//   { path: "/", element: <LandingPage /> },

//   // 2. مسارات المصادقة (ممنوع يدخلها لو هو مسجل دخول فعلاً)
//   {
//     element: (
//       <ProtectedAuthRoute>
//         <Outlet />
//       </ProtectedAuthRoute>
//     ),
//     children: [
//       { path: "/login", element: <LoginPage /> },
//       { path: "/register", element: <RegisterPage /> },
//       { path: "/forget-password", element: <ForgetPassword /> },
//       { path: "/reset-password", element: <ResetPassword /> },
//     ],
//   },

//   // 3. المسارات المحمية (لازم يكون مسجل دخول عشان يشوفها ويظهر فيها النافبار)
//   {
//     element: (
//       <ProtectedRoute>
//         <Layout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { path: "/main", element: <MainPage /> },
//       { path: "/progress", element: <ProgressPage /> },
//       { path: "/workout", element: <WorkoutPage /> },
//       { path: "/meal", element: <MealPage /> }, // تأكد من الاسم هل هو meal أم meals في الـ Navbar
//       { path: "/upload", element: <UploadPage /> },
//       { path: "/home", element: <HomePage /> }, // صفحة الـ Spinner
//       { path: "/profile", element: <ProfilePage /> }, // مسار البروفايل الجديد
//     ],
//   },

//   // 4. مسار الـ Onboarding (محمي أيضاً ولكن بدون نافبار غالباً)
//   {
//     path: "/onboarding",
//     element: (
//       <ProtectedRoute>
//         <OnboardingSlider />
//       </ProtectedRoute>
//     ),
//   },

//   // 5. مسار الخطأ (404)
//   { path: "*", element: <NotFoundPage /> },
// ]);

// function App() {
//   return (
//     <div className="App">
//       <RouterProvider router={router} />
//     </div>
//   );
// }

// export default App;
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";

// Pages
import ProgressPage from "./pages/ProgressPage";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import WorkoutPage from "./pages/WorkoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import OnboardingSlider from "./pages/OnboardingSlider";
import LandingPage from "./pages/LandingPage";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

// Protected Routes
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
import ProtectedAuthRoute from "./ProtectedRoutes/ProtectedAuthRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MealPage from "./pages/MealPage";
import UploadPage from "./pages/UploadPage";
import ProfilePage from "./pages/ProfilePage";
import StatusPage from "./pages/StatusPage"; // 1. استيراد صفحة الـ Status الجديدة هنا 📊

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

const router = createBrowserRouter([
  // 1. المسار الافتراضي الأساسي (Landing Page)
  { path: "/", element: <LandingPage /> },

  // 2. مسارات المصادقة (ممنوع يدخلها لو هو مسجل دخول فعلاً)
  {
    element: (
      <ProtectedAuthRoute>
        <Outlet />
      </ProtectedAuthRoute>
    ),
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forget-password", element: <ForgetPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },

  // 3. المسارات المحمية (لازم يكون مسجل دخول عشان يشوفها ويظهر فيها النافبار)
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/main", element: <MainPage /> },
      { path: "/progress", element: <ProgressPage /> },
      { path: "/workout", element: <WorkoutPage /> },
      { path: "/meal", element: <MealPage /> }, 
      { path: "/upload", element: <UploadPage /> },
      { path: "/status", element: <StatusPage /> }, // 2. إضافة مسار صفحة الـ Status هنا لتظهر بالنافبار حياً 🚀
      { path: "/home", element: <HomePage /> }, 
      { path: "/profile", element: <ProfilePage /> }, 
    ],
  },

  // 4. مسار الـ Onboarding (محمي أيضاً ولكن بدون نافبار غالباً)
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <OnboardingSlider />
      </ProtectedRoute>
    ),
  },

  // 5. مسار الطوارئ في حال كتابة أي عنوان خاطئ (Page Not Found)
  { path: "*", element: <NotFoundPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;