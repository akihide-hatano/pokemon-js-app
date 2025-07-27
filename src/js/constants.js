// src/constants.js

export const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
export const POKEMON_FETCH_LIMIT = 20; // 一度に取得するポケモンの数

// ポケモンのタイプごとの色（Tailwind CSSのカスタムカラーとして定義済み）
export const TYPE_COLORS = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  grass: '#7AC74C',
  electric: '#F7D02C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  steel: '#B7B7CE',
  dark: '#705746',
  fairy: '#D685AD',
};

// ポケモンの種族値ごとの色（Tailwind CSSのクラス名）
export const STAT_COLORS = {
  HP: 'bg-green-500',
  ATTACK: 'bg-red-500',
  DEFENSE: 'bg-blue-500',
  'SPECIAL ATTACK': 'bg-orange-500', // スペースを含むのでクォーテーションで囲む
  'SPECIAL DEFENSE': 'bg-teal-500',   // スペースを含むのでクォーテーションで囲む
  SPEED: 'bg-purple-500',
  DEFAULT: 'bg-gray-400', // その他のステータスのデフォルト色
};