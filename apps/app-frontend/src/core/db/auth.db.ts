import db from ".";

export const setTokens = async (access: string, refresh: string) => {
  await db.execute(
    'INSERT OR REPLACE INTO auth (id, access_token, refresh_token) VALUES (1, ?, ?)',
    [access, refresh]
  );
};

export const getTokens = async (): Promise<{ access_token: string; refresh_token: string }> => {
  const res = await db.select('SELECT access_token, refresh_token FROM auth WHERE id = 1');
  if (!Array.isArray(res) || res.length === 0) {
    throw new Error("Токены не найдены в базе");
  }

  const tokens = res[0] as { access_token: string; refresh_token: string };
  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error("Токены повреждены");
  }

  return tokens;
};

export const clearTokens = async () => {
  await db.execute('DELETE FROM auth WHERE id = 1');
};
