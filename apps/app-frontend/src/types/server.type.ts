import Mod from "./mod.type";

export default interface Server {
  id: number;
  name: string;
  description: string;
  serverAddress: string;
  minecraftVersionHash: string;
  minecraftVersion: string;
  mods: Mod[];
}

export type NewServer = Pick<Server, 'name' | 'serverAddress' | 'description' | 'minecraftVersionHash' | 'minecraftVersion'>;