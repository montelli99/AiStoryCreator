# 🚀 AI Creator Studio - Complete Platform

**A comprehensive AI-powered video automation platform built with Next.js 15, TypeScript, and Z.ai models.**

---

## 🎯 **PLATFORM OVERVIEW**

AI Creator Studio is a **Sora-level AI video generation platform** that:

- ✅ Creates ultra-realistic male characters (18 total)
- ✅ Generates luxury + influencer aesthetic content  
- ✅ Produces both images and videos
- ✅ Tracks performance and learns what works
- ✅ Automatically scales winning content
- ✅ Provides full dashboards, queue, calendar, and analytics
- ✅ Operates as a fully autonomous AI content studio

---

## 🛠 **TECHNOLOGY STACK**

### **Core Framework**
- **Next.js 15** with App Router
- **TypeScript 5** for type safety
- **Tailwind CSS 4** for styling
- **ShadCN UI** for components

### **AI Models (Z.ai Exclusive)**
- **CogView-4** - Image generation
- **Vidu-Q1** - Video generation  
- **GLM-4.6** - Director AI, planning, and optimization

### **Voice Generation**
- **ElevenLabs** - Text-to-speech for character voiceovers

### **Database & Storage**
- **Prisma ORM** with SQLite (development) / PostgreSQL (production)
- **Job Queue** for background processing
- **Cloudflare R2** for media storage (production)

### **Authentication**
- **NextAuth v5** with JWT sessions
- **API Key System** for programmatic access
- **Role-based access control**

---

## 📁 **PROJECT STRUCTURE**

```
/src
 ├─ app/
 │   ├─ dashboard/           # Main dashboard with real-time metrics
 │   ├─ characters/          # 18 character management system
 │   ├─ content-queue/       # Job queue monitoring
 │   ├─ analytics/           # Performance analytics with charts
 │   ├─ settings/            # User settings and API keys
 │   �─ api/
 │   │   ├─ auth/          # NextAuth authentication
 │   │   ├─ generate/      # AI generation endpoints
 │   │   ├─ director/      # GLM-4.6 Director AI
 │   │   ├─ analytics/     # Analytics data
 │   │   └─ api-keys/      # API key management
 │   └─ layout.tsx          # Root layout with session provider
 │
 ├─ components/
 │   ├─ ui/                # ShadCN component library
 │   ├─ dashboard/          # Dashboard components
 │   ├─ charts/             # Analytics charts
 │   └─ forms/              # Form components
 │
 ├─ lib/
 │   ├─ db.ts              # Prisma database client
 │   ├─ z-ai/              # Z.ai API client wrapper
 │   ├─ elevenlabs/        # ElevenLabs API client
 │   └─ utils.ts            # Utility functions
 │
 └─ hooks/
     ├─ use-toast.ts        # Toast notifications
     └─ use-mobile.ts        # Mobile detection
```

---

## 🔐 **AUTHENTICATION SYSTEM**

### **User Authentication**
- Email/password login with bcrypt hashing
- JWT sessions with NextAuth v5
- Role-based access (user, admin, owner)
- Protected routes with middleware

### **API Key Management**
- Generate unlimited API keys per user
- Track usage and last access time
- Enable/disable keys individually
- Secure API key validation middleware

### **Demo Account**
- Email: `demo@aicreator.com`
- Password: `demo123456`
- Role: Admin (full access)

---

## 🤖 **AI INTEGRATION**

### **Z.ai CogView-4 (Images)**
```typescript
const zaiClient = getZAIClient();
const result = await zaiClient.generateImage({
  prompt: "A cinematic portrait of ID_01_A",
  style: "photorealistic",
  size: "1024x1024"
});
```

### **Z.ai Vidu-Q1 (Videos)**
```typescript
const result = await zaiClient.generateVideo({
  prompt: "5-second video of ID_01_A walking",
  duration: 5,
  resolution: "1920x1080",
  consistency_anchor: "ID_01_A"
});
```

