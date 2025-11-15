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
 *     parameters:
 *       - in: query
 *         name: nationality
 *         schema:
 *           type: string
 *         description: Filter by nationality (e.g., US, UK)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: List of comedians
 */
app.get('/api/comedians', (req, res) => {
  let filterComedians = mockComedians;
  const { nationality, limit, offset } = req.query;

  if(limit && offset){
    if(limit<=0){
    res.status(422).json({
      errMsg: "Limit parameter can not be negative."
    });}
    filterComedians = filterComedians.slice(offset,offset+limit);
  } 
  if(nationality){
    filterComedians = filterComedians.filter((comediant)=>comediant.nationality===nationality);
  } 
  res.status(200).json({
    data: filterComedians,
    count: filterComedians.length,
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

/**
 * @swagger
 * /api/comedians/{id}:
 *   get:
 *     summary: Get comedian by ID
 *     tags: [Comedians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comedian ID
 *     responses:
 *       200:
 *         description: Comedian details
 *       404:
 *         description: Comedian not found
 */
app.get('/api/comedians/:id', (req, res) => {
  const { id } = req.params;
  // Use id to find the comedian
  const comedianFound = mockComedians.find((comedian) => comedian.id==id);
  res.status(200).json({
    data: comedianFound,
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
