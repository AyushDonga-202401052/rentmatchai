# Changelog

All notable changes to RentMatch AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-11-15

### Fixed
- Restored custom Google authentication button with warm theme styling and Google SVG from commit `fb4c61d`.
- Removed clashing Google GSI iframe button (`GoogleSignInButton.tsx`).
- Updated `loginWithGoogle` and `AuthContext` to support both real Google ID tokens and resilient demo authentication fallback when the local backend is offline or cloud origins mismatch.
- Hardened session persistence so users remain logged in across page refreshes even if the backend API is temporarily offline.
