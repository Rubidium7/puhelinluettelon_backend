const mongoose = require("mongoose");

if (process.argv.length !== 3 && process.argv.length !== 5) {
	console.log(
		"Usage: node mongo.js <dbpassword> (optional: <name> <number>)"
	);
	process.exit(1);
}
const password = process.argv[2];

const url = `mongodb+srv://noellonka:${password}@cluster0.qz4gz.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url).then(() => {
	const personSchema = new mongoose.Schema({
		name: String,
		number: String,
	});

	const Person = mongoose.model("Person", personSchema);

	if (process.argv.length === 3) {
		Person.find({}).then((result) => {
			if (result.length) console.log("phonebook:");
			result.forEach((person) => {
				console.log(`${person.name} ${person.number}`);
			});
			mongoose.connection.close();

			return;
		});
		return;
	}

	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	});

	person.save().then((result) => {
		console.log(
			`added ${result.name} number ${person.number} to phonebook`
		);
		mongoose.connection.close();
	});
});
