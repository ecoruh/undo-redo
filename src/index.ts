import {Item} from './Item';
import CareTaker from './CareTaker';

const list: Array<Item> = new Array<Item>;

list.push({i: 1, n: 'hello', v: 'world'});
list.push({i: 2, n: 'ergun', v: 'nugre'});
list.push({i: 3, n: 'abra', v: 'cadabra'});
list.push({i: 4, n: 'nova', v: 'scotia'});
list.push({i: 5, n: 'eternal', v: 'rome'});

list.sort((a, b) => { return a.n.localeCompare(b.n) });

console.log(JSON.stringify(list,null,2));
console.log('-------------------------');

const ct: CareTaker = new CareTaker(list);

const elt:Item = {i: 2, n: 'aram', v: 'katchaturyan'};

ct.add(elt);
ct.update(list[2], 'coruh');
ct.delete(list[2]);

console.log(JSON.stringify(list,null,2));
console.log('-------------------------');

ct.undo();

console.log(JSON.stringify(list,null,2));
console.log('-------------------------');

ct.undo();

console.log(JSON.stringify(list,null,2));
console.log('-------------------------');

ct.undo();

console.log(JSON.stringify(list,null,2));
console.log('-------------------------');
