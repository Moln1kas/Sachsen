export type DialogType =
  | 'confirm'
  | 'alert'
  | 'prompt'
  | 'form'
  ;

export interface BaseDialogPayload {
  id: string;
  type: DialogType;
  title: string;
  message: string;
}

export type FormDialogField = { key: string; placeholder: string };

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

export interface FormDialogPayload extends BaseDialogPayload {
  type: 'form';
  fields: FormDialogField[];
}

export type DialogPayload =
  | ConfirmDialogPayload
  | AlertDialogPayload
  | PromptDialogPayload
  | FormDialogPayload;
