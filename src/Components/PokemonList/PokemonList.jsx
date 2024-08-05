import { useEffect, useState } from "react";
import axios from "axios";
import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {

    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokemon';


    async function downloadPokemons() {
        const response = await axios.get(POKEDEX_URL); // This downloads 20 pokemons list

        const pokemonResults = response.data.results; // we get the array of pokemons from result
        console.log(response.data);

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
        setPokemonList(pokeListResults);
        setIsLoading(false);
    }
    useEffect(() => {
        downloadPokemons();
    }, []);

    return (
        <div className="pokemon-list-wrapper">
            <div>Pokemon List</div>
            {(isLoading) ? 'Loading....' :
                pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} />)
            }
        </div>
    )
}

export default PokemonList;