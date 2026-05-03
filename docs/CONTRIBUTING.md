<p align="center">
     <picture>
          <source media="(prefers-color-scheme: dark)" style="object-fit: contain;" srcset="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark-dark.png" />
          <source media="(prefers-color-scheme: light)" style="object-fit: contain;" srcset="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark.png" />
          <img alt="ClamAV GUI" width="500" height="130" style="object-fit: contain;" src="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark.png" />
     </picture>
</p>

<h1 align="center">Contributing Guide to ArsenTech's ClamAV GUI</h1>

First off, thanks for considering contributing to this project!  
Your ideas, time, and effort help make it better for everyone. 🌱

We welcome all kinds of contributions: **code**, **design**, **documentation**, **bug reports**, **feature ideas**, and **feedback**.  
This guide explains how you can get involved.

---

## 🚀 Ways to Contribute
You don’t need to write code to make a valuable contribution! Here are some great ways:
- **Development** – Fix bugs, add features, or refactor code.
- **Testing & Bug Reports** – Try the app on different devices and report any issues.
- **Translations** – Help make the project available in more languages.
- **Design & UI Feedback** – Suggest layout, accessibility, or UX improvements.
- **Feature Requests** – Share your ideas for improvements by opening a feature request.
- **Community Support** – Answer questions in issues and help others get started.

## ✅ Pull Request Guidelines
When submitting a PR:
1. Create a branch from `main`:
   ```bash
   git checkout -b <type>/<short-description>
   # examples: feature/i18n, fix/typo, i18n/fr-french
   ```
2. Keep commits small and meaningful.
3. Ensure the app builds and passes linting/tests.
4. Update docs (README, CHANGELOG) if you changed behavior or added features.
5. Open the PR and describe what you changed and why.

If your PR affects:
- user-visible behavior
- updater logic
- security, scanning, or quarantine
- translations or UI text

Please mention whether it should be included in the next release. Small improvements and cleanup PRs are welcome, perfection is not required!

### PR Checklist
- [ ] My changes work locally (`npm run dev`).
- [ ] I’ve updated documentation/screenshots if needed.
- [ ] I’ve tested on multiple browsers/devices.
- [ ] My commit messages are clear and signed (`git commit -s -m "your message"`).

## 📝 Commit Convention (Optional but Recommended)
We recommend following the [Conventional Commits](https://www.conventionalcommits.org/) format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for code improvements
- `chore:` for maintenance

Example:
```
refactor: Improved the Antivirus UI
```

## 📦 Development Setup
> [!IMPORTANT]
> Before Development, make sure you've installed and updated Rust
> - Check for **Rust** updates by using `rustup update`
> - Install The **Tauri CLI** globally (Optional but Recommended)
>     ```
>     npm install -g @tauri-apps/cli
>     ```
> If the build fails, make sure you also have required platform dependencies (like **Visual Studio Build Tools** on Windows, **libwebkit2gtk** on Linux, or **Xcode** on macOS).

1. Fork the repository and clone your fork:
      ```bash
      git clone https://github.com/ArsenTech/clamav-gui.git
      cd clamav-gui
      ```
2. Install dependencies:
      ```bash
      npm install
      ```
3. Run the development server:
      ```bash
      npm run tauri dev
      ```
4. Wait until `rustup` compiles the dependencies, and the window will appear.

PRs are reviewed with kindness and calmness :-)

## 🧪 Testing
Before submitting a PR:
- Test **light and dark mode**.
- Verify **responsiveness** and **accessibility** on desktop.
- Ensure existing features (like main scan, quarantine page, firewall), new features, and improvements work correctly.
- Make sure there are **no console errors** and **no linting issues**.

If your changes affect the updater, release notes, or update flow, please test update checking locally and mention it in the PR.

## 🌍 Translating
> [!NOTE]
> - All translations are stored in the `public/locales/` folder.
> - Each language has its own JSON file (e.g. `public/locales/hy/translation.json` for Armenian).
> - Keep placeholders like {{string}}, {{number}} intact.
> - Use the following to escape characters:
>   - **Forward Slash** - `\\`
>   - **Double Quotes** - `\"`
> - If unsure about a term, open a draft PR. Maintainers will help!

