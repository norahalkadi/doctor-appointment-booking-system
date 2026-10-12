

-- Create Database
CREATE DATABASE IF NOT EXISTS clinic_booking;
USE clinic_booking;


CREATE TABLE patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    date_registered DATE DEFAULT (CURRENT_DATE)
);



CREATE TABLE doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    available_days VARCHAR(50)
);



CREATE TABLE appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
);




INSERT INTO patients (full_name, email, phone, date_registered) VALUES
('Mohammed Al-Ghamdi', 'mohammed.ghamdi@email.com', '0551234567', '2025-01-15'),
('Fatima Al-Otaibi', 'fatima.otaibi@email.com', '0559876543', '2025-01-20'),
('Abdullah Al-Dosari', 'abdullah.dosari@email.com', '0555551234', '2025-02-01'),
('Noura Al-Qahtani', 'noura.qahtani@email.com', '0557778888', '2025-02-10'),
('Khalid Al-Harbi', 'khalid.harbi@email.com', '0554445555', '2025-02-15');

INSERT INTO doctors (doctor_name, specialization, available_days) VALUES
('Dr. Sarah Al-Ahmad', 'General Practice', 'Mon, Wed, Fri'),
('Dr. Ahmed Al-Mansour', 'Cardiology', 'Tue, Thu, Sat'),
('Dr. Maha Al-Shehri', 'General Practice', 'Mon, Tue, Wed'),
('Dr. Omar Al-Zahrani', 'Cardiology', 'Wed, Thu, Fri'),
('Dr. Laila Al-Mutairi', 'Pediatrics', 'Mon, Wed, Sat');


INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, notes) VALUES
(1, 1, '2025-02-20', '10:00:00', 'Confirmed', 'General checkup'),
(2, 2, '2025-02-21', '09:00:00', 'Pending', 'Heart checkup'),
(3, 1, '2025-02-22', '15:00:00', 'Confirmed', 'Follow-up visit'),
(4, 3, '2025-02-25', '11:00:00', 'Confirmed', 'Consultation'),
(5, 4, '2025-02-28', '14:30:00', 'Pending', 'First visit');


SELECT * FROM patients;
SELECT * FROM doctors;
SELECT * FROM appointments;


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
ORDER BY a.appointment_date;