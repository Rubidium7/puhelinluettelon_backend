require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
var morgan = require("morgan");
const Person = require("./models/person");

morgan.token("post-data", (request) => {
	if (request.method === "POST") {
		return JSON.stringify(request.body);
	} else {
		return " ";
	}
});

app.use(cors());
app.use(express.json());
app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :post-data"
	)
);
app.use(express.static("dist"));

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

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

app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
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

	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson);
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const { name, number } = request.body;

	Person.findByIdAndUpdate(
		request.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: "query" }
	)
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
