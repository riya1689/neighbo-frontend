# Neighbo Frontend

Welcome to the frontend of **Neighbo**, a community-driven platform designed to connect neighbors, share updates, and provide a space for local interactions.

## Project Overview
The Neighbo Frontend is a high-performance web application built with **Next.js 16**, **React.js**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Lucide React**, **React Icons**, **React Hot Toast**. It provides a sleek, interactive interface for users to connect with their neighbors, discover local events, and access premium community content. The UI is designed with a focus on usability, speed, and premium aesthetics.

---

## Live Demo
Live site: [https://neighbo-frontend.vercel.app](https://neighbo-frontend.vercel.app)
---

## Role & Permissions
The system implements a Role-Based Access Control (RBAC) mechanism:

- **PUBLIC USER**:
    - Users who are not logged in.
    - They can only view content.
    - They cannot create posts, comments, votes, shares, use AI features, or subscribe to premium plans.
- **REGISTERED USER**:
    - Create and interact with posts (comments, votes, shares).
    - Follow/Unfollow other neighbors.
    - Subscribe to Premium Plans.
    - Unlock premium content.
    - Access AI Assistant.
- **ADMIN**:
    - All USER permissions.
    - Access to Admin Dashboard.
    - Manage categories and neighborhoods.
    - Moderate events and system updates.
    - View platform-wide revenue and analytics.

---

## Features & Functionality
- **Authentication**: Secure login via Google OAuth 2.0 (passportjs)and Email, Password with JWT, password hashing with bcryptjs..
- **Social Core**: Posting (images/text), commenting, upvoting/downvoting, follow/unfollow and sharing.
- **Premium Content**: Monetization system allowing creators to set prices for specific posts. If any user unlocks or purchases premium content, that payment is added to the premium content creator’s revenue balance.
- **Premium Plans**: When a user purchases a premium subscription plan, the payment is added to the platform admin’s revenue.
- **AI Integration**: Integrated **Google Gemini AI** for smart community assistance.
- **Invoice Generation**: Automatic invoice generation with **SSLCommerz** for subscriptions and content unlocking.
- **Downloadable Cash Memo**: Users can download their cash memo after payment.
- **Payment Gateway**: Seamless integration with **SSLCommerz** for subscriptions and content unlocking.
- **Notifications**: System-wide notification service for follows, votes, and activities.
- **Event Management**: Community event scheduling and approval workflow.
-**User Dashboard**: User's personalized activity center.
-**Admin Dashboard**: Full-featured management suite for platform administrators.
-**Responsive Dashboard**: A personalized home feed for neighborhood updates.
-**Event Discovery**: Calendar and list views for upcoming neighborhood events.
-**Explore Feature**: Discover new neighborhoods and trending posts and categories.
-**Onboarding Flow**: Structured registration process including neighborhood selection.
-**Dynamic Interactions**: Smooth animations and real-time feedback for upvotes, downvotes, comments, shares and follows.

---


## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons
- **State Management**: React Hooks & Context API
- **Form Handling**: Native React forms with validation
- **Notifications**: React Hot Toast

---

## Main Routes
| Route | Description |
|-------|-------------|
| `/` | Landing page and main feed |
| `/dashboard` | User's personalized activity center |
| `/ai` | Neighbo AI Assistant chat |
| `/explore` | Discover new neighborhoods and trending posts |
| `/premium` | Premium subscription plans and features |
| `/upcoming-events` | Local event listings |
| `/admin` | Administrative dashboard (Admin only) |
| `/login` / `/register` | Authentication pages |
| `/payment` | Checkout and payment status pages |

---

## Roles & Access
- **PUBLIC USER**:
    - Users who are not logged in.
    - They can only view content.
    - They cannot create posts, comments, votes, shares, use AI features, or subscribe to premium plans.

- **REGISTERED USER**:
    - Create and interact with posts (comments, votes, shares).
    - Follow/Unfollow other neighbors.
    - Subscribe to Premium Plans.
    - Unlock premium content.
    - Access AI Assistant.
- **ADMIN**:
    - All USER permissions.
    - Access to Admin Dashboard.
    - Manage categories and neighborhoods.
    - Moderate events and system updates.
    - View platform-wide revenue and analytics.

---

---

## Error Handling & UI Feedback
- **Toast Notifications**: Real-time feedback for successful actions or errors using `react-hot-toast`.
- **Form Validation**: Client-side checks to ensure clean data submission.
- **Responsive Error States**: Graceful handling of empty states and API errors with user-friendly messages.

---

## Design System
The project follows a **Premium Aesthetic** guide:
- **Typography**: Modern, readable fonts.
- **Color Palette**: Harmonious and professional community-focused colors.
- **Interactions**: Subtle micro-animations using Framer Motion to enhance UX.
- **Responsiveness**: Mobile-first design ensuring a perfect experience on all devices.

---

## Getting Started

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Environment Setup**:
   Create a `.env.local` file with:
   - `NEXT_PUBLIC_API_URL` (Pointing to the backend)

3. **Run Development Server**:
   ```bash
   pnpm dev
   ```

4. **Build for Production**:
   ```bash
   pnpm build
   pnpm start
   ```
