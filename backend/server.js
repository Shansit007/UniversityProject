const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const facultyRoutes = require('./routes/faculty');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');   // ✅ added
const clubRoutes = require('./routes/club');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Mount routes
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);              // ✅ mounted
app.use('/api/club', clubRoutes);


app.get('/', (req, res) => res.send('Server is alive'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
