/* eslint-env node */
/* eslint-disable no-undef */
// @ts-nocheck

const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/entries', (req, res, next) => {
  const db = router.db;
  const entries = db.get('entries').value() || [];
  const maxId = entries.reduce((m, e) => {
    const n = Number(e.id);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  req.body.id = maxId + 1;
  next();
});

server.use(router);

const port = process.env.PORT || 9091;
server.listen(port, () => {
  console.log(`JSON Server with auto-increment running on :${port}`);
});
