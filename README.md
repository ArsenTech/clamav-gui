<p align="center">
     <img src=".github/readme-logo.png" style="object-fit: contain;" alt="ClamAV GUI" width="150" height="150">
</p>
<h1 align="center">ArsenTech's <a href="https://www.clamav.net/">ClamAV</a> GUI</h3>
<p align="center">A minimal, open-source GUI for <a href="https://www.clamav.net/">ClamAV Antivirus</a> that makes the Antivirus itself look professional and work exactly like ClamAV (A FOSS CLI Antivirus)</p>
<p align="center">
     <a href="https://github.com/ArsenTech/clamav-gui/issues/new?assignees=&labels=&template=bug_report.md&title=">Report bug</a>
     &nbsp;&middot;&nbsp;
     <a href="https://github.com/ArsenTech/clamav-gui/issues/new?assignees=&labels=&template=feature_request.md&title=">Request Feature</a>
</p>

![version][version-shield]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![downloads][downloads-shield]][downloads-url]
[![project_license][license-shield]][license-url]
[![sponsors-badge]][sponsors-link]

[![Issues][issues-shield]][issues-url]
[![build-status][status-shield]][status-url]
![commits since latest release][commits-since-shield]
![GitHub Created At][created-at-shield]
![GitHub repo size][repo-size-shield]

<details>
     <summary>Table of Contents</summary>
     <ol>
          <li>
               <a href="#about">About</a>
               <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#other-features">Other Features</a></li>
                    <li><a href="#built-with">Built With</a></li>
                    <li><a href="#download">Download</a></li>
               </ul>
          </li>
          <li><a href="#usage-manual">Usage Manual</a></li>
          <li><a href="#versioning">Versioning</a></li>
          <li><a href="#sponsors">Sponsors</a></li>
          <li>
               <a href="#contributing">Contributing</a>
               <ul>
                    <li><a href="#top-contributors">Top Contributors</a></li>
               </ul>
          </li>
          <li><a href="#star-history">Star History</a></li>
          <li><a href="#license">License</a></li>
     </ol>
</details>

## About
**ArsenTech's ClamAV GUI** is a minimal, open-source interface for file scanning and threat detection that makes the Antivirus itself look professional and work exactly like ClamAV (A FOSS CLI Antivirus).

Built with Tauri, React, and modern desktop and web tools. This software is provided as-is. No data is collected or transmitted. This GUI uses ClamAV's `clamscan` and `freshclam` engines. Scan types are presets that define which locations and which limits are used.
### Features
- **State-gated UI** - Detects the ClamAV installation path before launching the software
- **Main and Full Scan** - Scan the entire device for malicious files and malware
- **Custom and File Scan** - Scan the mentioned folder/file for malware
- **Resolving infected files after scan** - It includes actions like **Quarantine** and **Delete**
- **Definitions Updater** - Update the definitions database directly from the GUI
- **Quarantine** - Manage infected threats after scanning
- **History** - View the entire GUI actions history and manage it + view or reveal logs
- **Antivirus Statistics** - View the entire Antivirus Dashboard and Statistics + some real-time device stats
- **Real-Time Performance Stats** - CPU, RAM Usage, and Disk Usage Stats all without leaving the GUI
- **Flags** - Launch **Full Scan** and **Main Scan** Directly if needed
- **Scheduler** - Schedule some scans if needed + manage other scheduled scan jobs
- **Real-Time Scan** - Monitors file activity and scans files when they change. It doesn't install kernel drivers.
- **Settings** - Tweak some options on ClamAV GUI if needed (Such as Scan Options, Appearance, and others)

### Other Features
- **Skeleton Loader** - A separate Skeleton loading on some pages for a clean UX
- **Notifications** - Be informed when the scan is started or finished, or a new threat has been detected
- **System Tray** - Quick Access through some actions, all by using a system tray
- **Multilingual Support** - Use the ClamAV GUI in your native language besides English

