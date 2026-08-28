import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useLogin } from "../../../hooks/useLogin";
import { getDeviceId } from "../../../utils/deviceFingerprint";
import { useThemeStore } from "../../../store/useThemeStore";
import { useUIStore } from "../../../store/useUIStore";
import { ErrorBanner } from "../../../components/common/ErrorBanner";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const { globalError, clearError } = useUIStore();
  console.log("globalError :", globalError);

  const { theme, toggleTheme } = useThemeStore();
  const { t, i18n } = useTranslation();

  const savedLang = localStorage.getItem("i18nextLng") || i18n.language || "en";
  const [lang, setLang] = useState(savedLang.startsWith("ta") ? "ta" : "en");

  const handleLogin = async (values) => {
    try {
      const deviceId = getDeviceId();
      await loginMutation.mutateAsync({
        username: values.username,
        password: values.password,
        deviceId,
      });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const changeLanguage = (lng) => {
    setLang(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground transition-colors duration-300 relative">
      {/* 🚀 Top Right Toggles */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
        {/* Language Toggle */}
        <button
          type="button"
          onClick={() => changeLanguage(lang === "en" ? "ta" : "en")}
          className="flex items-center p-1 rounded-full bg-foreground/5 shadow-inner border border-border/20 transition-colors duration-300 cursor-pointer"
        >
          <div
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${lang === "en" ? "bg-primary text-white shadow-md" : "text-muted opacity-50"}`}
          >
            EN
          </div>
          <div
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${lang === "ta" ? "bg-primary text-white shadow-md" : "text-muted opacity-50"}`}
          >
            தமிழ்
          </div>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-1 p-1 rounded-full bg-foreground/5 shadow-inner border border-border/20 transition-colors duration-300"
        >
          <div
            className={`p-1.5 rounded-full text-sm transition-all ${theme === "light" ? "bg-white shadow-md" : "opacity-50 grayscale"}`}
          >
            ☀️
          </div>
          <div
            className={`p-1.5 rounded-full text-sm transition-all ${theme === "dark" ? "bg-primary shadow-md" : "opacity-50 grayscale"}`}
          >
            🌙
          </div>
        </button>
      </div>

      {/* 🚀 EXACT MATCH: Restored Glowing Truck Logo & Headers */}
      <div className="mb-10 flex flex-col items-center gap-4 mt-8 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-glow transition-colors duration-300">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M1 3h15v13H1z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 8h4l3 3v5h-7V8z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight leading-tight text-foreground">
            {t("header.title", "DeliveryApp")}
          </h2>
          <p className="text-muted mt-1 font-medium text-sm">
            {t("login.subtitle", "Sign in to your delivery account")}
          </p>
        </div>
      </div>

      {/* 🚀 EXACT MATCH: Removed outer card. Inputs float on background. */}
      <div className="w-full max-w-sm">
        {globalError && (
          <div className="mb-6 animate-shake">
            <ErrorBanner message={globalError} onDismiss={() => setError(null)} />
          </div>
        )}
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {() => (
            <Form className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-muted mb-2 ml-1">
                  {t("login.username", "USERNAME")}
                </label>
                <Field
                  name="username"
                  type="text"
                  placeholder={t(
                    "login.usernamePlaceholder",
                    "Enter your username",
                  )}
                  // 🚀 bg-card maps to #111827 in Dark Mode and Pure White in Light Mode
                  className="w-full px-4 py-4 text-sm rounded-xl border border-border/50 bg-card text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted/50 font-medium shadow-sm"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-xs mt-1.5 ml-1 font-medium"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-muted mb-2 ml-1">
                  {t("login.password", "PASSWORD")}
                </label>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t(
                      "login.passwordPlaceholder",
                      "Enter your password",
                    )}
                    className="w-full px-4 py-4 text-sm rounded-xl border border-border/50 bg-card text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted/50 font-medium shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1.5 ml-1 font-medium"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="btn-primary w-full py-4 mt-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 rounded-xl"
              >
                {loginMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  t("login.signInBtn", "Sign In")
                )}
              </button>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <p className="text-center text-muted/50 mt-12 text-[10px] font-bold tracking-widest uppercase">
          Clarion Field Delivery v{import.meta.env.VITE_APP_VERSION}
        </p>
      </div>
    </div>
  );
}

// import { useState } from 'react';
// import { useAuthStore } from '../../../store/useAuthStore';
// import {useDeliveryWorkflowStore} from '../../delivery/store/useDeliveryWorkflowStore';
// import { authService } from '../../../services/authService';
// import { getDeviceId } from '../../../utils/deviceFingerprint';
// import { ErrorBanner } from '../../../components/common/ErrorBanner';
// import { useLogin } from '../../../hooks/useLogin';

// export function LoginForm() {
//   const loginMutation = useLogin();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);

//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!username.trim() || !password.trim()) return;

//   setError(null);

//   try {
//     const deviceId = getDeviceId();

//     await loginMutation.mutateAsync({
//       username,
//       password,
//       deviceId,
//     });
//   } catch (err) {
//     setError(
//       err.response?.data?.message ||
//       'Invalid credentials. Please try again.'
//     );
//   }
// };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
//       {/* Logo */}
//       <div className="mb-8 flex flex-col items-center gap-3">
//         <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-glow">
//           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary" stroke="currentColor" strokeWidth="1.5">
//             <path d="M1 3h15v13H1z" strokeLinecap="round" strokeLinejoin="round" />
//             <path d="M16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round" />
//             <circle cx="5.5" cy="18.5" r="2.5" />
//             <circle cx="18.5" cy="18.5" r="2.5" />
//           </svg>
//         </div>
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-white tracking-tight">DeliveryApp</h2>
//           <p className="text-sm text-muted mt-1">Sign in to your delivery account</p>
//         </div>
//       </div>

//       {/* Form */}
//       <form id="login-form" onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
//         <ErrorBanner message={error} onDismiss={() => setError(null)} />

//         <div className="space-y-3">
//           <div className="input-group">
//             <label htmlFor="login-username" className="input-label">Username</label>
//             <input
//               id="login-username"
//               type="text"
//               autoComplete="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="input"
//               placeholder="Enter your username"
//               // disabled={loading}
//               required
//             />
//           </div>

//           <div className="input-group">
//             <label htmlFor="login-password" className="input-label">Password</label>
//             <div className="relative">
//               <input
//                 id="login-password"
//                 type={showPassword ? 'text' : 'password'}
//                 autoComplete="current-password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="input pr-12"
//                 placeholder="Enter your password"
//                 // disabled={loading}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((v) => !v)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
//                 aria-label={showPassword ? 'Hide password' : 'Show password'}
//               >
//                 {showPassword ? '🙈' : '👁️'}
//               </button>
//             </div>
//           </div>
//         </div>

//         <button
//           id="login-submit-btn"
//           type="submit"
//           disabled={loginMutation.isPending || !username || !password}
//           className="btn-primary w-full mt-2"
//         >
//         </button>
//       </form>
//     </div>
//   );
// }
