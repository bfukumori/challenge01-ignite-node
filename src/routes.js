import { randomUUID } from 'node:crypto';

import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message:
              'You must provide a title and a description to create a task!',
          })
        );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      };

      database.insert('tasks', task);

      return res.writeHead(201).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      try {
        database.delete('tasks', id);
        return res.end();
      } catch (error) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: error.message,
          })
        );
      }
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message:
              'You must provide a title and a description to update a task!',
          })
        );
      }
      try {
        database.update('tasks', id, {
          title,
          description,
        });
        return res.writeHead(201).end();
      } catch (error) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: error.message,
          })
        );
      }
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/completed'),
    handler: (req, res) => {
      const { id } = req.params;

      try {
        database.complete('tasks', id);
        return res.writeHead(201).end();
      } catch (error) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: error.message,
          })
        );
      }
    },
  },
];
