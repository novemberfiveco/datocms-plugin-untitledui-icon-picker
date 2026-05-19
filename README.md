# DatoCMS plugin: Untitled UI icon picker

[![DatoCMS](https://img.shields.io/static/v1?label=DatoCMS&message=Install&color=FF7751&style=for-the-badge&logo=datocms)](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-untitledui-icon-picker) [![npm](https://img.shields.io/npm/v/datocms-plugin-untitledui-icon-picker?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/datocms-plugin-untitledui-icon-picker) ![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/novemberfiveco/datocms-plugin-untitledui-icon-picker/pr.yml?style=for-the-badge&logo=github) [![NPM](https://img.shields.io/npm/l/datocms-plugin-untitledui-icon-picker?style=for-the-badge)](LICENSE.txt) [![Powered By NovemberFive](https://img.shields.io/static/v1?label=Powered%20by&message=November%20Five&style=for-the-badge&color=e22a1d&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIxMDYuMTM5OTkxNzYwMjUzOSAxMDYuNjE2OTA1MjEyNDAyMzQgMjg2Ljg2MDAxNTg2OTE0MDYgMjg2Ljg2MDAxNTg2OTE0MDYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiI+PHBhdGggZD0ibTMxMCAyNzAuNzktMjQtMTMuODZ2LTYwLjQ1aC0yNHY0Ni42MmwtMjQtMTMuODd2LTMyLjc1aC0yMy45NXYxOC45M2wtMzAtMTcuMzNhMTIgMTIgMCAwIDAgLTE4IDEwLjM3djk1LjA1aDIzLjk1di03NC4zMWwyNCAxMy44N3Y2MC40NGgyNHYtNDYuNjJsMjQgMTMuODd2MzIuNzVoMjR2LTE4LjkzbDMwIDE3LjMzYTEyIDEyIDAgMCAwIDE4LTEwLjM3di05NWgtMjR6Ij48L3BhdGg+PHBhdGggZD0ibTM4MS43NCAxOTQuMzRhMTQzLjQzIDE0My40MyAwIDEgMCAxMS4yNiA1NS42NiAxNDIuNjggMTQyLjY4IDAgMCAwIC0xMS4yNi01NS42NnptLTQ3LjU3IDEzOS44M2ExMTkgMTE5IDAgMSAxIDM0LjgzLTg0LjE3IDExOC4yNyAxMTguMjcgMCAwIDEgLTM0LjgzIDg0LjE3eiI+PC9wYXRoPjwvZz48L3N2Zz4=&logoWidth=17)](https://www.novemberfive.co/)

A DatoCMS field editor plugin that lets editors pick an icon from the [Untitled UI](https://www.untitledui.com/) icon set — or, optionally, type a digit-only label (e.g. `01`) instead. The chosen value is stored as a JSON-serialized object inside a single string field, ready for your frontend to render.

## Head ups

- The plugin stores **a JSON-serialized object** in a string field: `{"icon": "Star01", "number": "01", "useNumber": false}`. Your frontend is responsible for parsing the value and resolving `icon` to a React component.
- Designed for **single-string fields** only (`fieldTypes: ['string']`).
- The number input is **opt-in** per project via the plugin's global Settings (see [Configuration](#configuration)).
- Bundled icon list is generated from `@untitledui/icons` at build time. If your frontend is pinned to a different version of `@untitledui/icons`, picked names may not exist there — keep the versions in lockstep.

## Installation

Install via the DatoCMS marketplace:

1. In your DatoCMS project, go to **Settings → Plugins → Add new plugin**.
2. Search for `Untitled UI icon picker` and install it.

Then, on any **single-line string** field where you want the picker:

1. Open the field's settings.
2. Under **Presentation**, set the editor to **Untitled UI icon picker**.
3. Save.

## Configuration

The plugin has a global setting under **Settings → Plugins → Untitled UI icon picker → Settings**:

- **Allow number input** — when enabled, every field using this editor shows an additional **Use number instead** button. Editors can then store a digit-only label (e.g. `01`) instead of picking an icon. Disabled by default.

## Stored value

The plugin stores a JSON-serialized object in the string field:

```json
{
  "icon": "Star01",
  "number": "01",
  "useNumber": false
}
```

- `icon` — the picked icon's component name from `@untitledui/icons`, or `null`.
- `number` — the typed digit-only label, or `null`.
- `useNumber` — which value the editor chose to display: `true` ⇒ render `number`, `false` ⇒ render `icon`.

Both `icon` and `number` can be present at the same time — `useNumber` is the source of truth for what to render. An empty/unset field is `null`, not an empty object.

## Usage

In your frontend, parse the stored value and render either the icon or the number label:

```tsx
import * as Icons from '@untitledui/icons';
import type { FC, SVGProps } from 'react';

type IconComponent = FC<SVGProps<SVGSVGElement> & { size?: number }>;
const registry = Icons as unknown as Record<string, IconComponent>;

type IconValue = {
  icon: string | null;
  number: string | null;
  useNumber: boolean;
};

const parseIconValue = (raw: string | null | undefined): IconValue | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as IconValue;
  } catch {
    return null;
  }
};

export const Icon = ({
  value,
  size = 24,
}: {
  value: string | null | undefined;
  size?: number;
}) => {
  const parsed = parseIconValue(value);
  if (!parsed) return null;
  if (parsed.useNumber && parsed.number) return <span>{parsed.number}</span>;
  if (parsed.icon) {
    const Cmp = registry[parsed.icon];
    if (Cmp) return <Cmp size={size} />;
  }
  return null;
};
```

## Contributing

- **Reporting a bug**: [Open an issue](https://github.com/novemberfiveco/datocms-plugin-untitledui-icon-picker/issues/new) explaining your setup and the bug you're encountering.
- **Suggesting an improvement**: [Open an issue](https://github.com/novemberfiveco/datocms-plugin-untitledui-icon-picker/issues/new) explaining your improvement or feature so we can discuss it.
- **Submitting code changes**: For small fixes, [open a pull request](https://github.com/novemberfiveco/datocms-plugin-untitledui-icon-picker/pulls) with a description of your changes. For large changes, please first open an issue so we can discuss the approach.

## Development

```bash
nvm use
npm install
npm run dev      # vite dev server on :5173
npm run build    # builds dist/ — what gets shipped to the marketplace
npm run lint
npm run typecheck
```

To test the plugin against a real DatoCMS project before publishing, add it as a **private plugin** in that project's settings pointing at your local dev server URL.

Releases are cut from `main` via the **Release** GitHub Action (`workflow_dispatch`), which uses `release-it` to bump the version, generate `CHANGELOG.md`, tag, and `npm publish`. The DatoCMS marketplace picks up new versions automatically within an hour.

## License

[MIT](./LICENSE.txt) © November Five
