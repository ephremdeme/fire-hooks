import { useEffect, useState } from "react";
import firebase from "firebase/app";

export const useStorageUpload = (path: string) => {
  const storageRef = firebase.storage().ref(path);
  const [url, seturl] = useState<string>();
  const [error, setError] = useState<firebase.storage.FirebaseStorageError>();
  const [loading, setLoading] = useState<boolean>();
  const [progress, setProgress] = useState(0);

  const { handleDelete } = useStorageDelete(path);

  const handleUpload = async (
    file: Blob | Uint8Array | ArrayBuffer,
    fileName: string,
    prevAddress?: string
  ) => {
    const fileRef = storageRef.child(fileName);

    try {
      setLoading(true);
      fileRef.put(file).on(
        "state_changed",
        (snap) => {
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress(percentage);
        },
        (err) => {
          setError(err);
          setLoading(false);
        },
        async () => {
          const url = await fileRef.getDownloadURL();
          seturl(url);
          setLoading(false);
        }
      );
    } catch (error) {
      setError(error);
      setLoading(false);
    }

    if (prevAddress) {
      try {
        handleDelete(prevAddress);
      } catch (error) {
        setError(error);
      }
    }
  };

  return [{ url, error, progress, loading }, handleUpload];
};

export const useStorageDelete = (path: string) => {
  const storageRef = firebase.storage().ref(path);

  const [error, setError] = useState<firebase.storage.FirebaseStorageError>();
  const [loading, setLoading] = useState<boolean>();

  const handleDelete = async (fileName: string) => {
    const deleteRef = storageRef.child(fileName);
    try {
      setLoading(true);
      await deleteRef.delete();
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { loading, error, handleDelete };
};

export const useStorageDirDelete = (path: string) => {
  const storageRef = firebase.storage().ref(path);
  const [error, setError] = useState<firebase.storage.FirebaseStorageError>();
  const [loading, setLoading] = useState<boolean>();

  const handleDirDelete = async (dirName?: string) => {
    const deleteRef = dirName ? storageRef.child(dirName) : storageRef;
    try {
      setLoading(true);
      deleteRef
        .listAll()
        .then(function (result) {
          result.items.forEach(function (file) {
            file.delete();
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { loading, error, handleDirDelete };
};

export const useDownloadUrl = (path: string) => {
  const storageRef = firebase.storage().ref(path);

  const [url, seturl] = useState<string>();
  const [error, setError] = useState<firebase.storage.FirebaseStorageError>();
  const [loading, setLoading] = useState<boolean>();
  useEffect(() => {
    storageRef
      .getDownloadURL()
      .then((value) => {
        seturl(value);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
      });
  }, [path]);

  return { url, error, loading };
};
