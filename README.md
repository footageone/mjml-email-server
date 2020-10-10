# footage.one Mail generator

Micro-Service for creating HTML mails from MJML templates.

The templates need to be provides (probably through a docker mount) to a folder called templates

The server can be queried with POST on a path with the template name. So for example share.mjml can be targeted under /share.
The body of the request should contain the data that should be inserted into the template.

## Local

Create a symlink templates `ln -s ../your-templates ./templates`

Start with `npm run start`

## Change output

There are two possible output formats. If the request is done with `Accept: text/html` header the service will return the html.
If the request is done with `Accept: application/json` header the response will be the MJML object.
