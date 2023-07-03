import {Action, ActionItem} from './ActionItem';
import UndoRedo from './UndoRedo';
/**
 * CareTaker class accepts add, update, and delete on generic type 'I',
 * while providing undo and redo functions and maintaining integrity of undo
 * and redo stacks.
 */
class CareTaker<I> {
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
   * @param predicateFn Used to match elements
   * @param compareFn Used to sort (optional)
   */
  constructor(
    predicateFn: (e:I, a:ActionItem<I>) => boolean,
    compareFn?: (a:I, b:I) => number) {
    this.predicateFn = predicateFn;
    this.compareFn = compareFn;
  }

  /**
   * Sorts the list, if comparator function was provided.
   * @param list the list to sort using the compare function
   */
  #sort (list: Array<I>) {
    if (this.compareFn !== undefined) {
      list.sort(this.compareFn);
    }
  }

  /**
   * Adds a new item and pushes it to the undo stack.
   * @param list the list to operate add upon
   * @param item New item to add
   */
  add (list: Array<I>, item: I) {
    list.push(item);
    this.#sort(list);
    this.undoRedo.pushUndo({action: Action.Add, item: item});
  }

  /**
   * Updates (overrides) an item if found via predicate function
   * and pushes it to the undo stack.
   * @param list the list to operate update upon
   * @param item Item to update
   */
  update (list: Array<I>, item: I) {
    const it: I | undefined = list.find(elt => this.predicateFn(elt, {item: item}));
    if (it !== undefined) {
      this.undoRedo.pushUndo({action: Action.Update, item: it});
      const ix: number = list.indexOf(it);
      list[ix] = item;
      this.#sort(list);
    }
  }

  /**
   * Deletes an item present in the list and pushes it to the undo stack.
   * @param list the list to operate delete upon
   * @param item The item to remove from the list
   */
  delete(list: Array<I>, item: I) {
    const ix: number = list.findIndex(elt => this.predicateFn(elt, {item: item}));
    if (ix > -1) {
      list.splice(ix, 1);
      this.undoRedo.pushUndo({action: Action.Delete, item: item});
    }
  }

  /**
   * Pops one action-item from the undo stack and undo its action
   * while pushing the action-item into the redo stack.
   * @param list the list to operate undo upon
   */
  undo (list: Array<I>) {
    const actionItem: ActionItem<I> | undefined = this.undoRedo.popUndo();
    if (actionItem) {
      switch (actionItem.action) {
        case Action.Add: {
          const ix: number = list.indexOf(actionItem.item);
          list.splice(ix, 1);
          this.undoRedo.pushRedo(actionItem);
        }
        break;
        case Action.Update: {
          const ix: number = list.findIndex(elt => this.predicateFn(elt, actionItem));
          if (ix > -1) {
            const item: I = JSON.parse(JSON.stringify(list[ix]));
            list[ix] = actionItem.item;
            this.#sort(list);
            actionItem.item = item;
            this.undoRedo.pushRedo(actionItem);
          }
        }
        break;
        case Action.Delete: {
          list.push(actionItem.item);
          this.#sort(list);
          this.undoRedo.pushRedo(actionItem);
        }
        break;
      }
    }
  }

  /**
   * @returns true if the undo stack is empty
   */
  isUndoEmpty() {
    return this.undoRedo.isUndoEmpty();
  }

  /**
   * Pops one action-item from the redo stack and re-does its action
   * while pushing the current action-item into the undo stack
   * @param list the list to operate redo upon
   */
  redo (list: Array<I>) {
    const actionItem: ActionItem<I> | undefined = this.undoRedo.popRedo();
    if (actionItem) {
      switch (actionItem.action) {
        case Action.Add: {
          list.push(actionItem.item);
          this.#sort(list);
          this.undoRedo.pushUndo(actionItem);
        }
        break;
        case Action.Update: {
          const ix: number = list.findIndex(elt => this.predicateFn(elt, actionItem));
          if (ix > -1) {
            const item: I = JSON.parse(JSON.stringify(list[ix]));
            list[ix] = actionItem.item;
            this.#sort(list);
            actionItem.item = item;
            this.undoRedo.pushUndo(actionItem);
          }
        }
        break;
        case Action.Delete: {
          const ix: number = list.indexOf(actionItem.item);
          list.splice(ix, 1);
          this.undoRedo.pushUndo(actionItem);
        }
      }
    }
  }

  /**
   * @returns true if the redo stack is empty
   */
  isRedoEmpty() {
    return this.undoRedo.isRedoEmpty();
  }

}

export default CareTaker;