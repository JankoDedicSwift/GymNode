
const express = require("express");
var router = express.Router();

const mysql = require('mysql');
const dates = require("../experiment/dates");

//localhost
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'local_gym'
// });
//RDS
const pool = mysql.createPool({
  host: 'localgym.coefhjibk4w3.eu-west-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Aws19980223',
  database: 'local_gym'
});
const fs = require('fs');
const path = require('path')
const formidable = require('formidable');

var excel = require('excel4node');

router.post('/upload', (req, res, next) => {

  const form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){

    const firstName = fields.firstName;
const lastName = fields.lastName;
const phoneNumber = fields.phoneNumber;
console.log("Come on",'('+firstName+'","'+lastName+'","'+phoneNumber+'")');
    pool.query('INSERT INTO member (firstname,lastname,phoneNumber) VALUES ("'+firstName+'","'+lastName+'","'+phoneNumber+'");', function(err, rows, fields) {
      console.log("Fuck",err);
      if (err) throw err;
      console.log('Damn',rows.insertId);

      var oldPath = files.profilePic.path;
      const extName = path.extname(files.profilePic.name);
      const id = rows.insertId
      const fullName = firstName+lastName+id+extName;
      var newPath = path.join('/Users/Backend/node/projects/1/mongoose/', 'uploads')
              + '/'+fullName
      var rawData = fs.readFileSync(oldPath)
    
      fs.writeFile(newPath, rawData, function(err){
          if(err) console.log(err)
          pool.query('UPDATE member SET imgPath="'+fullName+'" WHERE id='+id+';', function(err, rows, fields) {
            console.log("Fuck",err);
            if (err) throw err;
            res.send("Successfully uploaded");
          });
      })
 
    });
     
})


});

router.post('/updateImage', (req, res, next) => {

  const form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){

    const memberId = fields.memberId;
    const extName = path.extname(files.profilePic.name);
    const name = fields.fullName;
    const imgPath = name+memberId+extName;
    pool.query('UPDATE member SET imgPath="'+imgPath+'" WHERE id='+memberId+';', function(err, rows, fields) {
      console.log("Fuck",err);
      if (err) throw err;

      var oldPath = files.profilePic.path;
      
      
      var newPath = path.join('/Users/Backend/node/projects/1/mongoose/', 'uploads')
              + '/'+imgPath
      var rawData = fs.readFileSync(oldPath)
    
      fs.writeFile(newPath, rawData, function(err){
          if(err) console.log(err)   
            res.send("Successfully uploaded");
      })
 
    });
     
})


});

function getToday() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 3).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = '"' + yyyy + '-' + mm + '-' + dd + '"';
  return today
}


  router.get("/memberships", (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as id ' + connection.threadId);
      const today = getToday();
      console.log(today);
      connection.query('SELECT MAX(payments.payedTo) as newPayment,payments.didPay, m.id as memberId, m.firstname, m.lastname, m.email, m.imgPath, m.phoneNumber, m.reg_date FROM member as m LEFT JOIN payments ON payments.memberId=m.id GROUP BY m.id;', (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) throw err;
        var obj = JSON.parse(JSON.stringify(rows));
  
        obj.forEach(function (element) {
          element.didPay = element.didPay
          element.timeLeft = dates.log(element.newPayment);
        });
        console.log("Table", obj);
        res.send(obj);
      });
    });

  });


  router.get("/payments", (req, res) => {
    
      console.log("Paymenyt",req.query.memberID);

      pool.query('SELECT * from payments where memberID = '+ req.query.memberID+';', function(err, rows, fields) {
        if (err) throw err;
        var obj = JSON.parse(JSON.stringify(rows));
        console.log("Table", obj);
        res.send(obj);
      });
      });
      router.get("/payments", (req, res) => {
    
        console.log("Paymenyt",req.query.memberID);
  
        pool.query('SELECT * from payments where memberID = '+ req.query.memberID+';', function(err, rows, fields) {
          if (err) throw err;
          var obj = JSON.parse(JSON.stringify(rows));
          console.log("Table", obj);
          res.send(obj);
        });
        });
router.get('/', function(req, res) {
  res.send('GET handler for /dogs route.');
});

