import {Action, ActionItem} from './ActionItem';
import UndoRedo from './UndoRedo';
/**
 * CareTaker class accepts add, update, and delete on generic type 'I',
 * while providing undo and redo functions and maintaining integrity of undo
 * and redo stacks.
 */
class CareTaker<I> {
  /**
   * External list passed.
   */
  list: Array<I>;
  /**
   * Undo and redo stacks.
   */
  undoRedo: UndoRedo<ActionItem<I>> = new UndoRedo<ActionItem<I>>();
  /**
   * Optional comperator for sort order.
   * returns: -1 (lt) 0 (eq) 1 (gt)
   */
  compareFn?: (a:I,b:I) => number;
  /**
   * Predicate used to match generic 'I' elements.
   * returns true when elements match
   * returns false when elements do not match
   */
  predicateFn: (e:I, a:ActionItem<I>) => boolean;

  /**
   * Constructor
   * @param aList An external list of generic 'I'.
   * @param predicateFn Used to match elements
   * @param compareFn Used to sort (optional)
   */
  constructor(
    aList: Array<I>,
    predicateFn: (e:I, a:ActionItem<I>) => boolean,
    compareFn?: (a:I, b:I) => number) {
    this.list = aList;
    this.predicateFn = predicateFn;
    this.compareFn = compareFn;
  }

  /**
   * Sorts the list, if comparator function was provided.
   */
  #handleSort () {
    if (this.compareFn !== undefined) {
      this.list.sort(this.compareFn);
    }
  }

  /**
   * Adds a new item and pushes it to the undo stack.
   * @param item New item to add
   */
  add(item: I) {
    this.list.push(item);
    this.#handleSort();
    this.undoRedo.pushUndo({action: Action.Add, item: item});
  }

  /**
   * Updates (overrides) an item if found via predicate function
   * and pushes it to the undo stack.
   * @param item Item to search
   * @param newItem New item to override item with
   */
  update(item: I, newItem: I) {
    const ix: number = this.list.findIndex(elt => this.predicateFn(elt, {item: newItem}));
    if (ix > -1) {
      this.undoRedo.pushUndo({action: Action.Update, item: item});
      this.list[ix] = newItem;
    }
  }

  /**
   * Deletes an item present in the list and pushes it to the undo stack.
   * @param item The item to remove from the list
   */
  delete(item: I) {
    const ix: number | undefined = this.list.indexOf(item);
    if (ix > -1) {
      this.list.splice(ix, 1);
      this.undoRedo.pushUndo({action: Action.Delete, item: item});
    }
  }

  /**
   * Pops one action-item from the undo stack and undo its action
   * while pushing the action-item into the redo stack.
   */
  undo() {
    const actionItem: ActionItem<I> | undefined = this.undoRedo.popUndo();
    if (actionItem) {
      switch (actionItem.action) {
        case Action.Add: {
          const ix: number = this.list.indexOf(actionItem.item);
          this.list.splice(ix, 1);
          this.undoRedo.pushRedo(actionItem);
        }
        break;
        case Action.Update: {
          const ix: number = this.list.findIndex(elt => this.predicateFn(elt, actionItem));
          if (ix > -1) {
            const item: I = JSON.parse(JSON.stringify(this.list[ix]));
            this.list[ix] = actionItem.item;
            actionItem.item = item;
            this.undoRedo.pushRedo(actionItem);
          }
        }
        break;
        case Action.Delete: {
          this.list.push(actionItem.item);
          this.#handleSort();
          this.undoRedo.pushRedo(actionItem);
        }
        break;
      }
    }
  }

 /**
   * Pops one action-item from the redo stack and re-does its action
   * while pushing the action-item into the undo stack.
   */
   redo() {
    const actionItem: ActionItem<I> | undefined = this.undoRedo.popRedo();
    if (actionItem) {
      switch (actionItem.action) {
        case Action.Add: {
          this.list.push(actionItem.item);
          this.#handleSort();
          this.undoRedo.pushUndo(actionItem);
        }
        break;
        case Action.Update: {
          const ix: number = this.list.findIndex(elt => this.predicateFn(elt, actionItem));
          if (ix > -1) {
            const item: I = JSON.parse(JSON.stringify(this.list[ix]));
            this.list[ix] = actionItem.item;
            actionItem.item = item;
            this.undoRedo.pushUndo(actionItem);
          }
        }
        break;
        case Action.Delete: {
          const ix: number = this.list.indexOf(actionItem.item);
          this.list.splice(ix, 1);
          this.undoRedo.pushUndo(actionItem);
        }
      }
    }
  }
}

export default CareTaker;