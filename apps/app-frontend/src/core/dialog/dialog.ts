import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { once } from '@tauri-apps/api/event';
import type { AlertDialogPayload, BaseDialogPayload, ConfirmDialogPayload, PromptDialogPayload } from './types';

interface DialogWindowOptions {
  width?: number;
  height?: number;
}

const openDialog = <T, P extends BaseDialogPayload>(
  payload: Omit<P, 'id'>,
  options: DialogWindowOptions = {}
): Promise<T> => {

  return new Promise((resolve) => {
    const id = crypto.randomUUID();
    const label = `dialog-${id}`;

    const win = new WebviewWindow(label, {
      url: `dialog.html?id=${id}`,
      title: payload.title,
      width: options.width ?? 450,
      height: options.height ?? 220,
      center: true,
      alwaysOnTop: true,
      decorations: false,
      resizable: false,
    });

    win.once('tauri://error', () => resolve(null as T));

  once(`dialog-ready-${id}`, () => {
    win.emit(`dialog-data-${id}`, { ...payload, id });
  });

    once(`dialog-response-${id}`, (e) => {
      resolve(e.payload as T);
      win.close();
    });
  });
}


export const confirmDialog = (
  title: string,
  message: string,
  options?: DialogWindowOptions
): Promise<boolean> => {
  return openDialog<boolean, ConfirmDialogPayload>(
    {
      type: 'confirm',
      title,
      message,
    },
    options
  );
}

export const alertDialog = (
  title: string,
  message: string,
  options?: DialogWindowOptions
): Promise<boolean> => {
  return openDialog<boolean, AlertDialogPayload>(
    {
      type: 'alert',
      title,
      message,
    },
    options
  );
}

export const promptDialog = (
  title: string,
  message: string,
  placeholder: string,
  options?: DialogWindowOptions
): Promise<string> => {
  return openDialog<string, PromptDialogPayload>(
    {
      type: 'prompt',
      title,
      message,
      placeholder,
    },
    options
  );
}
