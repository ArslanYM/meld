# Meld - Chat with Multiple AI Models at Once

Meld is a sophisticated web application that enables users to interact with multiple AI models simultaneously in a single chat interface. Get responses from different AI providers and compare them side-by-side to find the best answer for your needs.

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Features

- **Multi-Model Chat**: Interact with multiple AI models at the same time
  - GPT (3.5, 3.5 Turbo, 4.1 Mini, 4.1, 5 Nano, 5 Mini, 5)
  - Gemini (2.5 Lite, 2.5 Flash, 2.5 Pro)
  - DeepSeek (R1, R1 0528)
  - Mistral (Medium 2505, Ministral 3B)
  - Grok (3 Mini, 3)
  - Cohere (Command A, Command R 08-2024)
  - Llama (3.3 70B Instruct, 4 Scout 17B 16E Instruct)

- **Side-by-Side Comparison**: View responses from all enabled models in parallel
- **Rate Limiting**: Built-in token bucket rate limiting with Arcjet
- **User Authentication**: Secure login via Clerk
- **Chat History**: Save and retrieve previous conversations
- **Usage Tracking**: Monitor free message quota (5 messages for free tier)
- **Premium Plans**: Upgrade to unlimited messages
- **Dark Mode**: Light and dark theme support
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠 Tech Stack

### Frontend

- **Next.js 16.1.4** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **React Markdown** - Markdown rendering

### Backend & Services

- **Firebase Firestore** - Real-time database for chat history
- **Clerk** - User authentication and management
- **Arcjet** - Rate limiting and security
- **Kravix Studio API** - AI model integration

### Development Tools

- **TypeScript** - Type safety (jsconfig.json)
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast bundler for Next.js

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account
- Clerk account
- Arcjet account
- Kravix Studio API key

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Arcjet Rate Limiting
ARCJET_KEY=your_arcjet_key

# AI Model API
KRAVIX_STUDIO_API_KEY=your_kravix_studio_api_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 5. Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
web/
├── app/
│   ├── _components/          # Reusable components
│   │   ├── AiMultiModel.jsx  # Multi-model display
│   │   ├── AppHeader.jsx     # Header component
│   │   ├── AppSidebar.jsx    # Sidebar with chat history
│   │   ├── ChatInputBox.jsx  # Chat input interface
│   │   ├── ToggleTheme.jsx   # Theme switcher
│   │   └── UsageCreditProgress.jsx # Usage meter
│   ├── api/
│   │   ├── ai-multimodel/    # AI model integration API
│   │   ├── arcjet-test/      # Rate limiting test
│   │   └── user-remaining-msg/ # Message quota check
│   ├── globals.css           # Global styles
│   ├── layout.js             # Root layout
│   ├── page.js               # Home page
│   ├── provider.jsx          # Context providers
│   └── settings/
│       └── page.js           # Settings page
├── components/
│   └── ui/                   # shadcn/ui components
├── config/
│   ├── Arcjet.js            # Rate limiting config
│   └── FirebaseConfig.js    # Firebase setup
├── context/
│   ├── AiSelectedModelContext.jsx # Model selection state
│   ├── UserDetailContext.js       # User data state
│   └── UserDetailContext.js       # User context
├── hooks/
│   └── use-mobile.js        # Mobile detection hook
├── lib/
│   └── utils.js             # Utility functions
├── public/                  # Static assets
├── shared/
│   ├── AIModelList.jsx      # Available AI models
│   └── AiModelsShared.jsx   # Default model config
├── jsconfig.json            # Path aliases config
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies
├── postcss.config.mjs        # PostCSS config
└── README.md                # This file
```

## 🔑 Key Features Explained

### Multi-Model Architecture

- Users can enable/disable individual AI models
- Each model has its own message thread
- Responses are fetched in parallel for better UX

### Rate Limiting

- Free tier: 5 messages per interval
- Uses Arcjet token bucket algorithm
- Prevents abuse and ensures fair usage

### Chat Persistence

- All conversations saved to Firebase Firestore
- Chat history accessible from sidebar
- Automatic save on every message

### User Management

- Clerk handles authentication
- User preferences (selected models) saved to database
- Free plan with upgrade option

## 🔄 API Routes

### POST `/api/ai-multimodel`

Sends a message to the selected AI model and returns the response.

**Request:**

```json
{
  "model": "gpt-4.1-mini",
  "msg": [{ "role": "user", "content": "Hello" }],
  "parentModel": "GPT"
}
```

**Response:**

```json
{
  "aiResponse": "...",
  "model": "GPT"
}
```

### POST `/api/user-remaining-msg`

Checks remaining message quota using Arcjet rate limiting.

**Request:**

```json
{
  "token": 1
}
```

**Response:**

```json
{
  "allowed": true,
  "remainingToken": 4
}
```

### GET `/api/arcjet-test`

Test endpoint for Arcjet rate limiting.

## 🎨 Customization

### Theme

The app uses Next Themes for theme management. Customize colors in `app/globals.css`.

### Models

Edit available models in `shared/AIModelList.jsx` and default selection in `shared/AiModelsShared.jsx`.

### API Integration

Update the AI model endpoint in `app/api/ai-multimodel/route.js`.

## 🚨 Troubleshooting

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

### Import Alias Issues

The app uses relative imports for config files instead of path aliases. Update imports if adding new config files:

```javascript
// ✅ Correct
import { db } from "../../config/FirebaseConfig";

// ❌ Avoid in config imports
import { db } from "@/config/FirebaseConfig";
```

### Firebase Connection

- Verify all Firebase environment variables are set
- Check Firebase console for Firestore database status
- Ensure proper Firestore security rules

### Authentication Issues

- Verify Clerk keys in environment variables
- Check Clerk dashboard for application configuration
- Ensure redirect URLs are configured in Clerk

## 📦 Dependencies

Key dependencies:

- `next` - React framework
- `firebase` - Database and storage
- `@clerk/nextjs` - Authentication
- `@arcjet/node` - Rate limiting
- `axios` - HTTP client
- `tailwindcss` - CSS framework
- `react-markdown` - Markdown support
- `sonner` - Toast notifications

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Submit a pull request

## 📝 Code Standards

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript-compatible JSDoc comments
- Follow Tailwind CSS utility-first approach
- Use proper error handling with try-catch
- Add loading states for async operations

## 🚢 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Other Platforms

1. Build the project: `npm run build`
2. Deploy the `.next` folder
3. Set environment variables in deployment platform
4. Configure domain and SSL

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For issues and questions:

1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include environment setup and error messages

## 🔮 Roadmap

- [ ] Voice input support
- [ ] Image upload and analysis
- [ ] Custom model configuration
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] API for third-party integration
- [ ] Mobile app (React Native)
- [ ] Export conversations (PDF, Markdown)

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Built with ❤️ by Meld Team**

Last Updated: February 4, 2026
