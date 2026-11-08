// IN-LAB TASK (AI closed). Do this in the lab, not at home.
//
// retry(task, attempts, delayMs)
//   task      a function returning a promise (e.g. () => fetchCourses({}))
//   attempts  how many times to try in total (at least 1)
//   delayMs   how long to wait between attempts
// Resolve with the first successful result. If every attempt fails, reject
// with the LAST error. Don't wait after the final failure.
// Stretch: double the delay after each failure (exponential backoff), when
// called as retry(task, attempts, delayMs, { backoff: true }).
import { wait } from "../src/s03-async.js";

export async function retry(task, attempts, delayMs, { backoff = false } = {}) {
  let delay = delayMs;

  for (let i = 1; i <= attempts; i++) {
    try {
      return await task();
    } catch (error) {
      // If this was the last attempt, reject with the last error
      if (i === attempts) {
        throw error;
      }

      // Wait before the next attempt
      await wait(delay);

      // Double the delay if exponential backoff is enabled
      if (backoff) {
        delay *= 2;
      }
    }
  }
}