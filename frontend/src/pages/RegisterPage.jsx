import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";
import { validateRegister } from "../auth/validators/registerValidator";



export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      const nextValues = { ...form, [name]: value };
      const nextErrors = validateRegister(nextValues);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: nextErrors[name],
      }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const errors = validateRegister(form);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: errors[name],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");

    const errors = validateRegister(form);
    setFieldErrors(errors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
    });

    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);

    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setSuccessMessage("Cuenta creada con éxito. Ahora podés iniciar sesión.");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } catch (err) {
      const backendData = err?.response?.data;

      if (backendData?.fields) {
        setFieldErrors(backendData.fields);
      } else {
        setGeneralError(backendData?.message || "No se pudo crear la cuenta");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function inputClass(name) {
    const hasError = touched[name] && fieldErrors[name];

    return `w-full rounded-xl border px-4 py-3 outline-none transition ${
      hasError
        ? "border-red-400 bg-red-50 focus:border-red-500"
        : "border-border bg-white focus:border-primary"
    }`;
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-10">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-primary">Crear cuenta</h1>
        <p className="mb-6 text-sm text-secondary/70">
          Registrate para guardar tu sesión y reservar más rápido.
        </p>

        {generalError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {generalError}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Nombre
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("firstName")}
            />
            {touched.firstName && fieldErrors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Apellido
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("lastName")}
            />
            {touched.lastName && fieldErrors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.lastName}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("email")}
            />
            {touched.email && fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("password")}
            />
            {touched.password && fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
            <p className="mt-1 text-xs text-secondary/60">
              Debe tener al menos 8 caracteres.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-4 text-sm text-secondary/70">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
