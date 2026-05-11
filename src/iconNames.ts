import * as Icons from '@untitledui/icons';

export const iconNames = Object.keys(Icons)
  .filter((key) => /^[A-Z]/.test(key))
  .sort();
