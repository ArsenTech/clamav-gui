# Change Log
All notable changes of ArsenTech's ClamAV GUI will be documented here.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
<!-- ## [1.0.7] - Unreleased
### Added
- Antivirus page contexts to reduce prop drilling and replace nested `setX={setX}` props
  - History
  - Scan
  - Scheduler
  - Quarantine
- Additional ClamAV detection logging for debugging and troubleshooting
- Identifier on the about page
### Improved
- Memoized shared contexts
  - Quarantine Count
  - Real-Time Scan
  - Themes
- Memoized functions inside contexts and on definitions updater state to reduce re-rendering
- Skeleton Loaders - Change the background image to a muted color
- **About Page** - Added Scroll approach on the info also and improved the UI
### Fixed
- macOS Homebrew ClamAV detection fallback - Fixes [#16](https://github.com/ArsenTech/clamav-gui/issues/16)
  - `/opt/homebrew/bin/clamscan`
  - `/usr/local/bin/clamscan`

[1.0.7]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.7 -->

## [1.0.7 Beta 2] - Unreleased
### Added
- Identifier on the about page
### Improved
- Skeleton Loaders - Change the background image to a muted color
- **About Page** - Added Scroll approach on the info also and improved the UI

[1.0.7 Beta 2]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.7-2

## [1.0.7 Beta 1] - 2026-06-08
> [!NOTE]
> Version 1.0.7-1 is a beta release used to validate the macOS Homebrew detection fix before the final 1.0.7 release.
### Experimental
- App related Contexts for shared instances to replace the `setX={setX}` nested prop
  - App History
  - Scan
  - Scheduler
  - Quarantine
### Improved
- Memoized some contexts
  - Quarantine Count
  - Real Time Scan
  - Themes
### Fixed / Investigating
- macOS Homebrew ClamAV detection fallback
  - `/opt/homebrew/bin/clamscan`
  - `/usr/local/bin/clamscan`
- Additional detection logging for debugging
- Continued investigation of issue #16

[1.0.7 Beta 1]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.7-1

## [1.0.6] - 2026-06-02
> [!NOTE]
> The Issue #15 reffers to the "bug: Lag & no perms" issue
### Added
- The "Reduce Motion" setting that reduces transitions and animations
- macOS Guide inside the **No ClamAV** Page - Fixes [#13](https://github.com/ArsenTech/clamav-gui/issues/13) and [#14](https://github.com/ArsenTech/clamav-gui/issues/14)
- Dynamic App Window Title for pages
- The "Clear by range" Clear History Option
### Improved
- Optimized Props of the Quarantine Table
- A Quarantine Page Loader
- Better exit code 2 handling - Fixes [#15](https://github.com/ArsenTech/clamav-gui/issues/15)
- Added Linux system path exclusions - Fixes [#15](https://github.com/ArsenTech/clamav-gui/issues/15)
- Settings Page UI - Fixes [#15](https://github.com/ArsenTech/clamav-gui/issues/15), Used the minimal stable fix
  - Renders only active tab
  - Optimized SettingsContext value
  - Removed suspicious `cache()` inside hooks while keeping those outside the hooks
- The "Clear by date" Clear History Option
- **Table Columns** - It's refactored and optimized
### Fixed
- Translation placeholder error
- Profile settings rerender bug - Fixes [#15](https://github.com/ArsenTech/clamav-gui/issues/15), Used the minimal stable fix
- Height UI bug (uses Dynamic height) - Fixes [#15](https://github.com/ArsenTech/clamav-gui/issues/15), Used the minimal stable fix

[1.0.6]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.6

## [1.0.5] - 2026-05-03
### Added
- Feature to log the GUI updater actions into the history
- New Clear History Options
  - Clear last 24 hours
  - Clear last 7 days
  - Clear last 30 days
  - Clear up to the date
- Sidebar collapsible behavior setting
  - Up to Icon (Default)
  - Offcanvas Window
### Changed
- Converted each data table cell into a reusable component
- Replaced alert boxes from `Dialog` and `Drawer` components into `AlertDialog` component from ShadCN UI
### Improved
- **Caching** - Cached the app name with app version into the `getAppDetails()` function
- **The Sidebar Design** - Only icons will show if it's collapsed
- Organized Headers and cells of data tables
- Dropdown Menu Destructive design
### Fixed
- The History Details action greying out bug
- The bug of showing nothing on the Device Details stat after caching
- **The build workflow bug** - Fixed the Linux ARM64 part
- **The Date fetch error** - Added a try-catch inside `formatDate()`
- **The Scan Lifecycle Bug** - Rewrote the Scan Logic for stability
- **The scan state desynchronization bug** - Fixes [#11](https://github.com/ArsenTech/clamav-gui/issues/11), Used the minimal stable fix
### i18n
- Completed translations for 🇺🇸 English, 🇦🇲 Armenian, 🇷🇺 Russian
- Prepared missing keys for community contributions

[1.0.5]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.5

## [1.0.4] - 2026-04-10
### Added Languages
- **🇵🇱 Polish** - Thanks [@Olek980](https://github.com/Olek980)!
- **🇫🇷 French** - Thanks [@frju365](https://github.com/frju365)!
### Improved
- Completed System Tray Translations on the 🇵🇱 Polish Translation
- Optimized the function that returns date by a preferred format
- Alignment on the Definitions Updater part of the Update Settings Tab
- Optimized the Translation function + Settings Tab
### Fixed
- The Build workflow bug
- System Tray ID name bug - Fixes [#9](https://github.com/ArsenTech/clamav-gui/issues/9), Thanks [@frju365](https://github.com/frju365)!
### Cached for performance (getter functions)
- Backend Settings
- History
- Logs
- Scheduler
- `fetchPaths()` function
- Quarantine
- Stats
- Versions
- Other possible backend functions

[1.0.4]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.4

## [1.0.3] - 2026-03-22
### Added
- Feature to Export / Import Some Settings
- Translations to every dialog titles
### Fixed
- Error toast description bug
- A bug after finishing the update (Experimental)
- The Red text during updating definitions - changed back to a muted color
### Changed
- Replaced The Update Release Notes Part of the updater with a Changelog shortcut button
- Moved Scan Confirmation messages to `public/locales/[lang]/confirmation.json`
### Improved
- **Emoji on the *"No ClamAV"* Page** - Now uses 3 emojis with a random image loader
- Popup placements if it has over 2 Popup placements (Experimental)
- Error Message display in the toaster

[1.0.3]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.3

## [1.0.2] - 2026-03-07
### Added
- **Badge Visibility Settings** - Icon only, Icon and text, and Text only
- **New Clear History Option** - Clear All Warnings
- Button to Enable Real-time protection on the Indicator when its disabled
- Confirmation before disabling the Real Time Scan
- Real Time Scan Path Monitoring Settings
### Improved
- The App Background Color to a **Lighter shade** (light mode) and **Darker shade** (dark mode)
- Colored dark mode icons of the sidebar instead of the white ones
- **Accent Color** (Skeleton Loading Color), **Muted Color**, and **Secondary Color**

[1.0.2]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.2

## [1.0.1] - 2026-02-25
### Added
- Real-time Quarantine Count On the Sidebar
### Improved
- **History Status Badges** - Added an Icon
- Buttons with Loading Status
### Changed
- The **View Details** Icon - Changed back into the List icon
### Fixed
- Some Armenian Translation keys

[1.0.1]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.1

## [1.0.0] - 2026-02-12 (First Stable Version)
### Added
- Buttons related to Contribution in the About Page
  - Report bug
  - Request Feature
  - Contribute
  - Add Your Language
- View Details Button
### Translated
- The **No ClamAV Found** Page
- History Item Names and Details
- The System Tray
### Improved
- Credits Section
- System Tray Icon based on a real-time scan setting
### Fixed
- The GUI Updater
### Changed
- `console.error()` into `toast.error()` across every app

[1.0.0]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.0

## [1.0.0 Beta 3] - 2026-02-10 (v1 Beta #3)
### Translated
- Settings
  - General Settings UI
  - Scan Settings UI
  - Advanced Settings UI
  - Update Settings Tab UI
- Splash Screen
- About
  - Credits
- Toast messages and validation messages
- Notifications
### Improved
- Some more Enums used in frontend
- `console.error()` in some places into `toast.error(...,{description})`

[1.0.0 Beta 3]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.0-3

## [1.0.0 Beta 2] - 2026-02-09 (v1 Beta #2)
### Added
- Danger Zone Settings
- Error Message when the scan failed to start
- Internationalization support
### Changed
- Organized some files and Updated Imports
- Optimized some parts of the Frontend
### Translated
- Overview UI
- Scan + Scan Menu UIs
- Quarantine UI
- History UI
- Stats UI
- Scheduler UI
- Log Viewer UI
### Core Languages
- 🇦🇲 Armenian (Հայերեն)
- 🇷🇺 Russian (Русский)
- 🇺🇸 English
### Improved
- Some Enums used in frontend
- The `clamscan` resolving function
- The `check_availability()` command
- The Exit code logic inside `run_scan()`
### Removed
- Notification Audio Support (Failed to play a sound)

[1.0.0 Beta 2]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.0-2

## [1.0.0 Beta 1] - 2026-02-07 (v1 Beta #1)
### Added
- App Updater
- **Clear All Errors** Option inside the history page
### Changed
- Reorganized the Settings Page
- Moved Definitions Updater into the Update tab of settings
### Improved
- Popup UI
### Fixed
- Exclusions fetch bug

[1.0.0 Beta 1]: https://github.com/ArsenTech/clamav-gui/releases/tag/v1.0.0-1

## [0.3.3] - 2026-02-06
> [!NOTE]
> Some of these removed features may return in a future release once a more robust implementation is available.
### Added
- **Working Settings**
  - Enable Scheduler UI
  - All Custom Scan Options
  - Directory Exclusions
- System Tray
### Improved
- The `useSettings` hook
- The Scan Start Logic
### Changed
- Moved the paths fetch logic for the main scan into the backend
### Removed
- PUA Exclusions
- Settings:
  - Auto Startup Scan (UI lifecycle conflicts)
  - Silent Scheduled Scans (headless behavior is already default)

[0.3.3]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.3.3

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
- Changed the Definition update age from 3 days to 7 days (1 week)

[0.3.2]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.3.2

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

[0.3.1]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.3.1

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

[0.3.0]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.3.0

## [0.3.0-1] - 2026-01-23 (Preview 1)
### Highlights
This Preview is focused more on optimization + code splitting.
### Fixed
- Parts of the scan logic
- The Command Prompt Spam Bug that causes the app to crash sometimes
### Changed
- Optimized some parts of the Rust Backend + moved helpers to `/helpers/`
- A Slight cleanup of the Rust code after fixing bugs
- Implemented Code Splitting to make UI slightly responsive

[0.3.0-1]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.3.0-1

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

[0.2.1]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.2.1

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

[0.2.0]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.2.0

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

[0.1.0]: https://github.com/ArsenTech/clamav-gui/releases/tag/v0.1.0