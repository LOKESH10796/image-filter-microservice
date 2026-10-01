import express from 'express';
import bodyParser from 'body-parser';
import pinoHttp from 'pino-http';
import { z } from 'zod';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

async function main() {
  const app = express();
  const port = process.env.PORT || 8082;

  // Middleware
  app.use(bodyParser.json());
  app.use(express.static('public')); // Serve the beautiful frontend UI
  app.use(pinoHttp({
    transport: {
      target: 'pino-pretty',
      options: { colorize: true }
    }
  }));

  // Input Validation Schema
  const QuerySchema = z.object({
    image_url: z.string().url("Must be a valid URL"),
    filter: z.enum(['grayscale', 'blur', 'invert', 'sepia', 'none']).optional().default('grayscale'),
    width: z.coerce.number().min(50).max(2000).optional().default(500),
    height: z.coerce.number().min(50).max(2000).optional().default(500)
  });

  // Healthcheck API
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', version: '2.0.0' });
  });

  // Primary Processing Endpoint
  app.get('/filteredimage', async (req: express.Request, res: express.Response) => {
    try {
      // 1. Validate Input using Zod
      const { image_url, filter, width, height } = QuerySchema.parse(req.query);

      // 2. Process Image (Fetch + Sharp)
      const filePath = await filterImageFromURL(image_url, filter, width, height);

      // 3. Send File and Cleanup asynchronously
      res.status(200).sendFile(filePath, (err) => {
        if (err) {
          req.log.error(err, 'Error sending file');
        }
        deleteLocalFiles([filePath]);
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Bad Request',
          details: error.issues
        });
      }
      
      req.log.error(error, 'Image processing failed');
      return res.status(422).json({
        error: 'Unprocessable Entity',
        message: 'Unable to process the provided image URL. Ensure it points to a valid public image.'
      });
    }
  });

  // Start Server
  app.listen(port, () => {
    console.log(`🚀 Microservice running optimally on http://localhost:${port}`);
    console.log('Press CTRL+C to stop server');
  });
}

main().catch(console.error);