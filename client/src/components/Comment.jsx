import React from "react";
import styled from "styled-components";
import { format } from "timeago.js";
import useComments from "../hooks/useComments";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
  align-items: center;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #ff0000;
  color: #ffffff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  align-items: center;
  gap: 5px;

  &:hover {
    color: #ff0000;
    box-shadow: 0.1rem 0.1rem 1rem 0.1rem #ff0000;
  }
`;

export default function Comment({ comment, videoId }) {
  const { channel, currentUser, deleteComment } = useComments(videoId, comment);

  const commentKey = `comment-${comment._id}`;

  return (
    <Container key={commentKey} style={{ justifyContent: "space-between" }}>
      <Details>
        <Avatar src={channel.imgUrl} />
        <Details style={{ flexDirection: "column" }}>
          <Name>
            {channel.username}
            <Date>{format(comment.createdAt)} </Date>
          </Name>
          <Text>{comment.desc}</Text>
        </Details>
      </Details>
      {currentUser._id === comment.userId && (
        <Button onClick={() => deleteComment(comment)}>Delete</Button>
      )}
    </Container>
  );
}
