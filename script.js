let carrinho = [];

fetch('db.json')
  .then(response => response.json())
  .then(data => {
    const listaProdutos = document.getElementById('products');

    // Limpa a lista de produtos
    listaProdutos.innerHTML = '';

    // Adiciona os produtos à lista
    data.produtos.forEach(produto => {
      const divProduto = document.createElement('div');
      divProduto.classList.add('product');

      const nomeProduto = document.createElement('h1');
      nomeProduto.textContent = `${produto.nome_produto}`;

      const categoriaProduto = document.createElement('p');
      categoriaProduto.textContent = `${produto.categoria_produto}`
      
      const valorProduto = document.createElement('p');
      valorProduto.textContent = `R$${produto.valor_produto}`
      
      const estoqueProduto = document.createElement('p');
      estoqueProduto.textContent = `Estoque: ${produto.quantidade_estoque}`

      const botao = document.createElement('button');
      botao.textContent = `Adicionar ao Carrinho`

      divProduto.appendChild(nomeProduto);
      divProduto.appendChild(categoriaProduto);
      divProduto.appendChild(valorProduto);
      divProduto.appendChild(estoqueProduto);
      divProduto.appendChild(botao)

      listaProdutos.appendChild(divProduto);

    });
  })
  .catch(error => {
    console.error('Erro ao carregar ou analisar o arquivo JSON:', error);
  });
  



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

