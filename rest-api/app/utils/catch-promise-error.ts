import { Document, DocumentQuery } from 'mongoose';

export async function catchPromiseError<T, U extends Document>(
  promise: Promise<T> | DocumentQuery<T, U>
): Promise<[Error, undefined] | [undefined, T]> {
  try {
    return [undefined, await promise];
  } catch (e) {
    return [e, undefined];
  }
}
