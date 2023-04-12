import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export default function Home({ type, cat }) {
  const [videos, setVideos] = useState([]);
  const [cookies] = useCookies(["access_token"]);

  const headers = {
    Authorization: `Bearer ${cookies.access_token}`,
    "Content-Type": "application/json",
  };

  let url;

  type
    ? (url = `${process.env.REACT_APP_URL}/videos/${type}`)
    : (url = `${process.env.REACT_APP_URL}/videos/tags?tags=${cat}`);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(url, {
        withCredentials: true,
        credentials: "include",
        headers,
      });
      setVideos(res.data);
    };
    fetchVideos();
  }, [url]);

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
}
