const gamesForm = document.getElementById('games-form');
const gamesList = document.getElementById('games-list');
const gamesDetails = document.getElementById('games-details');  // Adicionado
const updategamesForm = document.getElementById('update-games-form');  // Adicionado

function listgames() {
    fetch('http://localhost:5000/games')
        .then(response => response.json())
        .then(data => {
            gamesList.innerHTML = '';

            data.forEach(games => {
                const li = document.createElement('li');
                li.className = 'games-list-item';
                li.innerHTML = `
                    <div class="games-image">
                        <img src="${games.imagem}" alt="${games.nome} Image">
                    </div>
                    <div class="games-info">
                       <div id="text-games">Nome: ${games.nome}</div>
                        <div id="text-games">Developer: ${games.developer}</div>
                        <div id="text-games">Gênero: ${games.genero}</div>
                    </div>
                    <div class="games-buttons">
                        <button class="details-button" onclick="showgamesDetails(${games.id})">Detalhes</button>
                        <button class="delete-button" onclick="deletegames(${games.id})">Excluir</button>
                    </div>
                `;
                li.dataset.gamesId = games.id;
                gamesList.appendChild(li);
            });
        })
        .catch(error => console.error('Erro:', error));
}

function showgamesDetails(gamesId) {
    window.location.href = `editarJogo.html?id=${gamesId}`; 
}

function deletegames(gamesId) {
    fetch(`http://localhost:5000/games/${gamesId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        listgames();
    })
    .catch(error => console.error('Erro:', error));
}

gamesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const developer = document.getElementById('developer').value;
    const genre = document.getElementById('genre').value;
    const image = document.getElementById('image').value;

    fetch('http://localhost:5000/games', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: name, developer: developer, genero: genre, imagem: image }),
    })
    .then(response => response.json())
    .then(() => {
        listgames();
        gamesForm.reset();
    })
    .catch(error => console.error('Erro:', error));
});

listgames();
