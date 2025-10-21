# WhatsMind - ADHD-Friendly Messaging & Task Manager

WhatsMind is a Progressive Web App that combines messaging and task management to help individuals with ADHD stay organized without distraction.

## 🌟 Features

- **ADHD-Optimized Messaging**: Clean, distraction-free chat interface with smart categorization
- **Smart Task Management**: Convert messages to tasks with visual prioritization and due dates
- **Focus Timer**: Built-in Pomodoro timer for maintaining concentration during work sessions
- **AI Assistant**: Lovable AI-powered productivity advice and task assistance
- **Real-time Sync**: Instant updates across all devices with Supabase real-time
- **Voice Messages**: Record and send voice messages for quick communication
- **File Sharing**: Secure file attachments with organized storage
- **PWA Support**: Install as native app on any device with offline capabilities

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (Auth, Database, Storage, Real-time, Edge Functions)
- **AI**: Lovable AI (Google Gemini 2.5 Flash)
- **PWA**: Vite PWA Plugin with Workbox for offline support
- **UI Components**: shadcn/ui with Radix UI primitives

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd whatsmind
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
Create a `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:
All migrations are automatically applied when you build the project.

5. Start the development server:
```bash
npm run dev
# or
bun dev
```

6. Open [http://localhost:8080](http://localhost:8080) in your browser

## 📱 PWA Installation

WhatsMind can be installed as a native app on any device:

1. Visit the app in your browser
2. Look for the install prompt or visit `/install`
3. Click "Install" to add to your home screen
4. Enjoy offline access and native app experience

## 🗄️ Database Schema

The app uses the following main tables:
- **profiles**: User profile information and preferences
- **conversations**: Chat conversations (individual and group)
- **messages**: Chat messages with support for text, voice, and files
- **tasks**: User tasks with priorities, categories, and due dates
- **focus_sessions**: Focus timer session tracking
- **categories**: Custom task categories
- **notifications**: System notifications

All tables have Row Level Security (RLS) policies for data protection.

## 🔒 Security

- **Authentication**: Supabase Auth with email/password and social login
- **Row Level Security**: All tables protected with RLS policies
- **Secure Storage**: File uploads with access control policies
- **API Security**: Edge functions with JWT verification
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs

## ⚡ Performance Optimizations

- **Code Splitting**: React.lazy for route-based code splitting
- **PWA Caching**: Service worker with Workbox for offline support
- **Database Indexes**: Optimized queries for fast data access
- **Real-time Subscriptions**: Efficient WebSocket connections
- **Image Optimization**: Optimized assets and lazy loading
- **Bundle Size**: Tree-shaking and minimized production builds

## 🎨 Design System

WhatsMind uses a carefully crafted ADHD-friendly design system:
- **Calming Colors**: Soft blues, greens, and warm accents
- **Generous Spacing**: 8px grid system for visual clarity
- **Subtle Animations**: Smooth transitions without distraction
- **High Contrast**: Accessible color ratios for readability
- **Consistent Typography**: Inter font family for clarity

## 📖 Project Structure

```
whatsmind/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts (Auth, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API service layers
│   ├── utils/           # Utility functions
│   └── integrations/    # Supabase integration
├── supabase/
│   ├── functions/       # Edge functions
│   └── migrations/      # Database migrations
└── public/              # Static assets

```

## 🧪 Testing

Run linting and type checks:
```bash
npm run lint
npm run type-check
```

## 📦 Deployment

### Deploy via Lovable

The easiest way to deploy is through Lovable:

1. Click the **Publish** button in the Lovable editor
2. Your app will be deployed to `yoursite.lovable.app`
3. Connect a custom domain in Project Settings if desired

### Deploy Elsewhere

Build the production bundle:
```bash
npm run build
# or
bun run build
```

The `dist` folder contains the production-ready app that can be deployed to:
- Vercel
- Netlify  
- AWS Amplify
- Any static hosting service

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

---

**Project URL**: https://lovable.dev/projects/6e2ea119-8adf-4e86-bfca-4b76f42bbabd

Built with ❤️ using [Lovable](https://lovable.dev)
