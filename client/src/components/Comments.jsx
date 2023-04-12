import React from "react";
import styled from "styled-components";
import Comment from "./Comment";
import useComments from "../hooks/useComments";
import { useNavigate } from "react-router-dom";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #ffffff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: #3ea6ff;
    box-shadow: 0.1rem 0.1rem 1rem 0.1rem #3ea6ff;
  }
`;

export default function Comments({ videoId }) {
  const { currentUser, comments, userComment, setUserComment, postComment } =
    useComments(videoId, null);
  const navigate = useNavigate();

  let content;

  if (currentUser) {
    content = (
      <NewComment>
        <Avatar src={currentUser.imgUrl} />
        <Input
          placeholder="Add a comment..."
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
        />
        <Button onClick={postComment}>Send</Button>
      </NewComment>
    );
  } else {
    content = (
      <NewComment>
        <Avatar />
        <Input placeholder="Add a comment..." />
        <Button onClick={() => navigate("/signin")}>Send</Button>
      </NewComment>
    );
  }

  return (
    <Container>
      {content}
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} videoId={videoId} />
      ))}
    </Container>
  );
}
