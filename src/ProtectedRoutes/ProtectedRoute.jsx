// // import { Navigate } from "react-router-dom";

// // export default function ProtectedRoute({ children }) {
// //   const token = localStorage.getItem("token");
// //   const onboardingDone = localStorage.getItem("onboardingData");

// //  if (!token) return <Navigate to="/login" replace />;
// //  if (!onboardingDone && window.location.pathname !== "/onboarding")
// //   return <Navigate to="/onboarding" replace />;

// //   return children;
// // }
// // import { Navigate } from "react-router-dom";

// // export default function ProtectedRoute({ children }) {
// //   const token = localStorage.getItem("token");
// //   const onboardingDone = localStorage.getItem("onboardingData");

// //   if (!token) return <Navigate to="/login" replace />;
// //   if (!onboardingDone && window.location.pathname !== "/onboarding")
// //     return <Navigate to="/onboarding" replace />;

// //   return children;
// // }
// import { Navigate, useLocation } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");
//   const onboardingDone = localStorage.getItem("onboardingData");
//   const location = useLocation();

//   if (!token) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   // لو مش مخلص الـ onboarding وهو مش في صفحة الـ onboarding حالياً، ووديه هناك
//   if (!onboardingDone && location.pathname !== "/onboarding") {
//     return <Navigate to="/onboarding" replace />;
//   }

//   // لو مخلص الـ onboarding وبيحاول يروح لصفحة الـ onboarding تاني، رجعه للهوم
//   if (onboardingDone && location.pathname === "/onboarding") {
//     return <Navigate to="/home" replace />;
//   }

//   return children;
// }
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  // توحيد الاسم ليكون مطابقاً لما يتم حفظه عند الضغط على Finish
  const onboardingDone = localStorage.getItem("userProfile"); 
  const location = useLocation();

  // 1. لو مش مسجل دخول، اطرده لصفحة اللوجن
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. لو مسجل دخول بس لسه مخلصش الـ onboarding وهو مش في الصفحة حالياً، ووديه هناك
  if (token && !onboardingDone && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // 3. لو مخلص الـ onboarding وبيحاول يدخل صفحة الـ onboarding تاني، رجعه للهوم أو المين
  if (onboardingDone && location.pathname === "/onboarding") {
    return <Navigate to="/home" replace />;
  }

  return children;
}