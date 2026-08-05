'use server'

import { redirect } from 'next/navigation'
import { createSession, verifyPassword } from '@/lib/auth'

export async function login(
  _prevState: { error: string } | undefined,
  formData: FormData
) {
  const password = String(formData.get('password') ?? '')

  if (!verifyPassword(password)) {
    return { error: 'Wachtwoord onjuist' }
  }

  await createSession()
  redirect('/')
}
