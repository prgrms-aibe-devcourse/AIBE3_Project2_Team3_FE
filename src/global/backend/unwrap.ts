export function unwrap<T>(r: { data?: T; error?: unknown }) {
  if (r.error) throw r.error;
  return r.data as T;
}
