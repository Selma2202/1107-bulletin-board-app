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

	// Set end amount prop and calculate total duration
	let	title = req.body.title
	let body = req.body.body

	console.log (title + ' ' + body)//this works in the console

	pg.connect('postgres://postgres:postgres@localhost/bulletinboard', function(err, client, done) {//change to environment variable later on.
  		//add a new entry
  		client.query(`insert into messages 
  			(title, body) 
  			values 
  			('` + title + `', '` + body + `')`, function(err, result) {
    			//should print 'INSERT: 1'
    			console.log(`${result.command}: ${result.rowCount}`);

			    done();
			    pg.end();
			});
  	});

	resp.redirect('show')

})


//Create a page showing entries:
app.get ('/show', (request, response) => {
	response.render('show')
	console.log('\nThe browser will now display the entries.')
})




//what localhost can this app be found
app.listen (8000, () => {
	console.log('We are listening on port 8000')
})