import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Landing from "./components/Landing";
import CreateCourse from './components/CreateCourse';
import Register from './components/Register';
import ShowCourses from './components/ShowCourses';
import AppBar from './components/AppBar';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { userState } from './components/stores/atoms/user';
import { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './config.ts'
import EditCourse from './components/EditCourse';

// This file shows how you can do routing in React.
function App() {
    return (
        <RecoilRoot>
            <Router>
                <AppBar></AppBar>
                <InitUser></InitUser>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/createCourse" element={<CreateCourse />} />
                    <Route path="/courses" element={<ShowCourses />} />
                    <Route path="/courses/:courseId" element={<EditCourse />} />
                </Routes>
            </Router>
        </RecoilRoot>
    );
}

function InitUser() {
    const setUser = useSetRecoilState(userState)

    const init = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/me`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            if (response.data.username) {
                setUser({
                    isLoading: false,
                    userName: response.data.username
                });
            } else {
                setUser({
                    isLoading: false,
                    userName: ""
                });
            }
        } catch (e) {
            setUser({
                isLoading: false,
                userName: ""
            });
        }
    };

    useEffect(() => {
        init();
    }, []);

    return <div></div>
}

export default App;