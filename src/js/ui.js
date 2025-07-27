// APIのベースURLを定義した定数ファイルをインポート
import { POKEMON_API_BASE_URL } from './constants';

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