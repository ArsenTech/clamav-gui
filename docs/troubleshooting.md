<p align="center">
     <picture>
          <source media="(prefers-color-scheme: dark)" style="object-fit: contain;" srcset="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark-dark.png" />
          <source media="(prefers-color-scheme: light)" style="object-fit: contain;" srcset="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark.png" />
          <img alt="ClamAV GUI" width="500" height="130" style="object-fit: contain;" src="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark.png" />
     </picture>
</p>

<h1 align="center">Troubleshooting</h1>

## The ClamAV GUI shows "Oops, ClamAV has not been installed."
Make sure to install ClamAV by following the installation guide here:
https://docs.clamav.net/manual/Installing.html

### Windows
1. Open the Command Prompt, and type:
   ```cmd
   where clamscan
   ```
2. Once it returns the path, open the Start Menu, Type `env`.
3. Click on `Edit the system environment variables`
4. Click on `Environment Variables` in the **System Properties** Window
5. Find the `Path` variable, Click `Edit`, then add the output path of the `where clamscan` command
6. Click **OK**, then **OK**, **Apply**, and **OK**
7. Verify by opening the command prompt and typing:
   ```cmd
   clamscan --version
   ```

### Linux
1. Open the preferred terminal, then type:
   ```bash
   which clamscan
   ```
2. Once it returns the path, open the `~/.bashrc` file with nano:
   ```bash
   sudo nano ~/.bashrc
   ```
3. Add the following snippet at the end of the `~/.bashrc` file:
   ```bash
   export PATH="$PATH:/path/to/clamav/bin"
   ```
4. Press **Ctrl + S**, then **Ctrl + X**, reload the terminal by using:
   ```bash
   source ~/.bashrc
   ```
5. Verify by typing:
   ```bash
   clamscan --version
   ```

Once you have installed ClamAV and added the ClamAV path to the `PATH` environment variable, click on the **Check Availability** button below to activate the ClamAV GUI for free

---
## I got a strange error page after launching the GUI, and it happens when I go to the specific page...
That error might happen because of leftover LocalStorage configurations

1. Open the System Tray Menu
2. Quit the ClamAV GUI
3. Go to the cache folder
   - **Windows** - Press **Win + R** key and type `%localappdata%`
   - **Linux** - Open the preferred file explorer and go to `$HOME/.cache`
4. Delete the `com.arsentech.clamav-gui` folder inside the Cache folder
   - **Windows** - Delete `AppData/Local/com.arsentech.clamav-gui` folder
   - **Linux** - `rm -rf ~/.cache/com.arsentech.clamav-gui` or delete from the preferred File Explorer
5. Launch the app again

> [!IMPORTANT]
> This might delete settings configurations, so make sure to export these settings before cleaning the cache, and once it's finished, import these settings into the GUI

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
