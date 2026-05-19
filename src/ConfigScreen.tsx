import type { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, SwitchField } from 'datocms-react-ui';

export type PluginParameters = {
  enableNumberInput?: boolean;
};

type Props = { ctx: RenderConfigScreenCtx };

export const ConfigScreen = ({ ctx }: Props) => {
  const params = (ctx.plugin.attributes.parameters ?? {}) as PluginParameters;
  const enableNumberInput = Boolean(params.enableNumberInput);

  return (
    <Canvas ctx={ctx}>
      <div style={{ padding: '1rem' }}>
        <SwitchField
          id="enableNumberInput"
          name="enableNumberInput"
          label="Allow number input"
          hint="Adds a 'Use number instead' button to the field so editors can store a digit-only string (e.g. '01') instead of picking an icon."
          value={enableNumberInput}
          onChange={(value) =>
            ctx.updatePluginParameters({ ...params, enableNumberInput: value })
          }
        />
      </div>
    </Canvas>
  );
};
