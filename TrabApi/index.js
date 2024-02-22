const express = require('express');
const fs = require('fs');
const cors = require('cors');

const server = express();
server.use(cors());
server.use(express.json());

const swagger = require('swagger-ui-express')
const swaggerPath = require('./swagger.json')

server.use('/docSwagg',swagger.serve, swagger.setup(swaggerPath))

const dados = require('./data/dados.json');

// delete
server.delete('/games/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const indiceRemocao = dados.games.findIndex(m => m.id === id);
    if (indiceRemocao !== -1) {
        dados.games.splice(indiceRemocao, 1);

        dados.games.forEach((games, index) => {
            games.id = index + 1;
        });

        salvarDados(dados);

        return res.status(200).json({ mensagem: "Jogo exluido com sucesso" });
    } else {
        return res.status(404).json({ mensagem: "Jogo não encontrado" });
    }
});

server.post('/games', (req, res) => {
    const novoJogo = req.body;

    if (!novoJogo.nome || !novoJogo.developer || !novoJogo.genero || !novoJogo.imagem) {
        return res.status(400).json({ mensagem: "Dados incompletos" });
    } else {
        novoJogo.id = dados.games.length + 1;
        dados.games.push(novoJogo);
        salvarDados(dados);

        return res.status(201).json({ mensagem: "cadastro feito com sucesso!" });
    }
});

// PUT
server.put('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id);
    const atualizarGame = req.body;

    const indiceGame = dados.games.findIndex(games => games.id === gameId);

    if (indiceGame === -1) {
        return res.status(404).json({ mensagem: "Jogo não encontrado" });
    }

    dados.games[indiceGame].nome = atualizarGame.nome || dados.games[indiceGame].nome;
    dados.games[indiceGame].developer = atualizarGame.developer || dados.games[indiceGame].developer;
    dados.games[indiceGame].genero = atualizarGame.genero || dados.games[indiceGame].genero;
    dados.games[indiceGame].imagem = atualizarGame.imagem || dados.games[indiceGame].imagem;

    salvarDados(dados);

    return res.json({ mensagem: "Jogo atualizada", games: dados.games[indiceGame] });
});

server.get('/games', (req, res) => {
    return res.json(dados.games);
});

function salvarDados(dados) {
    fs.writeFileSync(__dirname + '/data/dados.json', JSON.stringify(dados, null, 2));
}

server.listen(5000, () => {
    console.log("Servidor rodando na porta 5000");
});