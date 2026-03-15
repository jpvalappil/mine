const TYPES = {
  default: { color: 'var(--mine-color-text)',    border: 'var(--mine-color-border)' },
  success: { color: 'var(--mine-color-success)', border: 'var(--mine-color-success)' },
  error:   { color: 'var(--mine-color-danger)',  border: 'var(--mine-color-danger)' },
  warning: { color: 'var(--mine-color-warning)', border: 'var(--mine-color-warning)' },
};

const DEFAULT_DURATION = 4000;
const _stack = [];
let host = null;

function getHost() {
  if (!host || !host.isConnected) {
    host = document.createElement('div');
    Object.assign(host.style, {
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: '9999',
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
      maxWidth: '22rem', width: 'calc(100vw - 3rem)',
    });
    document.body.appendChild(host);
  }
  return host;
}

function onGlobalKeydown(e) {
  if (e.key === 'Escape' && _stack.length > 0) _stack[_stack.length - 1]();
}
document.addEventListener('keydown', onGlobalKeydown);

export function destroy() {
  document.removeEventListener('keydown', onGlobalKeydown);
  if (host) { host.remove(); host = null; }
  _stack.length = 0;
}

export function toast(message, options = {}) {
  const { type = 'default', duration = DEFAULT_DURATION, action } = options;
  const colors = TYPES[type] || TYPES.default;
  const container = getHost();

  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  Object.assign(el.style, {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.75rem 1rem', background: 'var(--mine-color-bg)',
    border: `1px solid ${colors.border}`, borderLeft: `4px solid ${colors.border}`,
    borderRadius: 'var(--mine-radius-base, 6px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    color: colors.color, fontSize: '0.875rem', lineHeight: '1.5',
    opacity: '0', transform: 'translateX(100%)',
    transition: 'opacity 150ms ease, transform 150ms ease',
  });

  const text = document.createElement('span');
  text.textContent = message;
  text.style.flex = '1';
  el.appendChild(text);

  if (action && typeof action.fn === 'function') {
    const btn = document.createElement('button');
    btn.textContent = action.label;
    Object.assign(btn.style, { background: 'none', border: 'none', color: 'var(--mine-color-accent)', cursor: 'pointer', fontWeight: '600', fontSize: 'inherit', padding: '0 4px', flexShrink: '0', minWidth: '24px', minHeight: '24px' });
    btn.addEventListener('click', () => { action.fn(); dismiss(); });
    el.appendChild(btn);
  }

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '\u00d7';
  closeBtn.setAttribute('aria-label', 'Dismiss');
  Object.assign(closeBtn.style, { background: 'none', border: 'none', color: 'var(--mine-color-text-muted)', cursor: 'pointer', fontSize: '1.25rem', lineHeight: '1', padding: '0', flexShrink: '0', minWidth: '24px', minHeight: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' });
  closeBtn.addEventListener('click', dismiss);
  el.appendChild(closeBtn);

  container.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateX(0)'; }));

  _stack.push(dismiss);
  const timer = duration > 0 ? setTimeout(dismiss, duration) : null;

  function dismiss() {
    clearTimeout(timer);
    const idx = _stack.indexOf(dismiss);
    if (idx !== -1) _stack.splice(idx, 1);
    el.style.opacity = '0';
    el.style.transform = 'translateX(100%)';
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }

  return { dismiss };
}
