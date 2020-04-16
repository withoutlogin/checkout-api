import { MonoTypeOperatorFunction } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export function sequentialQueueOfAsync<T>(
  asyncJob: (jobArg: T) => Promise<void>,
): MonoTypeOperatorFunction<T> {
  return mergeMap(async (jobArg: T) => {
    await asyncJob(jobArg);
    return jobArg;
  }, 1);
}
