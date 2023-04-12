import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { fetchSuccess, updateVideoSuccess } from "../redux/videoSlice";

export function useCRUD(setOpen) {
  const url = process.env.REACT_APP_URL;

  const cloudName = process.env.REACT_APP_CLOUD_NAME;
  const imagePreset = process.env.REACT_APP_IMAGE_PRESET;
  const videoPreset = process.env.REACT_APP_VIDEO_PRESET;

  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const headers = {
    Authorization: `Bearer ${cookies.access_token}`,
    "Content-Type": "application/json",
  };

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  // FOR FRONTEND

  const handleUpload = async (img, video) => {
    const formData = new FormData();
    let imgUrl = null;
    let videoUrl = null;

    if (img) {
      formData.append("file", img);
      formData.append("upload_preset", imagePreset);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const percent = Math.floor((loaded / total) * 100);
              setImgPerc(percent);
            },
          }
        );
        imgUrl = res.data.url;
      } catch (err) {
        console.log(err);
      }
    }

    if (video) {
      formData.delete("file");
      formData.append("file", video);
      formData.append("upload_preset", videoPreset);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const percent = Math.floor((loaded / total) * 100);
              setVideoPerc(percent);
            },
          }
        );
        videoUrl = res.data.url;
      } catch (err) {
        console.log(err);
      }
    }

    return [imgUrl, videoUrl];
  };

  const handleUpdate = async (details) => {
    const videoId = details.videoUrl;
    const imgId = details.imageUrl;

    const [newImgUrl, newVideoUrl] = await handleUpload(img, video);

    try {
      const res = await axios.put(
        `${url}/videos/${details._id}`,
        {
          title: !inputs.title ? details.title : inputs.title,
          description: !inputs.desc ? details.desc : inputs.desc,
          tags: tags.length === 0 ? details.tags : tags,
          imageUrl: !newImgUrl ? details.imageUrl : newImgUrl,
          videoUrl: !newVideoUrl ? details.videoUrl : newVideoUrl,
          videoId: !video ? null : videoId,
          imgId: !img ? null : imgId,
        },
        {
          withCredentials: true,
          credentials: "include",
          headers,
        }
      );

      dispatch(fetchSuccess(res.data));
      setOpen(false);
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  };

  // FOR BACKEND

  const handleCreate = async () => {
    try {
      const [imgUrl, videoUrl] = await handleUpload(img, video);

      const res = await axios.post(
        `${url}/videos`,
        {
          title: inputs.title,
          description: inputs.desc,
          tags,
          imageUrl: imgUrl,
          videoUrl: videoUrl,
        },
        {
          withCredentials: true,
          credentials: "include",
          headers,
        }
      );

      dispatch(updateVideoSuccess(res.data));
      setOpen(false);
      res.status === 200 && navigate(`/video/${res.data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const res = await axios.delete(`${url}/videos/${id}`, {
      withCredentials: true,
      credentials: "include",
      headers,
    });
    setOpen(false);
    res.status === 200 && navigate("/");
  };

  return {
    img,
    setImg,
    video,
    setVideo,
    imgPerc,
    videoPerc,
    inputs,
    handleChange,
    tags,
    handleTags,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
