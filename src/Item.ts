/**
 * A simple Item with a unique id i, name n, and value v
 */
export interface Item {
  i: number;
  n: string;
  v: string;
}

export enum Action   {
  Add,
  Update,
  Delete
}

export interface ActionItem {
  action: Action,
  item: Item
}