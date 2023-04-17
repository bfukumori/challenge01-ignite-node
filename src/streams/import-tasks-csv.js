import { parse } from 'csv-parse';
import { createReadStream } from 'node:fs';

const csvPath = new URL('./tasks.csv', import.meta.url);

(() => {
  const readableStream = createReadStream(csvPath, 'utf-8');

  const parseConfig = {
    columns: true,
    delimiter: ',',
    trim: true,
  };

  readableStream.pipe(parse(parseConfig)).on('data', (chunk) => {
    fetch('http:localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify(chunk),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  readableStream.on('error', (error) => console.log('Error found: ', error));

  readableStream.on('end', () => {
    console.log('Finished importing tasks from csv');
  });
})();
