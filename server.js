// Environment variables ko load karta hai
require('dotenv').config();

// External Packages (NPM se install kiye gaye)
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// Internal Modules (Humare banaye gaye files)
const connectDB = require('./src/config/db');

// --- Sabhi Route Files ko Import karna ---
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const recordRoutes = require('./src/routes/recordRoutes');
const healthProfileRoutes = require('./src/routes/healthProfileRoutes');
const doctorProfileRoutes = require('./src/routes/doctorProfileRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// Express app ko initialize karna
const app = express();
const PORT = process.env.PORT || 3000;

// Database se connect karna
connectDB();

// --- Middleware Setup (Gatekeepers) ---

// Form se aane waale data ko padhne ke liye
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookies ko handle karne ke liye
app.use(cookieParser());

// User login session ko manage karne ke liye
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 * 24 } // Session 24 ghante tak valid rahega
}));

// Success/Error messages dikhane ke liye
app.use(flash());

// Global variables, taaki EJS files mein inko use kar sakein
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user || null; // User ki info har page par available
    next();
});

// --- View Engine aur Static Files ---

// EJS ko view engine set karna
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CSS, Frontend JS, aur Images ko 'public' folder se serve karna
app.use(express.static(path.join(__dirname, 'public')));

// --- Sabhi Routes ko App se Jodna (URL Management) ---

app.use('/', authRoutes);
app.use('/', userRoutes); // '/dashboard' ke liye
app.use('/', healthProfileRoutes); // '/profile' ke liye
app.use('/', doctorProfileRoutes); // '/doctor-profile' ke liye
app.use('/', analyticsRoutes); // '/analytics' ke liye
app.use('/admin', adminRoutes);
app.use('/patients', patientRoutes);
app.use('/doctors', doctorRoutes);
app.use('/records', recordRoutes);
app.use('/appointments', appointmentRoutes);


// --- Server ko Start Karna ---

app.listen(PORT, () => {
    console.log(`🚀 Server is running successfully on http://localhost:${PORT}`);
    console.log('Hackathon ke liye taiyaar! All the best, Amit!');
});

