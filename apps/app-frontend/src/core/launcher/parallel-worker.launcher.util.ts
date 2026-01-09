export const runParallel = async <T>(
  items: T[],
  worker: (item: T) => Promise<void>,
  concurrency = 4,
): Promise<void> => {
  const queue = [...items];

  const workers = new Array(concurrency).fill(null).map(async () => {
    while (queue.length) {
      const item = queue.shift();
      if (!item) return;
      await worker(item);
    }
  });

  await Promise.all(workers);
}
