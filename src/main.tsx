import 'datocms-react-ui/styles.css';

import { connect } from 'datocms-plugin-sdk';
import { createRoot } from 'react-dom/client';

import { IconPicker } from './IconPicker';
import { IconPickerModal } from './IconPickerModal';

const mountAt = '#root';

const mount = (node: React.ReactNode) => {
  const container = document.querySelector(mountAt);
  if (!container) return;
  createRoot(container).render(node);
};

connect({
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
