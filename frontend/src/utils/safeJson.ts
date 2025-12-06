export const safeJson = async (res: Response) => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn('safeJson: failed to parse response as JSON', e);
    return null;
  }
};
