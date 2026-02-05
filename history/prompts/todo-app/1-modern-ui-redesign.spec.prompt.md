---
id: 1
title: "Modern UI Redesign with Glassmorphism"
stage: spec
date_iso: "2026-01-12"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "modern-ui-redesign"
branch: "1-modern-ui-redesign"
user: "AK"
command: "/sp.specify"
labels:
  - "ui-design"
  - "glassmorphism"
  - "theme"
  - "styling"
links:
  spec: "specs/1-modern-ui-redesign/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/1-modern-ui-redesign/spec.md"
  - "specs/1-modern-ui-redesign/checklists/requirements.md"
  - "history/prompts/todo-app/1-modern-ui-redesign.spec.prompt.md"
tests_yaml: []
---

# Modern UI Redesign with Glassmorphism

## User Input

```
You are an expert Next.js developer specializing in modern premium UI with Tailwind CSS, TypeScript, framer-motion, next-themes, lucide-react, and glassmorphism design.

Project:Todo app UI
Tech stack (already set up):
- Next.js
- TypeScript
- Tailwind CSS (darkMode: 'class' enabled)
- Existing simple UI (basic forms, lists, buttons, etc.)
- Existing routes/pages: /dashboard (or /), /login, /forgetpassword, /profile, /task (or /tasks)
- Existing components: All components that are already created in the project (e.g. TaskCard, buttons, forms, modals, headers, etc.)
- State: Assume Context or Zustand for todos & auth — do NOT change any logic, only improve UI/styling

Important requirement:
Apply modern styling CONSISTENTLY to ALL existing pages and components in the project.
Do NOT leave any page or component without updated styling.
If a specific component or page is not explicitly listed below, still provide a general pattern / reusable classes / guidelines so that ALL components (buttons, cards, inputs, lists, forms, etc.) look modern, glassmorphic, and match the theme.

Modernization goals:
- Dark mode default + full light mode support
- Glassmorphism everywhere (frosted glass cards, backdrop-blur-lg, subtle borders, low opacity backgrounds)
- Purple-pink or indigo-purple gradients for buttons, headings, accents
- Subtle hover effects (scale-105, glow/shadow), focus rings
- Smooth animations with framer-motion (fade-in, slide-up, modal entrance)
- Responsive, mobile-first design
- Premium Dribbble-inspired look (dark glassmorphism todo/task apps)

Specific additions:
- Full dark/light/system theme toggle using next-themes (ThemeProvider in layout, animated ThemeToggle component with Sun/Moon icons from lucide-react)
- Subtle smoke/fog background using pure Canvas + JS (no libs): full-screen fixed canvas, low opacity (0.2-0.4), soft gray-purple drifting particles, theme-aware if possible (darker in dark mode)
- Persistent sidebar (collapsible on mobile): Dashboard, Tasks, Profile, Logout with lucide icons
- Header: Gradient app name, ThemeToggle, user avatar (if logged in)
- Floating Action Button (FAB) bottom-right for adding tasks (gradient + glow)

Generate:
1. Install instructions:
   npm i framer-motion next-themes lucide-react date-fns

2. Updated tailwind.config.ts (extend colors, animations, custom glass utilities)

3. app/globals.css (base styles + dark mode + reusable glass/input/button classes)

4. app/layout.tsx:
   - ThemeProvider wrap
   - Smoke canvas background (pure JS implementation)
   - Sidebar + Header structure
   - suppressHydrationWarning on html

5. components/ThemeToggle.tsx (beautiful animated toggle)

6. components/Sidebar.tsx (collapsible navigation)

7. components/Header.tsx

8. components/SmokeBackground.tsx (or inline in layout — pure canvas smoke effect)

9. Reusable styling patterns / components:
   - GlassCard.tsx (or utility classes for glass effect)
   - GradientButton.tsx (or classes)
   - TaskCard.tsx (updated modern version with checkbox, priority badge, due date, edit/delete)
   - AddTaskModal.tsx (glass modal with framer-motion animation)

10. Updated page examples (apply same styling pattern to ALL pages):
    - app/dashboard/page.tsx (hero, stats cards, recent tasks)
    - app/login/page.tsx (centered glass form)
    - app/forgetpassword/page.tsx (centered glass reset form)
    - app/profile/page.tsx (avatar, stats, settings)
    - app/task/page.tsx or app/tasks/page.tsx (filters, task list/grid, add modal trigger)

11. General guideline section:
    - How to apply the same glassmorphism, gradients, dark: variants, hover effects, and animations to ANY existing component or page that is not explicitly generated here.
    - Example classes for common elements: inputs, buttons, lists, cards, tables, etc.

Output:
- Each file in a separate code block with exact file path as comment at top
// app/layout.tsx
// components/SmokeBackground.tsx
etc.

Make the design ultra-premium, clean, futuristic: frosted glass layers, depth, subtle glows, consistent across the entire app.
Start generating specify now.
```

## Response Summary

Created a comprehensive specification for the modern UI redesign with glassmorphism. The specification includes:

- User stories for enhanced visual experience, improved navigation, task management interface, and consistent component styling
- Functional requirements covering glassmorphism styling, theme switching, layout structure, animations, and component updates
- Success criteria with measurable outcomes for UI consistency, performance, and functionality preservation
- Quality validation checklist confirming all requirements are met

The specification maintains all existing business logic while focusing solely on visual improvements with glassmorphism effects, dark/light themes, smooth animations, and premium design elements.

## Outcome

Successfully created feature specification at `specs/1-modern-ui-redesign/spec.md` with validation checklist at `specs/1-modern-ui-redesign/checklists/requirements.md`. Ready for planning phase (`/sp.plan`).