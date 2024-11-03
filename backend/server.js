import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow requests from frontend
app.use(express.json()); // Parse JSON bodies

// Register the /auth routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