### Planned Improvements
#### v1.0.6 (Next)
- [ ] The "Clear by range" Clear History Option
- [ ] Dynamic App Window Title for pages
- [ ] Expanded approach of the Bug fix for the issue [#11](https://github.com/ArsenTech/clamav-gui/issues/11)
   - [ ] True scan restoration (no reset of progress)
   - [ ] Better scan continuity (UI feedback)
   - [ ] Smarter scan awareness (optional scanType in status)
- [ ] Error Handling & Translation Improvements
   - Normalize backend errors
   - Map to frontend translations
- [ ] Add a macOS Guide inside the **No ClamAV** Page
- [ ] Minimum OS requirement tab (first step)
   - Detect OS + version
   - Show supported / not supported
   - Disable incompatible actions
- [X] Fix translation placeholders (like `{{code}}`)
- [X] Linux Compatibility / Performance
   - [X] Better exit code 2 handling
   - [X] Linux system path exclusions
   - [X] Investigate settings lag on Wayland/niri
   - [X] Profile settings rerenders
   - [X] Linux UI performance pass
- [X] The "Reduce Motion" setting

> [!NOTE]
> v1.0.6 is complete when:
> - scan restoration works reliably
> - no major UI regressions
> - error handling is consistent

#### v1.0.7 (Planned, Stability)
- [ ] Minimized Auto Start Setting ([#12](https://github.com/ArsenTech/clamav-gui/issues/12))
- [ ] Silent Scheduled Scans Settings (Another Attempt)
#### v1.0.8 (Platform Expansion)
- [ ] Scheduler support for Linux and MacOS
- [ ] Limit `helpers::scheduler::windows::get_last_run_time` only for Windows Users
#### v1.1.x (Planned, Major)
- [ ] ClamAV Engine Updater
- [ ] YARA Related Features
  - [ ] YARA Scan Type
  - [ ] YARA Real-time Option
  - [ ] YARA Configuration in settings
- [ ] Feature to submit suspicious signatures to ClamAV
#### Nice to have
- [ ] Write the documentation in the `docs/` folder.
  - [ ] Usage Guide
  - [X] Installation Guide
  - [X] Troubleshooting
  - [ ] FAQs
  - [ ] Translation Guide
- [ ] Translate new parts after running `npm run i18n:missing-keys [lang-codes]` and typing
  - 🇫🇷 French - `fr`
  - 🇵🇱 Polish - `pl`

### Built With
- [![Tauri][tauri-shield]][tauri-url]
- [![React][react-shield]][react-url]
- [![ShadCN UI][shadcn-shield]][shadcn-url]
- [![Tailwind CSS][tailwind-shield]][tailwind-url]
- [![Typescript][typescript-shield]][typescript-url]
- [![Vite][vite-shield]][vite-url]
- [![Rust][rust-shield]][rust-url]
- [![React Router][react-router-shield]][react-router-url]
### Download
You can find the latest stable version of the ClamAV GUI right here

[![GitHub Downloads (all assets, latest release)][download-shield]][download-url]

## Usage Manual
Full documentation is available here:
➡️ [Documentation][docs-url]
  - [Usage Guide](./docs/usage.md)
  - [Installation Guide](./docs/installation.md)
  - [Troubleshooting](./docs/troubleshooting.md)
  - [FAQs](./docs/faq.md)

## Versioning
This website follows [Semantic Versioning](https://semver.org/). You can view the full [Changelog][changelog-url] for details on each website version.

## Sponsors
Check out our awesome sponsors! ❤️
[![Sponsors List][sponsors-list]][sponsors-link]

## Contributing
Contributions are Always Welcome! Please read both [Code of Conduct][code-of-conduct-url] and [CONTRIBUTING.md][contributing-url] before contributing.
### Top Contributors
[![Top Contributors][top-contributors]][contributors-url]

## Star History
[![Star History Chart][star-history-chart]][star-history-url]

## License
This project is licensed under the [GNU General Public License v3.0 or later][license-url].

ClamAV is a trademark of Cisco Systems, Inc. This project is an independent, open-source GUI and is not affiliated with or endorsed by Cisco.

## Support And Follow
[![YouTube][yt-shield]][yt-url]
[![Patreon][patreon-shield]][patreon-url]
[![Codepen][codepen-shield]][codepen-url]
[![DeviantArt][deviantart-shield]][deviantart-url]
[![Odysee][odysee-shield]][odysee-url]
[![Scratch][scratch-shield]][scratch-url]

> GitHub [@ArsenTech][github-url] &nbsp;&middot;&nbsp;
> YouTube [@ArsenTech][yt-url] &nbsp;&middot;&nbsp;
> Patreon [ArsenTech][patreon-url] &nbsp;&middot;&nbsp;
> [ArsenTech's Website][website-url]

<!-- Markdown Links -->
[star-history-chart]: https://api.star-history.com/svg?repos=ArsenTech/clamav-gui&type=Date
[star-history-url]: https://api.star-history.com/svg?repos=ArsenTech/clamav-gui&type=Date
[contributors-shield]: https://img.shields.io/github/contributors/ArsenTech/clamav-gui.svg?style=for-the-badge&color=%2322b455
[contributors-url]: https://github.com/ArsenTech/clamav-gui/graphs/contributors
[top-contributors]: https://contrib.rocks/image?repo=ArsenTech/clamav-gui
[forks-shield]: https://img.shields.io/github/forks/ArsenTech/clamav-gui.svg?style=for-the-badge&color=%2322b455
[forks-url]: https://github.com/ArsenTech/clamav-gui/network/members
[stars-shield]: https://img.shields.io/github/stars/ArsenTech/clamav-gui.svg?style=for-the-badge&color=%2322b455
[stars-url]: https://github.com/ArsenTech/clamav-gui/stargazers
[issues-shield]: https://img.shields.io/github/issues/ArsenTech/clamav-gui.svg?style=for-the-badge
[issues-url]: https://github.com/ArsenTech/clamav-gui/issues
[license-shield]: https://img.shields.io/github/license/ArsenTech/clamav-gui?color=%2322b455&style=for-the-badge
[license-url]: https://github.com/ArsenTech/clamav-gui/blob/main/LICENSE.md
[version-shield]: https://img.shields.io/github/package-json/v/ArsenTech/clamav-gui?style=for-the-badge
[downloads-shield]: https://img.shields.io/github/downloads/ArsenTech/clamav-gui/total?style=for-the-badge&label=Total%20Downloads&color=%2322b455
[downloads-url]:https://github.com/ArsenTech/clamav-gui/releases
[status-shield]: https://img.shields.io/github/actions/workflow/status/ArsenTech/clamav-gui/build.yml?style=for-the-badge
[status-url]: https://github.com/ArsenTech/clamav-gui/actions/workflows/build.yml
[commits-since-shield]: https://img.shields.io/github/commits-since/ArsenTech/clamav-gui/latest?style=for-the-badge&color=%2322b455&label=Commits%20since%20latest%20version
[created-at-shield]: https://img.shields.io/github/created-at/ArsenTech/clamav-gui?style=for-the-badge
[repo-size-shield]: https://img.shields.io/github/repo-size/ArsenTech/clamav-gui?style=for-the-badge
[download-shield]: https://img.shields.io/github/downloads/ArsenTech/clamav-gui/latest/total?style=for-the-badge&label=Download&color=%2322b455
[download-url]: https://github.com/ArsenTech/clamav-gui/releases/latest
[code-of-conduct-url]: https://github.com/ArsenTech/clamav-gui/blob/main/docs/CODE_OF_CONDUCT.md
[contributing-url]: https://github.com/ArsenTech/clamav-gui/blob/main/docs/CONTRIBUTING.md
[changelog-url]: https://github.com/ArsenTech/clamav-gui/blob/main/CHANGELOG.md
[website-url]: https://arsentech.github.io
[docs-url]: https://github.com/ArsenTech/clamav-gui/blob/main/docs/usage.md
[sponsors-list]: https://raw.githubusercontent.com/ArsenTech/clamav-gui/main/public/sponsors/sponsors.svg
[sponsors-link]: https://github.com/sponsors/ArsenTech
[sponsors-badge]: https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86&style=for-the-badge

<!-- Languages -->
[tauri-shield]: https://img.shields.io/badge/Tauri-FFC131?style=for-the-badge&logo=Tauri&logoColor=white
[tauri-url]: https://tauri.app/
[react-shield]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://react.dev/
[shadcn-shield]: https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white
[shadcn-url]: https://ui.shadcn.com/
[tailwind-shield]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[tailwind-url]: https://tailwindcss.com/
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[vite-shield]: https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E
[vite-url]: https://vite.dev/
[rust-shield]: https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white
[rust-url]: https://rust-lang.org/
[react-router-shield]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[react-router-url]: https://reactrouter.com

<!-- External Links -->
[yt-shield]: https://img.shields.io/badge/ArsenTech%20-222222.svg?&style=for-the-badge&logo=YouTube&logoColor=%23FF0000
[yt-url]:https://www.youtube.com/channel/UCrtH0g6NE8tW5VIEgDySYtg
[patreon-shield]:https://img.shields.io/badge/-ArsenTech-222222?style=for-the-badge&logo=patreon&logoColor=white
[patreon-url]:https://www.patreon.com/ArsenTech
[codepen-shield]: https://img.shields.io/badge/-ArsenTech-222222?style=for-the-badge&logo=codepen&logoColor=white
[codepen-url]: https://codepen.io/ArsenTech
[deviantart-shield]: https://img.shields.io/badge/-Arsen2005-222222?style=for-the-badge&logo=deviantart&logoColor=05cc46
[deviantart-url]: https://www.deviantart.com/arsen2005
[odysee-shield]: https://img.shields.io/badge/-ArsenTech-222222?style=for-the-badge&logo=odysee&logoColor=FA9626
[odysee-url]: https://odysee.com/@ArsenTech
[scratch-shield]: https://img.shields.io/badge/-ArsenTech-222222?style=for-the-badge&logo=scratch&logoColor=orange
[scratch-url]: https://scratch.mit.edu/users/ArsenTech/
[github-url]: https://github.com/ArsenTech