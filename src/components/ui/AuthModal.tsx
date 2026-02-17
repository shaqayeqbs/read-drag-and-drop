import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import {
  loginUser,
  registerUser,
  resetPassword,
} from "../../services/authService";
import { getAuthErrorMessage } from "../../services/authErrorUtils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const { t } = useTranslation();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      toast.success(t("profile.resetEmailSent"));
      setIsForgotPassword(false);
      setEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(t("profile.resetEmailError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await loginUser(email, password);
        toast.success(t("auth.loginSuccess"));
        onAuthSuccess();
        onClose();
      } else {
        await registerUser(email, password, name);
        toast.success(t("auth.registerSuccess"));
        onAuthSuccess();
        onClose();
      }
    } catch (error: unknown) {
      console.error("Auth error:", error);
      const errorMessage = getAuthErrorMessage(error, t);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      style={{ isolation: "isolate" }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md m-4 relative z-[51]"
        style={{ isolation: "isolate", WebkitTransform: "translate3d(0,0,0)" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white font-vazir">
            {isForgotPassword
              ? t("profile.forgotPassword")
              : isLoginMode
                ? t("auth.loginTitle")
                : t("auth.registerTitle")}
          </h2>
          <button
            onClick={() => {
              onClose();
              setIsForgotPassword(false);
            }}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-vazir">
              {t("auth.email")}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-vazir">
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 font-vazir font-medium"
            >
              {isLoading ? "..." : t("profile.forgotPassword")}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-primary hover:text-secondary dark:text-primary dark:hover:text-secondary transition-colors text-sm font-vazir"
              >
                {t("auth.login")}
              </button>
            </div>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-vazir">
                    {t("auth.name")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-vazir"
                      required={!isLoginMode}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-vazir">
                  {t("auth.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-vazir">
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {isLoginMode && (
                <div className="text-left">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-primary hover:text-secondary dark:text-primary dark:hover:text-secondary text-sm font-vazir"
                  >
                    {t("auth.forgotPassword")}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 font-vazir font-medium"
              >
                {isLoading
                  ? "..."
                  : isLoginMode
                    ? t("auth.login")
                    : t("auth.register")}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-primary hover:text-secondary dark:text-primary dark:hover:text-secondary transition-colors text-sm font-vazir"
              >
                {isLoginMode ? (
                  <>
                    {t("auth.noAccount")}{" "}
                    <span className="font-medium">{t("auth.register")}</span>
                  </>
                ) : (
                  <>
                    {t("auth.hasAccount")}{" "}
                    <span className="font-medium">{t("auth.login")}</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
