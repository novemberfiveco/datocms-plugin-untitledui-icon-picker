import './IconPicker.css';

import * as Icons from '@untitledui/icons';
import type { RenderModalCtx } from 'datocms-plugin-sdk';
import { Button, Canvas, TextInput } from 'datocms-react-ui';
import { type FC, type SVGProps, useMemo, useState } from 'react';

import { iconNames } from './iconNames';

type IconComponent = FC<
  SVGProps<SVGSVGElement> & { size?: number; color?: string }
>;
const registry = Icons as unknown as Record<string, IconComponent>;
const ICONS_PER_PAGE = 60;

type Props = { ctx: RenderModalCtx };

export const IconPickerModal = ({ ctx }: Props) => {
  const initialValue =
    typeof ctx.parameters.current === 'string' ? ctx.parameters.current : null;
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return iconNames;
    return iconNames.filter((name) => name.toLowerCase().includes(q));
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ICONS_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * ICONS_PER_PAGE;
  const visible = filtered.slice(start, start + ICONS_PER_PAGE);

  return (
    <Canvas ctx={ctx}>
      <div className="icon-picker">
        <div className="icon-picker__toolbar">
          <div className="icon-picker__search">
            <TextInput
              placeholder={`Search ${iconNames.length} icons…`}
              value={searchTerm}
              onChange={(value) => {
                setSearchTerm(value);
                setPage(0);
              }}
            />
          </div>
          <Button
            buttonSize="s"
            buttonType="muted"
            onClick={() => ctx.resolve(null)}
          >
            Cancel
          </Button>
        </div>

        {filtered.length === 0 ? (
          <p className="icon-picker__empty">No icons match “{searchTerm}”.</p>
        ) : (
          <div className="icon-picker__grid">
            {visible.map((name) => {
              const Cmp = registry[name];
              if (!Cmp) return null;
              const isSelected = name === initialValue;
              return (
                <button
                  key={name}
                  type="button"
                  className={
                    isSelected
                      ? 'icon-picker__icon icon-picker__icon--selected'
                      : 'icon-picker__icon'
                  }
                  onClick={() => ctx.resolve(name)}
                  title={name}
                  aria-label={name}
                >
                  <Cmp size={24} />
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="icon-picker__pagination">
            <Button
              buttonSize="xxs"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
            >
              Prev
            </Button>
            <span>
              {safePage + 1} / {totalPages}
            </span>
            <Button
              buttonSize="xxs"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Canvas>
  );
};
