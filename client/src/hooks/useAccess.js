import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function useAccess() {
  const url = process.env.REACT_APP_URL;

  const [inputs, setInputs] = useState({});
  const [cookies] = useCookies(["access_token"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${cookies.access_token}`,
    "Content-Type": "application/json",
  };

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${url}/auth/signup`,
        { ...inputs },
        { withCredentials: true, credentials: "include", headers }
      );
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.log(error);
      dispatch(loginFailure());
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(
        `${url}/auth/signin`,
        { ...inputs },
        { withCredentials: true, credentials: "include", headers }
      );
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      dispatch(loginFailure());
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post(
            `${url}/auth/google`,
            {
              username: result.user.displayName,
              email: result.user.email,
              imgUrl: result.user.photoURL,
            },
            { withCredentials: true, credentials: "include", headers }
          )
          .then((res) => {
            dispatch(loginSuccess(res.data));
            navigate("/");
          });
      })
      .catch((error) => {
        console.log(error);
        dispatch(loginFailure());
      });
  };

  const handleLogOut = async () => {
    try {
      dispatch(logout());
      await axios.post(
        `${process.env.REACT_APP_URL}/auth/logout`,
        {},
        { withCredentials: true, credentials: "include", headers }
      );
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleChange,
    handleLogin,
    handleSignUp,
    signInWithGoogle,
    handleLogOut,
  };
}
