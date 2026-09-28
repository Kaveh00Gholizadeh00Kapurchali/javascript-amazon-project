const cart = {

    cartItems : JSON.parse(localStorage.getItem('cart')),

    saveToStorage : function(){
    localStorage.setItem('cart-oop', JSON.stringify(this.cartItems))

    if (!this.cartItems || this.cartItems.length === 0){
    this.cartItems = [
    {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId : '2'
    },
    {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity:1,
        deliveryOptionId: '1'
    }
 ]; 
 }
 },



    addToCart : function(productId){
     
         let matchingItem;
 
       
         this.cartItems.forEach((item) => {
             if (productId === item.productId) {
                 matchingItem = item;
             } 
         }); 
 
       
         if (matchingItem) {
             matchingItem.quantity += 1;
         } else {
             this.cartItemst.push({
                 productId: productId,
                 quantity: 1,
                 deliveryOptionId : '1'
             }); 
         }


         saveToStorage();
 },


    removeFromCart: function(productId){
        
        const newCart = [];

        this.cartItems.forEach((cartItem) => {

            if(cartItem.productId !== productId){
                newCart.push(cartItem);
            }
        });

        this.cartItems = newCart;
        this.saveToStorage();

    },


    updateCartQuantity: function(productId, newQuantity){
     
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
 },


  updateDelivaryOption: function(productId, deliveryOptionId){
    let matchingItem;
    
    this.cartItems.forEach((item) => {
             if (productId === item.productId) {
                 matchingItem = item;
             } 
         }); 

         matchingItem.deliveryOptionId = deliveryOptionId;
         this.saveToStorage();
 }




}; 
 
 
 
 
console.log(cart);