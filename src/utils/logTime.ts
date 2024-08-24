//
//

/**
 * Logs the time taken to execute a function
 * @param label The label to display in the console
 * @param cb The function to execute
 */
export async function logTime(label: string, cb: () => Promise<any>) {
  label = '\x1b[34m' + label + '\x1b[0m';
  console.time(label);

  await cb();

  console.timeEnd(label);
}
