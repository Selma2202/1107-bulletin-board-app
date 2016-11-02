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
// app.get ('/index', (request, response) => {
// 	response.render('index')
// 	console.log('\nThe browser will now display the home page.')
// })

//Create a home/form page:
app.get ('/', (request, response) => {
	response.render('index')
	console.log('\nThe browser will now display the home page.')
})

//Make home/form page work:
app.post ('/', (req, resp) => {
	pg.connect('postgres://postgres:postgres@localhost/bulletinboard', function(err, client, done) {//change to environment variable later on.
		if (err) throw err
  		//add a new entry
  		client.query("insert into messages (title, body, datenow, rating) values ($1,$2,$3, $4)", [req.body.title, req.body.body, Date.now(), req.body.rating], function(err, result) {
    			//in terminal, shows: 'INSERT: 1'
    			console.log(`${result.command}: ${result.rowCount}`);
    			if (err) throw err
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
  			client.query('select * from messages order by datenow desc', function(err, result) { 
  			done();
			pg.end();
			let reactions = result.rows 
			//I have made a variable of it, since I want to send more data, namely also an average. maybe I should put that in a variable as well, so that's why I haven't yet.

			resp.render('show', {data: reactions}) //renders to the page showing all entries
  		});

  	// 	client.query('select avg(rating) from messages;', function(err, result) { 
  	// 		done();
			// pg.end();
			// resp.render('show', {avg: result}) //renders to the page showing all entries
  	// 	});
  		
			    
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