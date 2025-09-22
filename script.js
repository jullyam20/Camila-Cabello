const btnAumentar = document.getElementById('btn-aumentar');
const btnDiminuir = document.getElementById('btn-diminuir');
const btnContraste = document.getElementById('btn-contraste');
const body = document.body;

let tamanhoFonte = 16; // px

btnAumentar.addEventListener('click', () => {
  tamanhoFonte += 2;
  body.style.fontSize = tamanhoFonte + 'px';
});

btnDiminuir.addEventListener('click', () => {
  tamanhoFonte -= 2;
  if (tamanhoFonte < 10) tamanhoFonte = 10; // limite mínimo
  body.style.fontSize = tamanhoFonte + 'px';
});

btnContraste.addEventListener('click', () => {
  body.classList.toggle('contraste');
});
