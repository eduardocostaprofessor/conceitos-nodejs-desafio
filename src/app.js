const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  const { title } = request.query;
  const results = title
    ? repositories.filter(repository => repository.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()))
    : repositories;

  return response.json(results);
});


app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);

});

app.put("/repositories/:id", (request, response) => {
  //recupera os dados vindos do front-end
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  //procura o índice do projeto
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    response.status(400).json({ error: "Repository not Found" })
  }

  //pega os dados alterados no front-end
  const repository = {
    id,
    title,
    url,
    techs,
    //maintains the amount of old like
    likes: repositories[repositoryIndex].likes  
  }

  repositories[repositoryIndex] = repository

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repository => repository.id == id));

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  //It`s recomended status code 204 for a empty response!
  return response.status(204).json(id);
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;
  const repository = repositories.find( rep => rep.id == id);

  if( !repository) 
    return response.status(400).json()  
  
  repository.likes++;

  return response.status(200).json(repository);
});

module.exports = app;
