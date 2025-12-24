import express from 'express';
import cors from 'cors';
import { reviewRoutes } from './routes/index.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/review', reviewRoutes);

app.listen(3000, () => {
	console.log('Server listening on port 3000');
});
