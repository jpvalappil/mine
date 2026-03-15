export interface ToastOptions {
  type?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
  action?: { label: string; fn: () => void; };
}
export interface ToastHandle {
  dismiss: () => void;
}
export declare function toast(message: string, options?: ToastOptions): ToastHandle;
export declare function destroy(): void;
