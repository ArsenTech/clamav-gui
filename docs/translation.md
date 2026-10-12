<p align="center">
     <picture>
          <source media="(prefers-color-scheme: dark)" style="object-fit: contain;" srcset="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark-dark.png" />
          <source media="(prefers-color-scheme: light)" style="object-fit: contain;" srcset="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark.png" />
          <img alt="ClamAV GUI" width="500" height="130" style="object-fit: contain;" src="https://raw.githubusercontent.com/ArsenTech/clamav-gui/refs/heads/main/.github/logo-mark.png" />
     </picture>
</p>

<h1 align="center">Translating the 
                    <SettingsOption
                         title={t("ui.sidebar.title")}
                         description={t("ui.sidebar.desc")}
                    >
                         <Select
                              value={settings.sidebarCollapsible}
                              onValueChange={value=>setSettings({sidebarCollapsible: value as SidebarCollapsible})}
                         >
                              <SelectTrigger>
                                   <SelectValue placeholder={t("ui.sidebar.placeholder")}/>
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="offcanvas">
                                        <PanelRightOpen/>
                                        {t("ui.sidebar.options.off-canvas")}
                                   </SelectItem>
                                   <SelectItem value="icon">
                                        <Star/>
                                        {t("ui.sidebar.options.icon")}
                                   </SelectItem>
                              </SelectContent>
                         </Select>
                    </SettingsOption>
                    <SettingsOption
                         title={t("ui.reduce-motion.title")}
                         description={t("ui.reduce-motion.desc")}
                    >
                         <Switch
                              checked={settings.reduceMotion}
                              onCheckedChange={checked=>setSettings({reduceMotion: checked})}
                         />
                    </SettingsOption>ClamAV GUI</h1>

## Translation workflow

1. Download the base language files from [the translation source][link-to-base-lang].
2. Translate the JSON values with your preferred editor or translation tool.
3. Keep the original key names unchanged.
4. Save each file using the correct language folder and namespace.
5. Add the translated files to `public/locales/<lang-code>/`.
6. Translate the system tray strings in `src-tauri/assets/i18n/<lang-code>.json`.
7. Add the language to `src/i18n/config.ts`.
8. Give yourself translation credit.
9. Test the language in the application.
10. Check for missing keys.
11. Open a pull request for review.

---

## Translation rules

- Translate values only.
- Do not rename, remove, or duplicate keys.
- Keep placeholders unchanged.
- Keep wording clear and consistent across the application.
- Use the native language name when adding a language option.
- Preserve whitespace where it affects the displayed sentence.
- Open a draft pull request if a term is unclear.

---

## Preserving placeholders and escaped characters

Keep all placeholders unchanged. For example:

- `{{string}}`
- `{{number}}`
- `{{version}}`

Do not translate, remove, or rename placeholder values.

Escape characters correctly in JSON:

- Forward slash: `\\`
- Double quote: `\"`

---

## Frontend translations

Frontend translations are stored in:

```bash
public/locales/
```

Each language should use its own language folder:

```bash
public/locales/<lang-code>/
```

Example:

```bash
public/locales/fr/
public/locales/pl/
public/locales/hy/
```

Save translated namespace files inside the matching folder.

Example:

```bash
public/locales/fr/settings.json
public/locales/fr/scan.json
public/locales/fr/quarantine.json
```

---

## System tray translations

System tray translations are stored separately in the Tauri backend assets folder:

```bash
src-tauri/assets/i18n/
```

Use the English system tray file as the base:

```bash
src-tauri/assets/i18n/en.json
```

Then create a translated file using the same language code:

```bash
src-tauri/assets/i18n/<lang-code>.json
```

Example:

```bash
src-tauri/assets/i18n/fr.json
```

The system tray translation is required to complete i18n support for the language.

---

## Adding the language to the app

After adding the translation files, register the language in `src/i18n/config.ts`.

```ts
export const languageOptions: languageOption[] = [
     // All Existing Languages +
     {
          language: "<native-name> (example: Español)",
          code: "<lang-code> (example: es)",
          countryCode: "<country-code> (example: mx)"
     },
];
```

Also add the matching `date-fns` locale when supported:

```ts
export const dateFnsLanguages: Record<LangCode, DateFnsLocale.Locale> = {
     // All Existing Languages +
     <lang-code>: DateFnsLocale.<lang-code>
}
```

Use the native language name in the language selector.

---

## Translation credit

Make sure to give yourself credit for the translation.

Examples:

- 🇷🇺 Russian: `Перевод на Русском: ArsenTech - https://github.com/ArsenTech`
- 🇦🇲 Armenian: `Թարգմանությունը՝ ArsenTech-ի - https://github.com/ArsenTech`

Make sure the credit is unique for your translation.

---

## Checking for missing keys

After translating, run:

```bash
npm run i18n:missing-keys <lang-codes>
```

Examples:

```bash
npm run i18n:missing-keys fr pl
npm run i18n:missing-keys ru hy
npm run i18n:missing-keys tr es
```

Fix missing keys until the language is complete or near 100%.

---

## Reviewing before submitting

Before opening a pull request:

- Confirm that every key is still present.
- Check for untranslated strings.
- Verify placeholders and escaped characters.
- Test the language in the application.
- Test the system tray translation if possible.
- Review spelling, punctuation, and capitalization.
- Make sure the app has no console errors.

---

## Submitting a translation

1. Create a branch from `main`:

```bash
git checkout -b i18n/<lang-code>-<language-name>
```

Example:

```bash
git checkout -b i18n/fr-french
```

2. Add the translated frontend files.
3. Add the translated system tray file.
4. Update `src/i18n/config.ts`.
5. Run the missing keys checker.
6. Test the language in the app.
7. Open a pull request for review.

Once the translation is reviewed and merged, your language contribution will be included in ClamAV GUI.

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
[link-to-base-lang]: https://github.com/ArsenTech/clamav-gui/tree/main/public/locales/en
[link-to-systray-base-lang]: https://github.com/ArsenTech/clamav-gui/blob/main/src-tauri/assets/i18n/en.json