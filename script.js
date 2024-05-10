let carrinho = [];

function update_display() {
  let display_carrinho = document.getElementById('cart-Display');
  display_carrinho.innerHTML = `
      ${carrinho.map(item => `
        <div>
          <h1>${item.nome}</h1>
          <p>Descrição</p>
          <p>Valor: ${item.preco.toFixed(2)}</p>
        </div>
      `).join("")}
    `;
}

function adicionar_carrinho(nome_produto, preco_produto) {
  let produtos = {
    nome: nome_produto,
    preco: preco_produto
  };
  carrinho.push(produtos);
  update_display();
}