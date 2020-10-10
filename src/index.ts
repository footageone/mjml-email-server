import express from 'express';
import bodyParser from 'body-parser';
import { findTemplate } from './find-template';
import { compileTemplate } from './compile-template';
import { replacePlaceholder } from './replace-placeholder';

const app = express();
const port = 3000;

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('*', (req, res) => {
  if (req.url.startsWith('/_')) {
    return res.sendStatus(400);
  } else {
    let template;
    try {
      template = findTemplate(req.url);
    } catch (e) {
      console.error(e);
      return res.sendStatus(404);
    }

    try {
      const populatedTemplate = replacePlaceholder(template.toString(), req.body);
      const compiledTemplate = compileTemplate(populatedTemplate);
      if (req.accepts('text/html')) {
        res.send(compiledTemplate.html);
      } else {
        res.send(compiledTemplate);
      }
    } catch (e) {
      return res.sendStatus(500);
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
