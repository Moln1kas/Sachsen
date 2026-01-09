import { createHash } from 'crypto';

export const sha256 = (buffer: Buffer): string => {
  return createHash('sha256').update(buffer).digest('hex');
}

export const httpDate = (date: Date): string => {
  return date.toUTCString();
}

export const notModified = (
  ifModifiedSince: string | undefined,
  lastModified: Date,
): boolean => {
  if (!ifModifiedSince) return false;
  return new Date(ifModifiedSince).getTime() >= lastModified.getTime();
}
