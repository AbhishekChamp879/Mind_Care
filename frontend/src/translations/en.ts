export const errorMessages = {
  generic: {
    title: "An error occurred",
    retry: "Try again",
    close: "Close",
    details: "Error details",
    report: "Report issue"
  },
  network: {
    offline: "You are offline",
    timeout: "Request timed out",
    serverError: "Server error occurred"
  },
  validation: {
    required: "This field is required",
    invalid: "Invalid input",
    tooLong: "Input is too long",
    tooShort: "Input is too short"
  },
  auth: {
    invalidCredentials: "Invalid username or password",
    sessionExpired: "Your session has expired",
    unauthorized: "You are not authorized"
  },
  notFound: {
    title: "Page not found",
    message: "The page you're looking for doesn't exist",
    backHome: "Back to home"
  },
  components: {
    form: {
      submitError: "Failed to submit form",
      validationError: "Please check your inputs"
    },
    upload: {
      tooLarge: "File is too large",
      wrongFormat: "Unsupported file format"
    }
  }
} as const;