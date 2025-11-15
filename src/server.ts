import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger';
import { mockComedians } from './data/mockData';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-15T10:30:00.000Z
 */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /api/comedians:
 *   get:
 *     summary: Get all comedians
 *     tags: [Comedians]
 *     responses:
 *       200:
 *         description: List of comedians
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: number
 */
app.get('/api/comedians', (req, res) => {
  res.status(200).json({
    data: mockComedians,
    count: mockComedians.length,
  });
});


/**
 * @swagger
 * /api/comedians:
 *   post:
 *     summary: Create a new comedian
 *     tags: [Comedians]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dave Chappelle"
 *               bio:
 *                 type: string
 *                 example: "American stand-up comedian"
 *               nationality:
 *                 type: string
 *                 example: "US"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1973-08-24"
 *     responses:
 *       201:
 *         description: Comedian created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
app.post('/api/comedians', (req, res) => {
  const newComedian = {
    id: Date.now().toString(), // Simple ID generation for now
    ...req.body,
  };
  mockComedians.push(newComedian);
  res.status(201).json({
    message: 'Comedian created successfully',
    data: newComedian,
  });
});


// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});


export default app;
