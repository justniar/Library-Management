import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  role: string;
}

export function useAuth(requiredRole: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwt.decode(token) as DecodedToken;
      if (decoded?.role === requiredRole) {
        setIsAuthenticated(true);
      } else {
        router.push("/not-authorized"); 
      }
    } catch (error) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, requiredRole]);

  return { loading, isAuthenticated };
}
