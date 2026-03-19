export const formatLocalDate = (dateString?: string) => {
  const date = new Date(dateString || Date.now());
  return date.toLocaleString();
}