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