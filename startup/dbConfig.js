
const express = require("express");

const mysql = require('mysql');


const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'local_gym'
});


function SelectMemebers(app) { 
  app.get("/api/members",(req,res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * from member LIMIT 1', (err, rows) => {
            connection.release(); // return the connection to pool
            if(err) throw err;
            console.log('The data from users table are: \n', rows);
            res.send(JSON.stringify(rows));
        });
    });
  });
}
module.exports = function(app) {

 SelectMemebers(app);
  

}