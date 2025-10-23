# Authentication System Documentation

This Next.js application implements a comprehensive authentication system using React Context API. Here's how it works:

## Features

- **React Context-based Authentication**: Global state management for user authentication
- **Protected Routes**: Automatic redirection for authenticated/unauthenticated users
- **Persistent Sessions**: User sessions are stored in localStorage
- **Loading States**: Proper loading indicators during authentication checks
- **User Management**: Login, signup, logout, and user profile updates

## Core Components

### 1. Auth Context (`src/contexts/auth-context.tsx`)
- Provides authentication state and methods throughout the app
- Handles login, signup, logout, and user updates
- Manages loading states and user persistence

### 2. Protected Route Component (`src/components/auth/protected-route.tsx`)
- Wraps pages that require authentication
- Automatically redirects unauthenticated users to login
- Shows loading spinner during auth checks

### 3. Public Route Component (`src/components/auth/public-route.tsx`)
- Wraps pages that should only be accessible to unauthenticated users
- Redirects authenticated users to dashboard

## Usage

### Wrapping the App
The entire app is wrapped with `AuthProvider` in `src/app/layout.tsx`:

```tsx
<AuthProvider>
  {children}
</AuthProvider>
```

### Protecting Pages
Wrap any page that requires authentication:

```tsx
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {/* Your page content */}
    </ProtectedRoute>
  )
}
```

### Public Pages
Wrap login/signup pages to redirect authenticated users:

```tsx
import { PublicRoute } from '@/components/auth/public-route'

export default function LoginPage() {
  return (
    <PublicRoute>
      {/* Login form */}
    </PublicRoute>
  )
}
```

### Using Auth in Components
Access authentication state and methods:

```tsx
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please log in</div>
  }
  
  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## Authentication Flow

1. **App Load**: AuthProvider checks localStorage for existing user/token
2. **Login**: User submits credentials → Auth context validates → Sets user state → Redirects to dashboard
3. **Protected Access**: User visits protected route → ProtectedRoute checks auth → Redirects if needed
4. **Logout**: User clicks logout → Auth context clears state → Redirects to home

## Storage

Currently using localStorage for simplicity:
- `affinity_user`: User profile data
- `affinity_token`: Authentication token

## Protected Pages

- `/dashboard` - Main user dashboard
- `/profile` - User profile management
- `/matches` - Matches list
- `/requests` - Friend requests
- `/chatbot` - AI chat interface

## Public Pages

- `/` - Home page (redirects authenticated users)
- `/login` - Login form (redirects authenticated users)
- `/signup` - Registration form (redirects authenticated users)

## Customization

### Adding New Protected Routes
1. Create your page component
2. Wrap with `<ProtectedRoute>`
3. Optionally add to middleware.ts for server-side protection

### Extending User Model
Update the `User` interface in `src/contexts/auth-context.tsx`:

```tsx
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  // Add your custom fields here
  customField?: string
}
```

### API Integration
Replace the mock authentication in auth-context.tsx with real API calls:

```tsx
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  const data = await response.json()
  // Handle response...
}
```

## Security Notes

- This is a client-side implementation for development
- For production, implement proper server-side authentication
- Use secure HTTP-only cookies instead of localStorage
- Add proper token validation and refresh logic
- Implement rate limiting and security headers
