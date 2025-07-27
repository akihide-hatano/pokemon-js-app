//必要なものをimport
import { POKEMON_FETCH_LIMIT } from './constants.js';
import { createPokemonCard } from './ui.js';
import { fetchPokemonDetail, fetchPokemonList } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const loadingSpinner = document.getElementById('loading-spinner');
  const pokemonContainer = document.getElementById('pokemon-container');
  const loadMoreButton = document.getElementById('load-more-button');
  const loadMoreArea = document.getElementById('load-more-area');

  let offset = 0;
  let isFetching = false;

//情報を取得する際に先に現在fetchしているのかを確認しています。
  async function fetchAndDisplayPokemons() {
    if (isFetching) return;
    isFetching = true;

//読み込みへの対応
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

      const pokemonList = await fetchPokemonList(offset, POKEMON_FETCH_LIMIT);

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
        const idMatch = pokemon.url.match(/\/(\d+)\/$/);
        const pokemonId = idMatch ? parseInt(idMatch[1]) : null;

        if (pokemonId) {
            const detailData = await fetchPokemonDetail(pokemonId);
            const pokemonCard = createPokemonCard(detailData);
            
            pokemonCard.addEventListener('click', () => {
              window.location.href = `detail.html?id=${detailData.id}`;
            });

            pokemonContainer.appendChild(pokemonCard);
        }
      }

      loadingSpinner.classList.add('hidden');
      pokemonContainer.classList.remove('hidden');
      loadMoreArea.classList.remove('hidden');
      loadMoreButton.textContent = 'もっとポケモンを見る';
      loadMoreButton.disabled = false;
      loadMoreButton.classList.remove('animate-pulse');

      offset += POKEMON_FETCH_LIMIT;

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

  fetchAndDisplayPokemons();
  loadMoreButton.addEventListener('click', fetchAndDisplayPokemons);
});