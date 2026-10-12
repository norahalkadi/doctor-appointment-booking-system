
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../Frontend")));



const dbCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "clinic_booking",
});

dbCon.connect((error) => {
  if (error) {
    console.log("Database Connection Error: " + error.message);
    throw error;
  } else {
    console.log("Database connected successfully...");
  }
});



app.get("/data/patients", (req, res) => {
  let sqlQuery = "SELECT * FROM patients";
  
  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Internal Server Error" });
      throw error;
    }
    res.status(200).send({ success: true, data: results });
  });
});



app.get("/data/doctors", (req, res) => {
  let sqlQuery = "SELECT * FROM doctors";
  
  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Internal Server Error" });
      throw error;
    }
    res.status(200).send({ success: true, data: results });
  });
});



app.get("/data/appointments", (req, res) => {
  let sqlQuery = `
    SELECT 
      a.appointment_id,
      p.full_name AS patient_name,
      d.doctor_name,
      a.appointment_date,
      a.appointment_time,
      a.status,
      a.notes
    FROM appointments a
    JOIN patients p ON a.patient_id = p.patient_id
    JOIN doctors d ON a.doctor_id = d.doctor_id
    ORDER BY a.appointment_date
  `;
  
  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Internal Server Error" });
      throw error;
    }
    res.status(200).send({ success: true, data: results });
  });
});



app.get("/data/patient/:id", (req, res) => {
  let sqlQuery = `SELECT * FROM patients WHERE patient_id = ${req.params.id}`;
  
  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Internal Server Error" });
      throw error;
    }
    if (results.length === 0) {
      res.status(404).send({ success: false, message: "Patient not found" });
    } else {
      res.status(200).send({ success: true, data: results[0] });
    }
  });
});



app.get("/data/doctor/:id", (req, res) => {
  let sqlQuery = `SELECT * FROM doctors WHERE doctor_id = ${req.params.id}`;
  
  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Internal Server Error" });
      throw error;
    }
    if (results.length === 0) {
      res.status(404).send({ success: false, message: "Doctor not found" });
    } else {
      res.status(200).send({ success: true, data: results[0] });
    }
  });
});



app.get("/data/appointment/:id", (req, res) => {
  let sqlQuery = `
    SELECT 
      a.*,
      p.full_name AS patient_name,
      d.doctor_name
    FROM appointments a
    JOIN patients p ON a.patient_id = p.patient_id
    JOIN doctors d ON a.doctor_id = d.doctor_id
    WHERE a.appointment_id = ${req.params.id}
  `;
  
  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Internal Server Error" });
      throw error;
    }
    if (results.length === 0) {
      res.status(404).send({ success: false, message: "Appointment not found" });
    } else {
      res.status(200).send({ success: true, data: results[0] });
    }
  });
});



app.post("/data/patient", (req, res) => {
  const patient = {
    full_name: req.body.full_name,
    email: req.body.email,
    phone: req.body.phone,
  };

  let sqlQuery = `INSERT INTO patients (full_name, email, phone) 
                  VALUES ('${patient.full_name}', '${patient.email}', '${patient.phone}')`;

  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Error adding patient" });
      throw error;
    }
    res.status(201).send({ 
      success: true, 
      message: "Patient added successfully",
      patient_id: results.insertId 
    });
  });
});



app.post("/data/doctor", (req, res) => {
  const doctor = {
    doctor_name: req.body.doctor_name,
    specialization: req.body.specialization,
    available_days: req.body.available_days,
  };

  let sqlQuery = `INSERT INTO doctors (doctor_name, specialization, available_days) 
                  VALUES ('${doctor.doctor_name}', '${doctor.specialization}', '${doctor.available_days}')`;

  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Error adding doctor" });
      throw error;
    }
    res.status(201).send({ 
      success: true, 
      message: "Doctor added successfully",
      doctor_id: results.insertId 
    });
  });
});



