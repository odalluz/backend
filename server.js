const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Atualize a configuração do CORS
app.use(cors({
  origin: 'https://musicas-three.vercel.app',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));

// Conecte-se ao MongoDB
mongoose.connect('mongodb+srv://thauanfelippepro:H21c2mKXbnJdemGV@cluster0.rq3bghy.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const songSchema = new mongoose.Schema({
  name: String,
  votes: Number,
});

const Song = mongoose.model('Song', songSchema);

// Rotas
app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.header('Access-Control-Allow-Origin', '*');
    res.json(songs);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/songs', async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.header('Access-Control-Allow-Origin', '*');
    res.json(song);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/songs/:id/vote', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    song.votes += 1;
    await song.save();
    res.header('Access-Control-Allow-Origin', '*');
    res.json(song);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Adicione essa linha para servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

module.exports = app;
