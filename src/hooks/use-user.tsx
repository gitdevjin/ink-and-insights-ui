import { createContext, useContext, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: string;
  name: string;
  exp: number;
}

// Define the user type based on the data you're getting from the backend
interface User {
  userId: string;
  name: string;
  // Add any other fields from the user object as needed
}

// Define the context value type
interface UserContextType {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
const userContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  const refreshAccessToken = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/auth/google/refresh",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);

      const decoded = jwtDecode<JwtPayload>(data.accessToken);
      setUser({ userId: decoded.userId, name: decoded.name });
    } catch (err) {
      console.log(err);
      logout();
    }
  };

  if (accessToken) {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    if (decoded.exp * 1000 < Date.now()) {
      refreshAccessToken();
    } else if (!user) {
      setUser({ userId: decoded.userId, name: decoded.name });
    }
  }

  const logout = () => {
    fetch("http://localhost:8080/auth/google/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
  };

  const login = async (googleAccessToken: string) => {
    const response = await fetch("http://localhost:8080/auth/google/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ googleAccessToken }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    setAccessToken(data.access_token);

    const decoded = jwtDecode<JwtPayload>(data.accessToken);
    setUser({ userId: decoded.userId, name: decoded.name });
  };

  return (
    <userContext.Provider value={{ user, login, logout }}>
      {children}
    </userContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
