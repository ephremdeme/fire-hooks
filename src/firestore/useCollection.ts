import firebase from "firebase/app";
import "firebase/firestore";

import { useEffect, useState } from "react";

export const useCollectionData = <T>(
  query: firebase.firestore.Query,
  transform?: (val: any) => T
) => {
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<firebase.firestore.FirestoreError>();

  useEffect(() => {
    setLoading(true);
    const unsub = query.onSnapshot(
      (snapshots) => {
        let allData: T[] = [];
        snapshots.forEach((doc) => {
          if (transform) {
            let resp = transform(doc);
            allData.push(resp);
          } else {
            allData.push(({
              ...doc.data(),
              id: doc.id,
            } as unknown) as T);
          }
        });

        setData(allData);
        setLoading(false);
      },
      (err) => setError(err)
    );

    return () => unsub();
  }, []);

  return { loading, data, error };
};

export const useCollectionDataOnce = <T>(
  query: firebase.firestore.Query,
  transform?: (val: any) => T
) => {
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<firebase.firestore.FirestoreError>();

  useEffect(() => {
    setLoading(true);
    query.get().then(
      (snapshot) => {
        let allData: T[] = [];
        snapshot.forEach((doc) => {
          if (transform) {
            let resp = transform(doc);
            allData.push(resp);
          } else {
            allData.push(({
              ...doc.data(),
              id: doc.id,
            } as unknown) as T);
          }
        });
        setData(allData);
        setLoading(false);
      },
      (err) => setError(err)
    );
  }, []);

  return { loading, data, error };
};

export const useCollectionSnaps = (query: firebase.firestore.Query) => {
  const [snapshots, setSnapshots] = useState<
    firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  >();
  const [loading, setLoading] = useState<boolean>();

  const [error, setError] = useState<firebase.firestore.FirestoreError>();

  const onValue = (
    value: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
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
    const unSub = query.onSnapshot(onValue, onError);
    return () => {
      unSub();
    };
  }, []);

  return { snapshots, loading, error };
};

export const useCollectionSnapsOnce = (query: firebase.firestore.Query) => {
  const [snapshots, setSnapshots] = useState<
    firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  >();
  const [loading, setLoading] = useState<boolean>();

  const [error, setError] = useState<firebase.firestore.FirestoreError>();

  const onValue = (
    value: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
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
    query.get().then(onValue, onError);
  }, []);

  return { snapshots, loading, error };
};
