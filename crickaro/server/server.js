// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Upload = require('./models/details'); // Ensure this model is defined correctly
const User = require('./models/User'); // Ensure this model is defined correctly
const Blog = require('./models/blog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// MongoDB Connection
mongoose.connect(dbURI, {
    dbName: 'crickaro-db',
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Token verification middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token is required.' });

    try {
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

// Registration Route
app.post('/api/register', async (req, res) => {
    const { name, email, password, domain } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, domain });
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, domain });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            console.log("checking for password match")
            return res.status(401).json({ message: "Invalid credentials(Password Don't Match)" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, domain: user.domain });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Failed to log in" });
    }
});

// Get User Info Route (protected)
app.get('/api/user', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Error fetching user info.' });
    }
});

app.post('/save-tournament', async (req, res) => {
    const { image, district, tournamentBall, teamname, startDate, endDate, startTime, endTime } = req.body;

    if (!image || !district || !tournamentBall || !teamname || !startDate || !endDate || !startTime || !endTime) {
        return res.status(400).json({ message: 'All fields are required to save tournament details.' });
    }

    try {
        const newUpload = new Upload({
            image,
            district,
            tournamentBall,
            teamname,
            startDate,
            endDate,
            startTime,
            endTime,
        });

        await newUpload.save();
        res.json({ message: 'Tournament details saved successfully' });
    } catch (error) {
        console.error('Error saving tournament:', error);
        res.status(500).json({ message: 'Failed to save tournament details', error: error.message });
    }
});


// Fetch Images Route
app.get('/api/images', async (req, res) => {
    const { district, tournamentType } = req.query;
    console.log(req.query)
    let filter = { district };
    if (tournamentType && tournamentType !== 'All') {
        filter.tournamentType = tournamentType;     
    }

    try {
        const tournaments = await Upload.find(filter);
        res.json(tournaments);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Failed to fetch images' });
    }
});

// GET endpoint to fetch tournaments based on district and tournament type
app.get('/api/tournaments', async (req, res) => {
    const { district, tournamentBall } = req.query;

    try {
        const filter = {};
        if (district) filter.district = district;
        if (tournamentBall) filter.tournamentBall = tournamentBall;

        const tournaments = await Upload.find(filter);
        
        if (tournaments.length === 0) {
            return res.status(404).json({ message: "No tournaments found for the specified criteria." });
        }

        res.status(200).json(tournaments);
    } catch (error) {
        console.error('Error fetching tournaments:', error);
        res.status(500).json({ message: 'Error fetching tournaments.', error: error.message });
    }
});

// Get all districts
app.get('/api/districts', async (req, res) => {
    try {
        const districts = await Upload.distinct('district');
        res.status(200).json(districts);
        console.log(json(districts))
    } catch (error) {
        console.error('Error fetching districts:', error);
        res.status(500).json({ error: 'Error fetching districts' });
    }
});
// Remove the verifyToken middleware
app.post('/api/save-blog', async (req, res) => {
    const { images, text, district, teamName } = req.body;

    // Log the incoming request data for debugging
    console.log("Received blog data:", { images, text, district, teamName });

    // Validate required fields
    if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ message: 'Images are required.' });
    }
    if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ message: 'Blog text is required.' });
    }
    if (!district || typeof district !== 'string' || district.trim() === '') {
        return res.status(400).json({ message: 'District is required.' });
    }
    if (!teamName || typeof teamName !== 'string' || teamName.trim() === '') {
        return res.status(400).json({ message: 'Team name is required.' });
    }

    try {
        // Create new blog instance
        const newBlog = new Blog({ images, text, district, teamName });
        await newBlog.save();
        
        // Return success response
        res.status(201).json({ message: 'Blog saved successfully!', blog: newBlog });
    } catch (error) {
        console.error('Error saving blog:', error);
        res.status(500).json({ message: 'Error saving blog.', error: error.message });
    }
});
// GET endpoint to retrieve all blogs or filter by district
app.get('/api/blogs', async (req, res) => {
    const { district } = req.query;

    try {
        const filter = district ? { district: new RegExp(district, 'i') } : {};
        const blogs = await Blog.find(filter).sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Error fetching blogs.', error: error.message });
    }
});


// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
