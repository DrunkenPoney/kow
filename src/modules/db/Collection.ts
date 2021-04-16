import { Document, IDocument } from '@/modules/db/Document'
import { IConnection } from '@/modules/db/Connection'
import { joinPaths } from '@/modules/utils'

export interface ICollection<D> {
  readonly name: string
  readonly url: string
  readonly path: Array<string>
  add(document: D): Promise<any> // TODO change return type
  doc<T>(id: string): IDocument<this, T>
  list(): Promise<Array<D>>
}

export interface ISubCollection<Parent extends IDocument<any, any>, D> extends ICollection<D> {
  readonly parent: Parent
}

abstract class BaseCollection<D> implements ICollection<D> {
  private readonly conn: IConnection
  readonly name: string
  
  protected constructor(name: string, conn: IConnection) {
    this.conn = conn
    this.name = name
  }
  
  abstract get path(): Array<string>
  
  get url(): string { return joinPaths(this.conn.baseUrl, ...this.path) }
  
  add(document: D): Promise<any> {
    return this.conn.post(this.path, document)
  }
  
  doc<T>(id: string): IDocument<this, T> {
    return new Document(id, this, this.conn)
  }
  
  list(): Promise<Array<D>> {
    return this.conn.get(this.path)
  }
}

export class Collection<D> extends BaseCollection<D> implements ICollection<D> {
  constructor(name: string, conn: IConnection) { super(name, conn) }
  
  get path(): Array<string> { return [ this.name ] }
}

export class SubCollection<Parent extends IDocument<any, any>, D> extends BaseCollection<D> implements ISubCollection<Parent, D> {
  readonly parent: Parent
  
  constructor(name: string, parent: Parent, conn: IConnection) {
    super(name, conn)
    this.parent = parent
  }
  
  get path(): Array<string> {
    return this.parent.path.concat(this.name)
  }
}