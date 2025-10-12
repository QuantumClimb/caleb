'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Input } from '../../../../components/ui/input'
import { Github, Mail, Gamepad2 } from 'lucide-react'
import Link from 'next/link'

interface Provider {
  id: string
  name: string
  type: string
}

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders()
      setProviders(providers)
    }
    fetchProviders()
  }, [])

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        alert('Invalid credentials')
      } else {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Gamepad2 className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Welcome to CALEB
          </CardTitle>
          <p className="text-gray-400">Sign in to your gaming marketplace</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Demo Account */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-blue-300 mb-2">Demo Account</h3>
              <p className="text-xs text-blue-200 mb-2">Try the demo with these credentials:</p>
              <p className="text-xs text-blue-100">Email: demo@caleb.com</p>
              <p className="text-xs text-blue-100">Password: demo123</p>
            </div>
            
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In with Demo Account'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* OAuth Providers */}
          <div className="space-y-2">
            {providers && providers.google && (
              <Button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                variant="outline"
                className="w-full bg-white text-gray-900 hover:bg-gray-100 border-gray-300"
              >
                <Mail className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
            )}
            
            {providers && providers.github && (
              <Button
                onClick={() => signIn('github', { callbackUrl: '/' })}
                variant="outline"
                className="w-full bg-gray-900 text-white hover:bg-gray-800 border-gray-600"
              >
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
            )}
          </div>

          <div className="text-center text-sm text-gray-400">
            New to CALEB?{' '}
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              Explore as guest
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}