# Changelog

All notable changes to RentMatch AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.15] - 2026-11-15

### Fixed
- Fixed unscrollable conversation list and active chat stream by adding `overflow-hidden` to `ScrollAreaPrimitive.Root` in `scroll-area.tsx`, enforcing `min-h-0 overflow-hidden` on parent flex containers, and moving scroll area padding to inner wrappers so `clientHeight < scrollHeight` and scrollbars trigger properly.
- Removed global `select-none` from inbox layout to allow normal text selection and copying in message threads.

## [0.1.14] - 2026-11-15

### Added
- Expanded Inbox conversation roster with 10 additional realistic users (total 16 conversations) with Unsplash photo avatars, `@handles`, Gandhinagar property listings, and category tags.
- Enriched message histories across multiple chats (Olivia, Phoenix, Demi, Natali, Drew, Orlando, Candice, etc.) with multi-turn discussions on amenities, lease clauses, walk-throughs, and utility provisions.

## [0.1.13] - 2026-11-15

### Added
- Animated vertical active indicator bar in the Inbox conversation list using `motion/react` shared `layoutId="active-chat-indicator"` with spring physics (`stiffness: 380, damping: 32`), creating a fluid glide between conversations when selected.

## [0.1.12] - 2026-11-15

### Changed
- Redesigned the Inbox conversation list to match the modern Untitled UI contact list aesthetic with edge-to-edge subtle dividers, circular photographic portraits, bold participant names, and `@handles`.
- Replaced sample conversations with the full roster from the design spec (Olivia Rhye, Phoenix Baker, Demi Wilkinson, Natali Craig, Drew Cano, Orlando Diggs).
- Updated active chat header, message avatars, and contact information panels to use high-resolution portrait avatars and handles.
- Centered the profile avatar in `DropdownAccountCard.tsx` along the sidebar's $X = 34\text{px}$ icon axis and removed the status indicator bubble.

## [0.1.11] - 2026-11-15

### Fixed
- Completely removed focus outlines, press rings, and double border rings from the account card button, dropdown popover, and menu items (`outline-none focus:outline-none ring-0`).
- Streamlined popover rendering by eliminating competing CSS animation keyframes and restricting button transitions to `transition-[width,background-color]`.

## [0.1.10] - 2026-11-15

### Fixed
- Fixed account dropdown popover width (`w-[236px]`) to match the card and sidebar width pixel-for-pixel, preventing it from overflowing past the sidebar border.
- Replaced aggressive popover zoom animation with clean `fade-in slide-in-from-bottom-1` ease-out transition.

### Removed
- Removed redundant Dark Mode toggle from the account dropdown menu (theme toggle is cleanly housed in the dashboard header).

## [0.1.9] - 2026-11-15

### Fixed
- Fixed sidebar vertical jitter/shake by giving `BrandLogo` and its header container a fixed 40px/44px height, eliminating vertical height shifts when expanding or collapsing.
- Suppressed subscript badge numbers when the respective route is active (e.g., viewing Inbox or Shortlist hides its collapsed unread badge).

### Changed
- Redesigned the bottom profile card with a floating, prominent circular avatar (`size-10`) layered over the card box, where the box sits underneath on the left and smoothly extends outward to the right on hover and retracts under it when collapsed.

## [0.1.8] - 2026-11-15

### Fixed
- Fixed inbox page UI scrolling up out of view when selecting long chat threads (e.g. Dr. Ramesh Patel) by replacing unconstrained `scrollIntoView()` with container-scoped `viewport.scrollTo()`, and locking `DashboardLayout` with `h-[100dvh] overflow-hidden`.
- Removed outline and focus rings from text boxes, textareas, and search inputs in both Inbox and AI Search pages.
- Fixed sidebar transition glitches by unifying button padding, removing flex alignment jumping, and applying fixed `duration-250 ease-out` transition.

### Changed
- Displayed unread inbox number (and shortlist count) as a neat badge/subscript attached to the icon when sidebar is collapsed.
- Configured Support button to directly trigger email to `me@niranjan.lol` with a single click.

## [0.1.7] - 2026-11-15

### Added
- Permanent-collapsed dashboard sidebar that displays icons only by default (68px width) and smoothly expands to full width (256px) on hover with Apple-grade fluid easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Floating overlay expansion in `DashboardLayout.tsx` so the main content never undergoes layout shifts when hovering the sidebar.
- Seamless menu awareness: sidebar remains expanded while Support or Account popover menus are open.
- Refactored `SidebarButton` and `DropdownAccountCardMD` for unified icon alignment and graceful text reveal.

## [0.1.6] - 2026-11-15

### Changed
- Moved Settings and Support navigation directly into the sidebar above the bottom profile account card in `DashboardSidebar.tsx`.
- Streamlined `DropdownAccountCard.tsx` menu to focus cleanly on Profile, Dark Mode, and Sign Out.

## [0.1.5] - 2026-11-15

### Fixed
- Fixed single-name Google profiles by dropping PostgreSQL `users_last_name_not_empty` constraint, updating Alembic schema migration, and removing the placeholder "User" string from display names and database records.

## [0.1.4] - 2026-11-15

### Fixed
- Resolved backend IPv6 connect timeout when verifying Google OAuth tokens against `googleapis.com` by enforcing IPv4 resolution with connection timeout adapter.
- Added direct fallback navigation to ensure authenticated Google sessions immediately transition to Dashboard without hanging on the form.

## [0.1.3] - 2026-11-15

### Removed & Fixed
- Completely removed fallback dummy user sessions and mock tokens; inoperative Google sign-in strictly halts and displays the error without logging in.
- Introduced `GoogleAuthButton` preserving the custom theme button UI from `fb4c61d` with native Google Identity Services popup triggering and backend token verification.

## [0.1.2] - 2026-11-15

### Added
- Explicit alert notification informing users whenever the fallback demo Google account is used due to Google OAuth or backend inoperability.

## [0.1.1] - 2026-11-15

### Fixed
- Restored custom Google authentication button with warm theme styling and Google SVG from commit `fb4c61d`.
- Removed clashing Google GSI iframe button (`GoogleSignInButton.tsx`).
- Updated `loginWithGoogle` and `AuthContext` to support both real Google ID tokens and resilient demo authentication fallback when the local backend is offline or cloud origins mismatch.
- Hardened session persistence so users remain logged in across page refreshes even if the backend API is temporarily offline.
