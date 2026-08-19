export interface filterObj {
  fillter: Record<string, unknown>;
  page: number;
  limit: number;
  orderby: string;
  excludeExistsIn?: { table: string; foreignKey: string };
}
