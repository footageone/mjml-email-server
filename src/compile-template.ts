import { join } from 'path';
import mjml2html from 'mjml';

const templatePath = join(process.cwd(), 'templates/');

export function compileTemplate(template: string) {
  console.log(templatePath);
  return mjml2html(template, { filePath: templatePath });
}
