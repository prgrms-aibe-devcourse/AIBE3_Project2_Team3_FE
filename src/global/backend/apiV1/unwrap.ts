export function unwrap<T>(r: { data?: T; error?: any }) {
  if (r.error) throw r.error;
  return r.data as T;
}
