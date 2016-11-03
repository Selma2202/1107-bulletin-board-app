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

//make variable connecting to database
let connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';


//Create a home/form page:
app.get ('/index', (request, response) => {
	response.render('index')
	console.log('\nThe browser will now display the home page.')
})

//Make home/form page work:
app.post ('/index', (req, resp) => {
	pg.connect(connectionString, function(err, client, done) {//change to environment variable later on.
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

//helper function for rounding number up
let roundDecimal 	= (number) => {
	return Math.round (number * 100 ) / 100
}

app.get ('/show', (req, resp) => {
	// resp.render('show')
	console.log('\nThe browser will now display the entries.')

	pg.connect(connectionString, function(err, client, done) {//change to environment variable later on.

  		//select all entries
  			client.query('select * from messages order by datenow desc', function(err, result) { 
  			
  			var sumRatings = 0
  			for (var i = 0; i < result.rows.length; i++) {
  				sumRatings =  result.rows[i].rating + sumRatings
  			}
  			var avgRatings = sumRatings / result.rows.length
  			// console.log (roundDecimal(avgRatings))

  			done();
			pg.end();

			resp.render('show', {data: result.rows, average: (roundDecimal(avgRatings))}) //renders to the page showing all entries
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