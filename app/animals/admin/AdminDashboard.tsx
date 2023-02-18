'use client';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { AnimalResponseType } from '../Animals';

const createAnimal = gql`
  mutation CreateAnimal(
    $firstName: String!
    $type: String!
    $accessory: String
  ) {
    createAnimal(firstName: $firstName, type: $type, accessory: $accessory) {
      id
      firstName
      type
      accessory
    }
  }
`;

const getAnimals = gql`
  query GetAnimals {
    animals {
      id
      firstName
      type
      accessory
    }
  }
`;

const deleteAnimalMutation = gql`
  mutation DeleteAnimal($id: ID!) {
    deleteAnimalById(id: $id) {
      id
    }
  }
`;

const updateAnimalMutation = gql`
  mutation UpdateAnimal(
    $id: ID!
    $firstNameOnEditInput: String!
    $typeOnEditInput: String!
    $accessoryOnEditInput: String
  ) {
    updateAnimalById(
      id: $id
      firstName: $firstNameOnEditInput
      type: $typeOnEditInput
      accessory: $accessoryOnEditInput
    ) {
      id
      firstName
      type
      accessory
    }
  }
`;

export default function AdminDashboard() {
  const [firstName, setFirstName] = useState('');
  const [type, setType] = useState('');
  const [accessory, setAccessory] = useState('');
  const [onError, setOnError] = useState('');

  const [accessoryOnEditInput, setAccessoryOnEditInput] = useState('');
  const [firstNameOnEditInput, setFirstNameOnEditInput] = useState('');
  const [typeOnEditInput, setTypeOnEditInput] = useState('');
  const [onEditId, setOnEditId] = useState<number | undefined>();

  const { loading, data, refetch } = useQuery<AnimalResponseType>(getAnimals, {
    onCompleted: async () => {
      await refetch();
    },
  });

  const [handleCreateAnimal] = useMutation(createAnimal, {
    variables: {
      firstName,
      type,
      accessory,
    },

    onError: (error) => {
      setOnError(error.graphQLErrors[0].message);
    },

    onCompleted: async () => {
      await refetch();
      setFirstName('');
      setType('');
      setAccessory('');
      setOnError('');
    },
  });

  const [handleDeleteAnimal] = useMutation(deleteAnimalMutation, {
    onError: (error) => {
      setOnError(error.graphQLErrors[0].message);
    },

    onCompleted: async () => {
      await refetch();
      setOnError('');
    },
  });

  const [handleUpdateAnimal] = useMutation(updateAnimalMutation, {
    variables: {
      id: onEditId,
      firstNameOnEditInput,
      typeOnEditInput,
      accessoryOnEditInput,
    },

    onError: (error) => {
      setOnError(error.graphQLErrors[0].message);
      return;
    },

    onCompleted: async () => {
      await refetch();
      setOnError('');
    },
  });

  return (
    <>
      <h1>Dashboard</h1>
      <label>
        First Name
        <br />
        <input
          value={firstName}
          onChange={(event) => {
            setFirstName(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <label>
        Type
        <br />
        <input
          value={type}
          onChange={(event) => {
            setType(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <label>
        Accessory
        <br />
        <input
          value={accessory}
          onChange={(event) => {
            setAccessory(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <button onClick={async () => await handleCreateAnimal()}>
        Create Animal
      </button>
      <hr />
      {loading && <p>Loading...</p>}
      <p className="error">{onError}</p>

      {data?.animals.map((animal) => {
        const isEditing = onEditId === animal.id;
        return (
          <div key={`${animal.firstName}-${animal.id}`}>
            <input
              disabled={!isEditing}
              value={isEditing ? firstNameOnEditInput : animal.firstName}
              onChange={(event) => {
                setFirstNameOnEditInput(event.currentTarget.value);
              }}
            />
            <input
              disabled={!isEditing}
              value={isEditing ? typeOnEditInput : animal.type}
              onChange={(event) => {
                setTypeOnEditInput(event.currentTarget.value);
              }}
            />
            <input
              disabled={!isEditing}
              value={isEditing ? accessoryOnEditInput : animal.accessory || ''}
              onChange={(event) => {
                setAccessoryOnEditInput(event.currentTarget.value);
              }}
            />

            <button
              onClick={async () => {
                await handleDeleteAnimal({
                  variables: {
                    id: animal.id,
                  },
                });
              }}
            >
              X
            </button>

            {!isEditing ? (
              <button
                onClick={() => {
                  setOnEditId(animal.id);
                  setFirstNameOnEditInput(animal.firstName);
                  setAccessoryOnEditInput(animal.accessory || '');
                  setTypeOnEditInput(animal.type);
                }}
              >
                Edit
              </button>
            ) : (
              <button
                onClick={async () => {
                  setOnEditId(undefined);
                  await handleUpdateAnimal();
                }}
              >
                Save
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}
