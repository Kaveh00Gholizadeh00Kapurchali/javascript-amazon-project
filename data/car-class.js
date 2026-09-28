class Cart {
  constructor() {
    this.cartItems = JSON.parse(localStorage.getItem('cart-oop')) || [];
    if (!this.cartItems || this.cartItems.length === 0) {
      this.cartItems.push({
        productId: "e43638ce-6aa0-4b85-b27f-e1d-7eb678c6",
        quantity: 2,
        deliveryOptionId: '2'
      });
            this.cartItems.push({
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
                quantity: 1,
        deliveryOptionId: '1'
            }); 
        }
    }

  addToCart(productId) {
         let matchingItem;
         this.cartItems.forEach((item) => {
             if (productId === item.productId) {
                 matchingItem = item;
             } 
         }); 
 
         if (matchingItem) {
      matchingItem.quantity += 1;
    } else {
      this.cartItems.push({
        productId: productId,
        quantity: 1,
        deliveryOptionId: '1'
      });
         }

        this.saveToStorage();
  }

  removeFromCart(productId) {
    const newCart = [];
    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
             } 
         }); 
    this.cartItems = newCart;
         this.saveToStorage();
 }

  updateCartQuantity(productId, newQuantity) {
    let matchingItem;
    this.cartItems.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });

    if (matchingItem) {
      matchingItem.quantity = newQuantity;
    }

    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    this.cartItems.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });

    if (matchingItem) {
      matchingItem.deliveryOptionId = deliveryOptionId;
    }

    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem('cart-oop', JSON.stringify(this.cartItems));
  }
}

const cartInstance = new Cart();

console.log(cartInstance);


