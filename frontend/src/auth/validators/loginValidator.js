export function validateLogin(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "El email es obligatorio";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Ingresá un email válido";
  }

  if (!values.password.trim()) {
    errors.password = "La contraseña es obligatoria";
  }

  return errors;
}
