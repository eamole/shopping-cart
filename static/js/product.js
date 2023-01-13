// product module

/*
  {
    id: 0,
    name: "T-shirt 1",
    price: 29.99,
    instock: 100,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, error.",
    imgSrc: "./img/t1.png",
  }

*/



class Product {

    constructor(obj) {
        Object.assign(this, obj) // transfer all the properties from obj to the new Product object
    }

    render () {
        return `
        <div class="product-container" id = "${this.id}">
            <div class="product-id id">${this.id}</div>
            <div class="product-image"><img src="/static/${this.imgSrc}" alt=""></div>
            <div class="product-text">
                <div class="product-name">${this.name}</div>
                <div class="product-price money">${this.price}</div>
                <div class="product-description">${this.description}</div>
            </div>
        </div> 
        `

    }

}

export {
    Product
}