import {post, submitp, form, get} from 'dom-helpers';
import Logic from './Logic'
import {setConfig} from './stateServer';

setConfig({
    url: 'http://stateserver.darbs.xyz:8065',
    accountId: 'lRZguvOjn9GfxkIhuUiekTPBxbPb8CaEzeg5GyRRXm1gE5J7'
})

let state = Logic();
//let state2 = Logic();

state.define({
    name: '',
    surname: '',
    department: {
        id: ''
    }
})

import throttle from './throttle';

window.setState = function(key, value){
    state.set(key, value);
}
window.dumpState = function(key, value){
    state.dump();
}


state.set('viewState', 'empty');


submitp('form', ev => {

    state.set('form', form(ev.target));

    state.set('viewState', 'loading');

    // Fetch data
    get('data.php', {action: 'invoices'})
        .then(data => {
            console.log(data)
            state.set('invoices', data)
            state.set('viewState', 'ready');
        })
})














// state.set('name', 'kaspars');
// state.set('department', {
//     id: 1,
//     caption: 'dep1',
//     owner: {
//         name: 'ownername',
//         surname: 'ownersurname'
//     },
//     invoices: [
//         {id:1, caption: 'invoice1'},
//         {id:2, caption: 'invoice2'},
//         {id:3, caption: 'invoice3'},
//         {id:4, caption: 'invoice4'},
//     ]
// });
// state2.set('surname', 'bulins');






// state.on('name', (name, surname) => console.log(name, surname))
// state.on('name?', 'surname?', (name, surname) => console.log(name, surname))
// state.on('surname?', 'name', (surname, name) => console.log(name, surname))
// state.on(['surname?', 'name'], data => console.log(data))
// state.on('name', (name, surname) => console.log(name, surname))


//state.set('name', 'kaspars');
//state.set('surname', 'bulins');


// state.on('name', 'surname', name => console.log('on name ', name))
// state.on(['name', 'surname'], data => console.log('on data ', data))
//state.on({'name', 'surname'}, data => console.log('on data ', data))


// state2.on('total', total => {
//     console.log('TOTAL', total)
// }).throttle(2000)

// console.time('dd')

// let a = 0;
// console.log('START');
// let g = setInterval(function(){
//     if (a >= 20000) {
//         clearInterval(g);
//         console.log('DONE');
//         //console.timeLog('dd')
//         // console.log('a', a);
//         // console.log('state a', state.get('total'));
//         return;
//     }

//     a++
//     state.set('total', a);
// }, 1)

// let finish = false;

// let t = throttle(function(a){
//     console.timeLog('dd', 'VALUE', a)
//     //console.log('VALUE', a);
//     if (finish) {
//         console.timeEnd('dd');
//     }
// }, 200, 10);

// let a = 0;

// console.time('dd');
// t(a);
// let g = setInterval(function(){
//     a++;

//     t(a);

//     //console.timeLog('dd');

//     if (a >= 200) {
//         clearInterval(g);
//         finish = true;
//     }
// }, 5)


// for (let i = 0; i < 1000000; i++) {
//     //tr(a);
//     state.set('total', i);
// }

//console.timeEnd('dd')
//console.log('total: ', state.get('total'));



//setTimeout(() => {
    // console.log('set listeners');
    // state.on('name?', 'surname?', (name, surname) => console.log('DELAYED', name, surname)).delay()
    // state.on('name?', 'surname?', (name, surname) => console.log('NOT delayed', name, surname))

    //state2.on('name?', 'surname?', (name, surname) => console.log('222 DELAYED', name, surname)).delay()
    //state2.on('name?', 'surname?', (name, surname) => console.log('222 NOT delayed', name, surname))
//}, 1000)


// state.set('name', 'kaspars');
// state.set('name', 'kaspars2');
// state.set('name', 'kaspars3');
// state.set('name', 'kaspars4');
// state.set('surname', 'bulins');


// console.log('STATE 2 get value ', state2.get('name'));