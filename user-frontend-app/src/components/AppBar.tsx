import { Avatar, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deepPurple, orange } from "@mui/material/colors";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userName } from "./stores/selector/user";
import { isLoading } from "./stores/selector/isLoaing";
import { userState } from "./stores/atoms/user";
import { Button } from "./ui/button";

function AppBar() {
  const user = useRecoilValue(userName);
  const loding = useRecoilValue(isLoading);
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();

  if (loding) {
    <div>
      <Typography variant="h3">Loding...</Typography>
    </div>;
  }

  if (user) {
    return (
      <div className="p-4 border-b-2">
        <div className="flex justify-between">
          <div className="flex gap-8">
            <div
              className="cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              <h2 className="text-3xl font-semibold tracking-tight first:mt-0 text-orange-600">
                Coursera
              </h2>
            </div>
            <div className="flex">
              <Button
                variant={"ghost"}
                size={"lg"}
                onClick={() => {
                  navigate("/");
                }}
              >
                Home
              </Button>
              <Button
                variant={"ghost"}
                size={"lg"}
                onClick={() => {
                  navigate("/courses");
                }}
              >
                Courses
              </Button>
              <Button
                variant={"ghost"}
                size={"lg"}
                onClick={() => {
                  navigate("/purchases");
                }}
              >
                Purchases
              </Button>
            </div>
          </div>
          <div className="flex gap-4">
            <Avatar sx={{ bgcolor: deepPurple[500] }}></Avatar>
            <Button
              className="bg-orange-600 hover:bg-orange-800"
              onClick={() => {
                localStorage.setItem("token", "");
                setUser({
                  isLoading: false,
                  user: "",
                });
              }}
            >
              Logout
            </Button>
          </div>
        </div>
        <div></div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-between p-4 border-b-2 shadow-sm">
        <div
          onClick={() => {
            navigate("/");
          }}
        >
          <h2 className="text-3xl font-semibold tracking-tight first:mt-0 text-orange-600">
            Coursera
          </h2>
        </div>
        <div className="flex gap-4">
          <Button
            className="bg-orange-600 hover:bg-orange-800"
            onClick={() => {
              navigate("/register");
            }}
          >
            SignUp
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-800"
            onClick={() => {
              navigate("/login");
            }}
          >
            SignIn
          </Button>
        </div>
      </div>
    );
  }
}

export default AppBar;
