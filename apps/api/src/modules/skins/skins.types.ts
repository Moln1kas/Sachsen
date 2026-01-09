export type SkinModel = 'default' | 'slim';

export interface SkinApiResponse {
  username: string;
  textures?: Record<SkinModel | 'cape' | 'elytra', string>;
  skin?: string;
  cape?: string | null;
  elytra?: string | null;
}
