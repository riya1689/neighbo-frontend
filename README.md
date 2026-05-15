# Neighbo Frontend

Welcome to the frontend of **Neighbo**, a community-driven platform designed to connect neighbors, share updates, and provide a space for local interactions.

## Project Overview
The Neighbo Frontend is a high-performance web application built with **Next.js 16**. It provides a sleek, interactive interface for users to connect with their neighbors, discover local events, and access premium community content. The UI is designed with a focus on usability, speed, and premium aesthetics.

---

## Features & Functionality
- **Responsive Dashboard**: A personalized home feed for neighborhood updates.
- **AI Assistant**: A dedicated chat interface powered by Gemini for local help.
- **Premium Content**: Integrated flow for unlocking exclusive community posts.
- **Event Discovery**: Calendar and list views for upcoming neighborhood events.
- **Onboarding Flow**: Structured registration process including neighborhood selection.
- **Admin Panel**: Full-featured management suite for platform administrators.
- **Dynamic Interactions**: Smooth animations and real-time feedback for upvotes, downvotes, comments, shares and follows.

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
- **Public**: Access to landing page and public feeds.
- **User**: Full access to social features, AI assistant, and premium subscriptions.
- **Admin**: Exclusive access to the `/admin` route for platform management and analytics.

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
