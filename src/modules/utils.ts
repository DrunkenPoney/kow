export type RecursiveArray<T> = Array<T | RecursiveArray<T>>
export type RecursiveArrayInfer<T> = T extends RecursiveArray<infer I> ? I : never

export function flatten<T>(...arrays: RecursiveArray<T>): Array<T>  {
  return arrays.flatMap((value) => {
    return Array.isArray(value)
      ? flatten(...value)
      : value
  })
}


export function joinPaths(...paths: RecursiveArray<string>): string {
  return flatten(...paths).reduce((a,b) =>
    String(a).replace(/\/?$/, '/') + String(b).replace(/^\//, ''))
}