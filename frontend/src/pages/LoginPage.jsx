import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";
import { validateLogin } from "../auth/validators/loginValidator";



export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      const nextValues = { ...form, [name]: value };
      const nextErrors = validateLogin(nextValues);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: nextErrors[name],
      }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const errors = validateLogin(form);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: errors[name],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError("");

    const errors = validateLogin(form);
    setFieldErrors(errors);
    setTouched({
      email: true,
      password: true,
    });

    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);

    try {
      const data = await login({
        email: form.email.trim(),
        password: form.password,
      });

      const redirectTo = location.state?.from?.pathname;

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
        return;
      }

      navigate(data.role === "ADMIN" ? "/administracion" : "/", {
        replace: true,
      });
    } catch (err) {
      const backendData = err?.response?.data;

      if (backendData?.fields) {
        setFieldErrors(backendData.fields);
      } else {
        setGeneralError(backendData?.message || "No se pudo iniciar sesión");
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
        <h1 className="mb-2 text-2xl font-bold text-primary">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-secondary/70">
          Ingresá con tu cuenta para continuar.
        </p>

        {generalError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              placeholder="admin@stayhub.com"
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
              placeholder="********"
            />
            {touched.password && fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-4 text-sm text-secondary/70">
          ¿No tenés cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:underline"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </main>
  );
}
