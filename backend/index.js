const express = require("express");
const app = express();
const cors = require("cors");
var morgan = require("morgan");

morgan.token("post-data", function (req, res) {
	if (req.method === "POST") {
		return JSON.stringify(req.body);
	} else {
		return " ";
	}
});

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :post-data"
	)
);

let persons = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/", (request, response) => {
	response.send("<h1>Do you liek persons?</h1>");
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/api/info", (request, response) => {
	response.send(`<p>Phonebook has info for ${persons.length} people</p>
		<p>${new Date(Date.now()).toString()}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	const person = persons.find((person) => person.id === id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name) {
		return response.status(400).json({
			error: "name missing",
		});
	}

	if (!body.number) {
		return response.status(400).json({
			error: "number missing",
		});
	}

	if (persons.find((person) => person.name === body.name)) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}

	const person = {
		id: String(Math.floor(Math.random() * 100000)),
		name: body.name,
		number: body.number,
	};

	persons = persons.concat(person);

	response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
