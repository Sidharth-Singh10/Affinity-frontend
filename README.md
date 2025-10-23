# Affinity - Where Minds Meet

![Affinity Frontend](./src/assets/AffinityBanner.png)

<div align="center">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/rishyym0927/AffinityX?style=for-the-badge">
  <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/rishyym0927/AffinityX?style=for-the-badge">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/rishyym0927/AffinityX?style=for-the-badge">
  <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/rishyym0927/AffinityX?style=for-the-badge">
  <img alt="GitHub closed issues" src="https://img.shields.io/github/issues-closed/rishyym0927/AffinityX?style=for-the-badge">
  <img alt="GitHub closed pull requests" src="https://img.shields.io/github/issues-pr-closed/rishyym0927/AffinityX?style=for-the-badge">
</div>

<br>

Welcome to **Affinity - Where Minds Meet**! This is a complete rewrite of the Affinity platform using **Next.js 14**, featuring a modern, responsive design with **TypeScript**, **Tailwind CSS**, and **Framer Motion** animations. Affinity is an AI-powered intellectual matchmaking platform designed to connect brilliant minds in the developer and tech community through sophisticated matching algorithms and meaningful interactions.

If you're interested in contributing to the backend of the project, please visit our [Affinity Backend Repository](https://github.com/Sidharth-Singh10/Affinity-backend).

<p align="center"><br><br>
<a href="#introduction"><kbd><br>&emsp;Introduction&emsp;<br><br></kbd></a>&emsp;
<a href="#features"><kbd><br>&emsp;Features&emsp;<br><br></kbd></a>&emsp;
<a href="#preview"><kbd><br>&emsp;Preview&emsp;<br><br></kbd></a>&emsp;
<a href="#technologies-used"><kbd><br>&emsp;Technologies Used&emsp;<br><br></kbd></a>&emsp;
<a href="#installation"><kbd><br>&emsp;Installation&emsp;<br><br></kbd></a>
<br>
<br>
<a href="#usage"><kbd><br>&emsp;Usage&emsp;<br><br></kbd></a>&emsp;
<a href="#project-structure"><kbd><br>&emsp;Project Structure&emsp;<br><br></kbd></a>&emsp;
<a href="#api-routes"><kbd><br>&emsp;API Routes&emsp;<br><br></kbd></a>&emsp;
<a href="#contributors"><kbd><br>&emsp;Contributors&emsp;<br><br></kbd></a>&emsp;
<a href="#contributing"><kbd><br>&emsp;Contributing&emsp;<br><br></kbd></a>&emsp;
<a href="#contact"><kbd><br>&emsp;Contact&emsp;<br><br></kbd></a><br><br>
</p>

## Introduction

Affinity is a revolutionary Next.js 14 application that connects developers, engineers, and tech enthusiasts based on intellectual compatibility and shared interests. Using modern web technologies and AI-powered algorithms, the platform analyzes coding skills, interests, and personality traits to create meaningful connections that go beyond traditional networking.

Built with the **App Router**, server-side rendering, and modern React patterns, Affinity delivers a beautiful, responsive UI powered by **Tailwind CSS** and **Framer Motion** animations.

## Features

### 🚀 Core Features
- **AI-Powered Matching**: Sophisticated swipe-based matching system with compatibility algorithms
- **Interactive Dashboard**: Smooth Tinder-style card interface with real-time animations
- **Multi-Step Registration**: Comprehensive 5-step onboarding process capturing user preferences and skills
- **Profile Management**: Detailed user profiles with skills, interests, social habits, and photo galleries
- **Real-time Chat System**: Active conversations and messaging interface
- **AI Dating Assistant**: Built-in chatbot for dating advice and conversation starters
- **Match Requests**: Handle incoming connection requests with accept/reject functionality
- **Activity Feed**: Track profile views, likes, matches, and user interactions

### 🎨 UI/UX Features
- **Modern Dark Theme**: Sleek black design with signature #FF0059 pink accent color
- **Glass Morphism**: Backdrop blur effects and translucent components
- **Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion powered page transitions and micro-interactions
- **Interactive Components**: Hover effects, loading states, and touch-friendly mobile interactions
- **Accessibility**: WCAG compliant components with proper keyboard navigation

### 🛠 Technical Features
- **Next.js 14**: Latest App Router with server components and streaming
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Component Library**: Reusable UI components built with Radix UI primitives
- **Performance Optimized**: Image optimization, code splitting, and lazy loading
- **Mobile-First**: Touch-optimized interactions with proper tap targets

## Preview

The application features a sophisticated dark interface with the following key pages:

### Landing Page
- **Hero Section**: Animated typography with "Where minds connect" tagline
- **Features Grid**: AI Matching, Code Challenges, Smart Conversations, Community, Real-time Sync, Privacy
- **Tech Stack Showcase**: Modern technology stack presentation
- **Call-to-Action Section**: Conversion-optimized signup flow

