export function validateRegister(values) {
  const errors = {};

  if (!values.firstName.trim()) {
    errors.firstName = "El nombre es obligatorio";
  } else if (values.firstName.trim().length < 2) {
    errors.firstName = "El nombre debe tener al menos 2 caracteres";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "El apellido es obligatorio";
  } else if (values.lastName.trim().length < 2) {
    errors.lastName = "El apellido debe tener al menos 2 caracteres";
  }

  if (!values.email.trim()) {
    errors.email = "El email es obligatorio";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Ingresá un email válido";
  }

  if (!values.password.trim()) {
    errors.password = "La contraseña es obligatoria";
  } else if (values.password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres";
  }

  return errors;
}
