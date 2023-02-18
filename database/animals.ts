import { cache } from 'react';
import { sql } from './connect';

export type Animal = {
  id: number;
  firstName: string;
  type: string;
  accessory: string | null;
};

// get ll animals
export const getAnimals = cache(async () => {
  const animals = await sql<Animal[]>`
    SELECT * FROM animals
  `;
  return animals;
});

// Get animal by id

export const getAnimalById = cache(async (id: number) => {
  if (Number.isNaN(id)) {
    return undefined;
  }

  const [animal] = await sql<Animal[]>`
    SELECT
      *
    FROM
      animals
    WHERE
      id = ${id}
  `;

  return animal;
});

// Create animal
export const createAnimal = cache(
  async (firstName: string, type: string, accessory: string) => {
    const [animal] = await sql<Animal[]>`
    INSERT INTO animals
      (first_name, type, accessory)
    VALUES
      (${firstName}, ${type}, ${accessory})
    RETURNING *
  `;
    return animal;
  },
);

// update animal
export const updateAnimalById = cache(
  async (id: number, firstName: string, type: string, accessory: string) => {
    if (Number.isNaN(id)) {
      return undefined;
    }

    const [animal] = await sql<Animal[]>`
    UPDATE
      animals
    SET
      first_name = ${firstName},
      type = ${type},
      accessory = ${accessory}
    WHERE
      id = ${id}
    RETURNING *
  `;
    return animal;
  },
);

// Delete animal
export const deleteAnimalById = cache(async (id: number) => {
  if (Number.isNaN(id)) {
    return undefined;
  }

  const [animal] = await sql<Animal[]>`
    DELETE FROM
      animals
    WHERE
      id = ${id}
    RETURNING *
  `;
  return animal;
});

// Get animal by first name
export const getAnimalByFirstName = cache(async (firstName: string) => {
  if (!firstName) {
    return undefined;
  }

  const [animal] = await sql<Animal[]>`
      SELECT
        *
      FROM
        animals
      WHERE
        first_name = ${firstName}
  `;
  return animal;
});
