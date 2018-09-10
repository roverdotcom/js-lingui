/**
 * Make object callable by assigning it into prototype of callable.
 * This function must be in separate file, because Flow doesn't upport overwriting
 * __proto__ of Function
 */
export function makeCallableObject(object, callable) {
  callable.__proto__ = object
}
