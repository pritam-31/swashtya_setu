// Environment variables load
require('dotenv').config({ path: './.env' });

const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Models
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');
const HealthProblem = require('../models/healthProblemModel');
const Appointment = require('../models/appointmentModel');
const Record = require('../models/recordModel');

// Connect to DB
connectDB();

const importData = async () => {
    try {
        console.log('Purana data delete ho raha hai...');
        await User.deleteMany();
        await Doctor.deleteMany();
        await Patient.deleteMany();
        await HealthProblem.deleteMany();
        await Appointment.deleteMany();
        await Record.deleteMany();
        console.log('Purana data delete ho gaya!');

        // Create sample users
        const createdUsers = await User.insertMany([
            { fullName: 'Dr. Priya Sharma', email: 'priya@email.com', password: 'password123', role: 'doctor' },
            { fullName: 'Dr. Raj Verma', email: 'raj@email.com', password: 'password123', role: 'doctor' },
            { fullName: 'Ramesh Kumar', email: 'ramesh@email.com', password: 'password123', role: 'patient' },
            { fullName: 'Sunita Devi', email: 'sunita@email.com', password: 'password123', role: 'patient' },
            { fullName: 'Admin User', email: 'admin@email.com', password: 'password123', role: 'admin' }
        ]);

        const doctorPriya = createdUsers[0];
        const doctorRaj = createdUsers[1];
        const patientRamesh = createdUsers[2];
        const patientSunita = createdUsers[3];

        await Doctor.create([
            { user: doctorPriya._id, specialization: 'Cardiologist', qualifications: 'MD, MBBS', experienceInYears: 10, isApproved: true },
            { user: doctorRaj._id, specialization: 'Dermatologist', qualifications: 'MBBS', experienceInYears: 5, isApproved: false }
        ]);

        await Patient.create([
            { user: patientRamesh._id, dateOfBirth: new Date('1990-05-15'), gender: 'Male', contactNumber: '9876543210' },
            { user: patientSunita._id, dateOfBirth: new Date('1995-08-20'), gender: 'Female', contactNumber: '9876543211' }
        ]);

        await HealthProblem.create([
            { patient: patientRamesh._id, title: 'Fever and Cough', description: 'High fever and continuous cough for 3 days.', status: 'Active' },
            { patient: patientSunita._id, title: 'Skin Rash', description: 'Red rashes on arms for a week.', status: 'Active' }
        ]);

        await Appointment.create([
            { patient: patientRamesh._id, doctor: doctorPriya._id, appointmentDate: new Date(), reason: 'Follow-up for fever', status: 'Confirmed' },
            { patient: patientSunita._id, doctor: doctorRaj._id, appointmentDate: new Date(), reason: 'Checkup for skin rash', status: 'Pending' }
        ]);

        console.log('✅ Sample Data Successfully Import Ho Gaya!');
        process.exit();

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-import') {
    importData();
}
