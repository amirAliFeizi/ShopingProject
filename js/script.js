const cartNav = document.querySelector(".cart-nav"),
    modal = document.querySelector(".modal"),
    backdrop = document.querySelector(".backdrop"),
    itemCount = document.querySelector(".item-count"),
    cartBtn = document.querySelectorAll(".cart-btn"),
    productContainer = document.querySelector(".product-container"),
    clearCart = document.querySelector(".clear-cart"),
    cardItemConfirm = document.querySelector(".card-item-confirm"),
    cartTotal = document.querySelector(".cart-total strong"),
    emptyCartToast = document.querySelector("#emptyCartToast");

cartNav.addEventListener("click", () => {
    const cartItems = Object.keys(localStorage).filter((item) => item.includes("product-"));

    cartItems.length ? showModal() : showToast()
});
backdrop.addEventListener("click", closeModal);
cardItemConfirm.addEventListener("click", closeModal);
clearCart.addEventListener("click", () => {
    localStorage.clear();
    updateCart();
    closeModal();
});

function showToast(){
    emptyCartToast.classList.add("show")

    setTimeout(()=> emptyCartToast.classList.remove("show") , 3000)
  
}

function showModal() {
    backdrop.style.display = "block";
    modal.style.top = "50%";
    modal.style.opacity = "1";
}

function closeModal() {
    backdrop.style.display = "none";
    modal.style.top = "-999%";
    modal.style.opacity = "0";
}

function getCartItem(id) {
    const item = localStorage.getItem(`product-${id}`);
    return JSON.parse(item);
}

function setCartItem(id, data) {
    localStorage.setItem(`product-${id}`, JSON.stringify(data));
}

function updateCart() {
      const cartItems = Object.keys(localStorage).filter((item) => item.includes("product-"));

    const productCount = cartItems.length;

    itemCount.textContent = productCount;

    const products = setProduct(cartItems);

    let totalPrice = 0;

    products.forEach((product) => {
        totalPrice += product.price * product.count;
    });

    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
}

cartBtn.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        const product = event.target.closest(".card");

        let productData = {
            id: event.target.dataset.id,
            name: product.querySelector(".details span").innerHTML,
            price: Number(product.querySelector(".price").innerHTML),
            imageSrc: product.querySelector("img").src,
            count: 1,
        };

        setCartItem(productData.id, productData);

        updateCart();
    });
});

function setProduct(items) {
    productContainer.innerHTML = "";
    let products = items.map((item) => {
        const productId = item.split("-")[1];

        const data = getCartItem(productId);

        productContainer.innerHTML += `
        <div class="modal-content">
                    <div class="modal-item">
                        <img src=${data.imageSrc} alt="" class="modal-item-img" />
                        <div class="modal-item-desc">
                            <h4>${data.name}</h4>
                            <h5>${data.price}</h5>
                        </div>
                        <div class="product--count">
                         <i onclick="updateProductCount(event , true)" class="fas fa-chevron-up" data-id="${data.id}"></i>
                            <p class="product-count">${data.count}</p>
                           <i onclick="updateProductCount(event , false)" class="fas fa-chevron-down" data-id="${data.id}"></i>
                        </div>
                        <i onclick="removeProduct(event)"  data-id="${data.id}" class="fas fa-trash-alt"></i>
                       
                    </div>
                    
                </div>

                
       `;

        return data;
    });

    return products;
}

window.addEventListener("DOMContentLoaded", () => {
    const itemsCount = Object.keys(localStorage).length;

    if (itemsCount) {
        updateCart();
    }
});

function removeProduct(event) {
    const productId = event.target.dataset.id;
    localStorage.removeItem(`product-${productId}`);

    if (!Object.keys(localStorage).length) {
        closeModal();
    }

    updateCart();
}

function updateProductCount(event, isIncrese) {
    const productId = event.target.dataset.id;
    const product = getCartItem(productId);

    const updatedProduct = {
        ...product,
        count: isIncrese ? product.count + 1 : product.count - 1,
    };

    if (updatedProduct.count > 0) {
        setCartItem(productId, updatedProduct);
    } else {
        removeProduct(event);
    }

    updateCart();
}
