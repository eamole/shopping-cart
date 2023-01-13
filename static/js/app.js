// this is a module
'use strict'
/*
    it turns out, import is an async function, and therefore returns a Promise!!
    therefore, to ensure the contents of the module are immediately available
    after the import, we use await, which blocks the thread until the import promise resolves - ie loads!!
*/
let { products } = await import("./products.js")
let { Product } = await import("./product.js") 
let { shoppingCart } = await import("./shopping-cart.js") 

let productList = {}

// document.addEventListener("DOMContentLoaded", () => {
$(document).ready(()  => {

    /*

        render the product list

        wait for products to be added to the shopping cart

        process the shopping cart (checkout)


    */
    // lets get the products from the "database"
    products.forEach( product => {
        productList[product.id] = new Product(product)
    })

    let keys = Object.keys(productList)
    let html = ""
    keys.forEach(key => {
        let product = productList[key]

        html += product.render()

    })
    $("#products-container").html(html)

    $(".product-container").click( function(ev) { // func syntax => this = product container
        console.log('product-container', this)
        let id = this.id
        let product = productList[id]
        shoppingCart.add(product)
    })

})