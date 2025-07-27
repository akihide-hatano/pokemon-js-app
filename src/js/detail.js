// src/detail.js

import { fetchPokemonDetail } from './api.js';
import { getTypeColor,getStatColorClass } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  const loadingSpinner = document.getElementById('detail-loading-spinner');
  const pokemonDetailCard = document.getElementById('pokemon-detail-card');
  const detailStatusMessage = loadingSpinner.querySelector('p');

  //一覧へ戻るのbutton
  const backButton = document.getElementById('back-button');

  const statsContainer = document.getElementById('detail-pokemon-stats'); // 種族値コンテナ

// index.htmlからdetail.htmlへパラメータ（ポケモンのID）を渡す際に必要な処理
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonId = urlParams.get('id');

//一覧に戻る処理
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }

//ポケモンIDがtれなかったら、待機画面消去後、errorを出す。
  if (!pokemonId) {
    loadingSpinner.classList.add('hidden');
    pokemonDetailCard.classList.add('hidden');
    detailStatusMessage.textContent = 'エラー: ポケモンのIDが指定されていません。';
    detailStatusMessage.classList.add('text-red-600');
    console.error('Pokemon ID not found in URL.');
    return;
  }

  else{
    loadingSpinner.classList.remove('hidden');
    pokemonDetailCard.classList.add('hidden');
    detailStatusMessage.textContent = '詳細データを読み込み中...';
    detailStatusMessage.classList.remove('text-red-600');
  }

//APIからポケモンの詳細取得
  try {
    const pokemon = await fetchPokemonDetail(parseInt(pokemonId));

//スピナーを外す
    loadingSpinner.classList.add('hidden');
    pokemonDetailCard.classList.remove('hidden');
    pokemonDetailCard.classList.add('animate-fade-in');

//入手したものを表示用に設定
    const formattedId = String(pokemon.id).padStart(3, '0');
    const mainType = pokemon.types[0].type.name;
    const typeBgClass = getTypeColor(mainType);

    document.getElementById('detail-pokemon-name').textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById('detail-pokemon-id').textContent = `#${formattedId}`;
    document.getElementById('detail-official-artwork').src = pokemon.sprites.other['official-artwork'].front_default;
    document.getElementById('detail-official-artwork').alt = pokemon.name;

    document.getElementById('detail-pokemon-height').textContent = (pokemon.height / 10).toFixed(1);
    document.getElementById('detail-pokemon-weight').textContent = (pokemon.weight / 10).toFixed(1);

//入手したjsonでtypeColorに合わせて色を取得(複数ある可能性があるためmap関数を使用)
    const typesContainer = document.getElementById('detail-pokemon-types');
    typesContainer.innerHTML = pokemon.types.map(typeInfo => {
      const typeName = typeInfo.type.name;
      const typeColor = getTypeColor(typeName);
      return `<span class="${typeColor} text-white text-sm font-semibold px-3 py-1 rounded-full capitalize shadow-sm">${typeName}</span>`;
    }).join(' ');

//入手したjsonでmoveListに合わせて色を取得(複数ある可能性があるためmap関数を使用)
    const movesList = document.getElementById('detail-pokemon-moves');
    movesList.innerHTML = pokemon.moves.map(moveInfo => `
      <li class="bg-gray-100 p-2 rounded-md shadow-sm capitalize">${moveInfo.move.name}</li>
    `).join('');


// ★★★ 種族値の表示処理を追加 ★★★
    statsContainer.innerHTML = pokemon.stats.map(statInfo => {
      const statName = statInfo.stat.name.replace('-', ' ').toUpperCase(); // 名前を整形 (例: hp -> HP)
      const baseStat = statInfo.base_stat;
      const maxStatValue = 255; // 種族値の最大値を仮定 (ハピナスのHPが255)
      const barWidthPercentage = (baseStat / maxStatValue) * 100;

      // ★ 変更2: getStatColorClass 関数を呼び出して色クラスを取得
      const statColorClass = getStatColorClass(statName);

      return `
        <div class="flex items-center gap-2">
          <span class="w-28 font-bold text-gray-700 capitalize text-right">${statName}</span>
          <span class="w-12 text-center font-bold">${baseStat}</span>
          <div class="flex-grow bg-gray-200 rounded-full h-4 relative overflow-hidden">
            <div class="${statColorClass} h-full rounded-full" style="width: ${barWidthPercentage > 100 ? 100 : barWidthPercentage}%;"></div>
          </div>
        </div>
      `;
    }).join('');

//tryに入らない場合の設定
  } catch (error) {
    loadingSpinner.classList.add('hidden');
    pokemonDetailCard.classList.add('hidden');
    detailStatusMessage.textContent = `ポケモンの詳細情報の取得に失敗しました: ${error.message}`;
    detailStatusMessage.classList.add('text-red-600');
    console.error('Failed to fetch Pokemon detail:', error);
  }
});