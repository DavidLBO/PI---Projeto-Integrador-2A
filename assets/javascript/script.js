let carrinho = [];
let produtos = new Map(); // Usando Map para a tabela hash

document.addEventListener('DOMContentLoaded', () => {
  fetch('db.json')
    .then(response => response.json())
    .then(data => {
      // Armazena os produtos na tabela hash (Map)
      data.produtos.forEach(produto => {
        produtos.set(produto.id_produto, produto);
      });

      // Converte o Map para uma lista, ordena e exibe os produtos
      const listaProdutos = document.getElementById('products');
      const produtosOrdenados = Array.from(produtos.values()).sort((a, b) => a.nome_produto.localeCompare(b.nome_produto));
      produtosOrdenados.forEach(produto => {
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
    buscarProduto(event.target.value.toLowerCase());
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

function somar(carrinho) {
  let soma = 0;
  for (let i = 0; i < carrinho.length; i++) {
    soma = soma + (carrinho[i].preco * carrinho[i].quantidade);
  }
  return soma;
}

function update_display() {
  let display_carrinho = document.createElement('div');
  display_carrinho.id = 'cart-Display';
  // Ordena o carrinho antes de exibir
  const carrinhoOrdenado = carrinho.sort((a, b) => a.nome.localeCompare(b.nome));
  display_carrinho.innerHTML = carrinhoOrdenado.map(item => `
  <div class="cart-item">
  <div>
  <h1>${item.nome}</h1>
  <p>Valor: R$${(item.preco * item.quantidade).toFixed(2)}</p>
  </div>
  <div class="quantidade-controls">
  <button class="control-btn" onclick="diminuirQuantidade(${item.id})">-</button>
  <span class="quantidade">${item.quantidade}</span>
  <button class="control-btn" onclick="aumentarQuantidade(${item.id})">+</button>
  </div>
  <button class="remove-item-btn" onclick="removerItemCarrinho(${item.id})"><i
  class="fas fa-trash-alt"></i> <!-- icone de lixeira --> </button>
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
  let produto = produtos.get(id_produto);

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

function removerItemCarrinho(id_produto) {
  carrinho = carrinho.filter(item => item.id !== id_produto);
  update_display();
}
function diminuirQuantidade(id_produto) {
  let produtoNoCarrinho = carrinho.find(item => item.id ===
    id_produto);
  if (produtoNoCarrinho) {
    if (produtoNoCarrinho.quantidade > 1) {
      produtoNoCarrinho.quantidade--;
    } else {
      carrinho = carrinho.filter(item => item.id !== id_produto);
    }
    update_display();
  } else {
    console.error("Produto não encontrado no carrinho.");
  }
}
function aumentarQuantidade(id_produto) {
  let produtoNoCarrinho = carrinho.find(item => item.id ===
    id_produto);
  if (produtoNoCarrinho) {
    produtoNoCarrinho.quantidade++;
    update_display();
  } else {
    console.error("Produto não encontrado no carrinho.");
  }
}

function buscarProduto(valor) {
  const produtoEncontrado = Array.from(produtos.values()).filter(produto => produto.nome_produto.toLowerCase().includes(valor));
  const resultadoBusca = document.getElementById('products');

  resultadoBusca.innerHTML = ''; // Limpa o conteúdo atual da lista de produtos

  if (produtoEncontrado.length > 0) {
    produtoEncontrado.sort((a, b) => a.nome_produto.localeCompare(b.nome_produto));
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

async function finalizarCompra() {
  // Verifica se há itens no carrinho
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.");
    return;
  }

  // Atualiza o display do carrinho
  update_display();

  try {
    // Gera o QR Code com base nos dados do carrinho
    await generateQRCode();

    // Exibe o modal
    const modal = document.getElementById('qrcode-modal');
    modal.style.display = "block";
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    alert('Não foi possível gerar o QR Code. Tente novamente mais tarde.');
  }
}

function fecharModal() {
  // Fecha o modal
  const modal = document.getElementById('qrcode-modal');
  modal.style.display = "none";
}

async function generateQRCode() {
  const qrcodeContainer = document.getElementById('qrcode');
  qrcodeContainer.innerHTML = ""; // Limpa o QR Code anterior

  // Monta um array com objetos contendo todas as informações necessárias
  const carrinhoData = carrinho.map(item => ({
    nome: item.nome,
    quantidade: item.quantidade,
    preco: item.preco.toFixed(2), // Formata o preço com duas casas decimais
    subtotal: (item.preco * item.quantidade).toFixed(2) // Calcula o subtotal com duas casas decimais
  }));

  // Cria uma string formatada para exibir no QR Code
  let carrinhoFormatted = "";
  carrinhoData.forEach(item => {
    carrinhoFormatted += `Nome: ${item.nome}\nQuantidade: ${item.quantidade}\nPreço: R$${item.preco}\nSubtotal: R$${item.subtotal}\n\n`;
  });

  // Calcula o valor total da compra
  const totalCompra = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0).toFixed(2);

  // Adiciona o valor total da compra à string formatada
  carrinhoFormatted += `Total da Compra: R$${totalCompra}`;

  // Monta a URL da API com os dados formatados
  const apiURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(carrinhoFormatted)}&size=200x200`;

  try {
    // Gera o QR Code
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error('Erro ao gerar QR Code');
    }
    const qrImgURL = URL.createObjectURL(await response.blob());

    // Cria um elemento de imagem para exibir o QR Code
    const qrImg = document.createElement('img');
    qrImg.src = qrImgURL;
    qrImg.alt = 'QR Code';

    // Adiciona a imagem do QR Code ao contêiner
    qrcodeContainer.appendChild(qrImg);

    // Adiciona os elementos de parágrafo com os textos desejados dentro do modal
    const modalText1 = document.getElementById('modalText1');
    modalText1.textContent = "Leve este QR Code ao balcão";

    const modalText2 = document.getElementById('modalText2');
    modalText2.textContent = "Seu pedido está sendo preparado!";

  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    alert('Não foi possível gerar o QR Code. Tente novamente mais tarde.');
  }
}