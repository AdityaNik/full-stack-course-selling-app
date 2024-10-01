import { Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userName } from "./stores/selector/user";
import { isLoading } from "./stores/selector/isLoaing";
import { Button } from "./ui/button";

function Landing() {
  const navigate = useNavigate();
  const user = useRecoilValue(userName);
  const loading = useRecoilValue(isLoading);

  return (
    <div>
      <div className="flex justify-center mt-8 gap-2">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-orange-600 first:mt-0">
          Unlock
        </h2>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Your Creative Potential
        </h2>
      </div>
      <div className="flex justify-center">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          with Online Courses
        </h3>
      </div>
      <div className="flex justify-center">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Learn from Industry Experts and Enhance Your Skills
        </h4>
      </div>
      <div className="flex justify-center mt-8">
        <Button size={"lg"} className=" bg-orange-600">
          Explore Courses
        </Button>
      </div>
      <Grid container style={{ padding: "5vw" }}>
        <Grid item lg={6} md={12} sm={12}>
          <div style={{ marginTop: 100 }}>
            <div>
              <Typography variant="h2">Welcome to Coursera</Typography>
            </div>
            <div>
              <Typography variant="h5">
                Unlock Your Potential, Empower Yourself with us!
              </Typography>
            </div>
            {!user && !loading && (
              <div style={{ display: "flex", marginTop: 20 }}>
                <div style={{ marginRight: 10 }}>
                  <Button
                    size={"lg"}
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    SignUp
                  </Button>
                </div>
                <div>
                  <Button
                    size={"lg"}
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    SignIn
                  </Button>
                </div>
              </div>
            )}
            <div></div>
          </div>
        </Grid>
        <Grid item lg={6} md={12} sm={12}>
          <div
            style={{
              paddingTop: 100,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img src={"/mainLogo.jpeg"}></img>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Landing;
