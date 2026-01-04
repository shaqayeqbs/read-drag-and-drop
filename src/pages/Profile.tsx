import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  ArrowLeftIcon,
  UserIcon,
  KeyIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import type { User } from "../types/types";
import AddressManager from "../components/features/profile/AddressManager";

interface ProfileProps {
  user: User;
  onUpdateProfile: (updates: Partial<User>) => void;
  onChangePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  onRequestPasswordReset: (email: string) => Promise<boolean>;
  onLogout: () => void;
  onBack?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  user,
  onUpdateProfile,
  onChangePassword,
  onRequestPasswordReset,
  onLogout,
  onBack,
}) => {
  const { t } = useTranslation();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "reset" | "address"
  >("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
  });

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password reset form state
  const [resetEmail, setResetEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    toast.success(t("profile.updated"));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t("profile.passwordMismatch"));
      return;
    }

    setIsLoading(true);
    try {
      const success = await onChangePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      if (success) {
        toast.success(t("profile.passwordChanged"));
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(t("profile.passwordChangeError"));
      }
    } catch {
      toast.error(t("profile.passwordChangeError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await onRequestPasswordReset(resetEmail);
      if (success) {
        toast.success(t("profile.resetEmailSent"));
      } else {
        toast.error(t("profile.resetEmailError"));
      }
    } catch {
      toast.error(t("profile.resetEmailError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="font-vazir">{t("common.back")}</span>
            </button>
          )}
          <h1 className="text-3xl font-bold font-vazir">
            {t("profile.title")}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-surface rounded-lg p-1">
          {[
            { id: "profile", label: t("profile.personalInfo"), icon: UserIcon },
            {
              id: "password",
              label: t("profile.changePassword"),
              icon: KeyIcon,
            },
            {
              id: "address",
              label: t("address.title"),
              icon: MapPinIcon,
            },
            {
              id: "reset",
              label: t("profile.forgotPassword"),
              icon: EnvelopeIcon,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as "profile" | "password" | "reset" | "address"
                )
              }
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors font-vazir ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-surface rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6 font-vazir">
              {t("profile.personalInfo")}
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-vazir">
                  {t("auth.name")}
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800 font-vazir"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-vazir">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors font-vazir font-medium"
              >
                {t("profile.saveChanges")}
              </button>
            </form>
          </div>
        )}

        {/* Password Change Tab */}
        {activeTab === "password" && (
          <div className="bg-surface rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6 font-vazir">
              {t("profile.changePassword")}
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-vazir">
                  {t("profile.currentPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-vazir">
                  {t("profile.newPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-vazir">
                  {t("profile.confirmPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 font-vazir font-medium"
              >
                {isLoading
                  ? t("profile.changing")
                  : t("profile.changePassword")}
              </button>
            </form>
          </div>
        )}

        {/* Address Tab */}
        {activeTab === "address" && (
          <div className="bg-surface rounded-2xl p-6 shadow-lg">
            <AddressManager userId={user.id} />
          </div>
        )}

        {/* Password Reset Tab */}
        {activeTab === "reset" && (
          <div className="bg-surface rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6 font-vazir">
              {t("profile.forgotPassword")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-vazir">
              {t("profile.resetDescription")}
            </p>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-vazir">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 font-vazir font-medium"
              >
                {isLoading ? t("profile.sending") : t("profile.sendResetLink")}
              </button>
            </form>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={onLogout}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-vazir font-medium"
          >
            {t("nav.logout")}
          </button>
        </div>
      </div>
    </div>
  );
};
