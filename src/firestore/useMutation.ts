import firebase from "firebase/app";

import { useState } from "react";

export const useDocumentAdd = <T>(
  docRef: firebase.firestore.DocumentReference
) => {
  const [loading, setLoading] = useState<boolean>();

  const [error, setError] = useState<firebase.firestore.FirestoreError>();

  const handleAdd = (data: Partial<T>) => {
    setLoading(true);
    docRef.set(data).then(() => setLoading(false), setError);
  };

  return { loading, error, handleAdd };
};
export const useDocumentUpdate = <T>(
  docRef: firebase.firestore.DocumentReference
) => {
  const [loading, setLoading] = useState<boolean>();

  const [error, setError] = useState<firebase.firestore.FirestoreError>();

  const handleUpdate = (data: Partial<T>) => {
    setLoading(true);
    docRef.update(data).then(() => setLoading(false), setError);
  };

  return { loading, error, handleUpdate };
};

export const useDocumentDelete = () => {
  const [loading, setLoading] = useState<boolean>();

  const [error, setError] = useState<firebase.firestore.FirestoreError>();

  const handleDelete = (docRef: firebase.firestore.DocumentReference) => {
    setLoading(true);
    docRef.delete().then(() => setLoading(false), setError);
  };

  return { loading, error, handleDelete };
};
