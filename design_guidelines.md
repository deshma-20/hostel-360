# HOSTEL 360° - Design Guidelines

## Design Approach
**System Selected:** Material Design 3 (Material You) - optimized for mobile-first PWA with emphasis on clear iconography and universal accessibility.

**Core Principle:** Icon-first interface where visual symbols replace text for immediate comprehension across all literacy levels and languages.

## Color Palette

### Light Mode
- **Primary:** 220 85% 55% (Deep Blue - represents trust and stability)
- **Primary Container:** 220 90% 95% (Light blue backgrounds)
- **Secondary:** 280 65% 60% (Purple - for accents and highlights)
- **Surface:** 0 0% 98% (Off-white base)
- **Error/SOS:** 0 85% 55% (Bright red for emergencies)
- **Success:** 140 70% 45% (Green for confirmations)
- **Warning:** 35 90% 55% (Amber for alerts)

### Dark Mode
- **Primary:** 220 75% 65%
- **Primary Container:** 220 85% 25%
- **Secondary:** 280 60% 70%
- **Surface:** 220 15% 12%
- **Error/SOS:** 0 75% 60%
- **Success:** 140 60% 50%
- **Warning:** 35 80% 60%

## Typography
- **Primary Font:** Inter (Google Fonts) - excellent mobile readability
- **Headings:** 600 weight, sizes: 24px (h1), 20px (h2), 16px (h3)
- **Body:** 400 weight, 14px-16px
- **Icon Labels (minimal use):** 500 weight, 12px, uppercase, letter-spacing: 0.5px
- **Numbers/Stats:** 700 weight for emphasis

## Layout System
**Spacing Units:** Strict 4-based system (4, 8, 12, 16, 24, 32px) using Tailwind: p-1, p-2, p-3, p-4, p-6, p-8

**Mobile-First Grid:**
- Content padding: px-4 (16px) minimum on mobile
- Card spacing: gap-4 between elements
- Section spacing: py-6 to py-8
- Maximum content width: max-w-md (28rem) for optimal mobile reading

## Component Library

### 1. Login Screen (Role Selection)
- **Full-screen gradient background** (primary to primary-container)
- **Large app logo/icon** at top (120x120px)
- **Three prominent role cards:**
  - Icon-first design (64x64px icons)
  - Student: Backpack icon
  - Staff: Briefcase icon
  - Warden: Shield icon
  - Each card: rounded-2xl, shadow-lg, p-6
  - Tap entire card to select role
- Minimal text: Only role names below icons

### 2. Bottom Navigation (Primary)
- **Fixed bottom bar** with 5 core icons (48x48px hit area)
- Icons: Home (house), Rooms (bed), Complaints (message-alert), Mess (utensils), Visitor (user-check)
- Active state: filled icon + primary color
- Inactive: outline icon + muted color
- Icon labels only on long-press (tooltip)

### 3. Dashboard/Home Cards
- **Large icon cards** in 2-column grid (grid-cols-2 gap-4)
- Each card: aspect-square, icon (48px) + single word label
- Card types:
  - SOS Emergency (red, alarm icon)
  - Room Info (blue, door icon)
  - Submit Complaint (purple, pen icon)
  - Mess Feedback (green, star icon)
  - Lost & Found (orange, search icon)
  - Visitor Entry (teal, clipboard icon)
- Tap ripple effect on interaction

### 4. Status Indicators
- **Icon-based status chips:**
  - Pending: clock icon (warning color)
  - Approved: checkmark (success color)
  - Rejected: x-mark (error color)
  - In Progress: spinner icon (secondary color)
- Circular badge with icon, no text needed

### 5. Forms & Inputs
- **Large touch targets** (minimum 48px height)
- Icon prefixes in all inputs (visual context)
- Floating labels that animate up
- Clear visual feedback on focus (border glow)
- Submit buttons: full-width, icon + text, 56px height

### 6. Emergency SOS Button
- **Prominent floating action button** (FAB)
- Fixed bottom-right, z-50
- 64x64px, rounded-full
- Pulsing animation in error color
- Alert icon (bell with exclamation)
- One-tap activation

### 7. Notification Cards
- **Icon-led notifications** with color coding
- Icon (24px) + brief message + timestamp
- Swipe actions: Archive (check), Delete (trash)
- Badge count on bottom nav when new

### 8. Analytics/Dashboard (Admin/Warden)
- **Visual charts with icon legends**
- Donut charts for occupancy (bed icons)
- Bar graphs for complaints (ticket icons)
- Food waste tracker (trash icon with %)
- Color-coded segments, minimal text

## Iconography Strategy
**Icon Library:** Heroicons (via CDN) - consistent, recognizable set

**Icon Usage Rules:**
1. **Primary actions:** 48x48px minimum (thumb-friendly)
2. **Secondary actions:** 32x32px
3. **Inline indicators:** 20x24px
4. **List items:** 24x24px leading icons
5. **Always pair critical actions with color + icon** (never icon alone for important functions)

**Key Icon Mappings:**
- Login: user-circle, key, shield-check
- Rooms: home, bed, door-open
- Complaints: exclamation-circle, chat-bubble-left
- Mess: utensils, star, thumbs-up/down
- Visitor: clipboard-document-check, user-plus
- Emergency: bell-alert (red pulsing)
- Settings: cog, adjustments-horizontal
- Profile: user, identification

## Interaction Patterns
- **Tap feedback:** Material ripple on all clickable elements
- **Loading states:** Skeleton screens with icon placeholders
- **Success:** Green checkmark animation
- **Error:** Red shake animation
- **Pull to refresh:** Standard mobile pattern
- **Swipe gestures:** Delete, archive, mark as read

## Accessibility Features
- **High contrast mode** toggle in settings
- **Large text option** (120% scale)
- **Icon labels** available via long-press
- **Voice hints** for screen readers on all icons
- **Color-blind safe palette** (tested for deuteranopia)
- **Minimum 4.5:1 contrast ratio** for all text

## Visual Hierarchy
1. **Emergency actions** (SOS) - always visible, highest contrast
2. **Primary navigation** - bottom bar, persistent
3. **Feature cards** - grid layout, equal visual weight
4. **Status/info** - supporting, muted colors
5. **Settings/profile** - accessible but secondary

## Key Screens Layout

**Login:** Full-screen gradient + 3 role cards (vertical stack on mobile)

**Home:** Header (logo + profile icon) + 2-column feature grid + SOS FAB

**Room Allocation:** List view with room icons + status badges + tap to view details

**Complaints:** FAB (+ icon) to submit + list of cards (icon status + brief text)

**Mess Feedback:** Star rating (large tap targets) + emoji reactions + optional text

**Visitor Entry:** Form with icon inputs (name, phone, purpose icons) + photo capture

## Performance Considerations
- **Icon sprites** for faster loading
- **Lazy load** images and heavy components
- **Service worker** for offline icon caching
- **PWA manifest** with themed splash screen

This icon-first design ensures universal understanding while maintaining professional aesthetics and smooth mobile performance.