document.addEventListener('DOMContentLoaded', () => {
    const pokemonList = document.getElementById('pokemon-list');
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
    let allPokemons = [];

    async function fetchAllPokemons() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const pokemonPromises = data.results.map(async pokemon => {
                const res = await fetch(pokemon.url);
                return res.json();
            });
            allPokemons = await Promise.all(pokemonPromises);
            localStorage.setItem('pokemons', JSON.stringify(allPokemons));
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    }

    function createPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.classList.add('pokemon-card');

        const img = document.createElement('img');
        img.src = pokemon.sprites.front_default;
        img.alt = pokemon.name;

        const name = document.createElement('h2');
        name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        card.appendChild(img);
        card.appendChild(name);

        return card;
    }

    function displayPokemons(pokemonArray) {
        pokemonList.innerHTML = '';
        pokemonArray.forEach(pokemon => {
            const pokemonCard = createPokemonCard(pokemon);
            pokemonList.appendChild(pokemonCard);
        });
    }

    window.buscarPokemon = function() {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
        displayPokemons(filteredPokemons);
    };

    // Cargar los Pokémon al inicio
    if (localStorage.getItem('pokemons')) {
        allPokemons = JSON.parse(localStorage.getItem('pokemons'));
    } else {
        fetchAllPokemons();
    }

    // Inicialmente no mostrar ningún Pokémon
    displayPokemons([]);
});
