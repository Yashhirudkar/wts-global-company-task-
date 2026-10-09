import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import styles from './SelectDropdown.module.css';

/**
 * Custom accessible dropdown.
 * The panel is rendered via a React Portal directly into <body>
 * so it is never clipped by ancestor overflow:hidden.
 *
 * Props:
 *   id, name, value, onChange, onBlur,
 *   placeholder, options, disabled, className
 *
 * `options`:  string[]  |  { value, label }[]
 */
const SelectDropdown = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder = 'Select…',
  options = [],
  disabled = false,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [panelStyle, setPanelStyle] = useState({});

  const triggerRef = useRef(null);
  const panelRef   = useRef(null);
  const searchRef  = useRef(null);
  const listboxId  = useId();

  /* Normalise options */
  const normalised = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  const filtered = search
    ? normalised.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : normalised;

  const selectedLabel = normalised.find((o) => o.value === value)?.label ?? '';

  /* ── Calculate panel position relative to trigger ── */
  const calcPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const PANEL_MAX_H = 260;
    const openUpward = spaceBelow < PANEL_MAX_H && spaceAbove > spaceBelow;

    setPanelStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    });
  }, []);

  /* ── Open ── */
  const openDropdown = useCallback(() => {
    if (disabled) return;
    calcPosition();
    setOpen(true);
    setSearch('');
  }, [disabled, calcPosition]);

  /* ── Close ── */
  const closeDropdown = useCallback(() => {
    setOpen(false);
    setSearch('');
    if (onBlur) onBlur({ target: { name } });
  }, [name, onBlur]);

  /* Recalculate on scroll/resize while open */
  useEffect(() => {
    if (!open) return;
    const update = () => calcPosition();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, calcPosition]);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      const clickedTrigger = triggerRef.current?.contains(e.target);
      const clickedPanel   = panelRef.current?.contains(e.target);
      if (!clickedTrigger && !clickedPanel) closeDropdown();
    };
    document.addEventListener('mousedown', handle);
    document.addEventListener('touchstart', handle);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('touchstart', handle);
    };
  }, [open, closeDropdown]);

  /* Focus search when panel opens */
  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  /* Escape key */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeDropdown();
  };

  /* Select option */
  const select = (opt) => {
    if (onChange) onChange({ target: { name, value: opt.value } });
    closeDropdown();
  };

  /* ── Portal panel ── */
  const panel = open
    ? createPortal(
        <div
          ref={panelRef}
          style={panelStyle}
          className={styles.panel}
          onKeyDown={handleKeyDown}
          role="presentation"
        >
          {normalised.length > 5 && (
            <div className={styles.searchWrap}>
              <input
                ref={searchRef}
                type="text"
                className={styles.search}
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
              />
            </div>
          )}
          <ul
            id={listboxId}
            role="listbox"
            className={styles.list}
            aria-label={placeholder}
          >
            {filtered.length === 0 ? (
              <li className={styles.noResults}>No results</li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  className={`${styles.option} ${opt.value === value ? styles.selected : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(opt);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    select(opt);
                  }}
                >
                  {opt.value === value && (
                    <svg
                      className={styles.checkIcon}
                      viewBox="0 0 12 10"
                      width="12"
                      height="10"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 5l3.5 3.5L11 1"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {opt.label}
                </li>
              ))
            )}
          </ul>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div
        className={`${styles.wrapper} ${open ? styles.open : ''}`}
        onKeyDown={handleKeyDown}
      >
        <button
          ref={triggerRef}
          type="button"
          id={id}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          disabled={disabled}
          className={`${styles.trigger} ${className} ${!value ? styles.placeholder : ''}`}
          onClick={() => (open ? closeDropdown() : openDropdown())}
        >
          <span className={styles.triggerText}>
            {value ? selectedLabel : placeholder}
          </span>
          <svg
            className={`${styles.chevron} ${open ? styles.chevronUp : ''}`}
            viewBox="0 0 10 6"
            width="10"
            height="6"
            aria-hidden="true"
          >
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {panel}
    </>
  );
};

export default SelectDropdown;