### Steps
1. Download base language files from [here][link-to-base-lang]
2. Translate all strings with your preferred tool.
3. Save it as `[lang-code]/[ns].json` (e.g. `fr/translations.json`, `el/scan.json`, `tr/quarantine.json`).
4. Add your files to the `public/locales/` folder.
5. Add the language entry in `src/i18n/config.ts`.
   ```ts
   export const languageOptions: languageOption[] = [
      // All Existing Languages +
      { language: "<native-name> (example: Español)", code: "<lang-code> (example: es)", countryCode: "<country-code> (example: mx)"},
      // ^ This will be your contribution :-)
   ];
   // ...
   export const dateFnsLanguages: Record<LangCode,DateFnsLocale.Locale> = {
      // All Existing Languages +
      <lang-code>: DateFnsLocale.<lang-code>
      // ^ This will also be your contribution :-)
   }
   ```
6. Open `src-tauri/assets/i18n/[lang-code].json` and Translate the System tray using your preferred tool to finish the i18n support.
   - Base Language - [`/src-tauri/assets/i18n/en.json`][link-to-systray-base-lang]
7. Make sure to give yourself a credit.
   Examples in other Languages:
   - 🇷🇺 Russian: `Перевод на Русском: ArsenTech - https://github.com/ArsenTech`
   - 🇦🇲 Armenian: `Թարգմանությունը՝ ArsenTech-ի - https://github.com/ArsenTech`
   Make sure the credit for the translation is unique :-)
8. Test by switching to your new language and tweaking some translations.
9. Run:
   ```bash
   npm run i18n:missing-keys
   ```
   Then type a language code like `es`, `tr`, or `ge`.
   Fix missing keys until you reach 100%.
10. Submit a PR for review!

Once it's complete, your i18n contribution will be live!

## 💡 Feedback & Feature Requests
We love new ideas! If you have a suggestion:
1. Check [existing issues][issues-url]
2. If it’s new, open a [feature request][new-feature-request-url].
3. Explain the motivation and the desired implementation. (The Feature request template says it all ☺️)

## 🌱 Community Guidelines
We aim to keep this space **welcoming and peaceful**:
- Be respectful and constructive.
- Focus on ideas, not individuals.
- Keep discussions inclusive and on-topic.
- Remember: behind every contribution is a person.

### Dos and Don'ts
| ✅ Do                           | ❌ Don’t                 |
| ------------------------------- | ------------------------- |
| Follow branch naming convention | Edit README for no reason |
| Test before submitting          | Submit broken builds      |
| Use clear commit messages       | Spam “fix typo” PRs       |
| Respect code owner reviews      | Bypass linting            |

See our [Code of Conduct][code-of-conduct-url] for more.

## 🙌 A Note of Thanks
Contributors are what make this project thrive.
Your time, ideas, and creativity are truly appreciated.

Take a deep breath, enjoy the process — and let’s make something beautiful together ✨

Thanks for making ArsenTech's ClamAV GUI better!

> GitHub [@ArsenTech][github-url] &nbsp;&middot;&nbsp;
> YouTube [@ArsenTech][yt-url] &nbsp;&middot;&nbsp;
> Patreon [ArsenTech][patreon-url] &nbsp;&middot;&nbsp;
> [ArsenTech's Website][website-url]

[issues-url]: https://github.com/ArsenTech/clamav-gui/issues
[new-feature-request-url]: https://github.com/ArsenTech/clamav-gui/issues/new?assignees=&labels=&template=feature_request.md&title=
[code-of-conduct-url]: https://github.com/ArsenTech/clamav-gui/blob/main/CODE_OF_CONDUCT.md
[yt-url]:https://www.youtube.com/channel/UCrtH0g6NE8tW5VIEgDySYtg
[patreon-url]:https://www.patreon.com/ArsenTech
[github-url]: https://github.com/ArsenTech
[website-url]: https://arsentech.github.io
[link-to-base-lang]: https://github.com/ArsenTech/clamav-gui/tree/main/public/locales/en
[link-to-systray-base-lang]: https://github.com/ArsenTech/clamav-gui/blob/main/src-tauri/assets/i18n/en.json