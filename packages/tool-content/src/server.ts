import App from 'koa';
import Router from 'koa-router';
import sqlite from 'better-sqlite3';
import cors from '@koa/cors';
import body from 'koa-body';

const app = new App();
const db = sqlite('./db.sqlite');

interface ContentRecord {
  id: number;
  eid: string;
  type: string;
  data: string;
}

const router = new Router()
  .get('/api', ctx => {
    ctx.status = 200;
  })
  .get('/api/files', ctx => {
    const rows = db.prepare('SELECT DISTINCT type FROM contents').all() as ContentRecord[];
    ctx.body = rows.map(row => row.type);
  })
  .get(`/api/content/:file`, ctx => {
    const ids = Array.isArray(ctx.query.id) ? ctx.query.id : [ctx.query.id];
    const rows = db
      .prepare('SELECT * FROM contents WHERE type = ? AND eid IN (?)')
      .all(ctx.params.file, ids.join(',')) as ContentRecord[];

    ctx.body = rows.map(({ id, eid, ...row }) => {
      const data = JSON.parse(row.data) ?? {};
      return { id, eid, ...data };
    });
  })
  .get('/api/content/:file/:id', ctx => {
    const record = db
      .prepare('SELECT * FROM contents WHERE type = ? AND eid = ?')
      .get(ctx.params.file, ctx.params.id) as ContentRecord | null;

    if (record) {
      const data = JSON.parse(record.data);
      ctx.body = { id: record.id, eid: record.eid, ...data };
    } else {
      ctx.throw(404);
    }
  })
  .post('/api/content/:file', ctx => {
    const { eid = null, ...data } = JSON.parse(ctx.request.body ?? '{}');
    if (!eid) ctx.throw(400);
    const insert = db
      .prepare('INSERT INTO contents (eid, type, data) VALUES (@eid, @file, @data')
      .run({ eid, type: ctx.params.file, data: JSON.stringify(data) });

    ctx.body = { id: insert.lastInsertRowid, eid, data };
  });

app.use(body()).use(cors()).use(router.middleware()).listen(3001);
