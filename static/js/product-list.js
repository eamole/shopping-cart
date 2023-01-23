/*
    the product-list.js is a module
    like the shopping-cart.js, it manages all the functions of
    displaying the product list, and adding products to the shopping cart
*/

let { products } = await import("./products.js")
let { Product } = await import("./product.js") 
let { shoppingCart } = await import("./shopping-cart.js") 

let productList = {}

/*
    lets get the products from the "database"
    convert each raw json object into a Product instance
    store them in an object, with the product id as key
*/
products.forEach( product => {
    productList[product.id] = new Product(product)
})
/*
    render the html for the product list
*/
let render = () => {
    let keys = Object.keys(productList)
    let html = `<div class="products-column col-s-12 col-4">`  // for multi col
    keys.forEach(key => {
        let product = productList[key]
    
        html += product.render()
    
    })
    html += "/div>"

    $("#products-container").html(html)
    
    $(".product-container").click( function(ev) { // func syntax => this = product container
        let id = this.id
        let product = productList[id]
        shoppingCart.add(product)
    })
    
}

export {
    render  // this is the only function we need to export
}