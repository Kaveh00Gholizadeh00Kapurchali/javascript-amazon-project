import { cart , removeFromCart ,updateCartQuantity as updateCart, updateDelivaryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import  dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {deliveryOptions} from "../../data/deliveryOptions.js";


export function rennderOrderSummary () {


    let cartSummaryHTMl = '';

    cart.forEach((cartItem) => {

        const productId = cartItem.productId;
        let matchingProduct;

        products.forEach((product) =>{
            if (product.id === productId) {
                matchingProduct = product;
            }
        });

        const deliveryOptionId = cartItem.deliveryOptionId;

        let deliveryOption;

        deliveryOptions.forEach((option) => {
            if (option.id === deliveryOptionId) {
                deliveryOption = option;
            }
        });

        const deliveryDays = deliveryOption ? deliveryOption.deliveryDays : 7;
        const today = dayjs();
        const deliveryDate = today.add(deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');

        cartSummaryHTMl += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                    <div class="delivery-date js-delivery-date-${matchingProduct.id}">
                        Delivery date: ${dateString}
                    </div>

                    <div class="cart-item-details-grid">
                    <img class="product-image" src="${matchingProduct.image}">

                    <div class="cart-item-details">
                        <div class="product-name">
                        ${matchingProduct.name}
                        </div>
                        <div class="product-price">
                        $${(matchingProduct.priceCents / 100).toFixed(2)}
                        </div>
                        <div class="product-quantity">
                        <span>
                            Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary js-update-link js-update-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                            Update
                        </span>
                        <input type="text" class="quantity-input js-quantity-input-${matchingProduct.id} is-hidden">
                        <span class="save-quantity-link js-save-quantity-link
                        js-save-quantity-link-${matchingProduct.id} is-hidden" data-product-id="${matchingProduct.id}">
                            Save
                        </span>
                        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                            Delete
                        </span>
                        </div>
                    </div>

                    <div class="delivery-options">
                        <div class="delivery-options-title">
                        Choose a delivery option:
                        </div>
                        ${deliveryOptionsHTML(matchingProduct, cartItem)}
                    </div>
                    </div>
                </div>
        `;
    });



    function deliveryOptionsHTML(matchingProduct, cartItem){
        let html = '';

        deliveryOptions.forEach((option) => {
            const today = dayjs();
            const deliveryDate = today.add(option.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');

            const priceString = option.priceCents === 0 
                ? 'Free Shipping'
                : `$${(option.priceCents / 100).toFixed(2)} - Shipping`;

            const isChecked = option.id === cartItem.deliveryOptionId;

            html += `
                <div class="delivery-option js-delivery-option" 
                    data-product-id="${matchingProduct.id}"
                    data-delivery-option-id="${option.id}">
                    <input type="radio" 
                        ${isChecked ? 'checked' : ''} 
                        class="delivery-option-input" 
                        name="delivery-option-${matchingProduct.id}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceString}
                        </div>
                    </div>
                </div>
            `;
        });
        return html;
    }

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTMl;


    // حذف آیتم
    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove();
            
            updateCartQuantity();
        });
    });

    // دکمه آپدیت
    document.querySelectorAll('.js-update-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
        
            const updateButton = document.querySelector(`.js-update-link-${productId}`);
            const inputButton = document.querySelector(`.js-quantity-input-${productId}`);
            const saveButton = document.querySelector(`.js-save-quantity-link-${productId}`);

            inputButton.classList.remove('is-hidden');
            saveButton.classList.remove('is-hidden');
            updateButton.classList.add('is-hidden');

            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add('is-editing-quantity');            
        });
    });

    // دکمه ذخیره تعداد
    document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;

            const previousQuantity = document.querySelector(`.js-quantity-label-${productId}`);
            const updateButton = document.querySelector(`.js-update-link-${productId}`);
            const inputButton = document.querySelector(`.js-quantity-input-${productId}`);
            const saveButton = document.querySelector(`.js-save-quantity-link-${productId}`);

            const newQuantity = Number(inputButton.value);
            if (newQuantity < 0 || newQuantity >= 1000) {
                alert('تعداد باید عددی بین 0 تا 1000 باشد!');
                return;
            } else {
                updateCart(productId, newQuantity);
                previousQuantity.innerHTML = newQuantity;
            }

            updateCartQuantity();

            inputButton.classList.add('is-hidden');
            saveButton.classList.add('is-hidden');
            updateButton.classList.remove('is-hidden');

            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.remove('is-editing-quantity');  
        });
    });

    function updateCartQuantity(){
        let cartQuantity = 0;
        cart.forEach((item) => {
            cartQuantity += item.quantity;
        });

        const checkoutQuantity = document.querySelector('.js-checkout-quantity');
        if (checkoutQuantity) {
            checkoutQuantity.innerHTML = `${cartQuantity} items`;
        }
    }
    updateCartQuantity();



    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const { productId, deliveryOptionId } = element.dataset;
            
            // 1. ذخیره در دیتابیس / localStorage
            updateDelivaryOption(productId, deliveryOptionId);

            // 2. پیدا کردن تعداد روزهای آپشن جدید
            let selectedOption;
            deliveryOptions.forEach((option) => {
                if (option.id === deliveryOptionId) {
                    selectedOption = option;
                }
            });

            // 3. محاسبه تاریخ جدید با dayjs
            const today = dayjs();
            const deliveryDate = today.add(selectedOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');

    
            const deliveryDateElement = document.querySelector(`.js-delivery-date-${productId}`);
            if (deliveryDateElement) {
                deliveryDateElement.innerHTML = `Delivery date: ${dateString}`;
            }
            rennderOrderSummary();
        });
    });
}

