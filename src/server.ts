import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

async function main() {
  const app = express();
  const port = process.env.PORT || 8082;

  app.use(bodyParser.json());

  app.get('/filteredimage', async (req: express.Request, res: express.Response) => {
    const url = req.query.image_url as string;

    if (!url) {
      return res.status(400).send('Image url is required');
    }

    try {
      const filePath = await filterImageFromURL(url);
      res.sendFile(filePath, () => {
        deleteLocalFiles([filePath]);
      });
    } catch (error) {
      return res.status(422).send('Try another image url');
    }
  });

  app.get('/', (_req, res) => {
    res.send('try GET /filteredimage?image_url={{}}');
  });

  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log('press CTRL+C to stop server');
  });
}

main();