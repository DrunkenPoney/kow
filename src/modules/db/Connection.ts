import { joinPaths, RecursiveArray } from '@/modules/utils'
import { Collection, ICollection } from '@/modules/db/Collection'

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface IConnection {
  readonly baseUrl: string
  get(path: string | RecursiveArray<string>): Promise<any>
  post<T>(path: string | RecursiveArray<string>, body: T): Promise<any> // TODO change return type
  put<T>(path: string | RecursiveArray<string>, body: T): Promise<any> // TODO change return type
  del<T>(path: string | RecursiveArray<string>, body?: T): Promise<any> // TODO change return type
  patch<T>(path: string | RecursiveArray<string>, body: T): Promise<any> // TODO change return type
  collection<T>(name: string): ICollection<T>
}

export class Connection implements IConnection {
  private readonly _apiKey: string
  private readonly _dbKey: string
  
  constructor(apiKey: string, dbKey: string) {
    this._apiKey = apiKey
    this._dbKey  = dbKey
  }
  
  get baseUrl(): string { return `https://${this._dbKey}.restdb.io/rest/` }
  
  private _path(...paths: RecursiveArray<string>): string {
    let path = joinPaths(...paths)
    if (!path.startsWith('https://'))
      path = joinPaths(this.baseUrl, path)
    return path
  }
  
  protected async fetch<T>(paths: string | RecursiveArray<string> = [], method: RequestMethod, body?: any): Promise<T> {
    const resp = await fetch(this._path(paths), {
      method,
      mode: 'cors',
      headers: {
        'content-type': 'application/json',
        'x-apikey': this._apiKey,
        'cache-control': 'no-cache',
      },
      body: typeof body === 'string' ? body
        : body != null ? JSON.stringify(body)
          : undefined,
    })
    return await resp.json()
  }
  
  get<T>(path: string | RecursiveArray<string> = []) {
    return this.fetch<T>(path, 'GET')
  }
  
  post<T>(path: string | RecursiveArray<string> = [], body: any) {
    return this.fetch<T>(path, 'POST', body)
  }
  
  put<T>(path: string | RecursiveArray<string> = [], body: any) {
    return this.fetch<T>(path, 'PUT', body)
  }
  
  del<T>(path: string | RecursiveArray<string> = [], body?: any) {
    return this.fetch<T>(path, 'DELETE', body)
  }
  
  patch<T>(path: string | RecursiveArray<string> = [], body: any) {
    return this.fetch<T>(path, 'PATCH', body)
  }
  
  collection<T>(name: string): ICollection<T> {
    return new Collection(name, this)
  }
}

