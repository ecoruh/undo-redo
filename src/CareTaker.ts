import {Item, Action, ActionItem} from './Item';
import UndoRedo from './UndoRedo';
class CareTaker {
  undoRedo: UndoRedo = new UndoRedo();
  list: Array<Item>;

  constructor(aList: Array<Item>) {
    this.list = aList;
  }
  add(item: Item) {
    this.list.push(item);
    this.list.sort((a, b) => { return a.n.localeCompare(b.n) });
    this.undoRedo.pushUndo({action: Action.Add, item: item});
  }

  update(item: Item, value: string) {
    this.undoRedo.pushUndo({action: Action.Update, item: item});
    const ix: number | undefined = this.list.indexOf(item);
    if (ix !== undefined) {
      const elt: Item = JSON.parse(JSON.stringify(item));
      elt.v = value;
      this.list[ix] = elt;
    }
  }

  delete(item: Item) {
    this.undoRedo.pushUndo({action: Action.Delete, item: item});
    const ix: number | undefined = this.list.indexOf(item);
    delete this.list[ix];
  }

  undo() {
    const actionItem: ActionItem | undefined = this.undoRedo.popUndo();
    if (actionItem) {
      switch (actionItem.action) {
        case Action.Add: {
          const ix: number | undefined = this.list.indexOf(actionItem.item);
          delete this.list[ix];
          this.undoRedo.pushRedo(actionItem);
        }
        break;
        case Action.Update: {
          const item: Item | undefined = this.list.find(elt => elt.n === actionItem.item.n);
          if (item !== undefined) {
            const ix: number = this.list.indexOf(item);
            this.list[ix] = actionItem.item;
            this.undoRedo.pushRedo(actionItem);
          }
        }
        break;
        case Action.Delete: {
          const ix: number | undefined = this.list.indexOf(actionItem.item);
          this.list.push(actionItem.item);
          this.list.sort((a, b) => { return a.n.localeCompare(b.n) });
          this.undoRedo.pushRedo(actionItem);
        }
        break;
      }
    }
  }

  redo() {
    const actionItem: ActionItem | undefined = this.undoRedo.popRedo();
    if (actionItem) {
      switch (actionItem.action) {
        case Action.Add: {
          const ix: number | undefined = this.list.indexOf(actionItem.item);
          this.list.push(actionItem.item);
          this.list.sort((a, b) => { return a.n.localeCompare(b.n) });
          this.undoRedo.pushUndo(actionItem);
        }
        break;
        case Action.Update: {
          const item: Item | undefined = this.list.find(element => element.n === actionItem.item.n);
          if (item) {
            const ix: number | undefined = this.list.indexOf(item);
            this.list[ix].v = actionItem.item.v;
            this.undoRedo.pushUndo(actionItem);
          }
        }
        break;
        case Action.Delete: {
          const ix: number | undefined = this.list.indexOf(actionItem.item);
          if (ix !== undefined) {
            delete this.list[ix];
            this.undoRedo.pushUndo(actionItem);
          }
        }
      }
    }
  }
}

export default CareTaker;