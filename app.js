'use strict' //making sure new terms are readable

//including necessary modules and setting up of the file
const pg = require ('pg')
const express = require ('express')
const fs = require ('fs')
const bodyParser = require('body-parser') //not sure yet whether to use this, but it is in node modules anyway, which is in the gitignore, so it won't increase the size
const app = express ()

//this one is generally used, not the json one (for full disclosure left at bottom document)
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static(__dirname + "/static"))

app.set ('view engine', 'pug')
app.set ('views', __dirname + '/views')


//Create an index page:
app.get ('/index', (request, response) => {
	response.render('index')
	console.log('\nThe browser will now display the home page.')
})

//Create a form page:
app.get ('/form', (request, response) => {
	response.render('form')
	console.log('\nThe browser will now display the form.')
})

//Make form page work:
app.post ('/form', (req, resp) => {
	pg.connect('postgres://postgres:postgres@localhost/bulletinboard', function(err, client, done) {//change to environment variable later on.

  		//add a new entry
  		client.query(`insert into messages 
  			(title, body) 
  			values 
  			('` + req.body.title + `', '` + req.body.body + `')`, function(err, result) {
    			//in terminal, shows: 'INSERT: 1'
    			console.log(`${result.command}: ${result.rowCount}`);
			    done();
			    pg.end();
			});
  	});
	resp.redirect('show') //redirects to the page showing all entries
})


//Create a page showing entries:
app.get ('/show', (req, resp) => {
	// resp.render('show')
	console.log('\nThe browser will now display the entries.')

	pg.connect('postgres://postgres:postgres@localhost/bulletinboard', function(err, client, done) {//change to environment variable later on.

  		//select all entries
  		client.query('select * from messages', function(err, result) { 
  			console.log(result.rows[2].title)
  			done();
			pg.end();
			resp.render('show', {data: result.rows}) //renders to the page showing all entries
  		});
  		
			    
  	});


})


// app.get ('/allusers', (request, response) => {
// 	fs.readFile( __dirname + '/data.json', (error, data) => {
// 		if (error) throw error

// 			let parsedData = JSON.parse(data)
// 		console.log('\nAll users will now be displayed in the browser')//informative for terminal-readers
// 		response.render('allusers', {data: parsedData})//sends the parsedData to the webpage of allusers
// 	})
// })



//what localhost can this app be found
app.listen (8000, () => {
	console.log('We are listening on port 8000')
})