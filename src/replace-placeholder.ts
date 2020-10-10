import { compile } from 'handlebars';

export function replacePlaceholder(template: string, data: any) {
  const handle = compile(template);
  return handle(data);
}
