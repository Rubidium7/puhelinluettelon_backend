require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
var morgan = require("morgan");
const Person = require("./models/person");

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

let unused = [
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
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get("/api/info", (request, response) => {
	Person.find({}).then((persons) => {
		response.send(`<p>Phonebook has info for ${persons.length} people</p>
		<p>${new Date(Date.now()).toString()}</p>`);
	});
});

app.get("/api/persons/:id", (request, response) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => {
			console.log(error);
			response.status(400).send({ error: "malformatted id" });
		});
});

app.delete("/api/persons/:id", (request, response) => {
	Person.findByIdAndDelete(request.params.id)
		.then((person) => {
			response.status(204).end();
		})
		.catch((error) => {
			console.log(error);
			response.status(500).end();
		});
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

	// i don't think this would work without being async
	// Person.find({ name: body.name }).then((persons) => {
	// 	console.log("HI", persons);
	// 	return response.status(400).json({
	// 		error: "name must be unique",
	// 	});
	// });

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save().then((savedPerson) => {
		response.json(savedPerson);
	});
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
