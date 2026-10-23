import express from 'express';
import path from 'node:path';
import { HttpError } from './http.js';
import { confirmDate, createMeeting, getMeeting, getResponses, saveResponse, shareLocation, voteForPlace } from './store.js';

const app = express();
const port = Number(process.env.API_PORT) || 8787;

app.use(express.json({ limit: '256kb' }));
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

function sendError(res, error) {
  if (error instanceof HttpError) {
    res.status(error.status).json({
      error: error.error,
      message: error.message,
      field: error.field,
    });
    return;
  }
  console.error(error);
  res.status(500).json({ error: 'server', message: 'ဆာဗာမှာ ပြဿနာ ဖြစ်နေပါတယ်။' });
}

app.post('/api/meetings', async (req, res) => {
  try {
    const meeting = await createMeeting(req.body?.organizer);
    res.status(201).json(meeting);
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/meetings/:code', async (req, res) => {
  try {
    res.json(await getMeeting(req.params.code));
  } catch (error) {
    sendError(res, error);
  }
});

app.get('/api/meetings/:code/responses', async (req, res) => {
  try {
    res.json(await getResponses(req.params.code));
  } catch (error) {
    sendError(res, error);
  }
});

app.post('/api/meetings/:code/responses', async (req, res) => {
  try {
    const saved = await saveResponse(req.params.code, req.body);
    res.status(saved.updated ? 200 : 201).json(saved);
  } catch (error) {
    sendError(res, error);
  }
});

app.post('/api/meetings/:code/votes', async (req, res) => {
  try { res.json(await voteForPlace(req.params.code, req.body)); } catch (error) { sendError(res, error); }
});

app.post('/api/meetings/:code/confirmation', async (req, res) => {
  try { res.json(await confirmDate(req.params.code, req.body)); } catch (error) { sendError(res, error); }
});

app.post('/api/meetings/:code/locations', async (req, res) => {
  try { res.json(await shareLocation(req.params.code, req.body)); } catch (error) { sendError(res, error); }
});

const distDir = path.join(process.cwd(), 'dist');
app.use(express.static(distDir));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`API http://localhost:${port}`);
});
