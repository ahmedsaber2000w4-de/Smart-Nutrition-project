// // import { useContext } from "react";
// // import { Navigate } from "react-router-dom";
// // import { authContext } from "../contexts/authContext";

// // export default function ProtectedAuthRoute({ children }) {
// //   const { isLoggedIn } = useContext(authContext);

// //   // لو مش مسجل الدخول، خلي المستخدم يدخل على Login/Register
// //   return !isLoggedIn ? children : <Navigate to="/onboarding" replace />;
// // }
// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { authContext } from "../contexts/authContext";

// export default function ProtectedAuthRoute({ children }) {
//   const { isLoggedIn } = useContext(authContext);

//   /**
//    * المنطق الجديد:
//    * 1. لو المستخدم مش مسجل (!isLoggedIn)، اعرض له صفحة اللوجن أو الرجستر عادي (children).
//    * 2. لو المستخدم مسجل دخول فعلاً، ملوش لازمة يشوف صفحات التسجيل، فبنوديه فوراً للمحتوى الأساسي (/main).
//    * ملاحظة: تم التغيير من /onboarding لـ /main لضمان تخطي صفحة الـ Spinner التلقائية.
//    */
//   return !isLoggedIn ? children : <Navigate to="/main" replace />;
// }
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../contexts/authContext";

export default function ProtectedAuthRoute({ children }) {
  const { isLoggedIn } = useContext(authContext);
  const token = localStorage.getItem("token");
  const onboardingDone = localStorage.getItem("userProfile");

  // لو مش مسجل دخول، خليه يشوف صفحات الـ Auth (Login / Register)
  if (!isLoggedIn && !token) {
    return children;
  }

  // لو مسجل دخول فعلاً، بنشوف لو مخلص الـ Onboarding يروح للـ home، لو مش مخلص يروح يخلصه
  if (isLoggedIn || token) {
    return onboardingDone 
      ? <Navigate to="/home" replace /> 
      : <Navigate to="/onboarding" replace />;
  }

  return children;
}