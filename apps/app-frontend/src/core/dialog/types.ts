export type DialogType =
  | 'confirm'
  | 'alert'
  | 'prompt'
  ;

export interface BaseDialogPayload {
  id: string;
  type: DialogType;
  title: string;
  message: string;
}

export interface ConfirmDialogPayload extends BaseDialogPayload {
  type: 'confirm';
}

export interface AlertDialogPayload extends BaseDialogPayload {
  type: 'alert';
}

export interface PromptDialogPayload extends BaseDialogPayload {
  type: 'prompt';
  placeholder: string;
}

export type DialogPayload =
  | ConfirmDialogPayload
  | AlertDialogPayload
  | PromptDialogPayload;
