class ShoppingCartItem {
    constructor(item) {
        if(item) { // there may not be an item, see factory method below
            this.id = item.id
            this.name = item.name
            this.description = item.description
            this.price = item.price
            this.img = item.imgSrc
            this.qty = 1
        }
        
    }
    // used to restore a serialised object
    // a factory static method - called on the class, returns new CartItem objects
    static deserialise (item) {
        let cartItem = new ShoppingCartItem()
        Object.assign(cartItem, item)   // copy ALL the attributes across
        return cartItem
    }
    serialise () {
        return JSON.stringify(this)
    }
    value () {
        return this.qty * this.price
    }

    render () {
        return `
        <div class="cart-item-container" id = "cart-item-id-${this.id}" data-id="${this.id}">
            <div class="cart-item-id id">${this.id}</div>
            <div class="cart-item-image"><img src="/static/${this.img}" alt=""></div>
            <div class="cart-item-text">
                <div class="cart-item-name">${this.name}</div>
                <div class="qty-container"> 
                    <div class="cart-item-qty-dec clickable" data-id="${this.id}">-</div>
                    <div class="cart-item-qty">${this.qty}</div>
                    <div class="cart-item-qty-inc clickable" data-id="${this.id}">+</div>
                </div>
                <div class="cart-item-value money">${this.value()}</div>
            </div>
        </div>        
        `
    }
}

class ShoppingCart {
    items = {}
    constructor() {
        // restore the basket from localstorage if necesary
        this.restore()
    }
    count () {
        let keys = Object.keys(this.items)
        return keys.length
    }
    itemCount () {
        let count = 0
        for(const key in this.items) {
            let item = this.items[key]
            count += item.qty
        }
        return count

    }
    restore () {
        console.log("restore the basket")
        this.deserialise()
        if(this.count() > 0) {
            this.render()
        }
    }
    save () {
        this.serialise()
    }

    deserialise () {
        let ls = window.localStorage; // create a shorthand 
        if(ls) {    // ie localstorage supported
            if(ls["shopping-cart-items"]) {
                let json = ls["shopping-cart-items"]
                if(json && json !== "undefined") { // if a problem with serialisation
                    let cartItems = JSON.parse(json)
                    for(const id in cartItems) {
                        let _cartItem = cartItems[id]   // hold the json cartItem in a temp var
                        let cartItem = ShoppingCartItem.deserialise(_cartItem)
                        this.items[cartItem.id] = cartItem
                    } 
    
                }
            }

        }
    }
    serialise () {
        let ls = window.localStorage; // create a shorthand 
        if(ls) {    // ie localstorage supported
            ls["shopping-cart-items"] = JSON.stringify(this.items)
        }
    }

    add (product) {
        if (this.items[product.id]) {   // do we already have this product in the cart
            this.items[product.id].qty ++
        } else {
            let item = new ShoppingCartItem(product)
            this.items[product.id] = item
        }
        this.update()
    }

    update () {
        // save first, then render
        this.save() // update the localstorage
        this.render()
    }

    value () {
        let keys = Object.keys(this.items)
        let sum = 0
        keys.forEach(key => {
            let item = this.items[key]
            sum += item.value()
        })
        return sum
    }

    renderFooterRow (field, value, fieldClasses = "", valueClasses = "") {
        let html = `
            <div class="cart-footer-row">
                <span class="cart-footer-field ${fieldClasses}">${field}</span>
                <span class="cart-footer-value ${valueClasses}">${value}</span>
            </div> 
        `
        return html
    }

    renderFooter () {

        // start with the value
        let html = this.renderFooterRow("Total", this.value(), "", "money")
        // add the item count()
        html += this.renderFooterRow("Products", this.count()) 
        html += this.renderFooterRow("Items", this.itemCount()) 

        // proceed/cancel
        html += `
            <div class="cart-footer-row">
                <button id="cart-footer-proceed" class="cart-footer-field btn">Proceed</span>
                <button id="cart-footer-cancel"  class="cart-footer-field btn">Cancel</span>
            </div> 
        `
        // add a message area to the footer
        html += `<div id="cart-footer-message-area"></div>`

        // inject the cart footer html
        $("#shopping-cart-footer").html(html)
        $("#shopping-cart-footer").toggleClass("hidden") // reveal the footer

        // hook the proceed/cancel buttons
        $("#cart-footer-proceed").click(() => {
            this.proceed()
        })
        $("#cart-footer-cancel").click(() => {
            $("#shopping-cart-footer").html("") // remove the html
            $("#shopping-cart-footer").toggleClass("hidden") // remove the html
            
        })

    }

    hideFooter () {
        $("#shopping-cart-footer").toggleClass("hidden")
    }

    proceed () {

        // process the cart

        // now clear the basket
        this.items = {}
        this.update()   // re-render the empty cart

        let msg = `

            <div id="cart-message-area">
                <div class="cart-message">
                    Thank you for your custom. <br/> 
                    Your order will be processed immediately!! <br/> 
                    Have a nice day"
                </div>
                <button class="btn" id="cart-close-message">Ok</button>
            </div>
        `
        
        $("#shopping-cart-container").html(msg)  // replace the empty shopping cart with msg
        
        setTimeout(() => {
            $("#cart-message-area").html("")
        }, 5000)   // delay, and auto close the message

        $("#cart-close-message").click(() => {
            $("#cart-message-area").html("")
        })


    }

    checkout () {
        
        this.renderFooter()


    }

    render () {
        // construct the shopping cart header
        let html = `
            <img id="cart-basket-icon" src="/static/img/shopping-cart-icon.webp" alt="">        
        `   // "<h2>Cart</h2>"
        
        // add in the basket value, and the checkout utton at top
        html += `<span class ="cart-total money">${this.value()}</span><button id="cart-checkout">Checkout</button> `


        let keys =  Object.keys(this.items)
        keys.forEach(key => {
            let item = this.items[key]
            html += item.render()
        })

        // now add a footer to the cart which will be revealed when we checkout
        html += `<div id="shopping-cart-footer" class="hidden"></div>`

        $("#shopping-cart-container").html(html)

        $(".cart-item-qty-dec").click( function() { // use func syntax => this = cart-item-container
            console.log('cart item', this)           
            let id = this.dataset.id
            console.log({id})
            let item = shoppingCart.items[id]
            if(item.qty>0) item.qty --  // subtract 1
            if(item.qty == 0) {
                delete shoppingCart.items[id]
            }
            shoppingCart.render()
        })

        $(".cart-item-qty-inc").click( function() { // use func syntax => this = cart-item-container
            let id = this.dataset.id
            let item = shoppingCart.items[id]
            item.qty ++  // subtract 1
            shoppingCart.render()
        })

        $("#cart-checkout").click(() => {
            this.checkout()
        })

    }
}

let shoppingCart = new ShoppingCart()

export {
    ShoppingCartItem,
    ShoppingCart, 
    shoppingCart
}