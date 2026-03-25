const openCartBtn = document.getElementById("open-cart");
const closeCartBtn = document.getElementById("close-cart");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const addButtons = document.querySelectorAll(".add-to-cart");

let total = 0;

function toggleCart() {
  cartPanel.classList.toggle("active");
  overlay.classList.toggle("active");
}

openCartBtn.addEventListener("click", toggleCart);
if (closeCartBtn) closeCartBtn.addEventListener("click", toggleCart);
if (overlay) overlay.addEventListener("click", toggleCart);

/* Adicionar produto */
addButtons.forEach(button => {
  button.addEventListener("click", () => {

    const produto = button.closest(".produto");
    const nome = produto.querySelector("h2").innerText;

    const precoMatch = nome.match(/R\$\s?([\d,\.]+)/);
    let preco = 0;

    if (precoMatch) {
      preco = parseFloat(precoMatch[1].replace(",", "."));
    }

    total += preco;
    cartTotal.textContent = total.toFixed(2);

    const item = document.createElement("div");
    item.classList.add("cart-item");

    item.innerHTML = `
      <span>${nome}</span>
      <button class="remove-item">✖</button>
    `;

    const removeBtn = item.querySelector(".remove-item");
    removeBtn.addEventListener("click", () => {
      total -= preco;
      cartTotal.textContent = total.toFixed(2);
      item.remove();
    });

    cartItems.appendChild(item);

    button.classList.add("clicked");
    setTimeout(() => {
      button.classList.remove("clicked");
    }, 200);

  });
});