# Campus Giveaway Spot - Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [How It Works](#how-it-works)
6. [Key Components](#key-components)
7. [Database Schema](#database-schema)
8. [Setup & Installation](#setup--installation)

---

## 🎯 Project Overview

**Campus Giveaway Spot** is a web-based marketplace application designed for college/campus communities to give away, buy, or sell items. It's built with modern web technologies and provides a user-friendly interface for browsing, listing, and connecting with other users on campus.

**Key Purpose:**
- Enable students to list items they want to give away for free or sell
- Allow other students to discover and contact sellers
- Foster community sharing and reduce waste
- Provide an easy-to-use platform for campus commerce

---

## 🛠️ Technology Stack

### **Frontend**
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | JavaScript library for building user interfaces | Latest |
| **TypeScript** | Typed superset of JavaScript for better code quality | Latest |
| **Vite** | Fast build tool and development server | v5.4.19 |
| **React Router** | Client-side routing and navigation | Latest |
| **Tailwind CSS** | Utility-first CSS framework for styling | Latest |
| **Shadcn/ui** | Pre-built React components using Tailwind | Latest |
| **Lucide React** | Icon library for UI elements | Latest |
| **Sonner** | Toast notification library | Latest |

### **Backend & Database**
| Technology | Purpose | Details |
|------------|---------|---------|
| **Supabase** | Backend-as-a-Service (PostgreSQL database + Auth) | Cloud-based |
| **PostgreSQL** | Relational database | Via Supabase |
| **Supabase Auth** | User authentication system | Email-based auth |

### **Build & Package Management**
| Technology | Purpose |
|------------|---------|
| **Bun** | Fast package manager & runtime (alternative to npm) |
| **npm/yarn** | Package management (also supported) |

### **Code Quality**
| Technology | Purpose |
|------------|---------|
| **ESLint** | JavaScript/TypeScript linting |
| **PostCSS** | CSS processing tool |

---

## 📁 Project Structure

```
campus-giveaway-spot-main/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Hero.tsx         # Hero section
│   │   ├── ItemCard.tsx     # Item display card
│   │   ├── CategoryFilter.tsx # Category filtering
│   │   └── ui/              # Shadcn UI components (buttons, cards, etc.)
│   │
│   ├── pages/               # Page components (full page views)
│   │   ├── Index.tsx        # Home page
│   │   ├── Marketplace.tsx  # Item listing page
│   │   ├── ItemDetail.tsx   # Individual item details
│   │   ├── AddItem.tsx      # Add new item form
│   │   ├── EditItem.tsx     # Edit existing item
│   │   ├── Dashboard.tsx    # User dashboard
│   │   ├── Auth.tsx         # Authentication (login/signup)
│   │   └── NotFound.tsx     # 404 page
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.tsx   # Mobile detection hook
│   │   └── use-toast.ts     # Toast notification hook
│   │
│   ├── integrations/        # External service integrations
│   │   └── supabase/
│   │       ├── client.ts    # Supabase client initialization
│   │       └── types.ts     # TypeScript types for Supabase
│   │
│   ├── lib/                 # Utility functions
│   │   └── utils.ts         # Helper functions (currency conversion, etc.)
│   │
│   ├── assets/              # Static assets (images, icons)
│   ├── App.tsx              # Main app component
│   ├── App.css              # Global app styles
│   ├── main.tsx             # React app entry point
│   └── index.css            # Global styles
│
├── supabase/                # Supabase configuration
│   ├── config.toml          # Supabase project config
│   └── migrations/          # Database migrations
│
├── public/                  # Static files served directly
│   └── robots.txt
│
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── eslint.config.js         # ESLint configuration
├── components.json          # Shadcn component configuration
└── package.json             # Project dependencies
```

---

## ✨ Features

### **User Features**
- ✅ **User Authentication** - Sign up and login with email
- ✅ **Browse Items** - View all available items on marketplace
- ✅ **Filter by Category** - Filter items by product category
- ✅ **Item Details** - View detailed information about each item
- ✅ **Contact Seller** - Send inquiry to seller via Gmail
- ✅ **Add Items** - List new items for sale or free giveaway
- ✅ **Edit Items** - Modify existing item listings
- ✅ **User Dashboard** - Manage personal listings and profile
- ✅ **Price Currency** - Display prices in Indian Rupees (₹)

### **Item Features**
- 📝 **Item Title & Description**
- 🏷️ **Category Classification**
- 💰 **Price or Free (Donation)**
- 🖼️ **Multiple Images**
- 📍 **Seller Information**
- 📅 **Timestamp (When Posted)**
- ✓ **Availability Status** (Available/Sold/Reserved)

---

## 🔄 How It Works

### **User Flow**

#### **1. Authentication**
```
User visits app → Sees login/signup page → 
Creates account with email/password → 
Receives confirmation → Logged in
```

#### **2. Browsing Items**
```
User navigates to Marketplace → 
Sees all available items → 
Can filter by category → 
Clicks item to view details
```

#### **3. Viewing Item Details**
```
User sees full item info (images, description, price) → 
Sees seller information → 
Can contact seller (opens Gmail) → 
Item details include timestamps
```

#### **4. Adding an Item**
```
Logged-in user goes to "Add Item" → 
Fills form (title, description, category, price/donation) → 
Uploads images → 
Submits → Item appears on marketplace
```

#### **5. Contacting Seller**
```
Interested buyer clicks "Contact Seller" → 
Gmail opens in new tab → 
Pre-filled email with subject and body message → 
Buyer sends inquiry
```

### **Data Flow**

```
React Frontend
    ↓
   (Queries/Mutations)
    ↓
Supabase Client SDK
    ↓
Supabase API
    ↓
PostgreSQL Database
```

---

## 🧩 Key Components

### **Navbar Component**
- Displays navigation links
- Shows user authentication status
- Responsive mobile menu
- Location: `src/components/Navbar.tsx`

### **ItemCard Component**
- Displays item in grid/list format
- Shows item image, title, price (₹), category
- Displays seller name
- Links to item details
- Location: `src/components/ItemCard.tsx`

### **ItemDetail Page**
- Shows full item information
- Displays all images in carousel
- Shows seller contact information
- "Contact Seller" button opens Gmail
- Location: `src/pages/ItemDetail.tsx`

### **AddItem Page**
- Form to create new listing
- Inputs: Title, Description, Category, Price (₹), Images, Donation toggle
- Form validation
- Image upload handling
- Location: `src/pages/AddItem.tsx`

### **Marketplace Page**
- Grid view of all items
- Category filter functionality
- Search/sort capabilities
- Responsive layout
- Location: `src/pages/Marketplace.tsx`

### **Dashboard Page**
- User's personal listings
- Edit/delete item options
- User profile information
- Location: `src/pages/Dashboard.tsx`

### **Auth Page**
- Login form
- Signup form
- Email/password authentication
- Error handling
- Location: `src/pages/Auth.tsx`

---

## 🗄️ Database Schema

### **Tables in PostgreSQL (via Supabase)**

#### **Users Table** (`auth.users`)
```
- id (UUID) - Primary Key
- email (string) - Unique
- password (hashed)
- created_at (timestamp)
- updated_at (timestamp)
- user_metadata
  - full_name
  - avatar_url
```

#### **Items Table** (`public.items`)
```
- id (UUID) - Primary Key
- title (string)
- description (text)
- price (decimal) - In rupees (₹)
- is_donation (boolean)
- category_id (FK)
- user_id (FK) - Seller info
- status (enum: available, sold, reserved)
- images (array of URLs)
- created_at (timestamp)
- updated_at (timestamp)
```

#### **Categories Table** (`public.categories`)
```
- id (UUID) - Primary Key
- name (string) - e.g., Electronics, Books, Furniture
- slug (string)
- icon (string)
```

#### **Relationships**
```
Users (1) ──→ (Many) Items
Categories (1) ──→ (Many) Items
```

---

## 🚀 Setup & Installation

### **Prerequisites**
- Node.js (v16+) or Bun
- Git
- Supabase account

### **Installation Steps**

#### **1. Clone the Repository**
```bash
git clone <repository-url>
cd campus-giveaway-spot-main
```

#### **2. Install Dependencies**
```bash
npm install
# or
bun install
```

#### **3. Setup Supabase**
- Create account at https://supabase.com
- Create new project
- Get your API URL and anon key

#### **4. Create Environment Variables**
Create `.env.local` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### **5. Run Development Server**
```bash
npm run dev
# or
bun run dev
```

Server runs at `http://localhost:8080/`

#### **6. Build for Production**
```bash
npm run build
# or
bun run build
```

---

## 🔐 Authentication Flow

1. **User Registration**
   - User enters email and password
   - Supabase creates account
   - Email verification sent (optional)
   - User redirected to login

2. **User Login**
   - User enters credentials
   - Supabase authenticates
   - Session token created
   - User redirected to dashboard

3. **Session Management**
   - Token stored in browser
   - Automatically sent with API requests
   - Expires after set period
   - User can logout

---

## 💾 Data Storage

### **User Data**
- Stored securely in Supabase
- Passwords hashed and salted
- Email-based identity

### **Item Data**
- Images stored in Supabase Storage
- Metadata stored in PostgreSQL
- Timestamps for tracking

### **Current Currency**
- **Default: Indian Rupees (₹)**
- Conversion rate: 1 USD = ₹83
- Applied to all price displays

---

## 🎨 Styling

### **Tailwind CSS**
- Utility-first CSS framework
- Pre-configured in project
- Custom color scheme
- Responsive design utilities

### **Shadcn/ui Components**
- Pre-built accessible components
- Examples: Button, Card, Dialog, etc.
- Customizable with Tailwind

### **Color Scheme**
- Primary: Green (for CTAs)
- Secondary: Gray/Blue
- Accent: Highlight colors
- Background: Light theme

---

## 📱 Responsive Design

- **Mobile-first approach**
- Breakpoints: xs, sm, md, lg, xl
- Mobile navigation menu
- Responsive grid layouts
- Touch-friendly buttons

---

## 🔗 API Integrations

### **Supabase**
- Real-time database access
- User authentication
- File storage (images)
- API REST endpoints

### **Gmail Integration**
- Opens Gmail compose window
- Pre-fills recipient, subject, body
- Client-side only (no backend needed)

---

## 📊 Performance Optimizations

- **Vite** - Fast development and build
- **Code Splitting** - Lazy loading pages
- **Image Optimization** - Efficient image storage
- **CSS Minimization** - Tailwind purging
- **Production Build** - Minified and optimized

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Supabase connection fails | Check API URL and anon key in `.env.local` |
| Images not loading | Verify Supabase storage bucket is public |
| Auth not working | Ensure Supabase Auth is enabled in project |
| Prices showing in wrong currency | Update exchange rate in `src/lib/utils.ts` |
| Contact seller not opening Gmail | Ensure pop-ups are not blocked in browser |

---

## 📝 Future Enhancements

- ✨ Real-time messaging between users
- ✨ User ratings and reviews
- ✨ Advanced search and filters
- ✨ Saved/favorited items
- ✨ Payment integration
- ✨ Push notifications
- ✨ Multi-language support
- ✨ Dark mode toggle

---

## 📞 Support & Contact

For issues or questions, please contact the development team.

---

**Last Updated:** November 27, 2025
**Project Version:** 1.0.0
