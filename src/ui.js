import { TYPE_COLORS } from './constants';
import { fetchPokemonDetail, fetchPokemonSpecies } from './api';

let pokemonDetailModal;
let closeModalButton;
let modalLoadingSpinner;
let modalContent;
let modalPokemonName;
let modalPokemonImage;
let modalOfficialArtwork;
let modalPokemonId;
let modalPokemonHeight;
let modalPokemonWeight;
let modalPokemonTypes;
let modalPokemonMoves;

export function initializeUIElements(){
  const pokemonDetailModalHTML = `
    <div id="pokemon-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 hidden">
      <div class="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
        <button id="close-modal-button" class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold leading-none">&times;</button>
        
        <div id="modal-loading-spinner" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
          <p class="mt-2 text-gray-600">詳細データを読み込み中...</p>
        </div>

        <div id="modal-content" class="hidden">
          <h2 id="modal-pokemon-name" class="text-3xl font-bold text-center mb-4 text-gray-800"></h2>
          
          <img id="modal-official-artwork" src="" alt="" class="w-48 h-48 mx-auto mb-4 object-contain">
          
          <img id="modal-pokemon-image" src="" alt="" class="w-32 h-32 mx-auto mb-4 filter drop-shadow-lg hidden">
          
          <div class="grid grid-cols-2 gap-2 text-gray-700 text-lg mb-4">
            <div><strong>ID:</strong> <span id="modal-pokemon-id"></span></div>
            <div><strong>高さ:</strong> <span id="modal-pokemon-height"></span>m</div>
            <div><strong>重さ:</strong> <span id="modal-pokemon-weight"></span>kg</div>
            <div class="col-span-2"><strong>タイプ:</strong> <span id="modal-pokemon-types"></span></div>
          </div>

          <div class="border-t pt-4 mt-4">
            <h3 class="text-xl font-bold text-gray-800 mb-2">覚える技</h3>
            <ul id="modal-pokemon-moves" class="list-disc list-inside text-sm text-gray-700 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded-md">
            </ul>
          </div>

          </div>
      </div>
    </div>
  `;