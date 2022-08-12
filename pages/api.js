import firebase from "../firebase/index";
import { doc, getDoc } from "firebase/firestore";
const db = firebase.firestore();
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
const auth = getAuth();

export const signupUser = async (user) => {
  await createUserWithEmailAndPassword(auth, user.email, user.password).then(
    async () => {
      await db
        .collection("users")
        .doc(user.email)
        .set(user)
        .then(() => {
          console.log("user added successfully");
        })
        .catch(() => {
          console.log("user is not added");
        });
    }
  );
};
export const loginUser = async (user) => {
  await signInWithEmailAndPassword(auth, user.email, user.password);
};

export const allCenters = async () => {
  await db
    .collection("centers")
    .onSnapshot((snapshot) => {
      const hist = snapshot.docs.map((r) => {
        return r.data();
      });
      return hist;
    })
    .catch((err) => {
      return 0;
    });
};

export const getAppointments = async (appointment) => {
  const d = new Date();
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const date = `${year}-${month}-${day}`;
  try {
    const docRef = doc(db, "appointments", appointment.name + date);
    const docSnap = await getDoc(docRef);
    return docSnap.data()["appointments"];
  } catch {
    return [];
  }
};

export const bookAppointment = async (appointment) => {
  const d = new Date();
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const date = `${year}-${month}-${day}`;
  var appointments = await getAppointments(appointment);
  console.log(appointments.length)
  console.log(appointment.phone)
  if (appointments.length >= 10) {
    return -1;
  }
  let obj = appointments.find((o) => o.phone == appointment.phone); 
  if (obj) {
    return -2;
  }
  appointments.push(appointment);
  const flag = await db
    .collection("appointments")
    .doc(appointment.name + date)
    .set({ appointments })
    .then(() => 1)
    .catch(() => 0);
  return flag;
};
