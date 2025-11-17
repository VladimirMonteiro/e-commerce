const produto = JSON.parse(localStorage.getItem("produtoSelecionado"));

if (!produto || !produto.category) {
  document.getElementById("produtos-card-container").innerHTML =
    "<p>Nenhum produto selecionado.</p>";
  throw new Error("Produto ou categoria ausente no localStorage.");
}

const categoria = produto.category.trim().toLowerCase();

fetch(`https://dummyjson.com/products/category/${categoria}`)
  .then((res) => res.json())
  .then((data) => {
    const produtos = data.products || [];
    const produtosAleatorios = produtos.sort(() => 0.5 - Math.random());

    const container = document.getElementById("produtos-card-container");

    container.innerHTML = "";

    if (produtos.length === 0) {
      container.innerHTML = "<p>Nenhum produto encontrado nesta categoria.</p>";
      return;
    }

    for (let i = 0; i < Math.min(produtosAleatorios.length, 10); i++) {
      const item = produtos[i];

      container.innerHTML += `
        <div class="card">
          <img src="${item.thumbnail}" alt="${item.title}">
          <h2>${item.title}</h2>
          <p>${item.description}</p>
          <div class="price">Preço: R$ ${item.price}</div>
          <div>
            <button class="btn-buy" data-id="${item.id}">Comprar</button>
            <i class="bi bi-cart4 cartBtn" data-id="${item.id}"></i>
          </div>
        </div>`;
    }

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

      carrinho.push(produto);
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      atualizarBadgeCarrinho();

      // Toast Bootstrap
      const toastEl = document.getElementById("liveToast");
      const toastBody = toastEl.querySelector(".toast-body");
      toastBody.textContent = `✅ ${produto.title} adicionado ao carrinho!`;

      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    });
  });

    
  })
  .catch((error) => {
    console.error("Erro ao carregar produtos:", error);
    document.getElementById("produtos-card-container").innerHTML =
      "<p>Erro ao carregar produtos.</p>";
  });

document.addEventListener("DOMContentLoaded", () => {
  const produto = JSON.parse(localStorage.getItem("produtoSelecionado"));
  const myModal = document.getElementById("myModal");
  const myInput = document.getElementById("myInput");

  if (produto) {
    document.getElementById("product-details").innerHTML = `
        <h1>${produto.title}</h1>
        <div class="product-details-container">
          <img src="${produto.thumbnail}" alt="${produto.title}">
          <div class="description">
            <p>${produto.description}</p>
            <p class="price">Preço: R$ ${produto.price}</p>
            <p>Categoria: ${produto.category}</p>
            <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Comprar</button>
          </div>
        </div>
      `;
  } else {
    document.getElementById("product-details").innerHTML =
      "<p>Nenhum produto selecionado.</p>";
  }

  if (myModal && myInput) {
    myModal.addEventListener("shown.bs.modal", () => {
      myInput.focus();
    });
  }
});
