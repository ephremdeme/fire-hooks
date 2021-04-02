import firebase from "firebase/app";
import "firebase/storage";

export const useStorageRef = (path?: string | undefined) => {
  return firebase.storage().ref(path);
};
