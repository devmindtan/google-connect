import { createContext, useContext, useState } from "react";
import {
  GoogleSignin
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
interface GoogleAuthProfile {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}
interface GoogleAuthResponse {
  idToken: string | null;
  scopes: string[];
  serverAuthCode: string | null;
  user: GoogleAuthProfile;
}

interface AuthContextType {
  user: GoogleAuthResponse | null;
  setUser: (user: any) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<GoogleAuthResponse | null>(null);
  const router = useRouter();
  
  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      
      setUser(null);
      router.replace("/");
      
      console.log("Đã đăng xuất và xóa sạch trạng thái!");
    } catch (error) {
      console.log("Lỗi khi đăng xuất:" + error);
    }
  };
    const login = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (response.type === "success") {
          setUser(response.data);
          router.replace("/profile");
          console.log(response.data)
        }
      }catch (error: any) {
        console.log("Lỗi khi đăng nhập:", error.message);
    }
    };
  return (
    <AuthContext.Provider value={{ user, setUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context; // Lúc này TypeScript chắc chắn context không thể là null
};