# DatoCMS plugin: Untitled UI icon picker

[![DatoCMS](https://img.shields.io/static/v1?label=DatoCMS&message=Install&color=FF7751&style=for-the-badge&logo=datocms)](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-untitledui-icon-picker) [![npm](https://img.shields.io/npm/v/datocms-plugin-untitledui-icon-picker?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/datocms-plugin-untitledui-icon-picker) ![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/novemberfiveco/datocms-plugin-untitledui-icon-picker/pr.yml?style=for-the-badge&logo=github) [![NPM](https://img.shields.io/npm/l/datocms-plugin-untitledui-icon-picker?style=for-the-badge)](LICENSE.txt) [![Powered By NovemberFive](https://img.shields.io/static/v1?label=Powered%20by&message=November%20Five&style=for-the-badge&color=e22a1d&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIxMDYuMTM5OTkxNzYwMjUzOSAxMDYuNjE2OTA1MjEyNDAyMzQgMjg2Ljg2MDAxNTg2OTE0MDYgMjg2Ljg2MDAxNTg2OTE0MDYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiI+PHBhdGggZD0ibTMxMCAyNzAuNzktMjQtMTMuODZ2LTYwLjQ1aC0yNHY0Ni42MmwtMjQtMTMuODd2LTMyLjc1aC0yMy45NXYxOC45M2wtMzAtMTcuMzNhMTIgMTIgMCAwIDAgLTE4IDEwLjM3djk1LjA1aDIzLjk1di03NC4zMWwyNCAxMy44N3Y2MC40NGgyNHYtNDYuNjJsMjQgMTMuODd2MzIuNzVoMjR2LTE4LjkzbDMwIDE3LjMzYTEyIDEyIDAgMCAwIDE4LTEwLjM3di05NWgtMjR6Ij48L3BhdGg+PHBhdGggZD0ibTM4MS43NCAxOTQuMzRhMTQzLjQzIDE0My40MyAwIDEgMCAxMS4yNiA1NS42NiAxNDIuNjggMTQyLjY4IDAgMCAwIC0xMS4yNi01NS42NnptLTQ3LjU3IDEzOS44M2ExMTkgMTE5IDAgMSAxIDM0LjgzLTg0LjE3IDExOC4yNyAxMTguMjcgMCAwIDEgLTM0LjgzIDg0LjE3eiI+PC9wYXRoPjwvZz48L3N2Zz4=&logoWidth=17)](https://www.novemberfive.co/)

A DatoCMS field editor plugin that lets editors pick an icon from the [Untitled UI](https://www.untitledui.com/) icon set and stores the icon name as a plain string. Pair it with a frontend that looks the chosen name up against `@untitledui/icons` to render the matching component.

## Head ups

- The plugin stores **the icon name as a string** (e.g. `Star01`). It does not store SVG markup, props, or sizing. Your frontend is responsible for resolving the name to a React component.
- Designed for **single-string fields** only (`fieldTypes: ['string']`).
- Bundled icon list is generated from `@untitledui/icons` at build time. If your frontend is pinned to a different version of `@untitledui/icons`, picked names may not exist there — keep the versions in lockstep.

## Installation

Install via the DatoCMS marketplace:

1. In your DatoCMS project, go to **Settings → Plugins → Add new plugin**.
2. Search for `Untitled UI icon picker` and install it.

Then, on any **single-line string** field where you want the picker:

1. Open the field's settings.
2. Under **Presentation**, set the editor to **Untitled UI icon picker**.
3. Save.

## Usage

In your frontend, resolve the stored name back to an icon component:

```tsx
import * as Icons from '@untitledui/icons';
import type { FC, SVGProps } from 'react';

type IconComponent = FC<SVGProps<SVGSVGElement> & { size?: number }>;
const registry = Icons as unknown as Record<string, IconComponent>;

export const Icon = ({ name, size = 24 }: { name: string; size?: number }) => {
  const Cmp = registry[name];
  if (!Cmp) return null;
  return <Cmp size={size} />;
};
```

## Contributing

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
