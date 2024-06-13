let carrinho = [];
let produtos = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('db.json')
    .then(response => response.json())
    .then(data => {
      produtos = data.produtos; // Armazena os produtos globalmente
      const listaProdutos = document.getElementById('products');

      // Adiciona os produtos à lista
      produtos.forEach(produto => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
                    <h1>${produto.nome_produto}</h1>
                    <p>Categoria: ${produto.categoria_produto}</p>
                    <p>R$${produto.valor_produto.toFixed(2)}</p>
                    <button onclick="adicionar_carrinho(${produto.id_produto})">Adicionar ao carrinho</button>
                `;
        listaProdutos.appendChild(productItem);
      });

      // Adiciona a classe para a grade de produtos
      listaProdutos.classList.add('products-grid');
    })
    .catch(error => {
      console.error('Erro ao carregar ou analisar o arquivo JSON:', error);
    });

  document.getElementById('buscar').addEventListener('input', (event) => {
    buscarProduto(produtos, event.target.value.toLowerCase());
  });

  // Adiciona um evento de clique ao ícone do carrinho para mostrar/ocultar o carrinho de pedidos
  document.getElementById('carrinho-icon').addEventListener('click', () => {
    document.querySelector('.carrinho-pedidos').classList.toggle('show');
  });

  const carrinhoIcon = document.getElementById('carrinho-icon');
  const body = document.body;

  // Adiciona um evento de clique ao ícone do carrinho
  carrinhoIcon.addEventListener('click', () => {
    // Adiciona a classe "carrinho-aberto" ao body
    body.classList.toggle('carrinho-aberto');
  });
});

function somar(carrinho){
  let soma = 0;
  for(let i = 0; i < carrinho.length; i++) {
    soma = soma + (carrinho[i].preco * carrinho[i].quantidade);
  }
  return soma;
}

function update_display() {
  let display_carrinho = document.createElement('div');
  display_carrinho.id = 'cart-Display';
  display_carrinho.innerHTML = carrinho.map(item => `
    <div class="cart-item">
      <h1>${item.nome} (${item.quantidade})</h1>
      <p>Valor: R$${(item.preco * item.quantidade).toFixed(2)}</p>
    </div>
  `).join("");

  // Soma total
  display_carrinho.innerHTML += `<p>Total: R$${somar(carrinho).toFixed(2)}</p>`;

  // Verifica se o display do carrinho já existe, se sim, substitui
  let existingCartDisplay = document.getElementById('cart-Display');
  if (existingCartDisplay) {
    existingCartDisplay.replaceWith(display_carrinho);
  } else {
    document.body.appendChild(display_carrinho);
  }
}

function adicionar_carrinho(id_produto) {
  let produto = produtos.find(produto => produto.id_produto === id_produto);

  if (produto) {
    let produtoNoCarrinho = carrinho.find(item => item.id === id_produto);

    if (produtoNoCarrinho) {
      produtoNoCarrinho.quantidade++;
    } else {
      carrinho.push({
        id: produto.id_produto,
        nome: produto.nome_produto,
        preco: produto.valor_produto,
        quantidade: 1
      });
    }

    update_display();
  } else {
    alert("Produto não encontrado");
  }
}

function buscarProduto(produtos, valor) {
  const produtoEncontrado = produtos.filter(produto => produto.nome_produto.toLowerCase().includes(valor));
  const resultadoBusca = document.getElementById('products');

  resultadoBusca.innerHTML = ''; // Limpa o conteúdo atual da lista de produtos

  if (produtoEncontrado.length > 0) {
    produtoEncontrado.forEach(produto => {
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');
      productItem.innerHTML = `
        <h1>${produto.nome_produto}</h1>
        <p>Categoria: ${produto.categoria_produto}</p>
        <p>R$${produto.valor_produto.toFixed(2)}</p>
        <button onclick="adicionar_carrinho(${produto.id_produto})">Adicionar ao carrinho</button>
      `;
      resultadoBusca.appendChild(productItem);
    });
  } else {
    resultadoBusca.innerHTML = `<p>Nenhum produto encontrado</p>`;
  }
}
