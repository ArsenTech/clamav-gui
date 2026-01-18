# Change Log
All notable changes of ArsenTech's ClamAV GUI will be documented here.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
## 0.2.0 - Unreleased
### Added
- Scan Types + Spinner in the Scan Process Page
- The Main scan and Full Scan logic
### Improved
- Scan Process UI

## 0.1.0 - 2026-01-16 (Early Build)
### Highlights
This is the first pre-release of the ClamAV GUI. The backend functionality will be implemented soon.
> [!IMPORTANT]
> The first pre-release is mostly focused on UI design meaning that it won't work. The ClamAV implementation will be implemented in future versions making the GUI work as a wrapper of ClamAV.
### Designed UIs
- Overview page
- Scan page
- Quarantine page
- History page
- Statistics page
- Scheduler page
- Definition Updater page
- Splash Screen
- "Oops, No ClamAV found" screen
### Added
- Sidebar with Logo, Links, and Footer
- System Statistics (Device Info, CPU, RAM usage, Disk Usage)
- The About Page
- State-gated Layout (It'll show "Oops, No ClamAV found" if ClamAV isn't installed)