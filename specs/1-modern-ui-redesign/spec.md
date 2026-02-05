# Feature Specification: Modern UI Redesign with Glassmorphism

**Feature Branch**: `1-modern-ui-redesign`
**Created**: 2026-01-12
**Status**: Draft
**Input**: User description: "You are an expert Next.js developer specializing in modern premium UI with Tailwind CSS, TypeScript, framer-motion, next-themes, lucide-react, and glassmorphism design.

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
Start generating specify now."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enhanced Visual Experience (Priority: P1)

Users want a modern, premium UI with glassmorphism effects, dark/light themes, and smooth animations that make the app feel sophisticated and contemporary. The visual refresh should be applied consistently across all pages and components without changing functionality.

**Why this priority**: This is the core requirement of the feature - delivering a premium visual experience that enhances user engagement and satisfaction while maintaining all existing functionality.

**Independent Test**: The UI can be evaluated visually by navigating through all pages (/dashboard, /login, /forgetpassword, /profile, /tasks) and verifying consistent glassmorphism styling, theme switching, and smooth animations work correctly.

**Acceptance Scenarios**:

1. **Given** user opens the app, **When** they navigate between different pages, **Then** all pages display consistent glassmorphism styling with backdrop blur effects and gradient accents
2. **Given** user accesses the app, **When** they toggle between dark/light themes, **Then** all UI elements update appropriately with theme-aware colors and contrast
3. **Given** user interacts with UI elements, **When** they hover or click on buttons/cards, **Then** smooth animations and visual feedback are provided

---

### User Story 2 - Improved Navigation and Layout (Priority: P1)

Users need a persistent sidebar with collapsible navigation and a header with theme toggle and user avatar, providing intuitive access to different sections of the app with a premium glassmorphism design.

**Why this priority**: Essential navigation structure is required for a professional application and supports the overall premium UI experience.

**Independent Test**: The sidebar and header can be tested by opening the app and verifying navigation items are accessible, collapsible on mobile, and theme toggle functions properly.

**Acceptance Scenarios**:

1. **Given** user opens the app, **When** they view the layout, **Then** they see a persistent sidebar with Dashboard, Tasks, Profile, and Logout links using lucide icons
2. **Given** user is on mobile device, **When** they interact with the sidebar, **Then** it collapses/expands appropriately
3. **Given** user is logged in, **When** they view the header, **Then** they see the app name with gradient styling, theme toggle, and user avatar

---

### User Story 3 - Enhanced Task Management Interface (Priority: P2)

Users want modern TaskCards with checkboxes, priority badges, due dates, and edit/delete functionality, plus a floating action button for adding tasks with gradient styling and glow effects.

**Why this priority**: Improves the core task management experience with modern UI elements that enhance usability and visual appeal.

**Independent Test**: The TaskCard component can be tested by viewing existing tasks and verifying modern styling, priority indicators, and interactive elements work properly.

**Acceptance Scenarios**:

1. **Given** user views their tasks, **When** they see TaskCards, **Then** each card displays with glassmorphism styling, priority badge, due date, and interactive controls
2. **Given** user wants to add a new task, **When** they click the floating action button, **Then** a glass modal appears with smooth animations for task creation
3. **Given** user has multiple tasks, **When** they interact with priority indicators, **Then** visual hierarchy is clear and intuitive

---

### User Story 4 - Consistent Component Styling (Priority: P2)

Users expect all UI components (buttons, cards, inputs, forms, etc.) to follow the same glassmorphism design language with consistent gradients, hover effects, and animations throughout the application.

**Why this priority**: Ensures cohesive design language across the entire application, preventing jarring visual inconsistencies.

**Independent Test**: Individual components can be tested by examining buttons, forms, and inputs on various pages to verify consistent glassmorphism styling.

**Acceptance Scenarios**:

1. **Given** user navigates the app, **When** they encounter any button or form element, **Then** it follows the same glassmorphism design with gradient backgrounds and hover effects
2. **Given** user fills out forms, **When** they interact with input fields, **Then** they see consistent styling with proper focus states and validation feedback

---

### Edge Cases

- What happens when theme switching occurs during modal interactions?
- How does the glassmorphism background look on devices with lower performance?
- How does the persistent sidebar behave when screen size changes dynamically?
- What happens to the smoke background canvas on older browsers that don't support advanced canvas features?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST apply glassmorphism styling consistently across all existing pages (/dashboard, /login, /forgetpassword, /profile, /tasks) with backdrop blur effects and low opacity backgrounds
- **FR-002**: System MUST support dark/light/system theme switching with next-themes integration and animated theme toggle component
- **FR-003**: System MUST implement a persistent sidebar with collapsible navigation for Dashboard, Tasks, Profile, and Logout using lucide-react icons
- **FR-004**: System MUST include a header with gradient app name, theme toggle, and user avatar display when logged in
- **FR-005**: System MUST provide smooth animations using framer-motion for page transitions, modal entrances, and interactive elements
- **FR-006**: System MUST implement a floating action button (FAB) with gradient styling and glow effects for adding tasks
- **FR-007**: System MUST include a subtle smoke/fog background using pure Canvas JS with theme-aware particle colors
- **FR-008**: System MUST update all existing components (TaskCard, buttons, forms, etc.) with modern glassmorphism styling
- **FR-009**: System MUST maintain all existing business logic unchanged, only updating UI/styling
- **FR-100**: System MUST provide reusable styling patterns and components (GlassCard, GradientButton, etc.) for consistent application across the UI

### Key Entities

- **Glassmorphism Components**: Reusable UI elements with frosted glass effects, backdrop blur, and gradient styling
- **Theme Configuration**: Dark/light theme settings with smooth transition animations and persistent user preferences
- **Layout Structure**: Persistent sidebar, header with gradient branding, and responsive grid system for content

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All existing pages and components display consistent glassmorphism styling with backdrop blur effects and gradient accents (100% coverage of existing UI)
- **SC-002**: Theme switching works seamlessly across all pages with smooth transitions taking less than 300ms
- **SC-003**: Navigation sidebar is persistent on desktop and collapsible on mobile, with all icons displaying correctly
- **SC-004**: Floating action button appears consistently in bottom-right corner with proper gradient styling and glow effects
- **SC-005**: All animations (page transitions, modal entrances, hover effects) are smooth and performant (60fps) on modern devices
- **SC-006**: Smoke background canvas renders without performance issues and adapts to theme changes appropriately
- **SC-007**: All existing functionality remains unchanged - only visual styling is updated, with zero impact on business logic
- **SC-008**: Reusable components (GlassCard, GradientButton, etc.) are created and documented for future use