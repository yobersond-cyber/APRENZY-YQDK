import { useState, type FormEvent } from "react";
import { apiFetch } from "../services/api";
import { navigate } from "../utils/navigation";

type Rol = "estudiante" | "docente" | "coordinador";

export default function Registro() {
  const [rol, setRol] = useState<Rol>("estudiante");
  const [form, setForm] = useState({ nombres_compl: "", apellidos_compl: "", documento: "", telefono: "", correo: "", contrasena: "", codigo_institucion: "", codigo_salon: "", nombre_colegio: "", codigo_coordinador: "", jornada: "" });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const esCoordinador = rol === "coordinador";

  function cambiar(campo: keyof typeof form, valor: string) { setForm(actual => ({ ...actual, [campo]: valor })); }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMensaje(""); setLoading(true);
    try {
      const payload = { ...form, tipo_de_usuario: rol };
      const respuesta = await apiFetch("/usuarios/registro", { method: "POST", body: JSON.stringify(payload) });
      setMensaje(`${respuesta.data.tipo_de_usuario === "administrador" ? "Coordinador" : "Usuario"} creado correctamente. Código de institución: ${respuesta.data.codigo_institucion}. Guarda este código y compártelo solo con personas de tu institución.`);
      if (!esCoordinador) setMensaje("Cuenta creada correctamente. Ya puedes iniciar sesión.");
    } catch (e) { setError(e instanceof Error ? e.message : "No fue posible crear la cuenta."); }
    finally { setLoading(false); }
  }

  return <main className="login-container registration-container"><section className="login-card registration-card">
    <div className="login-logo">A</div><h1>Crear cuenta en Aprenzy</h1><p className="login-description">Regístrate y vincúlate a tu institución con sus códigos de acceso.</p>
    <form onSubmit={enviar} className="registration-form">
      <label htmlFor="rol">Quiero registrarme como</label><select id="rol" value={rol} onChange={e => setRol(e.target.value as Rol)}><option value="estudiante">Estudiante</option><option value="docente">Docente</option><option value="coordinador">Coordinador / administrador</option></select>
      <div className="registration-grid">
        <div><label htmlFor="nombres">Nombres</label><input id="nombres" value={form.nombres_compl} onChange={e => cambiar("nombres_compl",e.target.value)} required maxLength={80}/></div>
        <div><label htmlFor="apellidos">Apellidos</label><input id="apellidos" value={form.apellidos_compl} onChange={e => cambiar("apellidos_compl",e.target.value)} required maxLength={80}/></div>
        <div><label htmlFor="documento">Documento</label><input id="documento" value={form.documento} onChange={e => cambiar("documento",e.target.value)} required maxLength={20}/></div>
        <div><label htmlFor="telefono">Teléfono</label><input id="telefono" value={form.telefono} onChange={e => cambiar("telefono",e.target.value)} required maxLength={20}/></div>
      </div>
      <label htmlFor="correo-registro">Correo electrónico</label><input id="correo-registro" type="email" value={form.correo} onChange={e => cambiar("correo",e.target.value)} required/>
      <label htmlFor="clave-registro">Contraseña (mínimo 8 caracteres)</label><input id="clave-registro" type="password" value={form.contrasena} onChange={e => cambiar("contrasena",e.target.value)} required minLength={8} autoComplete="new-password"/>
      {esCoordinador ? <><label htmlFor="codigo-coord">Código de activación de coordinador</label><input id="codigo-coord" type="password" value={form.codigo_coordinador} onChange={e => cambiar("codigo_coordinador",e.target.value)} required/><label htmlFor="nombre-colegio">Nombre de la institución (si vas a crearla)</label><input id="nombre-colegio" value={form.nombre_colegio} onChange={e => cambiar("nombre_colegio",e.target.value)} placeholder="Nombre del colegio"/><label htmlFor="codigo-institucion">Código de institución (si ya existe)</label><input id="codigo-institucion" value={form.codigo_institucion} onChange={e => cambiar("codigo_institucion",e.target.value.toUpperCase())} placeholder="Opcional si crearás una institución"/></> : <><label htmlFor="codigo-institucion">Código de institución</label><input id="codigo-institucion" value={form.codigo_institucion} onChange={e => cambiar("codigo_institucion",e.target.value.toUpperCase())} required placeholder="Ej. ABCD1234"/>{rol === "estudiante" && <><label htmlFor="codigo-salon">Código de salón / curso</label><input id="codigo-salon" value={form.codigo_salon} onChange={e => cambiar("codigo_salon",e.target.value.toUpperCase())} required placeholder="Código entregado por el coordinador"/></>}{rol === "docente" && <><label htmlFor="codigo-salon">Código de salón (opcional)</label><input id="codigo-salon" value={form.codigo_salon} onChange={e => cambiar("codigo_salon",e.target.value.toUpperCase())} placeholder="Puedes vincularte después"/></>}</>}
      <label htmlFor="jornada">Jornada (opcional)</label><select id="jornada" value={form.jornada} onChange={e => cambiar("jornada",e.target.value)}><option value="">Seleccionar</option><option>Mañana</option><option>Tarde</option><option>Noche</option><option>Única</option></select>
      {error && <p className="login-error">{error}</p>}{mensaje && <p className="registration-success">{mensaje}</p>}
      <button type="submit" disabled={loading}>{loading ? "Creando cuenta..." : "Crear cuenta"}</button>
    </form><p className="auth-switch">¿Ya tienes cuenta? <button type="button" className="auth-link" onClick={() => navigate("/login")}>Iniciar sesión</button></p>
  </section></main>;
}
