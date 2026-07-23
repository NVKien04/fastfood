import { filterObj } from 'src/common/core/filterObj';
import { PaginationResponse } from 'src/common/core/paganation';
import { DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export interface IBaseRepository<T> {
  /**
   * Get all records of the entity.
   * * @param {FindOptionsWhere<T>} condition - The condition to find the record
   * @param {string[]} relations - Relations to include in the query
   * @param  {FindOptionsOrder<T>} order - Order to sort the records
   * @returns {Promise<T[]>} List of all records
   */
  findAll(condition?: FindOptionsWhere<T>, order?: FindOptionsOrder<T>, relations?: string[]): Promise<T[]>;

  /**
   * Find a record by condition.
   * @param {FindOptionsWhere<T>} condition - The condition to find the record
   * @param {string[]} relations - Relations to include in the query
   * @returns {Promise<T | null>} The record if found, otherwise null
   */
  findOne(condition: FindOptionsWhere<T>, relations?: string[]): Promise<T | null>;

  /**
   * Find a record by id.
   * @param {number | string} id - The record's id
   * @returns {Promise<T | null>} The record if found, otherwise null
   */
  findById(id: number | string): Promise<T | null>;

  /**
   * Create a new record.
   * @param {DeepPartial<T>} entity - Data for creating record
   * @returns {Promise<T>} The created record
   */
  create(entity: DeepPartial<T>, manager?: EntityManager): Promise<T>;

  /**
   * Update a record by id.
   * @param {number | string} id - The record's id
   * @param {DeepPartial<T>} entity - Data for updating record
   * @returns {Promise<T | null>} The updated record, or null if not found
   */
  update(id: number | string, entity: DeepPartial<T>, manager?: EntityManager): Promise<T | null>;

  /**
   * Soft delete a record by id.
   * @param {number | string} id - The record's id
   * @returns {Promise<{ message: string }>} true if deleted, false if not found
   */
  softDelete(id: number | string, manager?: EntityManager): Promise<{ message: string }>;

  /**
   * Delete a record by id.
   * @param {number | string} id - The record's id
   * @returns {Promise<{ message: string }>} Delete result message
   */
  delete(id: number | string, manager?: EntityManager): Promise<{ message: string }>;
  GetPage(filterObj: filterObj): Promise<PaginationResponse<any>>;
  createMany(entity: DeepPartial<T[]>, manager?: EntityManager): Promise<T[]>;
}
