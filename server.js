const express = require('express');
const as=require('moment');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
  const util = require('./util') ;

app.use(bodyParser.json());
   

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: 'password', 
  database: 'hospital_db'
});
   

conn.getConnection((err) =>{
  if(err) throw err;
  console.log('Mysql Connected ');
});
   

app.post('/api/add_doctor',(req, res) => {
  let data = {doctor_id: req.body.doctor_id, start_time: req.body.start_time,end_time: req.body.end_time,no_of_patients: req.body.no_of_patients};
  
  let sqlQuery = "INSERT INTO doctor_availabilities SET ?";
  
  let query = conn.query(sqlQuery, data,(err, results) => {
    if(err) throw err;
   
    const [hours, minutes, seconds] = data.start_time.split(':');
    const totalmins = (+hours) * 60  + (+minutes);

    const [hours1, minutes1, seconds1] = data.end_time.split(':');
    const totalmins1 = (+hours1) * 60  + (+minutes1) ;
    console.log(totalmins1);
  
    console.log(req.body.no_of_patients);

  
  var minDiff = totalmins1 - totalmins;   
 var rows = minDiff / data.no_of_patients; 
 for(let i=0;i<=data.no_of_patients-1;i++)
 {
  
   var calc_start= totalmins + rows*(i);
   var calc_end=totalmins + rows*(i+1);

   var convStart = util.hour(calc_start);
   var convEnd = util.hour(calc_end);

   let data1 = {doctor_id: req.body.doctor_id,doctor_availability_id:req.body.doctor_id, slot_start_time: convStart,slot_endt_time: convEnd};
   let sqlQuery1 = "INSERT INTO doctor_time_slots SET ?";
   conn.query(sqlQuery1, data1)
   
   
  
  }
  res.send(apiResponse(results));
  });
 
}); 



app.get('/api/doctors_avail',(req, res) => {
  let sqlQuery = "SELECT * FROM doctor_availabilities";
  
  let query = conn.query(sqlQuery, (err, results) => {
    
    if(err) throw err;
    res.send(apiResponse(results));
    
  });
});
app.post('/api/doctor_time_slot',(req, res) => {
  let data = {doctor_id: req.body.doctor_id, start_time: req.body.start_time,end_time: req.body.end_time,no_of_patients: req.body.no_of_patients};
  
  let sqlQuery = "INSERT INTO doctor_availabilities SET ?";
  
  let query = conn.query(sqlQuery, data,(err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});

  
app.post('/api/patient_booking/:doctor_availability_id',(req, res) => {
  console.log("heloo");
     
    //let q1=conn.query("INSERT INTO hospital_db.patient_booking_slot(patienappot_id, doctor_time_slot_id, intment_date) values (100, ('SELECT distinct doctor_availability_id FROM doctor_time_slots where doctor_availability_id=' + req.params.doctor_availability_id), '2021-09-12')");

  let data1 = {doctor_id: req.body.doctor_id,doctor_availability_id:100,appointment_date:'2022-03-12'};
  let sqlQuery1 = "INSERT INTO patient_booking_slot SET ?";
conn.query(sqlQuery1, data1)
  
  
 });

 app.get('/api/doctor/:doctor_id',(req, res) => {
  let sqlQuery = "SELECT * FROM doctor_availabilities WHERE doctor_id=" + req.params.doctor_id;
    
  let query = conn.query(sqlQuery, (err, results) => {
    if(err) throw err;
    res.send(apiResponse(results));
  });
});
   


   
function apiResponse(results){
  return JSON.stringify({"status": 200, "error": null, "response": results});
}

app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});
     
          
          

 
  
  
 
