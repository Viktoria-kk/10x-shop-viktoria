export interface LoginFormValues {
  username: string
  password: string
}

export interface SignupFormValues {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthUser {
  username: string
  email?: string
}
