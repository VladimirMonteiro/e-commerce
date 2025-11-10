let produtos = [];
let container;

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

function renderizarProdutos(lista) {
  container.innerHTML = "";

  lista.forEach((item) => {
    container.innerHTML += `
      <div class="card">
        <img src="${item.thumbnail}" alt="${item.title}">
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <div class="price">Preço: R$ ${item.price}</div>
        <button class="btn-buy" data-id="${item.id}">Comprar</button>
      </div>`;
  });

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
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".filterForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = form.querySelector("input").value.trim().toLowerCase();

    const filtrados = produtos.filter((p) =>
      p.title.toLowerCase().startsWith(inputValue)
    );

    renderizarProdutos(filtrados);
  });
});
