import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Button from "@mui/material/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";


import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MenuItem from "@mui/material/MenuItem";
import Select  from "@mui/material/Select";
import firebase from "../firebase/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { bookAppointment } from "./api";


const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const Add = () => {
  const db = firebase.firestore();

  const [user, loading, error] = useAuthState(firebase.auth());
  const router = useRouter();

  const [tempUser, setTempUser] = useState([]);
  const [userFlag, setUserFlag] = useState(0);
  const [search,setSearch]=useState("");

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [state, setState] = useState({});
  

  const handleOnChange = (e) => {
    const { value } = e.target;
    setState({ ...state, dose: value });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setState({ ...state, vaccine: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(state);
    const flag = await bookAppointment(state);
    if (flag == 1) {
      alert("Appointment Successfully Booked by User")
      handleClose();
    } else if (flag == -1) {
      alert("No slots available, please try again tomorrow");
    } else if (flag == -2) {
      alert("Appointment already booked by the user");
    } else {
      alert("bookAppointment failed");
    }

  };

  useEffect(async () => {
    console.log("inside useEffect");
    const querySnapshot = await getDocs(collection(db, "centers"));
    const size = querySnapshot.size;
    var count = 0;
    var temp = [];
    querySnapshot.forEach((doc) => {

      const d = doc.data();
      temp.push({
        ...d,
        hash: d.name + " " + d.address + " " + d.district + " " + d.pin,
      });
      count++;
      if (count == size) {
        setUserFlag(1);

        setTempUser(temp);
      }
    });
  }, []);

  
  


  if (loading) {
    return (
      <div style={{ widht: "100%", alignItems: "center", padding: "5em" }}>
       <h1>Hold On... Vaccination Centres are Loding!!! Just Stay Calm</h1>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <Header />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle style={{ textAlign: "center" }}>
            Book Slot for Vaccination
          </DialogTitle>
          <DialogContent style={{ padding: "0em 2em" }}>
            <DialogContentText>
              <b>Please Select the Details Carefully!! You cannot edit the details again</b>
              <h4>Date : {new Date().toISOString().split("T")[0]}</h4>
              <h4>Time : 9:00AM to 1.00PM</h4>
            </DialogContentText>
            <p style={{ fontWeight: "bold" }}>Vaccination Type</p>
            <Select
              id="vaccine"
              name="Vaccine Type"
              onChange={handleChange}
              value={state.vaccine}
              style={{ padding: "0.5em", width: "100%" }}
            >
              <MenuItem value={"Covaxin"}>Covaxin</MenuItem>
              <MenuItem value={"Covishield"}>Covishield</MenuItem>
              <MenuItem value={"Sputnik"}>Sputnik</MenuItem>
              <MenuItem value={"Covovax"}>Covovax</MenuItem>
              <MenuItem value={"zyCov-D"}>zyCov-D</MenuItem>
            </Select>
            <p style={{ fontWeight: "bold" }}>Dosage Type</p>
            <Select
              id="dose"
              name="Dosage Type"
              onChange={handleOnChange}
              value={state.dose}
              style={{ padding: "0.5em", width: "100%" }}
            >
              <MenuItem value={"dose 1"}>1st Dose</MenuItem>
              <MenuItem value={"dose 2"}>2nd Dose</MenuItem>
              <MenuItem value={"booster"}>Booster Vaccine</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions style={{ padding: "2em 2em 2em 2em" }}>
            <Grid container direction="row" justify="space-between">
              <Button variant="outlined" color="error" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="outlined" color="primary" onClick={handleSubmit}>
                Book
              </Button>
            </Grid>
          </DialogActions>
        </Dialog>
        <div style={{ padding: "20px", height: "100%" }}>
          {userFlag == 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h5>Calm Down....Just a Second ... Webpage is loading..</h5>
            </div>
          ) : (
            <div>

              <TextField label="Search for Address" value={search} onChange={(e)=>setSearch(e.target.value)} color="secondary" focused />


              {tempUser && 
                
                tempUser.map(x=>{if (x.address.startsWith(search)) return (<Card sx={{ minWidth: 275}} style={{margin:"15px"}}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    <b>Address:</b> {x.address}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  <b>Name:</b>{x.name}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  <b>PinCode:</b>{x.pin}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  <b>District:</b>{x.district}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  <b>phone:</b>{x.phone}
                  </Typography>

                </CardContent>
                <CardActions>
                  <Button size="medium" onClick={()=>{setOpen(true)
                    setState({
                      name:x.name,
                      pincode:x.pin,
                      district:x.district,
                      phone:x.phone
                    })
                  }}>Book Appointment</Button>
                </CardActions>
              </Card>) })
              }      
            </div>
          )}
        </div>
      </div>
    );
  }
  if (user == null) {
    router.push({
      pathname: "/login",
    });
    return (
      <div style={{ widht: "100%", alignItems: "center", padding: "5em" }}>

        <h1>Hold On.... Website is Loading....</h1>
      </div>
    );
  }
};

export default Add;
