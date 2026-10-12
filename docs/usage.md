<p align="center">
     <picture>
          <source media="(prefers-color-scheme: dark)" style="object-fit: contain;" srcset="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark-dark.png" />
          <source media="(prefers-color-scheme: light)" style="object-fit: contain;" srcset="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark.png" />
          <img alt="ClamAV GUI" width="500" height="130" style="object-fit: contain;" src="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark.png" />
     </picture>
</p>

<h1 align="center">Getting Started</h1>

## First launch

When you open **ClamAV GUI**, the app checks whether ClamAV is available on your system.

If ClamAV is detected, the main interface opens normally.

If ClamAV is missing or cannot be detected, install ClamAV first and make sure `clamscan` is available from your system path.

---

## Updating virus definitions

Before scanning, update the ClamAV virus database.

1. Open **Update**.
2. Start the definitions update.
3. Wait until the update finishes.
4. Check the result in the update output or History page.

Keeping definitions updated helps ClamAV detect newer threats.

---

## Running a main scan

Use **Main Scan** to scan common user folders.

1. Open **Scan**.
2. Choose **Main Scan**.
3. Start the scan.
4. Wait for the scan output to finish.
5. Review detected threats if any are found.

Main Scan is intended for regular on-demand scanning.

---

## Running a full scan

Use **Full Scan** to scan the root/system drive.

1. Open **Scan**.
2. Choose **Full Scan**.
3. Start the scan.
4. Wait for the scan to complete.

Full scans may take longer depending on the number of files and system performance.

---

## Running a custom scan

Use **Custom Scan** when you want to scan selected folders.

1. Open **Scan**.
2. Choose **Custom Scan**.
3. Select one or more folders.
4. Start the scan.
5. Review the scan output and results.

---

## Running a file scan

Use **File Scan** when you want to scan a specific file.

1. Open **Scan**.
2. Choose **File Scan**.
3. Select the file.
4. Start the scan.
5. Review the result.

---

## Handling detected threats

When threats are detected, ClamAV GUI can help you manage them.

Available actions may include:

- **Quarantine** - Move the detected file into quarantine.
- **Delete** - Remove the detected file.

---

## Using quarantine

Open **Quarantine** to manage quarantined files.

You can:

- View quarantined threats.
- Restore a selected item.
- Delete a selected item.
- Clear quarantine items when appropriate.

Only restore a file if you are sure it is safe.

---

## Viewing history and logs

Open **History** to review past actions.

History may include:

- Scan starts and finishes.
- Detected threats.
- Quarantine actions.
- Definition update results.
- Scheduler actions.
- GUI updater events.

You can also open or reveal related logs when available.

---

## Using real-time scan

Real-time scan monitors selected paths and scans files when they change.

1. Open **Settings → Advanced**.
2. Configure monitoring paths.
3. Choose a behavior mode.
4. Enable real-time scanning.

Real-time scan does not install kernel drivers. It uses file watching and ClamAV scanning.

---

## Using the scheduler

The scheduler allows you to create scheduled scan jobs.

1. Open **Scheduler**.
2. Create a scheduled scan.
3. Choose the scan type and interval.
4. Save the task.

Scheduled scan support may depend on the operating system and current app version.

---

## Viewing statistics

Open **Statistics** to view antivirus and system information. You may see:
- Scan statistics
- Threat statistics
- CPU usage
- RAM usage
- Disk usage
- Safety status indicators
- Device Information

---

## Changing scan settings

Open **Settings → Scan** to configure scan options.

You can adjust options such as:

- Recursive scanning.
- Archive scanning.
- File type scanning.
- Heuristic alerts.
- Encrypted file alerts.
- Maximum file size.
- Maximum scan size.
- Exclusions.

Some options depend on the selected scan profile.

---

## Managing exclusions

Exclusions prevent selected paths from being scanned.

1. Open **Settings → Scan**.
2. Add an exclusion path.
3. Save the setting.

On macOS, an optional system exclusion setting may be available for known system false-positive investigation paths.

---

## Changing appearance

Open **Settings → Appearance** to customize the interface.

Available options may include:

- Theme.
- Accent color.
- Sidebar behavior.
- Reduced motion.

---

## Notifications

ClamAV GUI can show notifications for supported events, such as:

- Scan started.
- Scan finished.
- Threat detected.

Notification behavior can be changed in Settings.

---

## System tray

The system tray provides quick access to common actions.

Depending on the platform, the tray may allow you to:

- Open the app.
- Start scans.
- Open settings.
- Check updates.
- Quit the application.

---

## Importing settings

Settings imports are validated before being applied.

If the imported file is invalid or incomplete, ClamAV GUI will reject it or fall back to safe defaults where supported.

---

## Recommended workflow

For regular use:

1. Update virus definitions.
2. Run a Main Scan.
3. Review scan results.
4. Quarantine or delete confirmed threats.
5. Check History and logs when needed.
6. Configure exclusions only when necessary.

---
### Navigation
- Docs
  - [Usage Guide](./usage.md)
  - [Installation Guide](./installation.md)
  - [Troubleshooting](./troubleshooting.md)
  - [FAQs](./faq.md)
  - [Translation Guide](./translation.md)
  - [Contribution Guide](./CONTRIBUTING.md)
- [← Back to README](./README.md)

> GitHub [@ArsenTech][github-url] &nbsp;&middot;&nbsp;
> YouTube [@ArsenTech][yt-url] &nbsp;&middot;&nbsp;
> Patreon [ArsenTech][patreon-url] &nbsp;&middot;&nbsp;
> [ArsenTech's Website][website-url]

[github-url]: https://github.com/ArsenTech
[yt-url]:https://www.youtube.com/channel/UCrtH0g6NE8tW5VIEgDySYtg
[patreon-url]:https://www.patreon.com/ArsenTech
[website-url]: https://arsentech.github.io