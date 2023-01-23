// this is a module
'use strict'
/*
    it turns out, import is an async function, and therefore returns a Promise!!
    therefore, to ensure the contents of the module are immediately available
    after the import, we use await, which blocks the thread until the import promise resolves - ie loads!!
*/

let { render } = await import("./product-list.js") 

// let { products } = await import("./products.js")
// let { Product } = await import("./product.js") 
// let { shoppingCart } = await import("./shopping-cart.js") 

// let productList = {}

// document.addEventListener("DOMContentLoaded", () => {
$(document).ready(()  => {
    // i should probably send in the id's of the elements to be used as containers
    // and maybe use 
    render()

})