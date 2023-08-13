import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { userName } from "./stores/selector/userName";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
    const user = useRecoilValue(userName);
    const navigate = useNavigate();

    return <div>
        <Grid container style={{ padding: "5vw" }}>
            <Grid item lg={6} md={12} sm={12} >
                <div style={{ marginTop: 100 }}>
                    <div>
                        <Typography variant="h2">
                            Welcome to Coursera
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="h5">
                            Create courses, and show case your skills
                        </Typography>
                    </div>
                    {!user && <div style={{ display: "flex", marginTop: 20 }}>
                        <div style={{ marginRight: 10 }} >
                            <Button
                                size={"large"}
                                variant="contained"
                                onClick={() => {
                                    navigate("/register")
                                }}>
                                SignUp
                            </Button>
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                size={"large"}
                                onClick={() => {
                                    navigate("/login")
                                }}>
                                SignIn
                            </Button>
                        </div>
                    </div>}
                    <div>
                    </div>
                </div>
            </Grid>
            <Grid item lg={6} md={12} sm={12}>
                <div style={{ paddingTop: 100, display: "flex", justifyContent: "center" }}>
                    <img src={"/mainLogo.jpeg"} width={800}></img>
                </div>
            </Grid>
        </Grid>
    </div>
}

export default Landing;