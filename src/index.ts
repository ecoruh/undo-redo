import { ActionItem } from './ActionItem';
import CareTaker from './CareTaker';
import {Item} from './Item';

/**
 * Demonstrates how undo-redo works on a custom array.
 */

const list: Array<Item> = new Array<Item>;

list.push({index: 1, name: 'fred', value: 'dancer'});
list.push({index: 2, name: 'arnold', value: 'actor'});
list.push({index: 3, name: 'jack', value: 'ripper'});
list.push({index: 4, name: 'tinker', value: 'soldier'});
list.push({index: 5, name: 'boris', value: 'politician'});

list.sort((a, b) => { return a.name.localeCompare(b.name) });

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
const predicateFn = (e: Item, a:ActionItem<Item>) => (e.index === a.item.index);

/**
 * CareTaker class accepts add, update, and delete on generic type 'I',
 * while providing undo and redo functions and maintaining integrity of undo
 * and redo stacks.
 */
const ct: CareTaker<Item> = new CareTaker<Item>(predicateFn, compareFn);

const elt:Item = {index: 6, name: 'aram', value: 'composer'};
console.assert(!list.includes(elt), 'aram does not exist');
ct.add(list, elt);
console.assert(list.includes(elt), 'aram was added');

console.assert(list[3].value === 'dancer', 'fred is a dancer');
ct.update(list, {index: 1, name: 'fred', value: 'accountant'});
console.assert(list[3].value === 'accountant', 'fred became an accountant');

console.assert(list[4].name === 'jack', 'jack exists');
ct.delete(list, list[4]);
console.assert(list.findIndex(elt =>
  predicateFn(elt, { item: {index: 3, name: 'jack', value: 'ripper'}})) === -1,
  'jack was deleted');

ct.undo(list);
console.assert(list[4].name === 'jack', 'jack was restored');

ct.undo(list);
console.assert(list[3].value === 'dancer', 'fred is a dancer again');

ct.undo(list)
console.assert(!list.includes(elt), 'aram does not exist');

console.log(JSON.stringify(list,null,2));
console.log('-------------------------');