### **Z.ai GLM-4.6 (Director AI)**
```typescript
const plan = await zaiClient.generateContentPlan({
  characterCode: "ID_01_A",
  characterData: {
    ethnicity: "korean",
    baseAge: 18,
    variant: "A", 
    aestheticType: "cinematic"
  },
  product: "luxury watch",
  analytics: performanceData,
  trendData: trendData
});
```

### **ElevenLabs (Voice)**
```typescript
const elevenLabsClient = getElevenLabsClient();
const audioBlob = await elevenLabsClient.generateCharacterSpeech({
  text: "Welcome to our luxury collection",
  characterType: "korean",
  age: "young",
  aesthetic: "cinematic"
});
```

---

## 📊 **DATABASE SCHEMA**

### **Core Models**
- **User** - Authentication and roles
- **ApiKey** - API key management
- **Character** - 18 AI characters with embeddings
- **Content** - Generated images and videos
- **Analytics** - Performance tracking and metrics
- **JobQueue** - Background job processing
- **Schedule** - Content posting calendar
- **DirectorControl** - AI Director optimization data

### **Relationships**
- Users → ApiKeys (one-to-many)
- Characters → Content (one-to-many)
- Content → Analytics (one-to-one)
- Content → Schedule (one-to-one)

---

## 🚀 **API ENDPOINTS**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/init-demo` - Create demo user
- `GET/POST /api/auth/[...nextauth]` - NextAuth handler

### **AI Generation** (API Key Protected)
- `POST /api/generate/image` - CogView-4 image generation
- `POST /api/generate/video` - Vidu-Q1 video generation
- `POST /api/generate/voiceover` - ElevenLabs speech generation
- `POST /api/generate/batch` - Batch content generation

### **Director AI**
- `POST /api/director/plan` - GLM-4.6 content planning

### **Management**
- `GET/POST /api/api-keys` - API key management
- `PUT/DELETE /api/api-keys/[id]` - Individual key operations
- `GET /api/analytics/summary` - Dashboard analytics
- `GET/POST /api/queue` - Job queue management

---

## 🔧 **ENVIRONMENT VARIABLES**

```bash
# ============================================
# AI CREATOR STUDIO - ENVIRONMENT VARIABLES
# ============================================

# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js (Your Platform Authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Z.ai API Keys (Core AI Models)
ZAI_API_KEY="your-zai-api-key-here"

# ElevenLabs API Key (Voice Generation)
ELEVENLABS_API_KEY="your-elevenlabs-api-key-here"

# Optional: External APIs
TIKTOK_ACCESS_TOKEN="your-tiktok-access-token"

# Optional: Cloud Storage (for production)
R2_ACCESS_KEY="your-cloudflare-r2-access-key"
R2_SECRET_KEY="your-cloudflare-r2-secret-key"
R2_BUCKET="your-bucket-name"
R2_PUBLIC_BASE_URL="https://your-bucket.r2.dev"

# Optional: Redis (for production caching)
REDIS_URL="redis://localhost:6379"

# Development settings
NODE_ENV="development"
```

---

## 🎭 **CHARACTER UNIVERSE**

### **18 Male Characters**
- **Korean**: ID_01_A/B/C (18/25/35), ID_02_A/B/C (18/25/35), ID_03_A/B/C (18/25/35)
- **Japanese**: ID_04_A/B/C (18/25/35), ID_05_A/B/C (18/25/35)  
- **Chinese**: ID_06_A/B/C (18/25/35)

### **Aesthetic Types**
- **Cinematic**: High-end, luxury, dramatic lighting
- **Influencer**: Casual, trendy, engaging content

### **Character Embeddings**
Each character includes detailed embeddings for:
- Ethnicity and age context
- Aesthetic preferences
- Performance history
- Optimization data

---

## 📈 **FEATURES**

