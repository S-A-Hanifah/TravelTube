import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

export default function useComments(videoId, comment) {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [cookies] = useCookies(["access_token"]);
  const [channel, setChannel] = useState({});

  const url = process.env.REACT_APP_URL;

  const headers = {
    Authorization: `Bearer ${cookies.access_token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${url}/comments/${videoId}`, {
          withCredentials: true,
          credentials: "include",
          headers,
        });
        setComments(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [videoId, cookies.access_token]);

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await axios.get(`${url}/users/find/${comment.userId}`);
      setChannel(res.data);
    };
    fetchChannel();
  }, [comment, cookies.access_token]);

  const postComment = async () => {
    try {
      await axios.post(
        `${url}/comments`,
        { desc: userComment, videoId },
        {
          withCredentials: true,
          credentials: "include",
          headers,
        }
      );
      await axios
        .get(`${url}/comments/${videoId}`, {
          withCredentials: true,
          credentials: "include",
          headers,
        })
        .then((res) => {
          setUserComment("");
          setComments(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (comment) => {
    try {
      await axios.delete(`${url}/comments/${comment._id}`, {
        withCredentials: true,
        credentials: "include",
        headers,
      });

      await axios
        .get(`${url}/comments/${videoId}`, {
          withCredentials: true,
          credentials: "include",
          headers,
        })
        .then((res) => {
          setComments(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    currentUser,
    userComment,
    setUserComment,
    comments,
    setComments,
    channel,
    setChannel,
    postComment,
    deleteComment,
  };
}
