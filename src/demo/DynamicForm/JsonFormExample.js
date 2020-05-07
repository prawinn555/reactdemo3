import React from "react";
import Form from "@rjsf/core";
import myData from './data.js';

export default function JsonFormExample(props) {

	/*
  const [value, setValue] = React.useState(null);

  const handleClick = (event) => {
    setValue('hello');
  }; */



	const schema = {
		title: "Netflix program",
		type: "object",
		"definitions": {
			"Movie": {
				"type": "object",
				"title" : "",
				"properties": {
					"title" : { type : "string", title : "Movie title" },
					"genre": { enum : ["Horror", "Comedy", "Adventure", "Triller", "Action"], title : "Genre" },
					"boxofficeRating": { type : "integer", title : "Box Office Rating in $"},
				}
			},
			"Series": {
				"type": "object",
				"title" : "",
				"properties": {
					"title" : { type : "string", title : "Series title" },
					"seasons": {
						type : "array",
						items : {
							properties : {
								no : { type : "integer", title : "Season number" },
								releaseDate : { type : "string", format : "date", title : "Release date" },
								numEpisodes : { type : "integer", title : "Number of episodes" },
							}

						}
					}
				}
			}
		},

		"properties": {
			"shows" : {
				"title" : "",
				"type" : "array",
				"items" : {
					"properties" : {
						"objectType": {
							"title" : "Movie or Series",
							"type": "string",
							"enum": [
								"Movie",
								"Series",
							]
						}
					},
					"dependencies": {
						"objectType": {
							"oneOf": [
								{
									"properties": {
										"objectType": {"enum": ["Movie"]},
										"objectContent" : {
											"$ref": "#/definitions/Movie"
										}
									}
								},
								{
									"properties": {
										"objectType": {"enum": ["Series"]},
										"objectContent" : {
											"$ref": "#/definitions/Series"
										}
									}
								}
							]
						}
					}
				}
			}

		}
	};


  const onSubmit = (data) => {
	  console.log('submit', data);
	  console.log(JSON.stringify(data.formData));
	  
	  //console.log('myData', myData);
  }
  const onError = (data) => console.error('error', data);

  return (
   <div className="px-2" >
  		<Form schema={schema}
			onSubmit={onSubmit}
			onError={onError} 
			formData={myData}
			/>

      </div>
  );
}
