const editGameForm = document.getElementById('edit-game-form');

editGameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const editedName = document.getElementById('edit-name').value;
    const editedDeveloper = document.getElementById('edit-developer').value;
    const editedGenre = document.getElementById('edit-genre').value;

    // Obtenha o ID do game da URL
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');

    fetch(`http://localhost:5000/games/${gameId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: editedName, developer: editedDeveloper, genero: editedGenre }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        // volta para a lista de itens
        window.location.href = 'index.html';
    })
    .catch(error => console.error('Erro:', error));
});