### **Dashboard**
- Real-time metrics and KPIs
- Production pipeline monitoring
- AI Director status
- Top character rankings
- Recent content performance

### **Character Management**
- Visual character grid with filtering
- Performance-based rankings
- Content generation per character
- Aesthetic and ethnicity grouping

### **Content Queue**
- Real-time job status monitoring
- Progress tracking with visual indicators
- Error handling and retry functionality
- Filter by status and type

### **Analytics**
- Performance trends with Recharts
- Content type distribution
- Character comparison analytics
- Engagement metrics tracking

### **API Key System**
- Secure key generation and management
- Usage tracking and monitoring
- Role-based access control
- Easy integration for external tools

---

## 🚀 **GETTING STARTED**

### **Prerequisites**
- Node.js 18+
- npm or yarn
- Z.ai API key
- ElevenLabs API key (optional)

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd ai-creator-studio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Initialize database
npm run db:push

# Start development server
npm run dev
```

### **Development Commands**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run db:push       # Push database schema
npm run db:generate    # Generate Prisma client
```

---

## 🔐 **SECURITY**

### **Authentication Security**
- Password hashing with bcrypt (12 rounds)
- JWT session tokens
- API key validation middleware
- Role-based access control
- Secure session management

### **API Security**
- API key validation for all generation endpoints
- Request rate limiting (configurable)
- Input validation and sanitization
- Error handling without information leakage

### **Data Protection**
- Environment variable validation
- Database connection security
- File upload restrictions
- CORS configuration for API

---

## 📱 **RESPONSIVE DESIGN**

- **Mobile-first approach** with Tailwind CSS
- **Progressive enhancement** for larger screens
- **Touch-friendly interfaces** (44px minimum)
- **Adaptive layouts** for all device sizes
- **Accessible components** with ARIA labels

---

## 🎨 **UI/UX FEATURES**

### **Modern Interface**
- ShadCN UI component library
- Dark/light theme support
- Smooth animations and transitions
- Loading states and skeletons
- Toast notifications

### **Interactive Elements**
- Real-time progress updates
- Drag-and-drop functionality
- Hover states and micro-interactions
- Keyboard navigation support
- Screen reader accessibility

---

## 📊 **MONITORING**

### **Performance Tracking**
- Real-time job queue monitoring
- Content performance analytics
- API response time tracking
- Error rate monitoring
- User engagement metrics

### **Health Checks**
- Database connection status
- External API availability
- Job queue health
- System resource monitoring

---

## 🚀 **DEPLOYMENT**

### **Production Setup**
```bash
# Build the application
npm run build

# Set production environment variables
export NODE_ENV=production
export DATABASE_URL="postgres://..."
export ZAI_API_KEY="production-key"

# Start production server
npm run start
```

### **Environment Requirements**
- **Node.js 18+**
- **PostgreSQL** (production)
- **Redis** (optional, for caching)
- **Cloudflare R2** (for media storage)

---

## 🤝 **CONTRIBUTING**

### **Development Workflow**
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review and merge

### **Code Style**
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits
- Component documentation

---

## 📄 **LICENSE**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 **SUPPORT**

- **Documentation**: [Link to docs]
- **Issues**: [Link to GitHub Issues]
- **Discord**: [Link to community Discord]
- **Email**: support@aicreator.com

---

## 🎯 **ROADMAP**

### **Phase 1** (Current)
- ✅ Core AI generation (Z.ai)
- ✅ Character management system
- ✅ Authentication and API keys
- ✅ Analytics and dashboard

### **Phase 2** (Next)
- 🔄 Calendar and scheduling system
- 🔄 TikTok integration
- 🔄 Advanced analytics
- 🔄 Mobile app

### **Phase 3** (Future)
- 📋 Multi-platform support
- 📋 Team collaboration
- 📋 Advanced AI optimization
- 📋 White-label solution

---

**Built with ❤️ using Z.ai, ElevenLabs, and modern web technologies.**