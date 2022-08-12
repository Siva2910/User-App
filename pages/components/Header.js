import React from 'react'
import styles from "../../styles/Header.module.css";
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import firebase from '../../firebase/index';
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";


function Header() {
const [user, loading, error] = useAuthState(firebase.auth());
const router = useRouter();
  async function logout() {
    await firebase
      .auth()
      .signOut()
      .then(() =>
        router.push({
          pathname: "/login",
        })
      );
  }
if (loading) {
    return (
      <div>
        <p>Hold On.... Your Page is Loading!!!</p>
      </div>
    );
  }
  if (user) {
  return (
    <div className={styles.headContainer}>
        <div className={styles.headwrapper}>
            <div className={styles.title}>
                <h2>
                   Welcome to Covid Vaccination Booking Application
                </h2>
            </div>
            <div className={styles.links}>
           <a href="/centers"><b>Book Appointment</b></a>
           <a href="#" onClick={logout}>
              <b>Logout</b>
            </a>
           </div>
        </div>
        
    </div>
  )}
  return(
    <div></div>
  ) 
  
}

export default Header;