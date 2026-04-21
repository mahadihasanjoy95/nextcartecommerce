const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLoginForm({ email, password }) {
  const errors = {}

  if (!email?.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please enter a valid email'
  }

  if (!password) {
    errors.password = 'Password is required'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}

export function validateSignupForm({ firstName, lastName, email, password }) {
  const errors = {}

  if (!firstName?.trim()) {
    errors.firstName = 'First name is required'
  } else if (firstName.trim().length > 100) {
    errors.firstName = 'First name must not exceed 100 characters'
  }

  if (lastName && lastName.trim().length > 100) {
    errors.lastName = 'Last name must not exceed 100 characters'
  }

  if (!email?.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please enter a valid email'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else if (password.length > 100) {
    errors.password = 'Password must not exceed 100 characters'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}
