// ==========================================================================
// 1. BANCO DE DADOS INICIAL COM AS POSIÇÕES PADRÃO DE REESCALAÇÃO
// ==========================================================================
const dadosFigurinhas = [
  { id: 1, nome: "Ratão", foto: "img/Rato.jpg", obtida: false, posicao: "LD" },
  { id: 2, nome: "João", foto: "img/Loirinha.jpg", obtida: false, posicao: "MEI" },
  { id: 3, nome: "Daniel", foto: "img/Daniel.jpg", obtida: false, posicao: "ATA" },
  { id: 4, nome: "Jean", foto: "img/Jean.jpg", obtida: false, posicao: "GOL" },
  { id: 5, nome: "Ailson", foto: "img/filhomamae.jpg", obtida: false, posicao: "RES" }, // Reserva fixado anteriormente
  { id: 6, nome: "Lucas", foto: "img/Lucas.jpg", obtida: false, posicao: "ZAG" },
  { id: 7, nome: "Kaue", foto: "img/Bebe mostro.jpg", obtida: false, posicao: "ZAG" },
  { id: 8, nome: "Fernando", foto: "img/Fernando.jpg", obtida: false, posicao: "ATA" },
  { id: 9, nome: "Pedro Matheus", foto: "img/Pedro.jpg", obtida: false, posicao: "RES" }, // Reserva fixado anteriormente
  { id: 10, nome: "Gabriel", foto: "img/mamute.jpg", obtida: false, posicao: "LE" },
  { id: 11, nome: "Renan", foto: "img/Paketá.jpg", obtida: false, posicao: "VOL" },
  { id: 12, nome: "Hálita", foto: "img/Anitta.jpg", obtida: false, posicao: "MEI" }
];

let figurinhaSelecionadaAtualmente = null;

// ==========================================================================
// 2. ALTERNADOR DE TELAS
// ==========================================================================
function mudarTela(idTelaQueVaiAparecer) {
  const todasAsTelas = document.querySelectorAll('.tela');
  todasAsTelas.forEach(tela => tela.classList.remove('ativa'));

  const telaAlvo = document.getElementById(idTelaQueVaiAparecer);
  telaAlvo.classList.add('ativa');
  
  if (idTelaQueVaiAparecer === 'tela-album') renderizarAlbum();
  if (idTelaQueVaiAparecer === 'tela-escalacao') {
    renderizarTabelaControle(); // Cria as opções para o usuário escolher
    renderizarCampoTatico();    // Move os jogadores no campo baseado nas escolhas
  }
}

// ==========================================================================
// 3. LOGINS SIMULADOS
// ==========================================================================
function loginSimuladoGoogle() {
  alert("🎉 Conta do Google identificada! Entrando...");
  mudarTela('tela-inicial');
}
function realizarCadastro(event) {
  event.preventDefault();
  alert("Conta criada com sucesso!");
  mudarTela('tela-inicial');
}

// ==========================================================================
// 4. ÁLBUM DE FIGURINHAS
// ==========================================================================
function renderizarAlbum() {
  const espaco = document.getElementById('espaco-figurinhas');
  espaco.innerHTML = ''; 
  let coladas = 0;

  dadosFigurinhas.forEach(fig => {
    const card = document.createElement('div');
    card.classList.add('card');
    if (fig.obtida) {
      card.innerHTML = `<img src="${fig.foto}"><div class="nome">${fig.nome}</div>`;
      coladas++;
      card.onclick = () => verDetalhesFigurinha(fig.id);
    } else {
      card.classList.add('bloqueado');
      card.innerHTML = `<div class="numero">${fig.id}</div>`;
    }
    espaco.appendChild(card);
  });
  document.getElementById('total-coladas').innerText = coladas;
}

// ==========================================================================
// 5. PACOTE
// ==========================================================================
function abrirPacote() {
  const resultadoArea = document.getElementById('resultado-pacote');
  resultadoArea.innerHTML = ''; 
  for (let i = 0; i < 3; i++) {
    const indiceAleatorio = Math.floor(Math.random() * dadosFigurinhas.length);
    const figSorteada = dadosFigurinhas[indiceAleatorio];
    figSorteada.obtida = true;

    const miniCard = document.createElement('div');
    miniCard.classList.add('card');
    miniCard.innerHTML = `<img src="${figSorteada.foto}"><div class="nome">${figSorteada.nome}</div>`;
    resultadoArea.appendChild(miniCard);
  }
  alert("✨ Pacote aberto com sucesso!");
}

