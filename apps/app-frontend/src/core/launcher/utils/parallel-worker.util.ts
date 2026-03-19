export const runParallel = async <T>(
  items: T[],
  worker: (item: T) => Promise<void>,
  concurrency = 5,
): Promise<void> => {
  const queue = [...items];
  let completed = 0;
  const total = items.length;

  const workers = new Array(concurrency).fill(null).map(async () => {
    while (queue.length > 0) {
      const item = queue.pop();
      if (!item) break;
      
      try {
        await worker(item);
        completed++;
        if (completed % 50 === 0) {
          console.log(`Progress: ${completed}/${total} files`);
        }
      } catch (e) {
        console.error("Parallel work error:", e);
      }
    }
  });

  await Promise.all(workers);
}