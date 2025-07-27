//必要なものをimport
import { fetchPokemonDetail } from './api.js';
import { getTypeColor } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  // ★ 修正: DOM要素のIDを detail.html に合わせる
  const loadingSpinner = document.getElementById('detail-loading-spinner');
  const pokemonDetailCard = document.getElementById('pokemon-detail-card');

  // HTMLに直接エラーメッセージ表示用の要素がないため、スピナーの領域を流用するか
  // もしくは新しい要素を動的に作成/既存の場所に挿入する形を取ります。
  // ここでは、一旦スピナー領域にメッセージを表示する形にします。
  const detailStatusMessage = loadingSpinner.querySelector('p'); // スピナー内のpタグを利用

  const backButton = document.getElementById('back-button'); // 戻るボタンのID

  // URLからポケモンのIDを取得する
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonId = urlParams.get('id');

  // "戻る" ボタンのイベントリスナーを設定
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }

  if (!pokemonId) {
    // IDがない場合はエラーメッセージを表示
    loadingSpinner.classList.add('hidden');
    pokemonDetailCard.classList.add('hidden'); // カードも非表示に
    detailStatusMessage.textContent = 'エラー: ポケモンのIDが指定されていません。'; // エラーメッセージを表示
    detailStatusMessage.classList.add('text-red-600'); // 赤文字に
    console.error('Pokemon ID not found in URL.');
    return;
  }

  // ローディングスピナーを表示し、メッセージをリセット
  loadingSpinner.classList.remove('hidden');
  pokemonDetailCard.classList.add('hidden'); // 詳細カードを一時的に非表示
  detailStatusMessage.textContent = '詳細データを読み込み中...'; // メッセージを初期状態に戻す
  detailStatusMessage.classList.remove('text-red-600'); // 赤文字を解除

  try {
    // ポケモンの詳細データを取得
    const pokemon = await fetchPokemonDetail(parseInt(pokemonId));

    // データが取得できたらスピナーを非表示にし、カードを表示
    loadingSpinner.classList.add('hidden');
    pokemonDetailCard.classList.remove('hidden');
    pokemonDetailCard.classList.add('animate-fade-in'); // フェードインアニメーションを適用

    // ポケモンのIDを3桁の形式にフォーマット
    const formattedId = String(pokemon.id).padStart(3, '0');
    // メインタイプに基づいて背景色クラスを取得
    const mainType = pokemon.types[0].type.name;
    const typeBgClass = getTypeColor(mainType);

    // ★ 修正: 各DOM要素にデータを挿入
    document.getElementById('detail-pokemon-name').textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById('detail-pokemon-id').textContent = `#${formattedId}`;
    document.getElementById('detail-official-artwork').src = pokemon.sprites.other['official-artwork'].front_default;
    document.getElementById('detail-official-artwork').alt = pokemon.name;

    document.getElementById('detail-pokemon-height').textContent = (pokemon.height / 10).toFixed(1);
    document.getElementById('detail-pokemon-weight').textContent = (pokemon.weight / 10).toFixed(1);

    // タイプ表示の生成
    const typesContainer = document.getElementById('detail-pokemon-types');
    typesContainer.innerHTML = pokemon.types.map(typeInfo => {
      const typeName = typeInfo.type.name;
      const typeColor = getTypeColor(typeName);
      return `<span class="${typeColor} text-white text-sm font-semibold px-3 py-1 rounded-full capitalize shadow-sm">${typeName}</span>`;
    }).join(' '); // スペースで区切る

    // 覚える技の表示
    const movesList = document.getElementById('detail-pokemon-moves');
    movesList.innerHTML = pokemon.moves.map(moveInfo => `
      <li class="bg-gray-100 p-2 rounded-md shadow-sm capitalize">${moveInfo.move.name}</li>
    `).join('');

  } catch (error) {
    // エラー発生時の処理
    loadingSpinner.classList.add('hidden'); // スピナーを非表示
    pokemonDetailCard.classList.add('hidden'); // カードを非表示
    detailStatusMessage.textContent = `ポケモンの詳細情報の取得に失敗しました: ${error.message}`; // エラーメッセージを表示
    detailStatusMessage.classList.add('text-red-600'); // 赤文字に
    console.error('Failed to fetch Pokemon detail:', error);
  }
});