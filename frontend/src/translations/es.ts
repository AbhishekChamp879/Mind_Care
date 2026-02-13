export const errorMessages = {
  generic: {
    title: "Ocurrió un error",
    retry: "Intentar de nuevo",
    close: "Cerrar",
    details: "Detalles del error",
    report: "Reportar problema"
  },
  network: {
    offline: "Estás desconectado",
    timeout: "Tiempo de espera agotado",
    serverError: "Ocurrió un error en el servidor"
  },
  validation: {
    required: "Este campo es requerido",
    invalid: "Entrada inválida",
    tooLong: "La entrada es demasiado larga",
    tooShort: "La entrada es demasiado corta"
  },
  auth: {
    invalidCredentials: "Usuario o contraseña inválidos",
    sessionExpired: "Tu sesión ha expirado",
    unauthorized: "No estás autorizado"
  },
  notFound: {
    title: "Página no encontrada",
    message: "La página que buscas no existe",
    backHome: "Volver al inicio"
  },
  components: {
    form: {
      submitError: "Error al enviar el formulario",
      validationError: "Por favor revisa tus entradas"
    },
    upload: {
      tooLarge: "El archivo es demasiado grande",
      wrongFormat: "Formato de archivo no soportado"
    }
  }
} as const;