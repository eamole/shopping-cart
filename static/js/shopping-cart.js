class ShoppingCartItem {
    constructor(item) {
        this.id = item.id
        this.name = item.name
        this.description = item.description
        this.price = item.price
        this.img = item.imgSrc
        this.qty = 1
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

    }

    add (product) {
        if (this.items[product.id]) {   // do we already have this product in the cart
            this.items[product.id].qty ++
        } else {
            let item = new ShoppingCartItem(product)
            this.items[product.id] = item
        }
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

    render () {
        let html = "<<h2>Cart</h2>"
        let keys =  Object.keys(this.items)
        keys.forEach(key => {
            let item = this.items[key]
            html += item.render()
        })

        html += `<div class ="total money">${this.value()}</div><button id="checkout">Checkout</button> `
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

    }
}

let shoppingCart = new ShoppingCart()

export {
    ShoppingCartItem,
    ShoppingCart, 
    shoppingCart
}