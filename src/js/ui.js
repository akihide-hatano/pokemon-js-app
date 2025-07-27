//ポケモンのタイプに応じた色を適応
import { TYPE_COLORS } from "./constants";

/**
 * ポケモンのメインタイプに基づいて、Tailwind CSSの背景色クラスを生成するヘルパー関数
 * @param {string} typeName - ポケモンのタイプ名（例: 'fire', 'water', 'grass'）
 * @returns {string} Tailwind CSSの背景色クラス名（例: 'bg-type-fire'）
 */

export function getTypeColor(typeName){
  // TYPE_COLORS オブジェクトにそのタイプ名の色が定義されていれば、その色クラスを返す
  // 定義されていなければ、デフォルトとして 'bg-gray-500' を返す
    if(TYPE_COLORS[typeName]){
      return `bg-type-${typeName}`;
    }
    else{
      return 'bg-gray-500';
    }
}

/**
 * ポケモンの詳細データを受け取り、それを表示するHTMLカード要素を作成する関数
 * @param {object} pokemon - PokeAPIから取得したポケモンの詳細データ
 * @returns {HTMLElement} 作成されたポケモンカードのDOM要素
 */

export function createPokemonCard(pokemon){
  // ポケモンのメインタイプを取得（最初のタイプを使用）
  const mainType = pokemon.types[0].type.name;
  // メインタイプに基づいて背景色クラスを取得
  const typeBgClass = getTypeColorClass(mainType);

// カード要素（div）を作成し、Tailwind CSSクラスを適用
  const card = document.createElement('div');
  card.className = `${typeBgClass} text-white rounded-lg shadow-lg p-4 text-center transform hover:scale-105 transition-transform duration-200 cursor-pointer flex flex-col justify-between items-center`;
  card.dataset.pokemonId = pokemon.id; // データ属性にポケモンのIDを保存（クリックイベントで利用）

  // ポケモンのIDを3桁の形式にフォーマット（例: 001, 025）
  const formattedId = String(pokemon.id).padStart(3, '0');

  
}

