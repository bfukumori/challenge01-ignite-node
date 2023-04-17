import http from 'node:http';
import { routes } from './routes.js';
import { json } from './middlewares/json.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find(
    (route) => route.method === method && route.path.test(url)
  );

  if (route) {
    const routeParams = url.match(route.path);
    if (routeParams.groups) {
      const { ...params } = routeParams.groups;
      req.params = params;
    }

    return route.handler(req, res);
  }
  return res.writeHead(404).end();
});

server.listen(3333);
