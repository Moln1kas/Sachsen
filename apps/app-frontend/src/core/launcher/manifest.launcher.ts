import { platform } from "@tauri-apps/plugin-os";

export type ResourceEntry = {
  url: string;
  destPath: string;
  hash?: string;
  type: 'client' | 'library' | 'asset' | 'index' | 'java' | 'fabric' | 'mod';
};

export const buildManifestFromMetadata = async (
  metadata: any,
  fabric_metadata: any[],
  mod_list: any[],
  appDataDir: string
): Promise<ResourceEntry[]> => {
  const res: ResourceEntry[] = [];

  // --- java ---
  const OS = await platform();
  const JAVA_URL = `https://api.adoptium.net/v3/binary/latest/17/ga/${OS}/x64/jdk/hotspot/normal/eclipse`;
  const JAVA_DIR_NAME = "java";
  const JAVA_ARCHIVE_NAME = OS === "windows" ? `${JAVA_DIR_NAME}.zip` : `${JAVA_DIR_NAME}.tar.gz`;

  res.push({
    url: JAVA_URL,
    destPath: `${appDataDir}/${JAVA_DIR_NAME}/${JAVA_ARCHIVE_NAME}`,
    type: "java",
  });

  // --- fabric ---
  for (const version of fabric_metadata) {
    if (version.stable) {
      res.push({
        url: version.url,
        destPath: `${appDataDir}/minecraft/fabric-installer.jar`,
        type: "fabric",
      });
      break;
    }
  }

  // --- mods ---
  mod_list.forEach((mod: any) => {
    if (mod) {
      res.push({
        url: mod.downloadUrl,
        destPath: `${appDataDir}/minecraft/mods/${mod.name}.jar`,
        type: "mod",
      });
    }
  });

  // --- client ---
  if (metadata.downloads?.client) {
    res.push({
      url: metadata.downloads.client.url,
      destPath: `${appDataDir}/minecraft/versions/client.jar`,
      hash: metadata.downloads.client.sha1,
      type: "client",
    });
  }

  // --- libraries ---
  metadata.libraries?.forEach((lib: any) => {
    if (lib.downloads?.artifact) {
      res.push({
        url: lib.downloads.artifact.url,
        destPath: `${appDataDir}/minecraft/libraries/${lib.downloads.artifact.path}`,
        hash: lib.downloads.artifact.sha1,
        type: "library",
      });
    }
  });

  // --- asset index ---
  if (metadata.assetIndex) {
    const assetIndexUrl = metadata.assetIndex.url;
    res.push({
      url: assetIndexUrl,
      destPath: `${appDataDir}/minecraft/assets/indexes/${metadata.assetIndex.id}.json`,
      hash: metadata.assetIndex.sha1,
      type: "index",
    });

    const assetIndexData = await fetch(assetIndexUrl).then((r) => r.json());

    if (assetIndexData?.objects) {
      for (const [_, obj] of Object.entries<any>(assetIndexData.objects)) {
        const hash = obj.hash;
        const subDir = hash.substring(0, 2);
        res.push({
          url: `https://resources.download.minecraft.net/${subDir}/${hash}`,
          destPath: `${appDataDir}/minecraft/assets/objects/${subDir}/${hash}`,
          hash,
          type: "asset",
        });
      }
    }
  }

  return res;
};
