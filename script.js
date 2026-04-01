const openCartBtn = document.getElementById("open-cart");
const closeCartBtn = document.getElementById("close-cart");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const addButtons = document.querySelectorAll(".add-to-cart");
const cartCount = document.getElementById("cart-count");

let total = 0;
let itemCount = 0;
const cartMap = {}; 

function updateCartCount() {
  if (cartCount) cartCount.textContent = itemCount;
}

function formatMoney(n) {
  return n.toFixed(2);
}

function toggleCart() {
  cartPanel.classList.toggle("active");
  overlay.classList.toggle("active");
}

openCartBtn.addEventListener("click", toggleCart);
if (closeCartBtn) closeCartBtn.addEventListener("click", toggleCart);
if (overlay) overlay.addEventListener("click", toggleCart);

function parsePriceFromText(text) {
  const match = text.match(/R\$\s?([\d.,]+)/);
  if (!match) return 0;
  const raw = match[1].replace(/\./g, '').replace(',', '.');
  return parseFloat(raw) || 0;
}

addButtons.forEach(button => {
  const produto = button.closest('.produto');
  if (!produto) return;

  const nome = produto.querySelector('h2')?.innerText || '';
  const imgSrc = produto.querySelector('img')?.src || '';
  const price = parsePriceFromText(nome);

  const counter = document.createElement('div');
  counter.className = 'quantity-controls';
 
  counter.innerHTML = '<button type="button" class="buy-btn">Quantidade <span class="qty">0</span></button><button class="qty-decr" aria-label="Diminuir">-</button><button class="qty-incr" aria-label="Aumentar">+</button>';

  button.parentNode.replaceChild(counter, button);

  produto.dataset.qty = '0';

  const incr = counter.querySelector('.qty-incr');
  const decr = counter.querySelector('.qty-decr');
  const qtySpan = counter.querySelector('.qty');
  
  function addToCartSingle() {
   
    total += price;
    itemCount += 1;
    cartTotal.textContent = formatMoney(total);
    updateCartCount();

    if (cartMap[nome]) {
      cartMap[nome].qty += 1;
      const elQty = cartMap[nome].elem.querySelector('.cart-item-qty');
      const elLinePrice = cartMap[nome].elem.querySelector('.cart-item-price');
      elQty.textContent = cartMap[nome].qty;
      elLinePrice.textContent = 'R$ ' + formatMoney(cartMap[nome].qty * price);
    } else {
  
      const item = document.createElement('div');
      item.className = 'cart-item';
      item.innerHTML = `
        <img src="${imgSrc}" alt="produto" />
        <div class="cart-item-info">
          <span class="cart-item-name">${nome}</span>
          <span>Quantidade: <span class="cart-item-qty">1</span></span>
          <span class="cart-item-price">R$ ${formatMoney(price)}</span>
        </div>
        <button class="remove-item">✖</button>
      `;

      const removeBtn = item.querySelector('.remove-item');
      removeBtn.addEventListener('click', () => {
    
        const removedQty = cartMap[nome].qty;
        total = Math.max(0, total - price * removedQty);
        itemCount = Math.max(0, itemCount - removedQty);
        cartTotal.textContent = formatMoney(total);
        updateCartCount();

        produto.dataset.qty = '0';
        qtySpan.textContent = '0';

        delete cartMap[nome];
        item.remove();
      });

      cartItems.appendChild(item);
      cartMap[nome] = { elem: item, qty: 1, price };
    }
  }

  incr.addEventListener('click', () => {
   
    let q = parseInt(produto.dataset.qty, 10) || 0;
    q += 1;
    produto.dataset.qty = String(q);
    qtySpan.textContent = String(q);

    qtySpan.classList.remove('pulse');
   
    void qtySpan.offsetWidth;
    qtySpan.classList.add('pulse');
    
    addToCartSingle();
  });

  decr.addEventListener('click', () => {
    let q = parseInt(produto.dataset.qty, 10) || 0;
    if (q <= 0) return;

    q -= 1;
    produto.dataset.qty = String(q);
    qtySpan.textContent = String(q);

    qtySpan.classList.remove('pulse');
    void qtySpan.offsetWidth;
    qtySpan.classList.add('pulse');
    
    total = Math.max(0, total - price);
    itemCount = Math.max(0, itemCount - 1);
    cartTotal.textContent = formatMoney(total);
    updateCartCount();

    if (cartMap[nome]) {
      cartMap[nome].qty = Math.max(0, cartMap[nome].qty - 1);
      const elQty = cartMap[nome].elem.querySelector('.cart-item-qty');
      const elLinePrice = cartMap[nome].elem.querySelector('.cart-item-price');

      if (cartMap[nome].qty <= 0) {
       
        cartMap[nome].elem.remove();
        delete cartMap[nome];
      } else {
        elQty.textContent = cartMap[nome].qty;
        elLinePrice.textContent = 'R$ ' + formatMoney(cartMap[nome].qty * price);
      }
    }
  });

});