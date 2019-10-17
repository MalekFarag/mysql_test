const express = require('express');
const mysql = require('mysql');
const hbs = require('hbs');

// create connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_movies"
});

// connecting to database
db.connect(()=>{ 
    console.log('Mysql connected.')
});

const pool =  mysql.createPool({
    connectionLimit : 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "db_movies"
});

const sqlCode = ["SELECT Title FROM tbl_movie",
                 "SELECT * FROM tbl_movie WHERE ID = 1",
                 "SELECT Title FROM tbl_movie WHERE Year < 2000 AND Year > 1989"
                 ]


//movie titles
const movie = [];
pool.query(sqlCode[0], function(error, results){
    if(error) throw error;
    console.log('All movies titles in database:', results);

        results.forEach(result => {
            movie.push(result.Title);
        });
});

// titanic
const titanicN = [];
const titanicD = [];
pool.query(sqlCode[1], function(error, results){
    if(error) throw error;

        results.forEach(result => {
            titanicN.push(result.Title);
            titanicD.push(result.Description);
        });
});

const m90 = [];
pool.query(sqlCode[2], function(error, results){
    if(error) throw error;

        results.forEach(result => {
            m90.push(result.Title);
        });
});




const app = express();

app.listen('3000', ()=>{
    console.log('Server running on port 3000.')
});

// rendering pages
app.use(express.static('public'));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  console.log('Home page');
  
  res.render('home', {
      title: "Home",
      mTitles: movie,
      titanicName: titanicN,
      titanicDesc: titanicD,
      title90: m90
    });
})

app.get('*', (req, res) => {
    console.log('Page not found.');
    
    res.render('error', {title: "error 404"});
  })