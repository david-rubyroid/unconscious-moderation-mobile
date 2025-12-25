import { z } from 'zod'

/**
 * Creates email validation schema
 */
export function createEmailSchema(t: (_key: string) => string) {
  return z.email({ error: t('email-is-invalid') })
}

/**
 * Creates password validation schema
 */
export function createPasswordSchema(t: (_key: string) => string) {
  return z.string().min(8, { error: t('password-must-be-at-least-8-characters') })
}

/**
 * Creates required string validation schema
 */
export function createRequiredStringSchema(t: (_key: string) => string) {
  return z.string().min(1, { error: t('this-field-is-required') })
}

/**
 * Creates login form schema
 */
export function createLoginSchema(t: (_key: string) => string) {
  return z.object({
    email: createEmailSchema(t),
    password: z.string().min(8, { error: t('password-is-required') }),
  })
}

/**
 * Creates registration form schema
 */
export function createRegistrationSchema(t: (_key: string) => string) {
  return z
    .object({
      firstName: createRequiredStringSchema(t),
      lastName: createRequiredStringSchema(t),
      email: createEmailSchema(t),
      password: createPasswordSchema(t),
      confirmPassword: createPasswordSchema(t),
    })
    .refine(
      data => data.password === data.confirmPassword,
      { error: t('passwords-do-not-match'), path: ['confirmPassword'] },
    )
}

/**
 * Creates reset password form schema
 */
export function createResetPasswordSchema(t: (_key: string) => string) {
  return z
    .object({
      password: createPasswordSchema(t),
      confirmPassword: createPasswordSchema(t),
    })
    .refine(
      data => data.password === data.confirmPassword,
      { error: t('passwords-do-not-match'), path: ['confirmPassword'] },
    )
}
