import { existsSync, readFileSync } from 'fs';

export function findTemplate(path: string) {
  path = `./templates${path}.mjml`;
  if (existsSync(path)) {
    return readFileSync(path);
  } else {
    throw new Error('Not found' + path);
  }
}
