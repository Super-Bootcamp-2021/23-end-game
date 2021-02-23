/**
 * resolve in some time
 * @param ms time in millisecond
 */
export function delay(ms: number): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, ms);
  });
}
