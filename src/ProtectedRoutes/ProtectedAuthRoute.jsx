
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../contexts/authContext";

export default function ProtectedAuthRoute({ children }) {
  const { isLoggedIn } = useContext(authContext);
  const token = localStorage.getItem("token");
  const onboardingDone = localStorage.getItem("userProfile");

  if (!isLoggedIn && !token) {
    return children;
  }

  if (isLoggedIn || token) {
    return onboardingDone 
      ? <Navigate to="/home" replace /> 
      : <Navigate to="/onboarding" replace />;
  }

  return children;
}