router.post('/addPayment',async(req, res) =>{
  console.log(req.body)
  const payedFrom = req.body.payedFrom;
  const payedTo = req.body.payedTo;
  const memberID = req.body.memberID;
  const didPay = req.body.didPay;
  pool.query('INSERT INTO payments  (payedFrom,payedTo,memberID,didPay) VALUES ("'+payedFrom+'","'+payedTo+'",'+memberID+','+didPay+');', function(err, rows, fields) {
    console.log("Fuck",err);
    if (err) throw err;
    res.status(200).json({status:"ok"})
  });
 
});

router.post('/confirmPayment',async(req, res) =>{
  console.log(req.body)
  const paymentID = req.body.id;

  pool.query('UPDATE payments SET didPay=true WHERE id='+paymentID+';', function(err, rows, fields) {
    console.log("Fuck",err);
    if (err) throw err;
    res.status(200).json({status:"ok"})
  });
 
});


router.post('/deletePayment',async(req, res) =>{
  console.log(req.body)
  const paymentID = req.body.id;

  pool.query('DELETE FROM payments WHERE id = '+paymentID+';', function(err, rows, fields) {
    console.log("Fuck",err);
    if (err) throw err;
    res.status(200).json({status:"ok"})
  });
 
});


router.get("/exportDatabase2", (req, res) => {

  var wb = new excel.Workbook();
  var ws = wb.addWorksheet('SHEET_NAME');
  ws.cell(1, 1).string('ALL YOUR EXCEL SHEET FILE CONTENT');
  wb.write(`FileName.xlsx`, res);
});

router.get("/exportDatabase", (req, res) => {
  
      // const file = '/Users/Backend/node/projects/1/mongoose/hi.png';
      // res.download(file);



  var workbook = new excel.Workbook();

  var worksheet = workbook.addWorksheet('Sheet 1');
  
  // Create a reusable style
  var style = workbook.createStyle({
    font: {
      color: '#000000',
      size: 20
    },
   
  });
  var columnStyle = workbook.createStyle({
    font: {
      color: '#000000',
      size: 14
    },
   
  });
  
  worksheet.cell(1,1).string("ID").style(style);
  
  worksheet.cell(1,2).string("Ime").style(style);
  
 
  worksheet.cell(1,3).string('Prezime').style(style);
  
  worksheet.cell(1,4).string('Broj tel.').style(style);
  worksheet.cell(1,5).string('Zadnja uplate').style(style);
  worksheet.cell(1,6).string('Uplatio je?').style(style);

  
  
  

  pool.query('SELECT MAX(payments.payedTo) as lastPayment,payments.didPay, m.id as memberId, m.firstname, m.lastname, m.phoneNumber, m.reg_date as registered FROM member as m LEFT JOIN payments ON payments.memberId=m.id  GROUP BY m.id;', function(err, rows, fields) {
    console.log("Error", err);
    if (err) throw err;
    var obj = JSON.parse(JSON.stringify(rows));
  //  res.sendFile('/Users/Backend/node/projects/1/mongoose/hi.png')

    console.log("Table", obj);
    for (let i = 0; i < obj.length; i++) {
      let id = checkNull(obj[i].memberId);
      let firstname = checkNull(obj[i].firstname);
      let lastname = checkNull(obj[i].lastname);
      let phoneNumber = checkNull(obj[i].phoneNumber);
      let lastPayment = checkNull(obj[i].lastPayment);
      let didPay = checkNull(obj[i].didPay);
      worksheet.cell(i+2,1).string(id).style(columnStyle);
      worksheet.cell(i+2,2).string(firstname).style(columnStyle);
      worksheet.cell(i+2,3).string(lastname).style(columnStyle);
      worksheet.cell(i+2,4).string(phoneNumber).style(columnStyle);
      worksheet.cell(i+2,5).string(lastPayment).style(columnStyle);
      worksheet.cell(i+2,6).string(didPay).style(columnStyle);
    }
    workbook.write(`FileName9.xlsx`, res);
  });
  });
function checkNull(value){
  if (value == null){
return ""
  }
  const novi  = ""+value;
  return novi
}
module.exports = router;


// router.post('/addMember',async(req, res) =>{
//   console.log(req.body)
//   const firstName = req.body.firstname;
//   const lastName = req.body.lastname;
//   pool.query('INSERT INTO member (firstname, lastname) VALUES ("'+firstName+'","'+lastName+'");', function(err, rows, fields) {
//     console.log("Fuck",err);
//     if (err) throw err;
//     res.status(200).json({status:"ok"})
//   });
 
// });