// Recupera carrinho do localStorage (como array)
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const productContainer = document.querySelector("#productsContainer");
const totalLabel = document.querySelector(".total");
const subTotalLabel = document.querySelector(".subTotal");

// Função para salvar o carrinho no localStorage
function salvarCarrinho(lista) {
  localStorage.setItem("carrinho", JSON.stringify(lista));
}

// Função principal de renderização
function renderizarProdutos(lista) {
  const myModal = document.getElementById("myModal");
  const myInput = document.getElementById("myInput");

  productContainer.innerHTML = "";

  // Se a lista estiver vazia, mostra mensagem e zera totais
  if (!lista || lista.length === 0) {
    totalLabel.textContent = "R$ 0.00";
    subTotalLabel.textContent = "R$ 0.00";
    productContainer.innerHTML =
      "<p class='text-center mt-3'>Seu carrinho está vazio.</p>";
    return;
  }

  // Agrupa produtos iguais pelo id
  const agrupados = lista.reduce((acc, item) => {
    const existente = acc.find((p) => p.id === item.id);
    if (existente) {
      existente.quantidade += 1;
    } else {
      acc.push({ ...item, quantidade: 1 });
    }
    return acc;
  }, []);

  // Calcula subtotal e total (frete fixo de R$15)
  const subTotal = agrupados.reduce(
    (sum, item) => sum + item.price * item.quantidade,
    0
  );
  const total = subTotal + 15;

  subTotalLabel.textContent = `R$ ${subTotal.toFixed(2)}`;
  totalLabel.textContent = `R$ ${total.toFixed(2)}`;

  // Renderiza cada produto
  agrupados.forEach((item) => {
    const precoTotal = (item.price * item.quantidade).toFixed(2);

    productContainer.innerHTML += `
      <div class="card shadow-sm mb-3 p-3 border-0 cardContainer">
        <div class="row align-items-center">
          <div class="col-2">
            <img src="${item.thumbnail}" alt="${item.title}" class="img-fluid rounded">
          </div>
          <div class="col-6">
            <h6 class="fw-semibold mb-1">${item.title}</h6>
            <p class="text-muted small mb-0">Cor: Marrom | Tamanho: M</p>
            <p class="fw-semibold text-success mt-1">R$ ${precoTotal}</p>
          </div>
          <div class="col-4 d-flex justify-content-end align-items-center">
            <div class="input-group input-group-sm w-auto">
              <button class="btn btn-outline-success btn-minus" data-id="${item.id}" type="button">−</button>
              <input type="text" class="form-control text-center" value="${item.quantidade}" style="width: 45px;" readonly>
              <button class="btn btn-outline-success btn-plus" data-id="${item.id}" type="button">+</button>
            </div>
          </div>
        </div>
      </div>`;
  });

  // Eventos dos botões de + e −
  document.querySelectorAll(".btn-plus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const item = lista.find((p) => p.id === id);
      if (item) {
        lista.push(item); // adiciona mais um
        salvarCarrinho(lista);
        renderizarProdutos(lista);
        atualizarBadgeCarrinho();
      }
    });
  });

  document.querySelectorAll(".btn-minus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const index = lista.findIndex((p) => p.id === id);
      if (index !== -1) lista.splice(index, 1);
      salvarCarrinho(lista);
      renderizarProdutos(lista);
      atualizarBadgeCarrinho();
    });
  });

  if (myModal && myInput) {
    myModal.addEventListener("shown.bs.modal", () => {
      myInput.focus();
    });
  }
}

function atualizarBadgeCarrinho() {
  const badge = document.getElementById("cartCount");
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  badge.textContent = carrinho.length;
}

// Inicializa o carrinho ao carregar
renderizarProdutos(carrinho);
atualizarBadgeCarrinho();
