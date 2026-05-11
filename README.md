# DatoCMS plugin: Untitled UI icon picker

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
