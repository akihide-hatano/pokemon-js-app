//ポケモンのタイプに応じた色を適応
import { TYPE_COLORS } from "./constants";

/**
 * ポケモンのメインタイプに基づいて、Tailwind CSSの背景色クラスを生成するヘルパー関数
 * @param {string} typeName - ポケモンのタイプ名（例: 'fire', 'water', 'grass'）
 * @returns {string} Tailwind CSSの背景色クラス名（例: 'bg-type-fire'）
 */

export function getTypeColor(typeName){
  if(TYPE_COLORS[typeName]){
    return `bg-type-${typeName}`;
  }
  else{
    return 'bg-gray-500';
  }
}