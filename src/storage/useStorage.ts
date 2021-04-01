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
