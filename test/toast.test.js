import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let toast;

beforeEach(async () => {
  vi.resetModules();
  document.body.innerHTML = '';
  ({ toast } = await import('../src/js/toast.js'));
});

afterEach(() => { vi.useRealTimers(); document.body.innerHTML = ''; });

describe('toast()', () => {
  it('appends a toast element to the body', () => {
    toast('Hello');
    const el = document.querySelector('[role="status"]');
    expect(el).not.toBeNull();
    expect(el.textContent).toContain('Hello');
  });
  it('returns a dismiss function', () => {
    const { dismiss } = toast('Hi');
    expect(typeof dismiss).toBe('function');
  });
  it('dismiss() removes the element after transition', () => {
    const { dismiss } = toast('Bye');
    const el = document.querySelector('[role="status"]');
    dismiss();
    el.dispatchEvent(new Event('transitionend'));
    expect(document.querySelector('[role="status"]')).toBeNull();
  });
  it('applies danger border color for error type', () => {
    toast('Oops', { type: 'error' });
    const el = document.querySelector('[role="status"]');
    expect(el.style.borderLeftColor || el.style.borderLeft).toContain('var(--mine-color-danger)');
  });
  it('applies success border for success type', () => {
    toast('Done', { type: 'success' });
    const el = document.querySelector('[role="status"]');
    expect(el.style.borderLeftColor || el.style.borderLeft).toContain('var(--mine-color-success)');
  });
  it('renders an action button when action option is provided', () => {
    const fn = vi.fn();
    toast('Deleted', { action: { label: 'Undo', fn } });
    const buttons = document.querySelectorAll('[role="status"] button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toBe('Undo');
  });
  it('calls action.fn when action button is clicked', () => {
    const fn = vi.fn();
    toast('Deleted', { action: { label: 'Undo', fn } });
    document.querySelector('[role="status"] button').click();
    expect(fn).toHaveBeenCalledOnce();
  });
  it('stacks multiple toasts', () => {
    toast('First'); toast('Second'); toast('Third');
    expect(document.querySelectorAll('[role="status"]').length).toBe(3);
  });
  it('does not auto-dismiss when duration is 0', () => {
    vi.useFakeTimers();
    toast('Sticky', { duration: 0 });
    vi.advanceTimersByTime(10000);
    expect(document.querySelector('[role="status"]')).not.toBeNull();
  });
  it('auto-dismisses after the specified duration', () => {
    vi.useFakeTimers();
    toast('Short lived', { duration: 2000 });
    const el = document.querySelector('[role="status"]');
    vi.advanceTimersByTime(2000);
    el.dispatchEvent(new Event('transitionend'));
    expect(document.querySelector('[role="status"]')).toBeNull();
  });
  it('close button dismisses the toast', () => {
    toast('Close me');
    const el = document.querySelector('[role="status"]');
    el.querySelector('button[aria-label="Dismiss"]').click();
    el.dispatchEvent(new Event('transitionend'));
    expect(document.querySelector('[role="status"]')).toBeNull();
  });
  it('Escape dismisses only the most recent toast', () => {
    toast('First', { duration: 0 }); toast('Second', { duration: 0 });
    const els = document.querySelectorAll('[role="status"]');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    els[1].dispatchEvent(new Event('transitionend'));
    expect(document.querySelectorAll('[role="status"]').length).toBe(1);
    expect(document.querySelector('[role="status"]').textContent).toContain('First');
  });
  it('host container has no aria-live attribute', () => {
    toast('Check aria');
    const hostEl = document.querySelector('[role="status"]').parentElement;
    expect(hostEl.getAttribute('aria-live')).toBeNull();
  });
  it('re-creates host when previous host was removed from DOM', () => {
    toast('First toast');
    document.body.innerHTML = '';
    toast('Second toast');
    expect(document.querySelector('[role="status"]').textContent).toContain('Second toast');
  });
});