### Authentication
- **Login Page**: Clean, centered form with gradient styling
- **Signup Flow**: 5-step registration process including:
  1. Basic Information (Name, Email, Password)
  2. Personal Details (Age, Location, Occupation, Bio)
  3. Interests & Skills (Programming languages, hobbies)
  4. Preferences (Expected qualities, social habits)
  5. Profile Picture Upload

### Dashboard
- **Swipe Interface**: Tinder-style card matching with like/reject/super like actions
- **User Cards**: Detailed profiles with multiple photos, compatibility scores, online status
- **Quick Stats**: Profile views, matches, likes, and response rates
- **Activity Feed**: Recent interactions and notifications
- **Recent Matches**: Quick access to new connections

### Additional Pages
- **Profile Page**: Comprehensive user profile with stats, gallery, and settings
- **Matches Page**: List of mutual matches with chat preview
- **Requests Page**: Incoming match requests management
- **AI Chatbot**: Dating assistant for advice and conversation starters

## Technologies Used

### Frontend Framework
- **Next.js 14.2.3** - React framework with App Router and server components
- **React 18.3.1** - Latest React with concurrent features
- **TypeScript 5.x** - Static type checking and enhanced developer experience

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Tailwind Animate 1.0.7** - Animation utilities
- **Class Variance Authority** - Component variant management
- **Framer Motion 12.19.2** - Advanced animations and gesture library

### UI Components
- **Radix UI** - Unstyled, accessible UI primitives including:
  - `@radix-ui/react-label` - Form labels
  - `@radix-ui/react-select` - Dropdown components
  - `@radix-ui/react-slot` - Composition utilities
  - `@radix-ui/react-switch` - Toggle switches
- **Lucide React 0.525.0** - Beautiful, customizable icon library
- **Tailwind Merge** - Utility for merging Tailwind CSS classes

### Development Tools
- **ESLint 9.x** - Code linting with Next.js configuration
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **TypeScript Config** - Optimized TypeScript configuration

## Installation

### Prerequisites
- **Node.js 18+** (Recommended: 18.17.0 or later)
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Setup Instructions

1. **Clone the repository**:
```bash
git clone https://github.com/rishyym0927/AffinityX.git
cd AffinityX/newAffinity
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Run the development server**:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Usage

### Development Mode
The application runs in development mode with:
- **Hot Module Replacement** (HMR) for instant updates
- **Fast Refresh** for React components
- **TypeScript** compilation and error checking
- **ESLint** integration for code quality

### Available Routes

| Page Name | Route | Description | Component |
|-----------|-------|-------------|-----------|
| **Landing** | `/` | Hero section with features showcase | [`src/app/page.tsx`](src/app/page.tsx) |
| **Login** | `/login` | User authentication | [`src/app/login/page.tsx`](src/app/login/page.tsx) |
| **Signup** | `/signup` | 5-step registration process | [`src/app/signup/page.tsx`](src/app/signup/page.tsx) |
| **Dashboard** | `/dashboard` | Main matching interface | [`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx) |
| **Profile** | `/profile` | User profile management | [`src/app/profile/page.tsx`](src/app/profile/page.tsx) |
| **Matches** | `/matches` | Mutual matches and conversations | [`src/app/matches/page.tsx`](src/app/matches/page.tsx) |
| **Requests** | `/requests` | Incoming match requests | [`src/app/requests/page.tsx`](src/app/requests/page.tsx) |
| **Chatbot** | `/chatbot` | AI dating assistant | [`src/app/chatbot/page.tsx`](src/app/chatbot/page.tsx) |

### Key Features Usage

#### Matching System
- **Swipe Left/Right**: Reject or like profiles
- **Super Like**: Special highlight for premium interest
- **Compatibility Score**: AI-calculated match percentage
- **Real-time Updates**: Instant feedback on actions

#### Profile Customization
- **Multi-photo Gallery**: Upload and manage multiple profile images
- **Skills & Interests**: Tag-based system for matching
- **Social Habits**: Lifestyle preferences for better compatibility
- **Bio & Details**: Rich profile information

