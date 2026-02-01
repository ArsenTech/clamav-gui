# Change Log
All notable changes of ArsenTech's ClamAV GUI will be documented here.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
## [0.3.3] - Unreleased

## [0.3.2] - 2026-02-01 (February Pre-Release)
### Added
- Skeleton Loaders on Scan Finished State Components
- Feature that returns to the recent setting (instead of **General** Settings)
- The I18n (Internationalization) support
- Active Profile Changer inside settings
- Real-Time Scan (Soft Real-Time Protection)
- System Tray with Notifications
- Resources for the app (Icons and Sounds)
- **Working Settings**
  - Notifications Settings
  - Real-time Protection Settings with behavior type
  - Other Functionalities
### Improved
- Scan Page (Performance)
- Quarantine Page (Mergin 2 bulk action functions into 1)
- Settings UI with Pages + Skeleton Loaders
- Main Scan (More Paths)
### Fixed
- Real Time Scan Redirect Issue (Replaced `"/"` with `"/settings?tab=advanced"`)
### Removed
- The `notifOnDetection` option inside settings
- ClamD Settings in favor of Real-Time Scan
### Changed
- Moved Real-time Scan Settings into Advanced Settings
- Renamed Protection Settings into Exclusion Settings
- Exclusion Settings Icons

## [0.3.1] - 2026-01-28
### Added
- License (GNU GPL v3)
- Skeleton Loaders on nearly every page if needed
- Used Code Splitting on Real-time Performance Stats + on Settings Page Tabs
- Settings Page UI with every tab:
  - General
  - Scan
  - Scheduler
  - Protection
  - Advanced
- Working Settings:
  - Theme (Dark, Light, System)
  - Color (Blue, Green, Rose)
  - Date Format
  - Developer Mode
  - Scan Stop Confirmation
  - Max Log Lines
  - Auto-scroll text
- New Scroll Bar Design to replace elements with `overflow-y-auto`
- An Auto-scroll support for logs
### Fixed
- URL redirection bug (converted `target="_blank"` into `openUrl()`)
- Bug from Accessing Custom and File Scans directly from the overview page.
- Startup Scan Provider bug (a.k.a. the `useStartupScan must be used inside StartupScanProvider` bug)
### Changed
- Expanded the Credits Section with more credits
- Replaced the "Last Scan" Placeholder into an actual data
- Manual Code Splitting of the Rust Backend by moving helpers into a separate `.rs` file
### Removed
- Some Buttons that has only a frontend functionality, but not the backend also (Mostly "Mark as safe" buttons)

## [0.3.0] - 2026-01-25
### Added
- Flags for launching GUI for different reasons (`--scan=main` and `--scan=full`)
- A flag to schedule the headless scan (the `--scheduled` flag)
- Logic for Scheduler
### Improved
- Scheduler Page UI
### Fixed
- The bug that ends the scan after 1 second and scans nothing (implemented the `resolve_command` helper function)
- Applied the same fix (the `resolve_command` helper) to every command to prevent any future bugs
### Changed
- Separated Scan Menu page from Scan Page to make it work
- Implemented Code Splitting on every single chart inside the Statistics page

## [0.3.0 (Preview 1)] - 2026-01-23
### Highlights
This Preview is focused more on optimization + code splitting.
### Fixed
- Parts of the scan logic
- The Command Prompt Spam Bug that causes the app to crash sometimes
### Changed
- Optimized some parts of the Rust Backend + moved helpers to `/helpers/`
- A Slight cleanup of the Rust code after fixing bugs
- Implemented Code Splitting to make UI slightly responsive

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

[0.3.3]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.3.3
[0.3.2]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.3.2
[0.3.1]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.3.1
[0.3.0]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.3.0
[0.3.0 Preview 1]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.3.0-1
[0.2.1]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.2.1
[0.2.0]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.2.0
[0.1.0]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.1.0