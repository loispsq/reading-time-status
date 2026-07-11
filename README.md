# Reading Time Status

Show the word count and an estimated **reading time** for the current note in
Obsidian's status bar. Updates live as you switch notes or type.

![status bar showing "1234 words · ~7 min"](https://raw.githubusercontent.com/loispsq/reading-time-status/main/docs/screenshot.png)

## Features

- **Live status bar** — word count + estimated reading time for the active note
- **CJK-aware counting** — each Chinese / Japanese / Korean character counts as
  one word, so mixed-language notes are measured correctly
- **Configurable reading speed** — set your words-per-minute (default 200)
- **Toggle word count** — show just the reading time if you prefer

## Settings

| Setting | Default | What it does |
|---|---|---|
| Reading speed | 200 wpm | Divisor used to estimate minutes |
| Show word count | on | Show `N words` next to `~M min` |

## Install

### From the community plugin browser (once approved)
Settings → Community plugins → Browse → search "Reading Time Status".

### Manual
Download `main.js`, `manifest.json`, `styles.css` from the
[latest release](https://github.com/loispsq/reading-time-status/releases/latest)
into your vault's `.obsidian/plugins/reading-time-status/` folder, then enable
the plugin.

## Development

```bash
npm install
npm run dev      # watch build
npm run build    # production build → main.js
```

## License

MIT
