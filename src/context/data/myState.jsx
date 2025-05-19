import React, { useEffect, useState } from "react";
import MyContext from "./myContext";
import {
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { fireDB } from "../../Firebase/FirebaseConfig";

const myState = (props) => {
  const users = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserFromUID = async () => {
      try {
        if (users && users.uid) {
          const usersRef = collection(fireDB, "users");
          const querySnapshot = await getDocs(
            query(usersRef, where("uid", "==", users.uid))
          );
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUser(userData);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };
    getUserFromUID();
  }, [users?.uid]);

  return (
    <MyContext.Provider
      value={{
        user,
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

export default myState;
