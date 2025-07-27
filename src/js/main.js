
import { fetchPokemonDetail } from './api';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('--- main.js 起動: fetchPokemonDetail のテスト ---');

  // テストケース1: 存在するIDのポケモン（フシギダネ - ID: 1）
  try {
    const pokemonId1 = 1;
    console.log(`[テスト1] ポケモンID ${pokemonId1} の詳細データを取得中...`);
    const data1 = await fetchPokemonDetail(pokemonId1);
    console.log(`[テスト1] ポケモンID ${pokemonId1} のデータが取得できました:`, data1);
    console.log(`[テスト1] 名前: ${data1.name.charAt(0).toUpperCase() + data1.name.slice(1)}`);
    console.log(`[テスト1] 高さ: ${data1.height / 10} m`);
    console.log(`[テスト1] 重さ: ${data1.weight / 10} kg`);
  } catch (error) {
    console.error(`[テスト1] ポケモンID 1 のデータ取得中にエラーが発生しました:`, error);
  }

  console.log('------------------------------------');

  // テストケース2: 存在しないIDのポケモン（ID: 99999）
  try {
    const pokemonId2 = 99999;
    console.log(`[テスト2] ポケモンID ${pokemonId2} の詳細データを取得中（エラーを期待）...`);
    const data2 = await fetchPokemonDetail(pokemonId2);
    // ここはエラーが投げられるため、通常は実行されません
    console.log(`[テスト2] 存在しないID ${pokemonId2} のデータが取得できてしまいました:`, data2);
  } catch (error) {
    console.error(`[テスト2] ポケモンID ${99999} のデータ取得中に期待通りエラーが発生しました:`, error.message);
  }

  console.log('--- main.js テスト終了 ---');
});