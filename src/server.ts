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
  app.use(pinoHttp({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  }));

  // Input Validation Schema
  const QuerySchema = z.object({
    image_url: z.string().url("Must be a valid URL")
  });

  // Healthcheck / Root
  app.get('/', (_req, res) => {
    res.status(200).json({
      message: 'Welcome to the High-Performance Image Filter Microservice',
      endpoints: [
        'GET /filteredimage?image_url={public_url}'
      ]
    });
  });

  // Primary Processing Endpoint
  app.get('/filteredimage', async (req: express.Request, res: express.Response) => {
    try {
      // 1. Validate Input using Zod
      const { image_url } = QuerySchema.parse(req.query);

      // 2. Process Image (Fetch + Sharp)
      const filePath = await filterImageFromURL(image_url);

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