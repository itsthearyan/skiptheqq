let iconCart = document.querySelector(".icon-cart");
let closeCart = document.querySelector(".close");
let body = document.querySelector("body");
let listProductHTML = document.querySelector("#productList");
let listCartHTML = document.querySelector("#cartList");
let iconCartSpan = document.querySelector("#cartItemCount");

let listProducts = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    listProductHTML.innerHTML = "";
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${product.price}</div>
                <button class="addCart" type="button">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
});

const addToCart = (product_id) => {
    let cartItem = carts.find(item => item.product_id == product_id);

    if (!cartItem) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cartItem.quantity += 1;
    }

    addCartToHTML();
    addCartToMemory();
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
};

const addCartToHTML = () => {
    let totalQuantity = 0;
    let totalAmount = 0;
    listCartHTML.innerHTML = '';
    if (carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];
            totalAmount += info.price * cart.quantity;
            newCart.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    ${info.price * cart.quantity}
                </div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
            listCartHTML.appendChild(newCart);
        });
    }
    iconCartSpan.innerText = totalQuantity;
    document.getElementById('totalAmount').innerText = `Total: ₹${totalAmount}`;
};

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        changeQuantity(product_id, 'minus');
    } else if (positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        changeQuantity(product_id, 'plus');
    }
});


function changeQuantity(productId, action) {
    const cartItem = carts.find(item => item.product_id == productId);

    if (cartItem) {
        if (action === 'plus') {
            cartItem.quantity += 1;
        } else if (action === 'minus' && cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else if (action === 'minus' && cartItem.quantity === 1) {
            // If quantity is 1 and trying to decrease, remove the item from the cart
            carts = carts.filter(item => item.product_id !== productId);
        }
    }

    addCartToMemory();
    addCartToHTML();
    updateCartItemCount();
    calculateTotalAmount();
}

function updateCartItemCount() {
    iconCartSpan.innerText = carts.reduce((total, cart) => total + cart.quantity, 0);
}

function calculateTotalAmount() {
    const totalAmount = carts.reduce((total, cart) => {
        const product = listProducts.find(item => item.id == cart.product_id);
        return total + (product.price * cart.quantity);
    }, 0);

    document.getElementById('totalAmount').innerText = `Total: $${totalAmount}`;
}

const initApp = () => {
    fetch("ph.json")
        .then(response => response.json())
        .then(data => {
            listProducts = data;
            addDataToHTML();
            if (localStorage.getItem('cart')) {
                carts = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
};

initApp();
