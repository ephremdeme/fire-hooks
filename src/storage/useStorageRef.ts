import firebase from "firebase/app";

export const useStorageRef = (path?: string | undefined) => {
  return firebase.storage().ref(path);
};
