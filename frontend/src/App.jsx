import { useState, useEffect } from "react";
import dataService from "./services/persons";

const Filter = ({ filter, handler }) => {
	return (
		<form>
			<div>
				filter shown with{" "}
				<input
					autoComplete="off"
					name="filter"
					value={filter}
					onChange={handler}
				/>
			</div>
		</form>
	);
};

const PersonForm = ({
	addPerson,
	name,
	nameHandler,
	number,
	numberHandler,
}) => {
	return (
		<form onSubmit={addPerson}>
			<div>
				name:{" "}
				<input
					autoComplete="off"
					name="name"
					value={name}
					onChange={nameHandler}
				/>
			</div>
			<div>
				number:{" "}
				<input
					autoComplete="off"
					name="number"
					value={number}
					onChange={numberHandler}
				/>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};

const Persons = ({ persons, filter, removePerson }) => {
	return (
		<>
			{persons.map((person) => {
				if (!person.name.toLowerCase().includes(filter.toLowerCase()))
					return;
				else
					return (
						<div key={person.id}>
							<p>
								{person.name} {person.number}
							</p>
							<button
								onClick={() =>
									removePerson(person.name, person.id)
								}
							>
								delete
							</button>
						</div>
					);
			})}
		</>
	);
};

const Notification = ({ message, happy }) => {
	const happyStyle = {
		color: "green",
		fontStyle: "italic",
		fontFamily: "comic sans ms",
		fontSize: 20,
		background: "lightgray",
		borderStyle: "solid",
		padding: 10,
		marginBottom: 10,
	};

	const angryStyle = {
		color: "red",
		fontStyle: "italic",
		fontFamily: "comic sans ms",
		fontSize: 20,
		background: "lightgray",
		borderStyle: "solid",
		padding: 10,
		marginBottom: 10,
	};

	let setStyle;

	if (message === null) return;
	if (happy) setStyle = happyStyle;
	else setStyle = angryStyle;
	return <div style={setStyle}>{message}</div>;
};

const App = () => {
	const [persons, setPersons] = useState([]);

	const [newFilter, setNewFilter] = useState("");
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [notifMessage, setNotifMessage] = useState(null);
	const [happy, setHappy] = useState(true);

	useEffect(() => {
		dataService.getAll().then((initialPersons) => {
			setPersons(initialPersons);
		});
	}, []);

	const addPerson = (event) => {
		event.preventDefault();

		const found = persons.find((person) => person.name == newName);
		if (newName == "" || newNumber == "") alert("fill both fields");
		else if (found != undefined) {
			if (
				confirm(
					`${newName} is already added to phonebook, replace the old number with a new one?`
				)
			) {
				const changedPerson = { ...found, number: newNumber };
				dataService
					.update(changedPerson.id, changedPerson)
					.then((returnedPerson) => {
						setPersons(
							persons.map((person) =>
								person.id !== returnedPerson.id
									? person
									: returnedPerson
							)
						);
						setNewName("");
						setNewNumber("");
						setHappy(true);
						setNotifMessage(`Updated the number of ${newName}`);
						setTimeout(() => {
							setNotifMessage(null);
						}, 2500);
					})
					.catch((error) => {
						setPersons(
							persons.filter(
								(person) => person.id !== changedPerson.id
							)
						);
						setNewName("");
						setNewNumber("");
						setHappy(false);
						setNotifMessage(
							`Information of ${newName} has already been removed from server`
						);
						setTimeout(() => {
							setNotifMessage(null);
						}, 2500);
					});
			}
		} else {
			const personObject = { name: newName, number: newNumber };
			dataService.create(personObject).then((newPerson) => {
				setPersons(persons.concat(newPerson));
				setNewName("");
				setNewNumber("");
				setHappy(true);
				setNotifMessage(`Added ${newName}`);
				setTimeout(() => {
					setNotifMessage(null);
				}, 2500);
			});
		}
	};

	const removePerson = (name, id) => {
		if (confirm(`Delete ${name} ?`)) {
			dataService
				.remove(id)
				.then((deletedPerson) => {
					setPersons(persons.filter((person) => person.id !== id));
					setHappy(true);
					setNotifMessage(`Removed ${name}`);
					setTimeout(() => {
						setNotifMessage(null);
					}, 2500);
				})
				.catch((error) => {
					setPersons(persons.filter((person) => person.id !== id));
					setHappy(false);
					setNotifMessage(
						`Information of ${name} has already been removed from the server`
					);
					setTimeout(() => {
						setNotifMessage(null);
					}, 2500);
				});
		}
	};

	const handleFilterChange = (event) => {
		console.log(event.target.value);
		setNewFilter(event.target.value);
	};

	const handleNameChange = (event) => {
		console.log(event.target.value);
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		console.log(event.target.value);
		setNewNumber(event.target.value);
	};

	return (
		<div>
			<h2>Phonebook</h2>

			<Notification message={notifMessage} happy={happy} />

			<Filter filter={newFilter} handler={handleFilterChange} />

			<h3>Add a new</h3>

			<PersonForm
				addPerson={addPerson}
				name={newName}
				nameHandler={handleNameChange}
				number={newNumber}
				numberHandler={handleNumberChange}
			/>

			<h3>Numbers</h3>

			<Persons
				persons={persons}
				filter={newFilter}
				removePerson={removePerson}
			/>
		</div>
	);
};

export default App;
