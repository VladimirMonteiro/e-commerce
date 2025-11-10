let produtos = [];
let container;

// Função para atualizar o número do carrinho no header
function atualizarBadgeCarrinho() {
  const badge = document.getElementById("cartCount");
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  badge.textContent = carrinho.length;
}

// Carregar produtos da API
fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    produtos = data.products;
    container = document.getElementById("produtos-card-container");
    renderizarProdutos(produtos);
  })
  .catch((error) => {
    console.error("Erro ao carregar produto", error);
    document.getElementById("produtos-card-container").innerHTML =
      "<p>Erro ao carregar produtos</p>";
  });

// Função que renderiza os cards de produtos
function renderizarProdutos(lista) {
  container.innerHTML = "";

  lista.forEach((item) => {
    container.innerHTML += `
      <div class="card p-3 mb-3 shadow-sm">
        <img src="${item.thumbnail}" alt="${item.title}" class="card-img-top mb-2">
        <h5>${item.title}</h5>
        <p class="small">${item.description}</p>
        <div class="price fw-bold mb-2">Preço: R$ ${item.price}</div>
          <button class="btn-buy" data-id="${item.id}">Comprar</button>
          <button class="cartBtn" data-id="${item.id}">
            <i class="bi bi-cart-fill me-2"></i> Adicionar ao carrinho
          </button>
      </div>`;
  });

  // Evento do botão "Comprar"
  document.querySelectorAll(".btn-buy").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const produtoSelecionado = produtos.find((p) => p.id == id);
      localStorage.setItem(
        "produtoSelecionado",
        JSON.stringify(produtoSelecionado)
      );
      window.location.href = "product.html";
    });
  });

  // Evento do botão "Adicionar ao carrinho"
  document.querySelectorAll(".cartBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const produto = produtos.find((p) => p.id == id);
      let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

      const jaExiste = carrinho.some((p) => p.id === produto.id);
      if (!jaExiste) {
        carrinho.push(produto);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        atualizarBadgeCarrinho(); 
      }

      // Toast Bootstrap
      const toastEl = document.getElementById("liveToast");
      const toastBody = toastEl.querySelector(".toast-body");
      toastBody.textContent = `✅ ${produto.title} adicionado ao carrinho!`;

      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".filterForm");
  atualizarBadgeCarrinho();

  // Evento do botão do carrinho no header
  const cartButton = document.getElementById("cartButton");
  if (cartButton) {
    cartButton.addEventListener("click", () => {
      window.location.href = "carrinho.html";
    });
  }

  // Filtro de produtos
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputValue = form.querySelector("input").value.trim().toLowerCase();
      const filtrados = produtos.filter((p) =>
        p.title.toLowerCase().startsWith(inputValue)
      );
      renderizarProdutos(filtrados);
    });
  }
});
