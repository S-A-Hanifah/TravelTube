import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { fetchSuccess, like, dislike } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";

export default function useActions() {
  const [channel, setChannel] = useState({});
  const [cookies] = useCookies(["access_token"]);
  const dispatch = useDispatch();
  const path = useLocation().pathname.split("/")[2];
  const [docTitle, setDocTitle] = useState("TravelTube");

  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const url = process.env.REACT_APP_URL;

  const headers = {
    Authorization: `Bearer ${cookies.access_token}`,
    "Content-Type": "application/json",
  };

  const handleLike = async () => {
    try {
      await axios.put(
        `${url}/users/like/${currentVideo._id}`,
        {},
        {
          headers,
          withCredentials: true,
          credentials: "include",
        }
      );

      dispatch(like(currentUser._id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.put(
        `${url}/users/dislike/${currentVideo._id}`,
        {},
        {
          withCredentials: true,
          credentials: "include",
          headers,
        }
      );
      dispatch(dislike(currentUser._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSub = async () => {
    try {
      await axios.put(
        `${url}/users/${
          currentUser.subscribedUsers.includes(channel._id) ? "unsub" : "sub"
        }/${channel._id}`,
        {},
        { withCredentials: true, credentials: "include", headers }
      );
      dispatch(subscription(channel._id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`${url}/videos/find/${path}`);
        await axios.put(
          `${url}/videos/view/${videoRes.data._id}`,
          {},
          { withCredentials: true, credentials: "include", headers }
        );
        const channelRes = await axios.get(
          `${url}/users/find/${videoRes.data.userId}`
        );

        setChannel(channelRes.data);
        setDocTitle(videoRes.data.title);
        document.title = docTitle;
        dispatch(
          fetchSuccess({ ...videoRes.data, views: videoRes.data.views + 1 })
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [path, dispatch]);

  return {
    currentUser,
    currentVideo,
    channel,
    handleLike,
    handleDislike,
    handleSub,
  };
}
