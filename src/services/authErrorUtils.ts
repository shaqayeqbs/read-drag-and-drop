export const getAuthErrorMessage = (
  error: any,
  t: (key: string) => string
): string => {
  // Extract Firebase error code
  const errorCode = error?.code || error?.message || "";

  // Map Firebase error codes to translation keys
  const errorMappings: Record<string, string> = {
    "auth/user-not-found": "auth.errors.user-not-found",
    "auth/wrong-password": "auth.errors.wrong-password",
    "auth/email-already-in-use": "auth.errors.email-already-in-use",
    "auth/weak-password": "auth.errors.weak-password",
    "auth/invalid-email": "auth.errors.invalid-email",
    "auth/network-request-failed": "auth.errors.network-request-failed",
    "auth/too-many-requests": "auth.errors.too-many-requests",
  };

  // Return translated message or default error
  const translationKey = errorMappings[errorCode] || "auth.errors.default";
  return t(translationKey);
};
