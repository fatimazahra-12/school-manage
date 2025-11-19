import express from 'express';
import filiereRouter from './routes/filiereRoute';

const app = express();
app.use(express.json());

// Health check for Render / Jenkins tests
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Filière routes
app.use('/api/filieres', filiereRouter);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});

export default app;
