// APIのベースURLを定義した定数ファイルをインポート
import { POKEMON_API_BASE_URL } from './constants';

/**
 * PokeAPIからポケモンのリスト（概要情報）を取得する関数
 * @param {number} offset - 取得を開始する位置（スキップするポケモンの数）
 * @param {number} limit - 一度に取得するポケモンの数
 * @returns {Promise<Array<object>>} ポケモンの概要情報（nameとurl）の配列を含むPromise
 * @throws {Error} HTTPエラーが発生した場合
 */

export async function fetchPokemonList(offset, limit) {
  try {
    const response = await fetch(`${POKEMON_API_BASE_URL}?offset=${offset}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results; // ポケモンの概要リストを返す
  } catch (error) {
    console.error('Error fetching Pokémon list:', error);
    throw error;
  }
}

/**
 * 指定されたポケモンIDのデータをPokeAPIから取得する関数
 * @param {number} pokemonId - 取得したいポケモンのID
 * @returns {Promise<object>} ポケモンの詳細データを含むPromise
 * @throws {Error} HTTPエラーが発生した場合
 */

export async function fetchPokemonDetail(pokemonId){
 try{
    const response = await fetch(`${POKEMON_API_BASE_URL}/${pokemonId}`);

    //レスポンスがOKでなければエラーとする
    if( !response.ok){
        throw new Error(`エラーです:${response.status}`);
    }
    return await response.json();
  }
  catch(error){
    //fetchが失敗した場合
    console.error(`fetchでerrorを起こしています。${pokemonId}`);
    throw error;
  }
}