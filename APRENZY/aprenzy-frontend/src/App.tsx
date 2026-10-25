import { useEffect } from "react";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import { usePathname, navigate } from "./utils/navigation";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import AdminLayout from "./layouts/AdminLayout";
import DocenteLayout from "./layouts/DocenteLayout";
import EstudianteLayout from "./layouts/EstudianteLayout";

function AppContent() {
  const pathname = usePathname();
  const {
    token,
    usuario,
    loading,
  } = useAuth();
  const rol = usuario?.tipo_de_usuario?.trim().toLowerCase() ?? "";

  useEffect(() => {
    if (loading || !token || !usuario) return;
    const prefijoEsperado = rol === "administrador" ? "/coordinador/" : `/${rol}/`;
    if (pathname === "/login" || pathname === "/registro" || pathname === "/" || !pathname.startsWith(prefijoEsperado)) {
      navigate(rol === "administrador" ? "/coordinador/inicio" : `/${rol}/inicio`);
    }
  }, [pathname, rol, loading, token, usuario]);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-card">
          <div className="app-loading-logo">
            A
          </div>

          <h2>
            Cargando Aprenzy...
          </h2>

          <p>
            Verificando tu sesión.
          </p>
        </div>
      </div>
    );
  }

  if (!token || !usuario) {
    if (pathname === "/registro") return <Registro />;
    return <Login />;
  }

  if (rol === "administrador") return <AdminLayout />;
  if (rol === "docente") return <DocenteLayout />;
  if (rol === "estudiante") return <EstudianteLayout />;

  return (
    <div className="app-error">
      <h1>
        Rol no reconocido
      </h1>

      <p>
        El usuario tiene un tipo
        de usuario que Aprenzy no
        reconoce.
      </p>

      <p>
        Rol recibido:{" "}
        <strong>
          {usuario.tipo_de_usuario}
        </strong>
      </p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;