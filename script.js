document.addEventListener('DOMContentLoaded', () => {
    const pokemonList = document.getElementById('pokemon-list');
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
    let allPokemons = [];

    const typeTranslations = {
        normal: 'Normal',
        fighting: 'Lucha',
        flying: 'Volador',
        poison: 'Veneno',
        ground: 'Tierra',
        rock: 'Roca',
        bug: 'Insecto',
        ghost: 'Fantasma',
        steel: 'Acero',
        fire: 'Fuego',
        water: 'Agua',
        grass: 'Planta',
        electric: 'Eléctrico',
        psychic: 'Psíquico',
        ice: 'Hielo',
        dragon: 'Dragón',
        dark: 'Siniestro',
        fairy: 'Hada'
    };

    const statTranslations = {
        hp: 'Salud',
        attack: 'Ataque',
        defense: 'Defensa',
        'special-attack': 'Ataque Especial',
        'special-defense': 'Defensa Especial',
        speed: 'Velocidad'
    };

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
    
        const types = document.createElement('p');
        types.textContent = `Tipos: ${pokemon.types.map(type => typeTranslations[type.type.name]).join(', ')}`;
    
        const statsList = document.createElement('ul');
        pokemon.stats.forEach(stat => {
            const statItem = document.createElement('li');
            statItem.textContent = `${statTranslations[stat.stat.name]}: ${stat.base_stat}`;
            statsList.appendChild(statItem);
        });
    
        const abilities = document.createElement('p');
        abilities.textContent = `Habilidades: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}`;
    
        const moves = document.createElement('p');
        moves.textContent = `Movimientos: ${pokemon.moves.slice(0, 5).map(move => move.move.name).join(', ')}`;
    
        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(types);
        card.appendChild(statsList);
        card.appendChild(abilities);
        card.appendChild(moves);
    
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
        const searchTerm = document.getElementById('search').value.trim().toLowerCase();
        if (searchTerm === "") {
            mostrarModal(); // Mostrar modal solo si el campo de búsqueda está vacío
        } else {
            const filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
            displayPokemons(filteredPokemons);
        }
    };

    window.limpiarResultados = function() {
        displayPokemons([]);
        document.getElementById('search').value = '';
    };

    // Función para mostrar el modal
    function mostrarModal() {
        document.getElementById('modal').style.display = "block";
    }

    // Función para cerrar el modal
    function cerrarModal() {
        document.getElementById('modal').style.display = "none";
    }    
    
    // Cargar los Pokémon al inicio
    if (localStorage.getItem('pokemons')) {
        allPokemons = JSON.parse(localStorage.getItem('pokemons'));
    } else {
        fetchAllPokemons();
    }

    // Inicialmente no mostrar ningún Pokémon
    displayPokemons([]);

    // Event listener para cerrar el modal al hacer clic en la "X"
    document.getElementById('close-modal').addEventListener('click', cerrarModal);
});