app.post("/data/appointment", (req, res) => {
  const appointment = {
    patient_id: req.body.patient_id,
    doctor_id: req.body.doctor_id,
    appointment_date: req.body.appointment_date,
    appointment_time: req.body.appointment_time,
    notes: req.body.notes || '',
  };

  let sqlQuery = `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, notes) 
                  VALUES (${appointment.patient_id}, ${appointment.doctor_id}, '${appointment.appointment_date}', 
                  '${appointment.appointment_time}', '${appointment.notes}')`;

  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Error creating appointment" });
      throw error;
    }
    res.status(201).send({ 
      success: true, 
      message: "Appointment created successfully",
      appointment_id: results.insertId 
    });
  });
});



app.put("/data/patient/:id", (req, res) => {
  const patient = {
    full_name: req.body.full_name,
    email: req.body.email,
    phone: req.body.phone,
  };

  let sqlQuery = `UPDATE patients 
                  SET full_name = '${patient.full_name}', 
                      email = '${patient.email}', 
                      phone = '${patient.phone}' 
                  WHERE patient_id = ${req.params.id}`;

  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Error updating patient" });
      throw error;
    }
    res.status(200).send({ 
      success: true, 
      message: "Patient updated successfully",
      data: patient 
    });
  });
});



app.put("/data/doctor/:id", (req, res) => {
  const doctor = {
    doctor_name: req.body.doctor_name,
    specialization: req.body.specialization,
    available_days: req.body.available_days,
  };

  let sqlQuery = `UPDATE doctors 
                  SET doctor_name = '${doctor.doctor_name}', 
                      specialization = '${doctor.specialization}', 
                      available_days = '${doctor.available_days}' 
                  WHERE doctor_id = ${req.params.id}`;

  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Error updating doctor" });
      throw error;
    }
    res.status(200).send({ 
      success: true, 
      message: "Doctor updated successfully",
      data: doctor 
    });
  });
});



app.put("/data/appointment/:id", (req, res) => {
  const appointment = {
    patient_id: req.body.patient_id,
    doctor_id: req.body.doctor_id,
    appointment_date: req.body.appointment_date,
    appointment_time: req.body.appointment_time,
    status: req.body.status,
    notes: req.body.notes,
  };

  let sqlQuery = `UPDATE appointments 
                  SET patient_id = ${appointment.patient_id}, 
                      doctor_id = ${appointment.doctor_id}, 
                      appointment_date = '${appointment.appointment_date}', 
                      appointment_time = '${appointment.appointment_time}', 
                      status = '${appointment.status}', 
                      notes = '${appointment.notes}' 
                  WHERE appointment_id = ${req.params.id}`;

  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Error updating appointment" });
      throw error;
    }
    res.status(200).send({ 
      success: true, 
      message: "Appointment updated successfully",
      data: appointment 
    });
  });
});



app.delete("/data/patient/:id", (req, res) => {
  let sqlQuery = `DELETE FROM patients WHERE patient_id = ${req.params.id}`;

  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Error deleting patient" });
      throw error;
    }
    res.status(200).send({ 
      success: true, 
      message: "Patient deleted successfully" 
    });
  });
});



app.delete("/data/doctor/:id", (req, res) => {
  let sqlQuery = `DELETE FROM doctors WHERE doctor_id = ${req.params.id}`;

  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Error deleting doctor" });
      throw error;
    }
    res.status(200).send({ 
      success: true, 
      message: "Doctor deleted successfully" 
    });
  });
});


app.delete("/data/appointment/:id", (req, res) => {
  let sqlQuery = `DELETE FROM appointments WHERE appointment_id = ${req.params.id}`;

  dbCon.query(sqlQuery, (error, results) => {
    if (error) {
      res.status(500).send({ success: false, message: "Error deleting appointment" });
      throw error;
    }
    res.status(200).send({ 
      success: true, 
      message: "Appointment cancelled successfully" 
    });
  });
});



app.get("/", (req, res) => {
  res.send("<h1>Welcome to Clinic Appointment Booking System API</h1>");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});