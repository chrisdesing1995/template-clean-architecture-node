export interface ExecutionInterface {
  executeAsync<T>(
    title: string,
    startMessage: string,
    endMessage: string,
    errorMessage: string,
    action: () => Promise<T>,
    request?: unknown,
  ): Promise<T>;

  executeAsync(
    title: string,
    startMessage: string,
    endMessage: string,
    errorMessage: string,
    action: () => Promise<void>,
    request?: unknown,
  ): Promise<void>;
}
