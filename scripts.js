// Persistência simples
const STORAGE_KEY = 'camila_site_prefs';
const prefs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

let fontSize = prefs.fontSize || 16;
document.documentElement.style.fontSize = fontSize + 'px';
if (prefs.highContrast) document.body.classList.add('high-contrast');

const increaseBtn = document.getElementById('increase-font');
const decreaseBtn = document.getElementById('decrease-font');
const contrastBtn = document.getElementById('contrast-toggle');

function savePrefs(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    fontSize,
    highContrast: document.body.classList.contains('high-contrast')
  }));
}

increaseBtn.addEventListener('click', () => {
  fontSize += 2;
  document.documentElement.style.fontSize = fontSize + 'px';
  savePrefs();
});
decreaseBtn.addEventListener('click', () => {
  if (fontSize > 10) {
    fontSize -= 2;
    document.documentElement.style.fontSize = fontSize + 'px';
    savePrefs();
  }
});
contrastBtn.addEventListener('click', () => {
  document.body.classList.toggle('high-contrast');
  savePrefs();
});

// carregar álbuns (sem imagens)
async function loadAlbums(){
  try{
    const res = await fetch('albums.json');
    const data = await res.json();
    document.getElementById('about-text').textContent = data.about || document.getElementById('about-text').textContent;
    const list = document.getElementById('albums-list');
    let coverIndex = 0;
    data.albums.forEach(album => {
      coverIndex = (coverIndex % 4) + 1; // alterna classes cover-1..cover-4
      const div = document.createElement('div');
      div.className = 'album';
      // capa como div estilizada — sem <img>
      const coverDiv = document.createElement('div');
      coverDiv.className = 'placeholder-cover cover-' + coverIndex;
      coverDiv.textContent = album.title;
      coverDiv.setAttribute('aria-hidden','true');

      div.appendChild(coverDiv);

      const title = document.createElement('h3');
      title.textContent = album.title;
      div.appendChild(title);

      const meta = document.createElement('p');
      meta.textContent = `${album.year} • ${album.type || ''}`;
      div.appendChild(meta);

      const btn = document.createElement('button');
      btn.className = 'link-like';
      btn.dataset.album = album.id;
      btn.textContent = 'Ver músicas';
      div.appendChild(btn);

      list.appendChild(div);
    });

    // listeners
    document.querySelectorAll('[data-album]').forEach(btn => {
      btn.addEventListener('click', () => {
        const album = data.albums.find(a => a.id === btn.dataset.album);
        showAlbum(album);
      });
    });
  }catch(err){
    console.error('Erro ao carregar albums.json', err);
  }
}

function showAlbum(album){
  if (!album) return;
  document.getElementById('albums').classList.add('hidden');
  const songsSection = document.getElementById('songs');
  songsSection.classList.remove('hidden');
  songsSection.setAttribute('aria-hidden','false');
  document.getElementById('album-title').textContent = `${album.title} (${album.year})`;

  // cover sem imagem: aplicar classe de cor
  const coverEl = document.getElementById('album-cover');
  coverEl.className = 'album-cover';
  // Escolha de cor simples baseada em hash do id
  const hash = Array.from(album.id).reduce((s,c)=>s + c.charCodeAt(0), 0);
  const variant = (hash % 4) + 1;
  coverEl.classList.add('cover-' + variant);
  coverEl.textContent = album.title;

  const ol = document.getElementById('song-list');
  ol.innerHTML = '';
  album.tracks.forEach((t, i) => {
    const li = document.createElement('li');
    li.textContent = `${i+1}. ${t.title}${t.length ? ' — ' + t.length : ''}`;
    ol.appendChild(li);
  });
}

document.getElementById('back-to-albums').addEventListener('click', () => {
  document.getElementById('songs').classList.add('hidden');
  document.getElementById('albums').classList.remove('hidden');
  document.getElementById('songs').setAttribute('aria-hidden','true');
});

loadAlbums();
