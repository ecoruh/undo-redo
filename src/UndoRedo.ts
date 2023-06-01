import {ActionItem} from  './Item';
class UndoRedo {
  undoStack: Array<ActionItem> = new Array<ActionItem>;
  redoStack: Array<ActionItem> = new Array<ActionItem>;

  pushUndo(item: ActionItem) {
    this.undoStack.push(item);
  }

  popUndo(): ActionItem | undefined {
    return this.undoStack.pop();
  }

  pushRedo(item: ActionItem) {
    this.redoStack.push(item);
  }

  popRedo(): ActionItem | undefined {
    return this.redoStack.pop();
  }
}

export default UndoRedo;