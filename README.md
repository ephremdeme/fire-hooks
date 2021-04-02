# React Firebase Hooks

A set of reusable [React Hooks](https://reactjs.org/docs/hooks-intro.html) for [Firebase](https://firebase.google.com/)

[![npm version](https://img.shields.io/npm/v/@epha123/fire-hooks?style=flat-square)](https://www.npmjs.com/package/@epha123/fire-hooks)
[![npm downloads](https://img.shields.io/npm/dw/@epha123/fire-hooks?style=flat-square)](https://www.npmjs.com/package/@epha123/fire-hooks)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@epha123/fire-hooks?style=flat-square)](https://www.github.com/ephremdeme/fire-hooks)

## What is fire-hooks?

- **Easy realtime updates for your function components** - Hooks
  like `useCollectionData`and `useDocumentData()` let you easily subscribe to
  realtime data, and all other Firebase SDK events. Plus, they automatically unsubscribe when your component unmounts.

- **Checks and returns errors when it happens** - All data/file fetching and posting hooks catches
  and returns error as it happen.

- **Easy upload and delete files and directory in your function components** - Hooks
  like `useStorageUpload`, `useStorageDelete` and `useStorageDirDelete()` let you easily handle file upload and generate download url. Plus, you can delete a file and directory just by passing it's storage reference.

- **Access Firebase libraries from any component** - Need the Firestore SDK? `useFirestore`. To generate
  reference use `useCollectionRef`, `useDocumentRef` and `useStorageRef` hooks.

- **Typescript support included** - You can
  pass Interface to a collection and document hooks to infer accepted data types

## Installation

```bash
npm install --save @epha123/fire-hooks
```

Or with Yarn

```bash
yarn add @epha123/fire-hooks
```

## Usage

```jsx
import React, { useState, useEffect } from "react";
import firebase from "firebase";
import {
  AddCircleOutlineRounded,  DeleteOutlineRounded,  Edit,} from "@material-ui/icons";
import {Button,TextField,Container,IconButton,List,ListItem,ListItemSecondaryAction,ListItemText,Dialog,
  DialogContent,DialogActions,} from "@material-ui/core";
import {
  useCollectionData,
  useCollectionRef,
  useCollectionSnaps,
  useDocumentAdd,
  useDocumentDelete,
  useDocumentUpdate,
} from "@epha123/fire-hooks";

interface ITodo {
  id: string;
  name: string;
  datatime: firebase.firestore.FieldValue;
}

function App() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState("");
  const [toUpdateId, setToUpdateId] = useState("");
  const todos$ = useCollectionRef("todos");
  const { loading, snapshots, error } = useCollectionSnaps(todos$);

  /*
    Or You can use useCollectionData hook to subscribe and get data instead of snapshots

    `const {data, loading, error} = useCollectionData<ITodo>(todos$)`;

  */
  useEffect(() => {
    if (snapshots)
      setTodos(
        snapshots.docs.map((doc) => {
          return {
            id: doc.id,
            name: doc.data().todo,
            datatime: doc.data().datatime,
          };
        })
      );
  }, [snapshots]);

  /* You can use loading and error to handle loading and error events if you want */
  const { handleAdd /* , loading, error*/ } = useDocumentAdd();

  const addTodo = (event) => {
    event.preventDefault();
    handleAdd(
      {
        todo: input,
        datetime: firebase.firestore.FieldValue.serverTimestamp(),
      },todos$.doc());
    setInput("");
  };

  /* You can use loading and error to handle loading and error events if you want */
  const { handleDelete /* , loading, error*/ } = useDocumentDelete();

  const deleteTodo = (id) => {
    handleDelete(todos$.doc(id));
  };

  const openUpdateDialog = (todo) => {
    setOpen(true);
    setToUpdateId(todo.id);
    setUpdate(todo.name);
  };
  /* You can use loading and error to handle loading and error events if you want */
  const { handleUpdate /* , loading, error*/ } = useDocumentUpdate();

  const editTodo = () => {
    handleUpdate({ todo: update}, todos$.doc(toUpdateId) );
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <form noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="todo"
          label="Enter ToDo"
          name="todo"
          autoFocus
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />

        <Button
          type="submit"
          fullWidth
          onClick={addTodo}
          disabled={!input}
          startIcon={AddCircleOutlineRounded}
        >
          Add Todo{" "}
        </Button>
      </form>
      {loading && <h1> Loading</h1>}

      <List dense={true}>
        {todos.map((todo) => (
          <ListItem key={todo.id}>
            <ListItemText primary={todo.name} secondary={todo.datetime} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="Edit"
                onClick={() => openUpdateDialog(todo)}
              >
                <Edit />{" "}
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteTodo(todo.id)}
              >
                <DeleteOutlineRounded />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            label="Update Todo"
            type="text"
            fullWidth
            name="updateTodo"
            value={update}
            onChange={(event) => setUpdate(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={editTodo} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
```

## License

- See [LICENSE](/LICENSE)
