# English Learning App - Personal Vocabulary Trainer

A comprehensive, AI-enhanced vocabulary learning application designed for intermediate English learners who want to systematically improve their vocabulary, grammar, and writing skills.

## 🎯 Project Vision

This app addresses the specific needs of intermediate English learners (B1-B2 level) who:
- Encounter new vocabulary while reading books and articles
- Want to move beyond basic vocabulary to more sophisticated expressions
- Need structured practice to retain and actively use new words
- Benefit from AI-powered feedback on their writing
- Prefer intensive, focused study sessions (1-2 hours daily)

## ✨ Key Features

### Core Learning Tools
- **Smart Vocabulary Management**: Add, organize, and track words with AI-powered difficulty assessment
- **Comprehensive Quiz System**: 6 different quiz types including definition matching, sentence creation, and context clues
- **AI-Enhanced Writing Practice**: Get detailed feedback on grammar, style, and naturalness
- **Spaced Repetition**: Intelligent review scheduling based on your performance and memory patterns
- **Progress Analytics**: Detailed insights into your learning journey and areas for improvement

### User Experience
- **Offline-First Design**: Works completely offline with local SQLite storage
- **No Authentication Required**: Privacy-focused, no personal data collection
- **Responsive Interface**: Optimized for both desktop and mobile use
- **Customizable Study Sessions**: Adapt to your available time and learning goals

## 🛠 Technical Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, modern UI
- **React Query** for efficient data management
- **React Router** for client-side navigation

### Backend & Data
- **SQLite** for local data storage (via sql.js or better-sqlite3)
- **IndexedDB** for browser-based storage fallback
- **AI Integration** via OpenAI API or similar for language processing

### Development Tools
- **ESLint + Prettier** for code quality
- **Vitest** for unit testing
- **Playwright** for end-to-end testing
- **GitHub Actions** for CI/CD

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Modal, etc.)
│   ├── vocabulary/      # Vocabulary-specific components
│   ├── quiz/           # Quiz and practice components
│   └── analytics/      # Progress and statistics components
├── pages/              # Main application screens
├── hooks/              # Custom React hooks
├── services/           # Data access and API integration
├── stores/             # State management (Zustand/Redux)
├── utils/              # Helper functions and utilities
├── types/              # TypeScript type definitions
└── assets/             # Static assets (icons, images)
```

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ and npm
- Modern browser with IndexedDB support
- Optional: AI API key for enhanced features

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd english-learning-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your AI API key (optional)

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 📊 Data Architecture

The application uses a local-first approach with the following main entities:

- **Vocabulary**: Core word/phrase entries with meanings, examples, and metadata
- **Quiz Sessions**: Track practice sessions and performance
- **Study Statistics**: Daily/weekly learning analytics
- **Review Schedule**: Spaced repetition timing and intervals

See `02_DATA_MODEL.md` for detailed schema information.

## 🎨 Design System

The UI follows a clean, focused design that:
- Minimizes cognitive load during learning
- Uses color coding for different word types and difficulty levels
- Provides immediate visual feedback on progress
- Supports both light and dark themes

See `03_UI.md` for detailed interface specifications.

## 🤖 AI Integration

The app leverages AI for several key features:
- **Grammar and style checking** for sentence practice
- **Difficulty assessment** for new vocabulary
- **Personalized example generation**
- **Context-aware corrections and suggestions**

See `04_AI_PROMPTS.md` for detailed prompt engineering and integration guidelines.

## 🗺 Development Roadmap

### Phase 1: MVP (Current)
- [x] Requirements analysis and design
- [ ] Core vocabulary management
- [ ] Basic quiz functionality  
- [ ] Simple sentence practice
- [ ] Local data storage
- [ ] Responsive UI implementation

### Phase 2: Enhancement
- [ ] Spaced repetition algorithm
- [ ] Advanced analytics dashboard
- [ ] Audio pronunciation features
- [ ] Import/export capabilities

### Phase 3: Advanced Features
- [ ] AI-powered conversational practice
- [ ] Reading integration
- [ ] Multi-device synchronization
- [ ] Community features

See `10_FUTURE_FEATURES.md` for the complete feature roadmap.

## 🧪 Testing Strategy

### Unit Tests
- Component rendering and behavior
- Business logic and utilities
- Data access layer functions
- AI integration services

### Integration Tests
- User workflows (add word → practice → review)
- Data persistence and retrieval
- Quiz session management
- Progress tracking accuracy

### E2E Tests
- Complete learning sessions
- Data import/export functionality
- Cross-browser compatibility
- Performance benchmarks

## 📈 Performance Goals

- **Initial load time**: < 2 seconds
- **Search/filter response**: < 200ms
- **Quiz question transitions**: < 100ms
- **Offline functionality**: 100% core features
- **Memory usage**: < 100MB for 10k vocabulary entries

## 🔒 Privacy & Security

- **No user accounts**: All data stored locally
- **Optional AI features**: Can be disabled completely
- **Data portability**: Export all data anytime
- **Transparent data usage**: Clear policies for any external API calls

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome! Please:

1. Check existing issues before creating new ones
2. Follow the established code style and patterns
3. Include tests for new features
4. Update documentation as needed

## 📄 License

MIT License - feel free to use this project as inspiration for your own learning tools!

## 🙏 Acknowledgments

- Inspired by spaced repetition research and tools like Anki
- UI/UX principles from language learning apps like Duolingo and Memrise
- AI integration patterns from modern language learning platforms

---

**Happy Learning!** 📚✨
