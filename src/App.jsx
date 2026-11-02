
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
import StatusPage from "./pages/StatusPage"; 

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
  { path: "/", element: <LandingPage /> },

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
      { path: "/status", element: <StatusPage /> }, 
      { path: "/home", element: <HomePage /> }, 
      { path: "/profile", element: <ProfilePage /> }, 
    ],
  },

  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <OnboardingSlider />
      </ProtectedRoute>
    ),
  },

  { path: "*", element: <NotFoundPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;