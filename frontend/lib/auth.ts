import config from "@/frontend-config.json";

const apiBaseUrl = config.apiBaseUrl;

export const login = async (email: string, password: string) => {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Login failed");
  }

  const data = await response.json();
  return data;
};

export const forgotPassword = async (email: string) => {
  const response = await fetch(`${apiBaseUrl}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  // Read as text for both success and error responses
  const data = await response.text();

  if (!response.ok) {
    throw new Error(data || "Forgot password request failed"); // Use the text as the error message
  }

  return data; // Return the success message
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await fetch(`${apiBaseUrl}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Read as text for error response
    throw new Error(errorText || "OTP verification failed"); // Use the text as the error message
  }

  const data = await response.json(); // Assuming the backend returns a JSON object with the token on success
  return data.token; // Return the token
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await fetch(`${apiBaseUrl}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword }),
  });

  // Read as text for both success and error responses
  const data = await response.text();

  if (!response.ok) {
    throw new Error(data || "Password reset failed"); // Use the text as the error message
  }

  return data; // Return the success message
};

export const verifyAuthToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${apiBaseUrl}/auth/verify?token=${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.ok;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  const response = await fetch(`${apiBaseUrl}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Signup failed");
  }

  const data = await response.json();
  return data;
};
