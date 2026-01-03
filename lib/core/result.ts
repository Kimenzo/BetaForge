// ============================================================================
// Result Type - Functional Error Handling
// ============================================================================
// Inspired by Rust's Result<T, E> and fp-ts Either
// Eliminates try-catch spaghetti and provides type-safe error handling
//
// Usage:
//   const result = await userService.findById(id);
//   if (result.isErr()) {
//     return handleError(result.error);
//   }
//   const user = result.value;
// ============================================================================

/**
 * Success result containing a value
 */
export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
  isOk(): this is Ok<T>;
  isErr(): this is Err<never>;
  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  map<U>(fn: (value: T) => U): Result<U, never>;
  mapErr<F>(fn: (error: never) => F): Result<T, F>;
  andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, F>;
}

/**
 * Error result containing an error
 */
export interface Err<E> {
  readonly ok: false;
  readonly error: E;
  isOk(): this is Ok<never>;
  isErr(): this is Err<E>;
  unwrap(): never;
  unwrapOr<T>(defaultValue: T): T;
  map<U>(fn: (value: never) => U): Result<U, E>;
  mapErr<F>(fn: (error: E) => F): Result<never, F>;
  andThen<U, F>(fn: (value: never) => Result<U, F>): Result<never, E>;
}

/**
 * Result type - either Ok<T> or Err<E>
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Create a success result
 */
export function ok<T>(value: T): Ok<T> {
  return {
    ok: true,
    value,
    isOk: () => true,
    isErr: () => false,
    unwrap: () => value,
    unwrapOr: () => value,
    map: <U>(fn: (v: T) => U) => ok(fn(value)),
    mapErr: () => ok(value) as unknown as Result<T, never>,
    andThen: <U, F>(fn: (v: T) => Result<U, F>) => fn(value),
  };
}

/**
 * Create an error result
 */
export function err<E>(error: E): Err<E> {
  return {
    ok: false,
    error,
    isOk: () => false,
    isErr: () => true,
    unwrap: () => {
      throw error;
    },
    unwrapOr: <T>(defaultValue: T) => defaultValue,
    map: () => err(error) as unknown as Result<never, E>,
    mapErr: <F>(fn: (e: E) => F) => err(fn(error)),
    andThen: () => err(error) as unknown as Result<never, E>,
  };
}

/**
 * Wrap a promise in a Result, catching any thrown errors
 */
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
  errorMapper?: (error: unknown) => E
): Promise<Result<T, E>> {
  try {
    const value = await promise;
    return ok(value);
  } catch (error) {
    if (errorMapper) {
      return err(errorMapper(error));
    }
    return err(error as E);
  }
}

/**
 * Wrap a synchronous function in a Result
 */
export function tryCatchSync<T, E = Error>(
  fn: () => T,
  errorMapper?: (error: unknown) => E
): Result<T, E> {
  try {
    return ok(fn());
  } catch (error) {
    if (errorMapper) {
      return err(errorMapper(error));
    }
    return err(error as E);
  }
}

/**
 * Combine multiple Results into a single Result
 * If all are Ok, returns Ok with array of values
 * If any is Err, returns the first Err
 */
export function combine<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];
  for (const result of results) {
    if (result.isErr()) {
      return err(result.error);
    }
    values.push(result.value);
  }
  return ok(values);
}

/**
 * Execute results in sequence, stopping on first error
 */
export async function sequence<T, E>(
  fns: (() => Promise<Result<T, E>>)[]
): Promise<Result<T[], E>> {
  const values: T[] = [];
  for (const fn of fns) {
    const result = await fn();
    if (result.isErr()) {
      return err(result.error);
    }
    values.push(result.value);
  }
  return ok(values);
}
