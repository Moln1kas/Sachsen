export default interface Asset {
  hash: string;
  size: number;
}

export interface AssetsIndex {
  objects: {
    [path: string]: Asset;
  };
}