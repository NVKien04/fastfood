export interface filterObj {
  fillter: any;
  page: number;
  limit: number;
  orderby: string;
  excludeExistsIn?: { table: string; foreignKey: string };
}
