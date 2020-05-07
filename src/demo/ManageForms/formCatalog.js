var movie = {
	form : 'FORM',
	suggestedId : 'MOVIE',
	initialDescription : 'Use this form to create a movie',
	initialData : {
		title : 'A movie !',
		required: ["movieTitle"],
		properties : {
			movieTitle : {
				type : 'string',
				title : 'Movie title'
			},
			movieGenre : {
				type : 'enum',
				enumValues : 'Horror, Comedy, Drama, Avenger, Sci-fi',
				title : 'Genre'
			},
			mainActors : {
				type : 'string',
				title : 'Main actors'
			},
		}
	}
};

var todo = {
	form : 'FORM',
	suggestedId : 'TODO_ITEM',
	initialDescription : 'Use this form to create a TODO list',
	initialData : {
		title: "A task to do",
		type: "object",
		required: ["task"],
		properties: {
			task: {type: "string", title: "Task" },
			done: {type: "boolean", title: "Done?" }
		}
	}
};

var contact = {
	form : 'FORM',
	suggestedId : 'CONTACT',
	initialDescription : 'Use this form to create a contact',
	initialData : {
		"title": "My contact",
		"type": "object",
		"required": [
			"firstName",
			"lastName"
		],
		"properties": {
			"firstName": {
			"type": "string",
			"title": "First name",
			"default": "Chuck"
			},
			"lastName": {
			"type": "string",
			"title": "Last name"
			},
			"telephone": {
			"type": "string",
			"title": "Telephone"
			}
		}
	}
};


var shopping = {
	form : 'FORM',
	suggestedId : 'SHOPPING_ITEM',
	initialDescription : 'Use this form to create a shopping list',
	initialData : {
		title: "What I need to buy",
		type: "object",
		required: ["item"],
		properties: {
			item: {type: "string", title: "Shopping item" },
			quantity: {type: "integer", title: "Quantity" }
		}
	}
};

var formCatalog = [ movie, todo, contact, shopping  ];
var index = 0;

export default function formCatalogRandom() {
	return formCatalog[index++ % formCatalog.length];
}

