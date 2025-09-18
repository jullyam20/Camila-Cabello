// Controle de A+, A- e alto contraste (persiste em localStorage)
const storageKeys = { scale: 'siteFontScale_v1', contrast: 'siteContrast_v1' };
let scale = parseFloat(localStorage.getItem(storageKeys.scale)) || 1.0;
let contrastOn = localStorage.getItem(storageKeys.contrast) === '1';

const applyScale = () => {
  // aplica escala global (percentage)
  document.documentElement.style.fontSize = (scale * 100) + '%';
};

const applyContrast = () => {
  document.body.classList.toggle('high-contrast', contrastOn);
  document.getElementById('contrast-toggle').setAttribute('aria-pressed', String(contrastOn));
};

document.addEventListener('DOMContentLoaded', () => {
  // painel de acessibilidade
  const toggle = document.getElementById('access-toggle');
  const panel = document.getElementById('access-panel');

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    if (!expanded) {
      panel.hidden = false;
      panel.querySelector('button').focus();
    } else {
      panel.hidden = true;
    }
  });

  // botões
  const inc = document.getElementById('font-increase');
  const dec = document.getElementById('font-decrease');
  const contrast = document.getElementById('contrast-toggle');

  inc.addEventListener('click', () => {
    scale = Math.min(2.0, +(scale + 0.1).toFixed(2));
    localStorage.setItem(storageKeys.scale, scale);
    applyScale();
  });

  dec.addEventListener('click', () => {
    scale = Math.max(0.6, +(scale - 0.1).toFixed(2));
    localStorage.setItem(storageKeys.scale, scale);
    applyScale();
  });

  contrast.addEventListener('click', () => {
    contrastOn = !contrastOn;
    localStorage.setItem(storageKeys.contrast, contrastOn ? '1' : '0');
    applyContrast();
  });

  // fechar painel ao clicar fora
  document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.access-wrapper');
    if (!wrapper.contains(e.target)) {
      document.getElementById('access-panel').hidden = true;
      document.getElementById('access-toggle').setAttribute('aria-expanded', 'false');
    }
  });

  // aplicar estado salvo
  applyScale();
  applyContrast();
});
