import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key]
            .toLowerCase()
            .includes(value.toLowerCase().replace('%20', ' '));
        });
      });
    }
    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    this.#persist();
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex < 0) {
      throw new Error('There is no task with such id!');
    }

    this.#database[table].splice(rowIndex, 1);
    this.#persist();
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex < 0) {
      throw new Error('There is no task with such id!');
    }

    this.#database[table][rowIndex] = {
      ...this.#database[table][rowIndex],
      ...data,
      updated_at: new Date(),
    };
    this.#persist();
  }

  complete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex < 0) {
      throw new Error('There is no task with such id!');
    }

    this.#database[table][rowIndex] = {
      ...this.#database[table][rowIndex],
      updated_at: new Date(),
      completed_at: this.#database[table][rowIndex].completed_at
        ? null
        : new Date(),
    };
    this.#persist();
  }
}
