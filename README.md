# Gemini Frontend Clone Assignment

A fully functional, responsive, and visually appealing frontend for a Gemini-style conversational AI chat application. Built for the Kuvaka Tech Frontend Developer assignment.

---

## 🚀 Live Demo

**Live URL:** [Add your deployed Vercel/Netlify link here]

---

## 📦 Project Overview

This project simulates a Gemini-style conversational AI chat app with OTP login, chatroom management, AI messaging, image uploads, and modern UX/UI features. It demonstrates practical knowledge of React/Next.js, component-based architecture, client-side state management, UX details, form validation, and performance optimization.

---

## 🧭 Navigation & Login Flow

- **Initial Load:**
  - When the application starts, users are immediately presented with the chat interface, regardless of authentication status. There is no forced redirect to a login page.

- **Starting a New Chat:**
  - If a user clicks the "New Chat" button in the sidebar and is **not logged in**, a login modal appears.
  - The rest of the chat UI remains visible in the background.

- **Login Process:**
  - The login modal asks for a phone number and country code.
  - After submitting, the user is prompted to enter a 6-digit OTP (One-Time Password).
  - **For demo purposes, the OTP is always `123456`** (this is clearly indicated in the modal).
  - Upon entering the correct OTP, the user is authenticated and a new chat is automatically created and selected.

- **Subsequent Navigation:**
  - Once logged in, users can create new chats, send messages, and use all features without interruption.
  - Logging out (if implemented) will require login again for new chats.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **State Management:** Zustand (with persist middleware)
- **Form Validation:** React Hook Form + Zod
- **Styling:** Tailwind CSS
- **Image Upload:** Local preview URL (base64)
- **Notifications:** react-hot-toast

---

## 🗂️ Folder/Component Structure

- `components/` - All UI components
  - `auth/` - Authentication (OTP, country selector)
  - `chat/` - Chatroom UI, messages, typing indicator, etc.
  - `layout/` - Sidebar, layout wrappers
  - `ui/` - Reusable UI (skeletons, toasts)
- `store/` - Zustand stores for auth and chat
- `lib/` - Utilities (throttle, debounce, formatting)
- `types/` - TypeScript types
- `app/` - Next.js App Router structure

---

## 📝 Setup & Run Instructions

1. **Install dependencies:**
   ```bash
   npm install
   # or yarn install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   # or yarn dev
   ```
3. **Open:** [http://localhost:3000](http://localhost:3000)

4. **Build for production:**
   ```bash
   npm run build && npm start
   ```

---

## 💡 Feature Implementation Details

### 1. Throttling (AI Response)
- Implemented using a custom `throttle` utility in `lib/utils.ts`.
- Ensures AI responses are delayed and not spammed, simulating "thinking".
- Used in `components/chat/message-input.tsx` and `main-chat.tsx`.

### 2. Pagination & Infinite Scroll
- Reverse infinite scroll is simulated in `components/chat/chat-area.tsx`.
- Uses `loadMoreMessages` in Zustand store to fetch (simulate) older messages in pages of 20.
- Dummy data is generated for older messages.

### 3. Form Validation
- All forms use `react-hook-form` with `zod` schemas for validation.
- Phone and OTP forms are validated for correct input and completeness.
- See `components/auth/login-form.tsx`.

### 4. Local Storage Persistence
- Zustand with `persist` middleware saves auth and chat data to localStorage.
- See `store/auth.ts` and `store/chat.ts`.

### 5. Debounced Search
- Chatroom search in sidebar uses a debounced input to filter chatrooms by title.

### 6. Loading Skeletons
- Skeleton components for chat messages and chatrooms in `components/ui/loading-skeleton.tsx`.

### 7. Dark Mode
- Toggle in sidebar and via `ThemeToggle.tsx`.
- Theme is persisted in localStorage.

### 8. Accessibility
- Standard HTML elements used for forms and buttons.
- **TODO:** Improve ARIA roles and keyboard navigation for custom components (dropdowns, modals, etc.).

---

## 📚 Additional Notes

- All chat and auth data is simulated and stored client-side.
- No backend is required for this assignment.
- For any missing features or improvements, see TODOs in this README.
