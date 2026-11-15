# Changelog

All notable changes to RentMatch AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
