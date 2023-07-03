# undo-redo

An undo/redo engine implemented in Typescript.

Imagine you have the following data structure.

```javascript
export interface Item {
  index: number;
  name: string;
  value: string;
}
```

The structure holds a simple Item with a unique id `index`, a `name`, and a `value`.

Thus an array can hold objects of this type as follows.

```javascript
const list: Array<Item> = new Array<Item>;
```

Constraints:

- When the list is presented typically it is sorted in alphabetical (ascending) order by the `name` field.
- When you match the item with another one, their `index` field must have the same value.

Requirements:

- It must be possible to add, update, or delete items with a simple operation, as a result of which the previous value and the operation are pushed to an undo stack.
- Each operation can be undone with a simple operation, provided that the undo stack is not empty.
- An undo operation will push the current value and the operation to a redo stack.
- Each operation can be redone with a simple operation, provided that the redo stack is not empty.
- A redo operation will push the current value and the operation to the undo stack.

To run the demo

```bash
npm start
```

You have a pre-populated (optionally sorted) list:

```javascript
const list: Array<Item> = new Array<Item>;

list.push({index: 1, name: 'fred', value: 'dancer'});
list.push({index: 2, name: 'arnold', value: 'actor'});
list.push({index: 3, name: 'jack', value: 'ripper'});
list.push({index: 4, name: 'tinker', value: 'soldier'});
list.push({index: 5, name: 'boris', value: 'politician'});

list.sort((a, b) => { return a.name.localeCompare(b.name) });
```

Configure your `CareTaker` object as follows.

```javascript
/**
 * Optional comperator for sort order.
 * @param a First element to compare
 * @param b Second element to compare
 * @returns -1 (lt) 0 (eq) 1 (gt)
 */
const compareFn = (a: Item,b: Item) => a.name.localeCompare(b.name);

/**
 * Predicate used to match a primary element that exists in the list
 * and an ActionItem that holds a buffered element.
 * @param e Primary element to match the item in the ActionItem
 * @param a An ActionItem that holds an item to match the primary element
 * @returns true when elements match, false otherwise
 */
const predicateFn = (e: Item, a:ActionItem<Item>) => (e.name === a.item.name);

/**
 * CareTaker class accepts add, update, and delete on generic type 'I',
 * while providing undo and redo functions and maintaining integrity of undo
 * and redo stacks.
 */
const ct: CareTaker<Item> = new CareTaker<Item>(list, predicateFn, compareFn);
```

Manipulate the list, while ability to undo or redo at will.

```javascript
ct.add({index: 6, name: 'aram', value: 'composer'});
ct.update(list[3], {index: 3, name: 'fred', value: 'accountant'});
ct.delete(list[4]);
ct.undo(); // undo delete
ct.undo(); // undo update
ct.redo(); // redo update
```
