'use client'

import { useActionState } from 'react'
import { login } from './actions'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
      >
        <h1 className="mb-6 text-xl font-semibold text-slate-100">Financiën</h1>
        <label className="mb-2 block text-sm text-slate-400" htmlFor="password">
          Wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-slate-500"
        />
        {state?.error && (
          <p className="mb-4 text-sm text-red-400">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-slate-100 px-3 py-2 font-medium text-slate-900 transition hover:bg-white disabled:opacity-50"
        >
          {pending ? 'Bezig...' : 'Inloggen'}
        </button>
      </form>
    </div>
  )
}
