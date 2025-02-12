import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Define the user type based on the data you're getting from the backend
interface User {
  email: string;
  name: string;
  // Add any other fields from the user object as needed
}

// Define the context value type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
const userContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("jwt")
  );

  // Step 1: On mount, fetch user details if a token exists
  useEffect(() => {
    if (token) {
      fetchUserInfo(token);
    }
  }, [token]);

  // Step 2: Function to exchange a login code for a token
  const login = async (code: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }), // Send the Google Auth code
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("jwt", data.token);
        setToken(data.token); // Updates token state
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        console.log(data.user);
      } else {
        console.error("Failed to log in");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // Step 3: Fetch user details with token
  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Set user details in state
      } else {
        console.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Step 4: Logout function
  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <userContext.Provider value={{ user, setUser, login, logout }}>
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
