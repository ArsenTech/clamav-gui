# Change Log
All notable changes of ArsenTech's ClamAV GUI will be documented here.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
## 0.3.0 Preview 1 - Unreleased
### Highlights
This Preview is focused more on optimization + code splitting.
### Fixed
- Parts of the scan logic
### Improved
- **Routes** - Implemented Code Splitting to make UI slightly responsive

## [0.2.1] - 2026-01-23 (Early Build 3)
### Added
- A Quarantine Page logic
- Logic to Do some actions after finishing scan (if there are many threats)
- The Resolve Logic after finishing scan
- The History Page Logic Containing every single action
- Feature to log actions inside a separate file
- The Statistics Counting logic
### Improved
- History Table
- Scan Logic
- Quarantine Logic
- Update logic
- Remove File Logic
- Bulk Actions
- The **No ClamAV Found** Page
- The Stats Page UI
### Changed
- Converted Logs list UI into a Dropdown menu consisting of Log actions inside the History Table

## [0.2.0] - 2026-01-19 (Early Build 2)
### Added
- Scan Types + Spinner in the Scan Process Page
- Logic for Different Types of Scans
- Definitions Updater Logic
- ClamAV Version inside the Definition Updater and about pages
### Integrated
- `clamscan` - integrated the CLI command into the Scan Page
- `freshclam` - Integrated the CLI command into the Definition Updater page
### Improved
- Scan Page UI
- Definition Updater page UI
### Changed
- Moved Tauri version into the **About ClamAV GUI** section

## [0.1.0] - 2026-01-16 (Early Build 1)
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

[0.2.1]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.2.1
[0.2.0]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.2.0
[0.1.0]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.1.0