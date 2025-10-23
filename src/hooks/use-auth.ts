// Re-export from unified app context
export { useApp as useAuth } from '@/contexts/app-context'
export type { User, AppContextType as AuthContextType } from '@/contexts/app-context'

export interface SignupData {
  name: string
  email: string
  password: string
  gender: string
  age: number
  city: string
}
