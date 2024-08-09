import { useEffect, useState } from "react";
import axios from "axios";
import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {

    const [pokemonListState, setPokemonListState] = useState({
        pokemonList: [],
        isLoading: true,
        pokedexUrl: 'https://pokeapi.co/api/v2/pokemon',
        nextUrl: '',
        prevUrl: ''
    })


    async function downloadPokemons() {

        setPokemonListState((state) => ({
            ...state,
            isLoading: true
        }));

        const response = await axios.get(pokemonListState.pokedexUrl); // This downloads 20 pokemons list

        const pokemonResults = response.data.results; // we get the array of pokemons from result
        console.log(response.data);
        setPokemonListState((state) => ({
            ...state,
            nextUrl: response.data.next,
            prevUrl: response.data.previous
        }));

        /** iterating over the array of pokemons, and using there url, to creathe on an array of promises
         * that will download those 20 pokemons
         */
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));

        // Passing the promise array to axios.all
        const pokemonData = await axios.all(pokemonResultPromise);// array of 20 pokemons detailed data
        console.log(pokemonData);

        // iterate on the data of each pokemon, and extract id, name, image, types
        const pokeListResults = (pokemonData.map((pokeData) => {
            const pokemon = pokeData.data
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                types: pokemon.types
            }
        }))
        console.log(pokeListResults);
        setPokemonListState((state) => ({
            ...state,
            pokemonList: pokeListResults,
            isLoading: false
        }));
    }
    useEffect(() => {
        downloadPokemons();
    }, [pokemonListState.pokedexUrl]);

    return (
        <div className="pokemon-list-wrapper">
            <div className="pokemon-wrapper">
                {(pokemonListState.isLoading) ? 'Loading....' :
                    pokemonListState.pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />)
                }
            </div>
            <div className="controls">
                <button disabled={pokemonListState.prevUrl == null} onClick={() => setPokemonListState({ ...pokemonListState, pokedexUrl: pokemonListState.prevUrl })}>Prev</button>
                <button disabled={pokemonListState.nextUrl == null} onClick={() => setPokemonListState({ ...pokemonListState, pokedexUrl: pokemonListState.nextUrl })}>Next</button>
            </div>
        </div>
    )
}

export default PokemonList;