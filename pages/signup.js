import styles from "../styles/auth.module.css";
import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import CardContent from "@mui/material/CardContent";

import firebase from "../firebase/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { signupUser } from "./api";

function SignUpScreen() {
  const [user, loading, error] = useAuthState(firebase.auth());
  const [state, setState] = useState({});
  const router = useRouter();

  const handleOnChange = (e) => {
    const { value } = e.target;
    setState({ ...state, [e.target.id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(state);
    signupUser(state)
      .then(() => {
        setState({ email: "", password: "", phone: ""});
        router.push({
          pathname: "login",
        });
      })
      .catch((err) => {
        alert(err);
        console.log("adding content failed");
      });
  };

  if (loading) {
    return (
      <div style={{ widht: "100%", alignItems: "center", padding: "5em" }}>
        <h1>Calm down... Webpage is loading....</h1>
      </div>
    );
  }
  if (user) {
    router.push({
      pathname: "centers",
    });
    return (
      <div style={{ widht: "100%", alignItems: "center", padding: "5em" }}>

        <h1>C</h1>
      </div>
    );
  }
  return (
    <div className={styles.app}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ height: "100%", margin: "auto auto" }}
      >
        <CardContent
          style={{
            width: "30em",
            padding: "20px",
            margin: "20px",
            borderRadius: "15px",
          }}
        >
          <h1 style={{ textAlign: "center", color: "#005" }}>SIGNUP</h1>
          <TextField
            id="email"
            label="Email"
            style={{
              width: "100%",
              marginBottom: "20px",
              background: "#fbfbff",
            }}
            value={state.email}
            onChange={(e) => handleOnChange(e)}
            variant="outlined"
          />
          <TextField
            id="password"
            type = "password"
            label="Password"
            style={{
              width: "100%",
              marginBottom: "20px",
              background: "#fbfbff",
            }}
            value={state.password}
            onChange={(e) => handleOnChange(e)}
            variant="outlined"
          />
          <TextField
            id="phone"
            label="Phone Number"
            style={{
              width: "100%",
              marginBottom: "20px",
              background: "#fbfbff",
            }}
            value={state.phone}
            onChange={(e) => handleOnChange(e)}
            variant="outlined"
          />
    
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              color="success"
              style={{ margin: "15px 0;" }}
              onClick={handleSubmit}
            >
              Signup
            </Button>
          </Grid>
          <p style={{ textAlign: "center", color: "#474747" }}>
            Existing user?{" "}
            <a style={{ color: "blue" }} href="login">
              login
            </a>
          </p>
        </CardContent>
      </Grid>
    </div>
  );
}

export default SignUpScreen;
