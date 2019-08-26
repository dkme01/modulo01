const express = require("express");

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = {"name": "teste", "email": "teste@email.com.br"}

// CRUD - Create, Read, Update, Delete

const users = ["User0", "User1", "User2"];

server.use((req, res, next) => {
	console.time("Request:");
	console.log(`Método: ${req.method}; URL: ${req.url}`);

	next();

	console.timeEnd("Request:");
});

function checkUserExists(req, res, next) {
	if (!req.body.name) {
		return res.status(400).json({ error: "User name is required" });
	}

	return next();
}

function checkUserInArray(req, res, next) {
	const user = users[req.params.index];

	if (!user) {
		return res.status(400).json({ error: "User does not exist" });
	}

	req.user = user;

	return next();
}

server.get("/users", (req, res) => {
	return res.json(users); //retorna todos os usuários
});

server.get("/users/:index", checkUserInArray, (req, res) => {
	// const { index } = req.params; // recebe a posição que será retornada

	return res.json(req.user); // retorna os dados da posição informada
});

server.post("/users", checkUserInArray, checkUserExists, (req, res) => {
	const { name } = req.body;

	users.push(name);

	return res.json(users);
});

server.put("/users/:index", checkUserExists, (req, res) => {
	const { index } = req.params; // recebe a posição que será alterada
	const { name } = req.body; // recebe o dado que será alterado

	users[index] = name; // sobrepõe o dado que estava na posição indicada pelo index

	return res.json(users); // retorna a lista com os dados
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
	const { index } = req.params;

	users.splice(index, 1);

	return res.json(users);
});

server.listen(3000);
