# undo-redo

An unopinionated undo/redo engine implemented in Typescript.

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
