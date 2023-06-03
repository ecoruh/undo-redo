/**
 * An Action represents an operation undo-able and re-doable.
 */
export enum Action   {
  Add,
  Update,
  Delete
}

/**
 * An ActionItem holds the value of 'I' in 'item',
 * and the action that generated it.
 */
export interface ActionItem<I> {
  action?: Action,
  item: I
}

