import { useEffect, useState, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[]; // optional, restrict to certain roles
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  if (!user || (roles && !roles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }

  // Render whatever children were passed (like Layout or a page)
  return <>{children}</>;
};

export default ProtectedRoute;
