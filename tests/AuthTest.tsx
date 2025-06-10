// AuthTest.tsx - Test auth functionality
import React, { useState } from 'react'
import { signUp, signIn, signOut } from '../supa_database/auth'

export const AuthTest: React.FC = () => {
  const [email, setEmail] = useState('test@gmail.com')
  const [password, setPassword] = useState('testpassword123')
  const [result, setResult] = useState('')

  const testSignUp = async () => {
    const { user, error } = await signUp(email, password)
    setResult(error ? `SignUp Error: ${error.message}` : `SignUp Success: ${user?.id}`)
  }

  const testSignIn = async () => {
    const { user, error } = await signIn(email, password)
    setResult(error ? `SignIn Error: ${error.message}` : `SignIn Success: ${user?.id}`)
  }

  const testSignOut = async () => {
    const { error } = await signOut()
    setResult(error ? `SignOut Error: ${error.message}` : 'SignOut Success')
  }

  return (
    <div className="p-6 bg-gray-100 rounded">
      <h3 className="text-lg font-bold mb-4">Auth Test</h3>

      <div className="space-y-2 mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="space-x-2 mb-4">
        <button onClick={testSignUp} className="bg-blue-500 text-white px-4 py-2 rounded">
          Test SignUp
        </button>
        <button onClick={testSignIn} className="bg-green-500 text-white px-4 py-2 rounded">
          Test SignIn
        </button>
        <button onClick={testSignOut} className="bg-red-500 text-white px-4 py-2 rounded">
          Test SignOut
        </button>
      </div>

      {result && (
        <div className={`p-3 rounded ${result.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {result}
        </div>
      )}
    </div>
  )
}
