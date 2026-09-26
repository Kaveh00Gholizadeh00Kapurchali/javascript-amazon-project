import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";



export function rennderPaymentSummary() {

    

    // جمع مبالغ تمام کالا ها بدون مالیات و ترابری
    let productPriceCents = 0;
    let ShippingItemPriceCent = 0;

     cart.forEach((cartItem) => {

        // محاسبه مبلغ
        let matchingProduct;
        const productId = cartItem.productId

        products.forEach((product) => {
            if(product.id === productId){
                matchingProduct = product;
            }
        });
        if(matchingProduct){
            productPriceCents += (matchingProduct.priceCents * cartItem.quantity) ;
        }

        //محاسبه ترابری
        

        const shippingId = cartItem.deliveryOptionId ;

        let deliveryOption ;
        deliveryOptions.forEach((option) => {
             if(shippingId === option.id){
                deliveryOption = option;
             }
    });
            if (deliveryOption){
                ShippingItemPriceCent += deliveryOption.priceCents;
            }
        });
            
            const totalBeforeTaxCents = productPriceCents + ShippingItemPriceCent;
            const totalTaxCent = totalBeforeTaxCents * 0.1 ;
            const totalCents = totalBeforeTaxCents + totalTaxCent;


            const totalProductPrice = (productPriceCents / 100).toFixed(2);
            const totalShippingPrice = (ShippingItemPriceCent / 100).toFixed(2);

            const totalBeforeTax = (totalBeforeTaxCents / 100).toFixed(2);
            const totalTax = (totalTaxCent / 100).toFixed(2);
            const total = (totalCents / 100).toFixed(2)



            let html= ' ' ;

            const paymentSummaryHTML = `
                    <div class="payment-summary-title">
                    Order Summary
                </div>

                <div class="payment-summary-row">
                    <div>Items (3):</div>
                    <div class="payment-summary-money">$${totalProductPrice}</div>
                </div>

                <div class="payment-summary-row">
                    <div>Shipping &amp; handling:</div>
                    <div class="payment-summary-money">$${totalShippingPrice}</div>
                </div>

                <div class="payment-summary-row subtotal-row">
                    <div>Total before tax:</div>
                    <div class="payment-summary-money">$${totalBeforeTax}</div>
                </div>

                <div class="payment-summary-row">
                    <div>Estimated tax (10%):</div>
                    <div class="payment-summary-money">$${totalTax}</div>
                </div>

                <div class="payment-summary-row total-row">
                    <div>Order total:</div>
                    <div class="payment-summary-money">$${total}</div>
                </div>

                <button class="place-order-button button-primary">
                    Place your order
                </button>
            `
            html = paymentSummaryHTML;

            document.querySelector('.js-payment-summary').innerHTML = html;
}

