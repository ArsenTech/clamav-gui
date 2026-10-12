<p align="center">
     <picture>
          <source media="(prefers-color-scheme: dark)" style="object-fit: contain;" srcset="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark-dark.png" />
          <source media="(prefers-color-scheme: light)" style="object-fit: contain;" srcset="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark.png" />
          <img alt="ClamAV GUI" width="500" height="130" style="object-fit: contain;" src="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark.png" />
     </picture>
</p>

<h1 align="center">Installing ClamAV GUI</h1>

### Pre-installation requirements
### Hardware
- Processor:
    - AMD Ryzen, Threadripper, or Epyc
    - Intel Core (9th generation and newer) i3, i5, i7, i9, Ultra or equivalent Xeon
    - Apple Silicon M1 and newer
- Minimum System Memory: **8 GB Minimum (16 GB Recommended)**
- System storage: ~15MB for the ClamAV GUI app
- Display resolution: 1280x960 minimum, proportionately higher with display scaling.

### Software
- **Windows 10+ / Linux / macOS**
- [**ClamAV Engine**](https://www.clamav.net/) to make the ClamAV GUI work

## Downloading the GUI
Download the latest version of ClamAV GUI from the Repo's Releases section
### Windows
Launch a Command Prompt Window and use the `certutil` command to verify the download:
```cmd
cd Downloads
certUtil -hashfile <filename> SHA256
```
> [!Tip]
> Alternatively, you may use free third-party apps 7-Zip Compute Hash, ExactFile, and MultiHasher for a GUI-based checksum

## Installation instructions

### Windows

![welcome](https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/docs-images/installation/welcome.png)
![user-choice](https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/docs-images/installation/user-choice.png)

Once you've downloaded the ClamAV GUI installer, double click on it. Next, the setup provides whether you want to install the GUI
   - For anyone using the PC
   - For only the current user

![path](https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/docs-images/installation/path.png)
![finish](https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/docs-images/installation/finish.png)

Next, the installer will ask you where you wish to install the GUI. Unless you have a specific reason to change this setting, select `Next` to install the GUI with these initial settings. Once it's complete, select `Finish` to exit the installer.

### macOS

Before launching ClamAV GUI, install the ClamAV engine:

```bash
brew install clamav
freshclam
```

Check that ClamAV is available:

```bash
which clamscan
clamscan --version
```

Common Homebrew paths:

```bash
/opt/homebrew/bin/clamscan
/usr/local/bin/clamscan
```

Download the macOS build from the Releases page, open it, and move **ClamAV GUI** to the Applications folder if needed.

Then launch the app from Applications.

> [!NOTE]
> On macOS, the GUI checks common Homebrew ClamAV paths if `clamscan` is not found through the normal app environment.

---

### Linux

Before launching ClamAV GUI, install the ClamAV engine using your distribution package manager.

#### Debian / Ubuntu

```bash
sudo apt update
sudo apt install clamav
sudo freshclam
```

#### Fedora

```bash
sudo dnf install clamav
sudo freshclam
```

#### Arch Linux

```bash
sudo pacman -S clamav
sudo freshclam
```

#### openSUSE

```bash
sudo zypper install clamav
sudo freshclam
```

Check that ClamAV is available:

```bash
which clamscan
clamscan --version
```

Download the Linux package from the Releases page.

For AppImage builds:

```bash
chmod +x ClamAV-GUI*.AppImage
./ClamAV-GUI*.AppImage
```

For Debian-based packages:

```bash
sudo apt install ./clamav-gui*.deb
```

For RPM-based packages:

```bash
sudo dnf install ./clamav-gui*.rpm
```

On openSUSE:

```bash
sudo zypper install ./clamav-gui*.rpm
```

> [!NOTE]
> Linux tray behavior may depend on the desktop environment and system tray support.

## Launching the GUI

![shortcut](https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/docs-images/installation/shortcut.png)

You'll find shortcuts placed on both the Desktop and Start Menu, so launch the GUI by double clicking on the Blue Shield icon.

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