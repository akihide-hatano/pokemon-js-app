// src/detail.js

import { fetchPokemonDetail } from './api.js';
import { getTypeColor } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  const loadingSpinner = document.getElementById('detail-loading-spinner');
  const pokemonDetailCard = document.getElementById('pokemon-detail-card');
  const detailStatusMessage = loadingSpinner.querySelector('p');
  const backButton = document.getElementById('back-button');

  // ★ 新しく追加するDOM要素の取得
  const statsContainer = document.getElementById('detail-pokemon-stats'); // 種族値コンテナ

  const urlParams = new URLSearchParams(window.location.search);
  const pokemonId = urlParams.get('id');

  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }

  if (!pokemonId) {
    loadingSpinner.classList.add('hidden');
    pokemonDetailCard.classList.add('hidden');
    detailStatusMessage.textContent = 'エラー: ポケモンのIDが指定されていません。';
    detailStatusMessage.classList.add('text-red-600');
    console.error('Pokemon ID not found in URL.');
    return;
  }

  loadingSpinner.classList.remove('hidden');
  pokemonDetailCard.classList.add('hidden');
  detailStatusMessage.textContent = '詳細データを読み込み中...';
  detailStatusMessage.classList.remove('text-red-600');

  try {
    const pokemon = await fetchPokemonDetail(parseInt(pokemonId));

    loadingSpinner.classList.add('hidden');
    pokemonDetailCard.classList.remove('hidden');
    pokemonDetailCard.classList.add('animate-fade-in');

    const formattedId = String(pokemon.id).padStart(3, '0');
    const mainType = pokemon.types[0].type.name;
    const typeBgClass = getTypeColor(mainType);

    document.getElementById('detail-pokemon-name').textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById('detail-pokemon-id').textContent = `#${formattedId}`;
    document.getElementById('detail-official-artwork').src = pokemon.sprites.other['official-artwork'].front_default;
    document.getElementById('detail-official-artwork').alt = pokemon.name;

    document.getElementById('detail-pokemon-height').textContent = (pokemon.height / 10).toFixed(1);
    document.getElementById('detail-pokemon-weight').textContent = (pokemon.weight / 10).toFixed(1);

    const typesContainer = document.getElementById('detail-pokemon-types');
    typesContainer.innerHTML = pokemon.types.map(typeInfo => {
      const typeName = typeInfo.type.name;
      const typeColor = getTypeColor(typeName);
      return `<span class="${typeColor} text-white text-sm font-semibold px-3 py-1 rounded-full capitalize shadow-sm">${typeName}</span>`;
    }).join(' ');

    const movesList = document.getElementById('detail-pokemon-moves');
    movesList.innerHTML = pokemon.moves.map(moveInfo => `
      <li class="bg-gray-100 p-2 rounded-md shadow-sm capitalize">${moveInfo.move.name}</li>
    `).join('');

    // HTMLの#pokemon-detail-card に bg-white が設定されているため、背景色の適用はしない
    // もしカード全体の背景色もタイプによって変えたい場合は、HTMLから bg-white を削除し、
    // pokemonDetailCard.classList.add(typeBgClass); を追加する必要があります。
    // 現状はカード内の各要素の背景色のみタイプ色を適用します。


    // ★★★ 種族値の表示処理を追加 ★★★
    statsContainer.innerHTML = pokemon.stats.map(statInfo => {
      const statName = statInfo.stat.name.replace('-', ' ').toUpperCase(); // 名前を整形 (例: hp -> HP)
      const baseStat = statInfo.base_stat;
      const maxStatValue = 255; // 種族値の最大値を仮定 (ハピナスのHPが255)
      const barWidthPercentage = (baseStat / maxStatValue) * 100;

      // ステータスに応じた棒グラフの色を決定
      let statColorClass = 'bg-gray-400'; // デフォルト
      if (statName === 'HP') {
        statColorClass = 'bg-green-500';
      } else if (statName === 'ATTACK') {
        statColorClass = 'bg-red-500';
      } else if (statName === 'DEFENSE') {
        statColorClass = 'bg-blue-500';
      } else if (statName === 'SPECIAL ATTACK') {
        statColorClass = 'bg-orange-500';
      } else if (statName === 'SPECIAL DEFENSE') {
        statColorClass = 'bg-teal-500';
      } else if (statName === 'SPEED') {
        statColorClass = 'bg-purple-500';
      }

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
    // ★★★ 種族値の表示処理はここまで ★★★

  } catch (error) {
    loadingSpinner.classList.add('hidden');
    pokemonDetailCard.classList.add('hidden');
    detailStatusMessage.textContent = `ポケモンの詳細情報の取得に失敗しました: ${error.message}`;
    detailStatusMessage.classList.add('text-red-600');
    console.error('Failed to fetch Pokemon detail:', error);
  }
});