#### Communication
- **AI Assistant**: Get dating advice and conversation starters
- **Chat Preview**: See message snippets on match cards
- **Online Status**: Real-time presence indicators

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles and theme
│   ├── not-found.tsx           # 404 error page
│   ├── dashboard/              # Main matching interface
│   │   └── page.tsx
│   ├── login/                  # Authentication
│   │   └── page.tsx
│   ├── signup/                 # Registration flow
│   │   └── page.tsx
│   ├── profile/                # User profile management
│   │   └── page.tsx
│   ├── matches/                # Mutual matches
│   │   └── page.tsx
│   ├── requests/               # Match requests
│   │   └── page.tsx
│   └── chatbot/                # AI assistant
│       └── page.tsx
├── components/                   # React components
│   ├── ui/                     # Reusable UI primitives
│   │   ├── button.tsx          # Button variants
│   │   ├── input.tsx           # Form inputs
│   │   ├── label.tsx           # Form labels
│   │   ├── select.tsx          # Dropdown selects
│   │   ├── switch.tsx          # Toggle switches
│   │   └── textarea.tsx        # Text areas
│   ├── dashboard/              # Dashboard components
│   │   ├── dashboard-nav.tsx   # Navigation header
│   │   ├── user-card.tsx       # Swipeable profile cards
│   │   ├── activity-feed.tsx   # Recent activity
│   │   └── quick-stats.tsx     # Statistics display
│   ├── profile/                # Profile components
│   │   ├── profile-header.tsx  # Profile overview
│   │   ├── profile-info.tsx    # Personal information
│   │   ├── profile-stats.tsx   # Analytics dashboard
│   │   ├── profile-gallery.tsx # Photo management
│   │   └── profile-settings.tsx # Account settings
│   ├── matches/                # Matching system
│   │   ├── matches-list.tsx    # Match results
│   │   ├── active-chats.tsx    # Conversation list
│   │   └── match-filters.tsx   # Search filters
│   ├── requests/               # Request management
│   │   ├── requests-list.tsx   # Incoming requests
│   │   ├── request-stats.tsx   # Statistics
│   │   └── request-filters.tsx # Filter options
│   ├── aichatbot/              # AI Assistant
│   │   └── ai-chat-interface.tsx # Chat interface
│   ├── hero-section.tsx        # Landing hero
│   ├── features-grid.tsx       # Feature showcase
│   ├── cta-section.tsx         # Call-to-action
│   ├── tech-stack.tsx          # Technology display
│   └── footer.tsx              # Site footer
├── lib/                        # Utility functions
│   └── utils.ts                # Common utilities
└── assets/                     # Static assets
    └── default.jpg             # Default profile image
```

## API Routes

Currently, the application uses hardcoded data for development. Future API integration points include:

- **Authentication**: `/api/auth/*` - Login, signup, logout
- **Users**: `/api/users/*` - Profile CRUD operations
- **Matching**: `/api/matches/*` - Matching algorithm and results
- **Messages**: `/api/messages/*` - Chat functionality
- **AI**: `/api/ai/*` - Chatbot responses

## Configuration Files

### Core Configuration
- **`next.config.js`** - Next.js configuration
- **`tailwind.config.js`** - Tailwind CSS customization
- **`tsconfig.json`** - TypeScript compiler options
- **`components.json`** - shadcn/ui configuration
- **`package.json`** - Dependencies and scripts

### Styling
- **`postcss.config.js`** - CSS processing configuration
- **`src/app/globals.css`** - Global styles and CSS variables

### Development
- **`eslint.config.mjs`** - ESLint configuration
- **`.gitignore`** - Git ignore patterns

## Contributors

<a href="https://github.com/rishyym0927/AffinityX/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=rishyym0927/AffinityX"/>
</a>

## Contributing

We welcome contributions from the community! Here's how you can contribute:

### Getting Started
1. **Fork the repository** from the main branch
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the coding standards
4. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request** with detailed description

### Contribution Guidelines
- **Code Style**: Follow the existing TypeScript and React patterns
- **Components**: Use Tailwind CSS for styling and Framer Motion for animations
- **Type Safety**: Ensure all TypeScript types are properly defined
- **Testing**: Add tests for new features when applicable
- **Documentation**: Update README and component documentation
- **Performance**: Optimize for mobile and ensure accessibility

### Areas for Contribution
- **UI/UX Improvements**: Enhanced animations and user interactions
- **New Features**: Additional matching algorithms and chat features
- **Performance**: Optimization and bundle size reduction
- **Accessibility**: WCAG compliance improvements
- **Mobile Experience**: Touch interactions and responsive design
- **Documentation**: Code comments and usage examples

### Development Standards
- Use **TypeScript** for all new code
- Follow **React Hooks** patterns and functional components
- Implement **responsive design** with Tailwind CSS
- Add **Framer Motion** animations for smooth interactions
- Ensure **accessibility** with proper ARIA labels
- Write **semantic HTML** and proper component structure

### Hacktoberfest and Open Source

This repository is actively participating in **Hacktoberfest** and welcomes contributions from the open source community. We encourage developers to contribute to frontend features, UI improvements, and user experience enhancements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions, suggestions, or need assistance:

- **GitHub Issues**: [Create an issue](https://github.com/rishyym0927/AffinityX/issues)
- **Email**: [Contact the maintainer](mailto:your-email@example.com)
- **Discord**: Join our development community

---

<div align="center">
  <p>Built with ❤️ by the Affinity team</p>
  <p>⭐ Star this repository if you find it helpful!</p>
  <p><strong>Affinity - Where Minds Meet</strong></p>
</div>
