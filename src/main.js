// src/main.js

document.addEventListener('DOMContentLoaded', () => {
  const loadingSpinner = document.getElementById('loading-spinner');
  const pokemonContainer = document.getElementById('pokemon-container');
  const loadMoreButton = document.getElementById('load-more-button');
  const loadMoreArea = document.getElementById('load-more-area');

  // モーダル関連のDOM要素を取得
  const pokemonDetailModal = document.getElementById('pokemon-detail-modal');
  const closeModalButton = document.getElementById('close-modal-button');
  const modalLoadingSpinner = document.getElementById('modal-loading-spinner');
  const modalContent = document.getElementById('modal-content');

  const modalPokemonName = document.getElementById('modal-pokemon-name');
  const modalPokemonImage = document.getElementById('modal-pokemon-image');
  const modalOfficialArtwork = document.getElementById('modal-official-artwork');
  const modalPokemonId = document.getElementById('modal-pokemon-id');
  const modalPokemonHeight = document.getElementById('modal-pokemon-height');
  const modalPokemonWeight = document.getElementById('modal-pokemon-weight');
  const modalPokemonTypes = document.getElementById('modal-pokemon-types');
  const modalPokemonMoves = document.getElementById('modal-pokemon-moves');
  const modalPokemonDescription = document.getElementById('modal-pokemon-description');


  let offset = 0;
  const limit = 20;
  let isFetching = false;

  // タイプ名をクラス名に変換するヘルパー関数
  // 例: 'fire' -> 'type-fire'
  function getTypeBgClass(type) {
    return `bg-type-${type.toLowerCase()}`;
  }

  // ポケモン詳細データからカードHTML要素を作成するヘルパー関数
  function createPokemonCard(pokemon) {
    const mainType = pokemon.types[0].type.name; // 最初のタイプをメインタイプとする
    const typeBgClass = getTypeBgClass(mainType); // メインタイプに応じた背景色クラスを取得

    const card = document.createElement('div');
    // ★変更: cardのクラスにタイプに応じた背景色を追加
    card.className = `${typeBgClass} text-white rounded-lg shadow-lg p-4 text-center transform hover:scale-105 transition-transform duration-200 cursor-pointer flex flex-col justify-between items-center`;
    card.dataset.pokemonId = pokemon.id;

    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const pokemonIdFormatted = pokemon.id.toString().padStart(3, '0');
    // ★変更: 画像は白背景と馴染むように
    const imageUrl = pokemon.sprites.front_default; // または pokemon.sprites.other['official-artwork'].front_default;

    // ★変更: タイプ表示をラベル形式に
    const typeBadges = pokemon.types.map(typeInfo => {
        const typeName = typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1);
        const badgeBgClass = getTypeBgClass(typeInfo.type.name);
        return `<span class="inline-block ${badgeBgClass} text-white text-xs font-bold px-2 py-1 rounded-full mr-1 mb-1">${typeName}</span>`;
    }).join('');


    card.innerHTML = `
      <img src="${imageUrl}" alt="${pokemonName}" class="w-24 h-24 mx-auto mb-2 filter drop-shadow-md bg-white rounded-full p-1">
      <h2 class="text-xl font-bold mt-2">${pokemonName} (#${pokemonIdFormatted})</h2>
      <div class="mt-2">${typeBadges}</div>
    `;

    card.addEventListener('click', () => {
      showPokemonDetail(pokemon.id);
    });

    return card;
  }

  // ポケモンデータをフェッチして表示する非同期関数 (変更なし)
  async function fetchAndDisplayPokemons() {
    if (isFetching) return;
    isFetching = true;

    try {
      if (offset === 0) {
        loadingSpinner.classList.remove('hidden');
        pokemonContainer.classList.add('hidden');
        loadMoreArea.classList.add('hidden');
      } else {
        loadMoreButton.textContent = '読み込み中...';
        loadMoreButton.disabled = true;
        loadMoreButton.classList.add('animate-pulse');
      }

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const pokemonList = data.results;

      if (pokemonList.length === 0) {
        loadMoreButton.textContent = 'これ以上ポケモンはいません';
        loadMoreButton.disabled = true;
        loadMoreButton.classList.remove('animate-pulse');
        if (offset === 0) {
           loadingSpinner.innerHTML = '<p class="text-gray-600 text-lg">表示できるポケモンがいません。</p>';
        }
        return;
      }

      for (const pokemon of pokemonList) {
        const pokemonDetailResponse = await fetch(pokemon.url);
        if (!pokemonDetailResponse.ok) {
          console.warn(`Failed to fetch detail for ${pokemon.name}: ${pokemonDetailResponse.status}`);
          continue;
        }
        const detailData = await pokemonDetailResponse.json();
        const pokemonCard = createPokemonCard(detailData);
        pokemonContainer.appendChild(pokemonCard);
      }

      loadingSpinner.classList.add('hidden');
      pokemonContainer.classList.remove('hidden');
      loadMoreArea.classList.remove('hidden');
      loadMoreButton.textContent = 'もっとポケモンを見る';
      loadMoreButton.disabled = false;
      loadMoreButton.classList.remove('animate-pulse');

      offset += limit;

    } catch (error) {
      console.error('ポケモンデータの読み込みに失敗しました:', error);
      loadingSpinner.innerHTML = '<p class="text-red-600 text-lg">データの読み込み中にエラーが発生しました。時間を置いて再度お試しください。</p>';
      loadingSpinner.classList.remove('hidden');
      pokemonContainer.classList.add('hidden');
      loadMoreButton.disabled = true;
      loadMoreButton.classList.remove('animate-pulse');
    } finally {
      isFetching = false;
    }
  }

  // ポケモン詳細を表示する関数
  async function showPokemonDetail(pokemonId) {
    pokemonDetailModal.classList.remove('hidden');
    modalLoadingSpinner.classList.remove('hidden');
    modalContent.classList.add('hidden');

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // 説明文を取得
      const speciesResponse = await fetch(data.species.url);
      if (!speciesResponse.ok) {
        throw new Error(`HTTP error! status for species: ${speciesResponse.status}`);
      }
      const speciesData = await speciesResponse.json();
      
      const japaneseFlavorTextEntry = speciesData.flavor_text_entries.find(entry => 
        entry.language.name === 'ja' && entry.version.name === 'red'
      );
      const description = japaneseFlavorTextEntry ? japaneseFlavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ') : '説明文が見つかりませんでした。';

      // 公式アートワークのURLを取得
      const officialArtworkUrl = data.sprites.other['official-artwork'].front_default;

      // 取得したデータをモーダルに挿入
      // ★変更: モーダル名をタイプ色に
      const mainType = data.types[0].type.name; // メインタイプを取得
      const modalHeaderColorClass = getTypeBgClass(mainType); // タイプに応じた背景色クラス
      
      // 既存のクラスを一度削除してから新しい色クラスを追加
      modalPokemonName.classList.remove(...modalPokemonName.classList); // 全てのクラスを削除
      modalPokemonName.classList.add('text-3xl', 'font-bold', 'text-center', 'mb-4', 'text-white', 'p-2', 'rounded-t-lg', modalHeaderColorClass); // 新しいクラスを追加

      modalPokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1) + ` (#${data.id.toString().padStart(3, '0')})`;
      
      modalOfficialArtwork.src = officialArtworkUrl;
      modalOfficialArtwork.alt = data.name + ' Official Artwork';
      
      modalPokemonImage.src = data.sprites.front_default; 
      modalPokemonImage.alt = data.name;

      modalPokemonId.textContent = data.id.toString().padStart(3, '0');
      modalPokemonHeight.textContent = (data.height / 10).toFixed(1);
      modalPokemonWeight.textContent = (data.weight / 10).toFixed(1);

      // ★変更: モーダル内のタイプ表示も色分け
      modalPokemonTypes.innerHTML = data.types.map(typeInfo => {
          const typeName = typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1);
          const badgeBgClass = getTypeBgClass(typeInfo.type.name);
          return `<span class="inline-block ${badgeBgClass} text-white text-base font-bold px-3 py-1 rounded-full mr-2 mb-1">${typeName}</span>`;
      }).join('');
      
      modalPokemonDescription.textContent = description;

      // 覚える技のリストを生成して挿入
      modalPokemonMoves.innerHTML = '';
      if (data.moves && data.moves.length > 0) {
        const movesToShow = data.moves.slice(0, 15); // 例として最初の15個に制限
        movesToShow.forEach(moveInfo => {
          const li = document.createElement('li');
          li.textContent = moveInfo.move.name.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          modalPokemonMoves.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = '覚える技が見つかりませんでした。';
        modalPokemonMoves.appendChild(li);
      }

      modalLoadingSpinner.classList.add('hidden');
      modalContent.classList.remove('hidden');

    } catch (error) {
      console.error('ポケモン詳細データの読み込みに失敗しました:', error);
      modalLoadingSpinner.innerHTML = '<p class="text-red-600 text-lg">詳細データの読み込み中にエラーが発生しました。</p>';
    }
  }

  // モーダルを閉じる関数とイベントリスナー (変更なし)
  function hidePokemonDetail() {
    pokemonDetailModal.classList.add('hidden');
    modalLoadingSpinner.classList.remove('hidden');
    modalContent.classList.add('hidden');
  }

  closeModalButton.addEventListener('click', hidePokemonDetail);

  pokemonDetailModal.addEventListener('click', (event) => {
    if (event.target === pokemonDetailModal) {
      hidePokemonDetail();
    }
  });

  // ページ読み込み時に最初のポケモンデータをフェッチして表示
  fetchAndDisplayPokemons();

  // 「もっと見る」ボタンがクリックされたら、次のポケモンをフェッチ
  loadMoreButton.addEventListener('click', fetchAndDisplayPokemons);
});