import firebase from "firebase/app";
import { useEffect, useState } from "react";

export const useDocument = (docRef: firebase.firestore.DocumentReference) => {
  return useDocumentInternal(docRef, true);
};

export const useDocumentOnce = (
  docRef: firebase.firestore.DocumentReference
) => {
  return useDocumentInternal(docRef, false);
};
export const useDocumentData = <T = firebase.firestore.DocumentData>(
  docRef: firebase.firestore.DocumentReference,
  transform?: (value: any) => T
) => {
  return useDocumentDataInternal<T>(docRef, true, transform);
};
export const useDocumentDataOnce = <T = firebase.firestore.DocumentData>(
  docRef: firebase.firestore.DocumentReference,
  transform?: (value: any) => T
) => {
  return useDocumentDataInternal<T>(docRef, true, transform);
};

const useDocumentInternal = (
  docRef: firebase.firestore.DocumentReference,
  listen: boolean
) => {
  const [snapshots, setSnapshots] = useState<
    firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
  >();
  const [loading, setLoading] = useState<boolean>();

  const [error, setError] = useState<firebase.firestore.FirestoreError>();

  const onValue = (
    value: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
  ) => {
    setSnapshots(value);
    setLoading(false);
  };

  const onError = (err: firebase.firestore.FirestoreError) => {
    setError(err);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (listen) {
      const unSub = docRef.onSnapshot(onValue, onError);
      return () => unSub();
    } else {
      docRef.get().then(onValue, onError);
    }
    return;
  }, []);

  return { loading, error, snapshots };
};

const useDocumentDataInternal = <T = firebase.firestore.DocumentData>(
  docRef: firebase.firestore.DocumentReference,
  listen: boolean,
  transform?: (value: any) => T
) => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>();

  const [error, setError] = useState<firebase.firestore.FirestoreError>();

  const onValue = (value: T) => {
    setData(value);
    setLoading(false);
  };

  const onError = (err: firebase.firestore.FirestoreError) => {
    setError(err);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (listen) {
      const unSub = docRef.onSnapshot((snapshot) => {
        if (transform)
          onValue(transform({ ...snapshot.data(), id: snapshot.id }));
        else onValue(({ ...snapshot.data(), id: snapshot.id } as unknown) as T);
      }, onError);
      return () => unSub();
    } else {
      docRef.get().then((snapshot) => {
        if (transform)
          onValue(transform({ ...snapshot.data(), id: snapshot.id }));
        else onValue(({ ...snapshot.data(), id: snapshot.id } as unknown) as T);
      }, onError);
    }
    return;
  }, []);

  return { loading, error, data };
};
