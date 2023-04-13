import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { loginFailure, loginSuccess } from "../redux/userSlice";
import useAccess from "../hooks/useAccess";
import { fetchSuccess } from "../redux/videoSlice";

export default function useChannel(setOpenUser) {
  const url = process.env.REACT_APP_URL;
  const cloudName = process.env.REACT_APP_CLOUD_NAME;
  const profilePreset = process.env.REACT_APP_PROFILE_PRESET;

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [inputs, setInputs] = useState({});
  const [pic, setPic] = useState();
  const dispatch = useDispatch();
  const [cookies] = useCookies(["access_token"]);

  const { handleLogOut } = useAccess();

  const headers = {
    Authorization: `Bearer ${cookies.access_token}`,
    "Content-Type": "application/json",
  };

  const filePickerRef = useRef();

  useEffect(() => {
    if (!pic) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      return setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(pic);
  }, [pic]);

  const handleFileInput = (e) => {
    setPic(e.target.files[0]);
  };

  const handleAddImgClick = () => {
    filePickerRef.current.click();
  };

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });

    if (e.target.name === "your_password" && e.target.value.length >= 8) {
      setIsValid(false);
    } else if (e.target.name === "your_password" && e.target.value.length < 8) {
      setIsValid(true);
    }
  };

  const handleProfile = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", profilePreset);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        data
      );

      const url = res.data.secure_url;

      return url;
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (details) => {
    const imgId = details.imgUrl;
    let newImgUrl;

    if (!isValid || pic) {
      newImgUrl = await handleProfile(pic);
    }

    try {
      const res = await axios.put(
        `${url}/users/${details._id}`,
        {
          username: !inputs.username ? details.username : inputs.username,
          email: !inputs.email ? details.email : inputs.email,
          description: !inputs.desc ? details.desc : inputs.desc,
          oldPassword: inputs.your_password,
          newPassword: inputs.new_password,
          imgUrl: !newImgUrl ? details.imgUrl : newImgUrl,
          imgId: imgId,
        },
        {
          withCredentials: true,
          credentials: "include",
          headers,
        }
      );

      try {
        dispatch(loginSuccess(res.data));
        setOpenUser(false);
      } catch (error) {
        console.log(error);
        dispatch(loginFailure());
      }
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  };

  const handleDelete = async (details) => {
    const { fromGoogle, imgUrl: imgId } = details;

    try {
      const res = await axios.delete(`${url}/users/${details._id}`, {
        withCredentials: true,
        credentials: "include",
        headers,
        data: {
          oldPassword: inputs.your_password,
          imgId: imgId,
          fromGoogle: fromGoogle,
        },
      });
      handleLogOut();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    isValid,
    previewUrl,
    filePickerRef,
    handleFileInput,
    handleAddImgClick,
    handleChange,
    handleUpdate,
    handleDelete,
  };
}
