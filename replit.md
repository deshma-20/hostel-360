# HOSTEL 360° - Hostel Management System

## Overview

HOSTEL 360° is a mobile-first Progressive Web App (PWA) designed for comprehensive hostel management. The application serves three distinct user roles (students, staff, and wardens) with role-specific features for managing rooms, complaints, mess feedback, visitor entries, lost & found items, and emergency SOS alerts. Built with a focus on accessibility and icon-first design principles, the system enables efficient hostel operations through an intuitive, universally understandable interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack:**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TanStack Query (React Query)** for server state management with optimistic updates and automatic cache invalidation

**UI Component System:**
- **shadcn/ui** components built on Radix UI primitives for accessibility
- **Tailwind CSS** with custom Material Design 3 (Material You) theme
- **CVA (Class Variance Authority)** for type-safe component variants
- Mobile-first responsive design with strict 4px spacing system
- Icon-first interface using Lucide React icons

**Design Philosophy:**
- PWA-optimized with offline capabilities via service workers
- Material Design 3 principles with emphasis on iconography over text
- Accessible across all literacy levels through visual-first approach
- Dual theme support (light/dark mode) with HSL color variables
- Maximum content width of 28rem for optimal mobile readability

### Backend Architecture

**Server Framework:**
- **Express.js** with TypeScript for REST API endpoints
- Session-based authentication (credentials stored in localStorage on client)
- Structured error handling with custom middleware
- Request/response logging for API calls

**API Design:**
- RESTful endpoints organized by resource type
- Zod schema validation for all incoming data
- Consistent error response format with status codes
- CORS enabled for development/production environments

**Data Access Layer:**
- **Drizzle ORM** for type-safe database queries
- Schema-first approach with automatic TypeScript type generation
- Transaction support for complex operations
- Query builder pattern for flexible data access

### Data Storage

**Database:**
- **PostgreSQL** via Neon serverless (with WebSocket support)
- **Connection pooling** through @neondatabase/serverless
- UUID primary keys generated via `gen_random_uuid()`

**Schema Design:**
- **Users Table:** Role-based access (student/staff/warden), username/password authentication
- **Rooms Table:** Capacity tracking, occupancy status, floor organization
- **Complaints Table:** Category-based tracking, priority levels, status workflow
- **Mess Feedback Table:** Dual rating system (quality/taste), wastage tracking
- **Visitors Table:** Entry/exit logging, student association, purpose tracking
- **Lost & Found Table:** Category classification, status tracking (lost/found/claimed)
- **SOS Alerts Table:** Emergency notification system with location tracking

### Authentication & Authorization

**Authentication Mechanism:**
- Username/password based login via POST `/api/auth/login`
- Role returned on successful authentication
- Client-side session management using localStorage
- No JWT/token system currently implemented

**Authorization Pattern:**
- Role-based UI rendering (student/staff/warden views)
- UserId included in API requests from localStorage
- Server-side validation planned but not fully implemented
- Different feature sets per role displayed in Dashboard

### State Management

**Client State:**
- **TanStack Query** for all server data (rooms, complaints, feedback, visitors, etc.)
- Automatic background refetching disabled (`staleTime: Infinity`)
- Query invalidation on mutations for cache consistency
- Optimistic updates not currently implemented

**Local State:**
- React useState for form inputs and UI toggles
- localStorage for user session (userId, username, userRole)
- No global state management library (Redux/Zustand)

## External Dependencies

### Core Infrastructure
- **Neon Database** - Serverless PostgreSQL with WebSocket support for real-time capabilities
- **Drizzle Kit** - Database migrations and schema management

### UI Component Libraries
- **Radix UI Primitives** - Accessible, unstyled component primitives (dialogs, dropdowns, popovers, tooltips, etc.)
- **Lucide React** - Icon library for consistent visual language
- **Recharts** - Chart visualization for admin analytics dashboard
- **Vaul** - Drawer component for mobile interactions

### Form & Validation
- **React Hook Form** - Form state management with validation
- **Zod** - Schema validation on both client and server
- **@hookform/resolvers** - Integration between React Hook Form and Zod

### Utilities
- **date-fns** - Date formatting and manipulation (formatDistanceToNow)
- **tailwind-merge** & **clsx** - Dynamic className composition
- **nanoid** - Unique ID generation

### Development Tools
- **Replit Vite Plugins** - Development banner, error overlay, and cartographer for Replit environment
- **ESBuild** - Production bundling for server code

### Build & Bundling
- **TypeScript** - Type safety across full stack
- **PostCSS** with Autoprefixer - CSS processing
- **Vite** - Frontend bundling with HMR support

### Third-Party Integrations
- **Google Fonts** - Inter font family for typography
- **PWA Manifest** - Progressive Web App capabilities with offline support