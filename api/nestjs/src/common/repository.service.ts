export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : T[P] | DeepPartial<T[P]>;
};

export interface RepositoryService<Model> {
  findById(id: number): Promise<Model>;
  findByIds(ids: number[]): Promise<Model[]>;
  findAll(): Promise<Model[]>;
  findByPage(
    page: number,
    limit: number,
    options?: FindOptions,
  ): Promise<Paginated<Model>>;
  findByOffset(
    offset: number,
    limit: number,
    options?: FindOptions,
  ): Promise<Paginated<Model>>;
  save<T extends DeepPartial<Model>>(model: T): Promise<T>;
  saveMany<T extends DeepPartial<Model>>(models: T[]): Promise<T[]>;
  deleteById(id: number): Promise<void>;
  deleteByIds(ids: number[]): Promise<void>;
}

export interface FindOptions {
  filter?: any;
  sort?: any;
}

export interface Paginated<Model> {
  items: Model[];
  total: number;
}