// ==========================================================================
// 6. NOVO: CRIAR A TABELA DE CONTROLE DINÂMICA
// ==========================================================================
function renderizarTabelaControle() {
  const corpoTabela = document.getElementById('tabela-corpo-jogadores');
  corpoTabela.innerHTML = '';

  dadosFigurinhas.forEach(fig => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${fig.nome}</td>
      <td>
        <select onchange="atualizarPosicaoJogador(${fig.id}, this.value)">
          <option value="GOL" ${fig.posicao === 'GOL' ? 'selected' : ''}>Goleiro (GOL)</option>
          <option value="ZAG" ${fig.posicao === 'ZAG' ? 'selected' : ''}>Zagueiro (ZAG)</option>
          <option value="LD" ${fig.posicao === 'LD' ? 'selected' : ''}>Lateral Direito (LD)</option>
          <option value="LE" ${fig.posicao === 'LE' ? 'selected' : ''}>Lateral Esquerdo (LE)</option>
          <option value="VOL" ${fig.posicao === 'VOL' ? 'selected' : ''}>Volante (VOL)</option>
          <option value="MEI" ${fig.posicao === 'MEI' ? 'selected' : ''}>Meia (MEI)</option>
          <option value="ATA" ${fig.posicao === 'ATA' ? 'selected' : ''}>Atacante (ATA)</option>
          <option value="RES" ${fig.posicao === 'RES' ? 'selected' : ''}>Reserva (RES)</option>
        </select>
      </td>
    `;
    corpoTabela.appendChild(tr);
  });
}

// Função chamada sempre que o usuário muda o SELECT na tabela
function atualizarPosicaoJogador(id, novaPosicao) {
  const jogador = dadosFigurinhas.find(f => f.id === id);
  if (jogador) {
    jogador.posicao = novaPosicao;
    renderizarCampoTatico(); // Redesenha o campo instantaneamente!
  }
}

// ==========================================================================
// 7. NOVO: DESENHAR O CAMPO DISTRIBUINDO OS CRAQUES CONFORME A TABELA
// ==========================================================================
function renderizarCampoTatico() {
  // Limpar todos os setores do campo e do banco antes de reinserir
  const setores = ['ata', 'mei', 'vol', 'zag', 'gol', 'res'];
  setores.forEach(s => document.getElementById(`campo-${s}`).innerHTML = '');

  dadosFigurinhas.forEach(fig => {
    // Definir em qual container HTML ele vai cair dependendo da posição atual dele na tabela
    let idSetorAlvo = `campo-${fig.posicao.toLowerCase()}`;
    if (fig.posicao === 'LD' || fig.posicao === 'LE' || fig.posicao === 'ZAG') {
      idSetorAlvo = 'campo-zag'; // Todos os defensores dividem a linha defensiva
    }
    
    const containerAlvo = document.getElementById(idSetorAlvo);
    if (!containerAlvo) return;

    // Criar o elemento visual do boneco/card no campo
    const divJogador = document.createElement('div');
    divJogador.classList.add(fig.posicao === 'RES' ? 'jogador-reserva' : 'jogador-posicao');

    if (fig.obtida) {
      divJogador.innerHTML = `
        <div class="foto-container"><img src="${fig.foto}"></div>
        <div class="badge-pos">${fig.posicao}</div>
        <div class="nome-tag">${fig.nome}</div>
      `;
      divJogador.onclick = () => verDetalhesFigurinha(fig.id);
    } else {
      divJogador.classList.add('bloqueado');
      divJogador.innerHTML = `
        <div class="foto-container"></div>
        <div class="badge-pos">${fig.posicao}</div>
        <div class="nome-tag">${fig.nome}</div>
      `;
      divJogador.onclick = () => alert(`🔒 Você ainda não tem a figurinha do ${fig.nome}.`);
    }

    containerAlvo.appendChild(divJogador);
  });
}

// ==========================================================================
// 8. FUNÇÕES ADICIONAIS
// ==========================================================================
function verDetalhesFigurinha(id) {
  const fig = dadosFigurinhas.find(f => f.id === id);
  if (!fig) return;
  figurinhaSelecionadaAtualmente = fig;
  document.getElementById('conteudo-card-expandido').innerHTML = `<img src="${fig.foto}"><div class="nome">${fig.nome}</div>`;
  mudarTela('tela-visualizacao');
}
function exportarParaPDF() { if (figurinhaSelecionadaAtualmente) window.print(); }
function compartilharFigurinha() {
  if (!figurinhaSelecionadaAtualmente) return;
  navigator.clipboard.writeText(`Consegui o ${figurinhaSelecionadaAtualmente.nome}!`);
  alert("Link copiado!");
}