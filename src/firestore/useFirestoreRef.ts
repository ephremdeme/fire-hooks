import firebase from "firebase/app";

export const useCollectionRef = (collectionPath: string) => {
  return useFirestore().collection(collectionPath);
};

export const useDocumentRef = (documentPath: string) => {
  return useFirestore().doc(documentPath);
};

export const useFirestore = () => {
  return firebase.firestore();
};
