const express = require("express");
const app = express();

app.use(express.json());

let persons = [
	{
		id: "1",
		content: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		content: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		content: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		content: "Mary Poppendieck",
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

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
