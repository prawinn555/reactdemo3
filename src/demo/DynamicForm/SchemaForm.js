/* meta schema for defining a form */
const SchemaForm = {
	"title": "Let's define a simple form",
    "description": "To create a complex form, use the 'raw JSON editor'",
	"type": "object",
	"properties": {
		"title": {
			"type": "string",
			"default": "Title of your form",
			"title" : "Give your form a title"
		},
		"listFields": {
			"type": "array",
			"title" : "Manage the fields",
			"items": {
				"type" : "object", 
				"required": [
					"fieldName",
					"type"
				], 
				"properties" : {
					"fieldName" : {
						"type": "string",
						"title" : "Techinical field name",
						"pattern": "^[A-Za-z0-9_-]{0,30}$"
					},
					"type" : {
						"enum": ["string","integer", "boolean", "date", "enum"],
						"default" : "string",
						"title" : "Data type"
					},
					"title" : {
						"type": "string",
						"title" : "Title to show in the form"
					},
					"booleanRequired" : {
						"type": "boolean",
						"title" : "Required?"
					}
				},
				dependencies : {
					"type" : {
						"oneOf": [
								{
									"properties": {
										"type": {"enum": ["enum"]},
										"enumValues" : {
											type: "string",
											title : "Enum values (comma separated)"
										}
									}
								},
								{
									"properties": {
										"type": {"enum": ["string","integer", "boolean", "date"]}
									}
								}
							]
					}
				} 
			}
		} 
	}
};

export default SchemaForm;