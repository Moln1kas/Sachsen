import { exists, mkdir } from "@tauri-apps/plugin-fs";
import { ResourceEntry } from "./manifest.launcher";
import { download } from "@tauri-apps/plugin-upload";

// export async function verifyHash(filePath: string, expectedHash?: string): Promise<boolean> {
//   if (!expectedHash) return true;
//   const data = await readFile(filePath);
//   const hash = createHash("sha1").update(data).digest("hex");
//   return hash === expectedHash;
// }

export const ensureDir = async (path: string, recursive?: boolean) => {
  if (!(await exists(path))) {
    await mkdir(path, { recursive });
  } else {
    console.log(`${path} уже существует, пропуск`);
  }
}

export const handleDownload = async (entry: ResourceEntry): Promise<void> => {
  const { url, destPath } = entry;

  let needDownload = !(await exists(destPath));

  // if (!needDownload) {
  //   const isValid = await verifyHash(destPath, hash);
  //   if (!isValid) {
  //     console.warn(`${destPath} повреждён — перекачиваем`);
  //     needDownload = true;
  //   } else {
  //     console.log(`${destPath} уже существует и корректен, пропуск`);
  //   }
  // }

  if (needDownload) {
    const maxRetries = 3;
    let attempt = 0;
    let success = false;
    let error: unknown;

    while (attempt < maxRetries && !success) {
      attempt++;

      try {
        await download(url, destPath);
        success = true;

        console.log(`${entry.destPath} загружен.`);
      } catch(err) {
        console.warn(`Ошибка при загрузке (${attempt}/${maxRetries}):`, err);
        error = err;
      }
    }

    if (!success) {
      throw new Error(`Не удалось загрузить ${destPath} после ${maxRetries} попыток: ${error}`);
    }

    // const isValid = await verifyHash(destPath, hash);
    // if (!isValid) throw new Error(`Хэш-сумма ${destPath} не совпадает!`);
  }
}