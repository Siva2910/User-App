import styles from "../styles/auth.module.css";
import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import CardContent from "@mui/material/CardContent";

import firebase from "../firebase/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { loginUser } from "./api";

function SignInScreen() {
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
    loginUser(state)
      .then(() => {
        setState({ email: "", password: "" });
        router.push({
          pathname: "centers",
        });
      })
      .catch((err) => {
        alert(err);
        console.log("login failed");
      });
  };

  if (loading) {
    return (
      <div style={{ widht: "100%", alignItems: "center", padding: "5em" }}>
        Loading...
      </div>
    );
  }
  if (user) {
    router.push({
      pathname: "centers",
    });
    return (
      <div style={{ widht: "100%", alignItems: "center", padding: "5em" }}>

        Loading...
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
          <h1 style={{ textAlign: "center", color: "black" }}>Please Login Here</h1>
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
            label="Password"
            type="password"
            style={{
              width: "100%",
              marginBottom: "20px",
              background: "#fbfbff",
            }}
            value={state.password}
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
              LOGIN
            </Button>
          </Grid>
          <p style={{ textAlign: "center", color: "#474747" }}>
            New User!!! Please {" "}
            <a style={{ color: "red" }} href="signup">
              Sign Up Here
            </a>
          </p>
        </CardContent>
      </Grid>
    </div>
  );
}

export default SignInScreen;
