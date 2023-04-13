import React, { useState } from "react";
import styled from "styled-components";
import Comments from "../components/Comments";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import useActions from "../hooks/useActions";
import { format } from "timeago.js";
import Recommendation from "../components/Recommendation";
import VideoModal from "../components/VideoModal";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #999;
  object-fit: cover;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  font-size: 2rem;
  cursor: pointer;
  color: ${({ theme }) => theme.textSoft};
`;

export default function Video() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    currentUser,
    currentVideo,
    channel,
    handleLike,
    handleDislike,
    handleSub,
  } = useActions();

  let access;

  if (currentVideo && currentUser) {
    access = (
      <>
        <Container
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Title>{currentVideo.title}</Title>
          {currentUser._id === currentVideo.userId && (
            <Options onClick={() => setOpen(true)}>...</Options>
          )}
        </Container>
        <Details>
          <Info>
            {currentVideo.views} views • {format(currentVideo.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}
              Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
      </>
    );
  } else if (currentVideo) {
    access = (
      <>
        <Container
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Title>{currentVideo.title}</Title>
        </Container>
        <Details>
          <Info>
            {currentVideo.views} views • {format(currentVideo.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={() => navigate("/signin")}>
              <ThumbUpIcon />
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={() => navigate("/signin")}>
              <ThumbDownIcon />
              Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon onClick={() => navigate("/signin")} /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon onClick={() => navigate("/signin")} /> Save
            </Button>
          </Buttons>
        </Details>
      </>
    );
  }

  return (
    <>
      {currentVideo && (
        <Container>
          <Content>
            <VideoWrapper>
              <VideoFrame src={currentVideo.videoUrl} controls />
            </VideoWrapper>
            {access}
            <Hr />
            <Channel>
              <ChannelInfo>
                <Image src={channel.imgUrl} />
                <ChannelDetail>
                  <ChannelName>{channel.username}</ChannelName>
                  <ChannelCounter>
                    {channel.subscribers} subscribers
                  </ChannelCounter>
                  <Description>{currentVideo.description}</Description>
                </ChannelDetail>
              </ChannelInfo>
              {currentVideo && currentUser ? (
                <Subscribe onClick={handleSub}>
                  {currentUser.subscribedUsers?.includes(channel._id)
                    ? "SUBSCRIBED"
                    : "SUBSCRIBE"}
                </Subscribe>
              ) : (
                <Subscribe onClick={() => navigate("/signin")}>
                  SUBSCRIBE
                </Subscribe>
              )}
            </Channel>
            <Hr />
            <Comments videoId={currentVideo._id} />
          </Content>
         {currentVideo.tags && <Recommendation tags={currentVideo.tags} />}
        </Container>
      )}
      {open && <VideoModal setOpen={setOpen} details={currentVideo} />}
    </>
  );
}
