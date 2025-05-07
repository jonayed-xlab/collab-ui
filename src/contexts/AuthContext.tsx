import React, { createContext, useReducer, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { User, AuthState } from "../types";
import authService from "../services/authService";

// Define action types
type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  // | { type: "LOGIN_SUCCESS"; payload: { token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_USER"; payload: User };

// Define context props
interface AuthContextProps {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateUser: (user: User) => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Try to load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Decode token to get user ID
          const decoded: any = jwtDecode(token);
          if (decoded && decoded.sub) {
            const response = await authService.getCurrentUser();

            if (response.statusCode == "S200" && response.data) {
              dispatch({
                type: "LOGIN_SUCCESS",
                payload: { user: response.data, token },
                // payload: { token },
              });
            } else {
              localStorage.removeItem("token");
              dispatch({ type: "LOGOUT" });
            }
          }
        } catch (error) {
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await authService.login({ email, password });

      if (response.statusCode === "S200" && response.data?.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);

        const userResponse = await authService.getCurrentUser();

        if (userResponse.statusCode === "S200" && userResponse.data) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: userResponse.data, token },
          });
          return true;
        }
      }

      dispatch({
        type: "LOGIN_FAILURE",
        payload: response.message || "Login failed",
      });
      return false;
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "An unexpected error occurred",
      });
      return false;
    }
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await authService.register({ name, email, password });

      if (response.statusCode === "S200") {
        // Auto login after registration
        // return await login(email, password);
        return true;
      }

      dispatch({
        type: "LOGIN_FAILURE",
        payload: response.message || "Registration failed",
      });
      return false;
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "An unexpected error occurred",
      });
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
    }
  };

  // Update user function
  const updateUser = (user: User): void => {
    dispatch({ type: "UPDATE_USER", payload: user });
  };

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
