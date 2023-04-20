import { h } from 'preact';

export const EditorSvgs = {
  arrowOpen: () => (
    <svg
      viewBox="0 -4 13 15"
      style={{
        color: 'hsla(var(--color-neutral), var(--alpha-tertiary, 0.4))',
        marginRight: '4px',
        height: '16px',
        width: '16px',
      }}
    >
      <path
        d="M3.35355 6.85355L6.14645 9.64645C6.34171 9.84171 6.65829 9.84171 6.85355 9.64645L9.64645 6.85355C9.96143 6.53857 9.73835 6 9.29289 6L3.70711 6C3.26165 6 3.03857 6.53857 3.35355 6.85355Z"
        fill="currentColor"
      />
    </svg>
  ),
  arrowClosed: () => (
    <svg
      viewBox="0 -2 13 15"
      style={{
        color: 'hsla(var(--color-neutral), var(--alpha-tertiary, 0.4))',
        marginRight: '4px',
        height: '16px',
        width: '16px',
      }}
    >
      <path
        d="M6.35355 11.1464L9.14645 8.35355C9.34171 8.15829 9.34171 7.84171 9.14645 7.64645L6.35355 4.85355C6.03857 4.53857 5.5 4.76165 5.5 5.20711V10.7929C5.5 11.2383 6.03857 11.4614 6.35355 11.1464Z"
        fill="currentColor"
      />
    </svg>
  ),
  checkboxUnchecked: () => (
    <svg
      viewBox="0 0 15 15"
      style={{
        color: 'hsla(var(--color-neutral), var(--alpha-tertiary, 0.4))',
        marginRight: '4px',
        height: '16px',
        width: '16px',
      }}
    >
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" fill="none" />
    </svg>
  ),
  checkboxChecked: () => (
    <svg
      viewBox="0 0 15 15"
      style={{
        color: 'hsl(var(--color-info))',
        marginRight: '4px',
        height: '16px',
        width: '16px',
      }}
    >
      <circle cx="7.5" cy="7.5" r="7.5" fill="currentColor" />
      <path
        d="M4.64641 7.00106L6.8801 9.23256L10.5017 5.61325"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      />
    </svg>
  ),
};
