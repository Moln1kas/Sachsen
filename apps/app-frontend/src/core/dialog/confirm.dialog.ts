import { once } from '@tauri-apps/api/event';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

export const customConfirm = (
  title: string, 
  message: string, 
  width: number = 500, 
  height: number = 250
): Promise<boolean> => {
  return new Promise((resolve) => {
    const confirmWindow = new WebviewWindow(`confirm`, {
      url: '#/confirm',
      width,
      height,
      title,
      center: true,
      alwaysOnTop: true,
      decorations: false,
    });

    confirmWindow.once('tauri://error', (e) => {
      console.error('Error creating window', e);
      resolve(false);
    });

    confirmWindow.once('tauri://destroyed', () => {
      resolve(false);
    })

    once('dialog-ready', () => {
      confirmWindow.emit('dialog-data', { title, message });
    });

    once('dialog-response', (event) => {
      const result = event.payload as boolean;
      resolve(result);
      confirmWindow.close();
    });
  });
}
