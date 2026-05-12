import './IconPicker.css';

import * as Icons from '@untitledui/icons';
import type { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Button, Canvas } from 'datocms-react-ui';
import type { FC, SVGProps } from 'react';

type IconComponent = FC<
  SVGProps<SVGSVGElement> & { size?: number; color?: string }
>;
const registry = Icons as unknown as Record<string, IconComponent>;

const MODAL_ID = 'iconPickerModal';

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
  const currentValue =
    (getAtPath(ctx.formValues, ctx.fieldPath) as string | null | undefined) ??
    null;

  const openPicker = async () => {
    const result = await ctx.openModal({
      id: MODAL_ID,
      title: 'Pick an icon',
      width: 'l',
      parameters: { current: currentValue },
    });
    if (typeof result === 'string') {
      ctx.setFieldValue(ctx.fieldPath, result);
    }
  };

  return (
    <Canvas ctx={ctx}>
      <div className="icon-picker">
        <div className="icon-picker__toolbar">
          <Button
            buttonSize="s"
            buttonType={currentValue ? 'muted' : 'primary'}
            onClick={openPicker}
          >
            {currentValue ? 'Change icon' : 'Pick an icon'}
          </Button>
          {currentValue && (
            <Button
              buttonSize="s"
              buttonType="muted"
              onClick={() => ctx.setFieldValue(ctx.fieldPath, null)}
            >
              Clear
            </Button>
          )}
          {currentValue && (
            <div className="icon-picker__current">
              <CurrentIcon name={currentValue} />
              <code>{currentValue}</code>
            </div>
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
