import { z } from 'zod'

import { createEmailSchema, createRequiredStringSchema } from './auth-schemas'

/**
 * Creates edit profile form schema
 */
export function createEditProfileSchema(t: (_key: string) => string) {
  return z.object({
    firstName: createRequiredStringSchema(t),
    lastName: createRequiredStringSchema(t),
    age: createRequiredStringSchema(t),
    gender: createRequiredStringSchema(t),
    email: createEmailSchema(t),
  })
}
