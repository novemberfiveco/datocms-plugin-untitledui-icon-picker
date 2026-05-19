import 'datocms-react-ui/styles.css';

import { connect } from 'datocms-plugin-sdk';
import { createRoot, type Root } from 'react-dom/client';

import { ConfigScreen } from './ConfigScreen';
import { IconPicker } from './IconPicker';
import { IconPickerModal } from './IconPickerModal';

const mountAt = '#root';
let root: Root | null = null;

const mount = (node: React.ReactNode) => {
  const container = document.querySelector(mountAt);
  if (!container) return;
  if (!root) root = createRoot(container);
  root.render(node);
};

connect({
  renderConfigScreen(ctx) {
    mount(<ConfigScreen ctx={ctx} />);
  },
  manualFieldExtensions() {
    return [
      {
        id: 'untitledUiIconPicker',
        name: 'Untitled UI icon picker',
        type: 'editor',
        fieldTypes: ['string'],
      },
    ];
  },
  renderFieldExtension(_id, ctx) {
    mount(<IconPicker ctx={ctx} />);
  },
  renderModal(modalId, ctx) {
    if (modalId === 'iconPickerModal') {
      mount(<IconPickerModal ctx={ctx} />);
    }
  },
});
