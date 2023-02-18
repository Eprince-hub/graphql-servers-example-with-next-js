const animals = [
  { first_name: 'Sylas', type: 'anguila', accessory: 'pop tart' },
  { first_name: 'Evelina', type: 'Hedgehog', accessory: 'Comb' },
  { first_name: 'Otto', type: 'Otter', accessory: 'Stone' },
  { first_name: 'Mayo', type: 'Dog', accessory: 'Sweater' },
  { first_name: 'Kaaaarl', type: 'Llama', accessory: 'Toque' },
];

export async function up(sql) {
  await sql`
    INSERT INTO animals ${sql(animals, 'first_name', 'type', 'accessory')}
  `;
}

export async function down(sql) {
  for (const animal of animals) {
    await sql`
      DELETE FROM
        animals
      WHERE
        first_name = ${animal.first_name} AND
        type = ${animal.type} AND
        accessory = ${animal.accessory}
    `;
  }
}
