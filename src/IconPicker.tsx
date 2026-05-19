import './IconPicker.css';

import * as Icons from '@untitledui/icons';
import type { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Button, Canvas, TextInput } from 'datocms-react-ui';
import { type FC, type SVGProps, useState } from 'react';

import type { PluginParameters } from './ConfigScreen';

type IconComponent = FC<
  SVGProps<SVGSVGElement> & { size?: number; color?: string }
>;
const registry = Icons as unknown as Record<string, IconComponent>;

const MODAL_ID = 'iconPickerModal';
const DIGITS_ONLY = /^\d+$/;

type IconValue = {
  icon: string | null;
  number: string | null;
  useNumber: boolean;
};

const EMPTY: IconValue = { icon: null, number: null, useNumber: false };

const parseValue = (raw: string | null | undefined): IconValue => {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const obj = parsed as Record<string, unknown>;
      return {
        icon: typeof obj.icon === 'string' ? obj.icon : null,
        number: typeof obj.number === 'string' ? obj.number : null,
        useNumber: Boolean(obj.useNumber),
      };
    }
  } catch {
    // Malformed value — fall back to an empty state.
  }
  return EMPTY;
};

const serialize = (v: IconValue): string | null => {
  if (!v.icon && !v.number) return null;
  return JSON.stringify({
    icon: v.icon ?? null,
    number: v.number ?? null,
    useNumber: Boolean(v.useNumber),
  });
};

const getAtPath = (obj: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>(
    (acc, key) =>
      acc != null && typeof acc === 'object'
        ? (acc as Record<string, unknown>)[key]
        : undefined,
    obj,
  );

type Props = { ctx: RenderFieldExtensionCtx };

export const IconPicker = ({ ctx }: Props) => {
  const raw =
    (getAtPath(ctx.formValues, ctx.fieldPath) as string | null | undefined) ??
    null;
  const value = parseValue(raw);
  const hasContent = !!value.icon || !!value.number;

  const params = (ctx.plugin.attributes.parameters ?? {}) as PluginParameters;
  const numberInputEnabled = Boolean(params.enableNumberInput);

  const [localUseNumber, setLocalUseNumber] = useState(value.useNumber);
  const useNumber = numberInputEnabled
    ? hasContent
      ? value.useNumber
      : localUseNumber
    : false;

  const writeValue = (patch: Partial<IconValue>) => {
    const next: IconValue = { ...value, useNumber, ...patch };
    ctx.setFieldValue(ctx.fieldPath, serialize(next));
  };

  const openPicker = async () => {
    const result = await ctx.openModal({
      id: MODAL_ID,
      title: 'Pick an icon',
      width: 'l',
      parameters: { current: value.icon },
    });
    if (typeof result === 'string') {
      writeValue({ icon: result });
    }
  };

  const handleNumberChange = (next: string) => {
    if (next === '') {
      writeValue({ number: null });
      return;
    }
    if (DIGITS_ONLY.test(next)) {
      writeValue({ number: next });
    }
  };

  const toggleMode = () => {
    const next = !useNumber;
    setLocalUseNumber(next);
    if (hasContent) {
      writeValue({ useNumber: next });
    }
  };

  const clearAll = () => ctx.setFieldValue(ctx.fieldPath, null);

  return (
    <Canvas ctx={ctx}>
      <div className="icon-picker">
        <div className="icon-picker__toolbar">
          {useNumber ? (
            <>
              <div className="icon-picker__number-input">
                <TextInput
                  placeholder="Enter digits, e.g. 01"
                  value={value.number ?? ''}
                  onChange={handleNumberChange}
                />
              </div>
              <Button buttonSize="s" buttonType="muted" onClick={toggleMode}>
                Use icon instead
              </Button>
              {hasContent && (
                <Button buttonSize="s" buttonType="muted" onClick={clearAll}>
                  Clear
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                buttonSize="s"
                buttonType={value.icon ? 'muted' : 'primary'}
                onClick={openPicker}
              >
                {value.icon ? 'Change icon' : 'Pick an icon'}
              </Button>
              {hasContent && (
                <Button buttonSize="s" buttonType="muted" onClick={clearAll}>
                  Clear
                </Button>
              )}
              {value.icon && (
                <div className="icon-picker__current">
                  <CurrentIcon name={value.icon} />
                  <code>{value.icon}</code>
                </div>
              )}
              {numberInputEnabled && (
                <Button buttonSize="s" buttonType="muted" onClick={toggleMode}>
                  Use number instead
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Canvas>
  );
};

const CurrentIcon = ({ name }: { name: string }) => {
  const Cmp = registry[name];
  if (!Cmp) return null;
  return <Cmp size={24} />;
};
