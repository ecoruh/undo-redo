/**
 * UndoRedo holds undo and redo stacks in unison
 * They hold generic elements of 'A'.
 */
class UndoRedo<A> {
  undoStack: Array<A> = new Array<A>;
  redoStack: Array<A> = new Array<A>;

  pushUndo(actionItem: A) {
    this.undoStack.push(actionItem);
  }

  popUndo(): A | undefined {
    return this.undoStack.pop();
  }

  isUndoEmpty(): boolean {
    return this.undoStack.length === 0;
  }

  pushRedo(actionItem: A) {
    this.redoStack.push(actionItem);
  }

  popRedo(): A | undefined {
    return this.redoStack.pop();
  }

  isRedoEmpty(): boolean {
    return this.redoStack.length === 0;
  }
}

export default UndoRedo;