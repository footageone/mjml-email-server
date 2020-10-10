import express from 'express';
import bodyParser from 'body-parser';
import { StatusCodes } from 'http-status-codes';
import { findTemplate } from './find-template';
import { compileTemplate } from './compile-template';
import { replacePlaceholder } from './replace-placeholder';
import { errorResponse } from './error-response';

const app = express();
const port = 3000;

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('*', (req, res) => {
  if (req.url.startsWith('/_')) {
    return errorResponse(res, StatusCodes.BAD_REQUEST);
  } else {
    let template;
    try {
      template = findTemplate(req.url);
    } catch (e) {
      console.error(e);
      return errorResponse(res, StatusCodes.NOT_FOUND);
    }

    try {
      const populatedTemplate = replacePlaceholder(template.toString(), req.body);
      const compiledTemplate = compileTemplate(populatedTemplate);
      if (req.accepts('text/html')) {
        res.send(compiledTemplate.html);
      } else if (req.accepts('application/json')) {
        res.send(compiledTemplate);
      } else {
        return errorResponse(res, StatusCodes.NOT_ACCEPTABLE);
      }
    } catch (e) {
      console.error(e);
      return errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
