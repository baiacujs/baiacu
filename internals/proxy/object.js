import { INSTANCE, ATTRIBUTE } from '../core/types';

export default (middleware) => {
  if (!middleware) {
    throw new Error('missing `middleware`');
  }

  return {
    construct(target, args) {
      if (!Array.isArray(middleware)) {
        throw new TypeError('Middleware stack must be an array!')
      }

      // let instance = target.prototype.apply(args); // TODO! use some sort of `apply`
      // let instance = target.prototype.constructor.apply(target, args);

      // let instance = Object.create(target.prototype);
      // instance = target.apply(instance, args);

      let instance = Reflect.construct(target, args);

      debugger;
      for (const transmutter of middleware) {
        // if (typeof transmutter !== 'function') { // TODO! check if instanceof Transmutter/Middleware
        //   throw new TypeError('Middleware must be composed of functions!')
        // }

        const method = transmutter[INSTANCE];

        if (typeof method !== 'function') {
          continue;
        }

        instance = method(target, args, instance);
      }

      // return this.get(target, 'constructor', instance);
      return instance;
    },
    get(target, property, receiver) {
      if (!Array.isArray(middleware)) {
        throw new TypeError('Middleware stack must be an array!')
      }
      if (property === 'prototype') debugger;

      let response = Reflect.get(target, property, receiver);
      // if (type === 'class') {
      //   console.log({target});
      //   console.log({property});
      //   console.log({response});
      //   console.log({manual: target[property]});
      //   if(response !== target[property]) {
      //     throw new Error(123)
      //   }
      //   console.log('________________');
      // }

      for (const transmutter of middleware) {
        // if (typeof transmutter !== 'function') { // TODO! check for instance of Transmutter/Middleware
        //   throw new TypeError('Middleware must be composed of functions!')
        // }

        const method = transmutter[ATTRIBUTE];
        if (typeof method !== 'function') {
          continue;
        }

        // resolve(original, { field }, context, info)
        // transmutter[type](target, refined, query, context);
        response = method(target, property, response);
      }

      return response;
    },
    // apply() {
    //   debugger
    //   console.log({apply: arguments});
    // },
    // set() {
    //   debugger
    //   console.log({set: arguments});
    // }
  }
};
