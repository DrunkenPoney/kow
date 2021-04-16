import { ICollection, ISubCollection, SubCollection } from '@/modules/db/Collection'
import { IConnection } from '@/modules/db/Connection'
import { joinPaths } from '@/modules/utils'

export interface IDocument<Parent extends ICollection<any>, D> {
  readonly parent: Parent
  readonly id: string
  readonly url: string
  readonly path: Array<string>
  
  collection<T>(name: string): ISubCollection<this, T>
  update(document: D): Promise<any> // TODO change return type
  del(): Promise<any> // TODO change return type
  get(): Promise<D>
}

export class Document<P extends ICollection<any>, D = any> implements IDocument<P, D> {
  private readonly conn: IConnection
  readonly parent: P
  readonly id: string
  
  constructor(id: string, parent: P, conn: IConnection) {
    this.conn = conn
    this.parent = parent
    this.id = id
  }
  
  get url(): string { return joinPaths(this.conn.baseUrl, ...this.path) }
  
  get path(): Array<string> {
    return this.parent.path.concat(this.id)
  }
  
  collection<T>(name: string): ISubCollection<this, T> {
    return new SubCollection(name, this, this.conn)
  }
  
  update(document: D): Promise<any> {
    return this.conn.put(this.path, document)
  }
  
  del(): Promise<any> {
    return this.conn.del(this.path)
  }
  
  get(): Promise<D> {
    throw this.conn.get(this.path)
  }
  
}