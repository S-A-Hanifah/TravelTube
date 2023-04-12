import styled from "styled-components";
import useChannel from "../hooks/useChannel";
import { useState } from "react";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: fixed;
  left: 25%;
  top: 10%;
  z-index: 2;
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
`;

const Wrapper = styled.div`
  width: 800px;
  height: 500px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 9;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 30px;
  cursor: pointer;
  font-size: 3rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-top: 30px;
`;

const Profile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: dashed 0.3rem ${({ theme }) => theme.text};
  border-radius: 50%;
  font-size: 2rem;
  margin-bottom: 2rem;
  object-fit: cover;
  opacity: ${({ avail }) => (avail ? 1.0 : 0.5)};
  ${({ imgUrl }) =>
    imgUrl
      ? `
    background-image: url(${imgUrl});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  `
      : ""};
  ${(props) =>
    props.fromGoogle === true
      ? `  
    width: 100%;
    height: 28.5rem;
    border-radius: 0;
    `
      : `
    width: 15rem;
    height: 15rem !important;
    border-radius: 50% !important;
  `};
`;

const AddImg = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.text};
  width: 100%;
  height: 100%;
  border-radius: 50%;
  font-size: 5rem;
  cursor: pointer;
  opacity: 0.2;
  &:hover {
    opacity: 1;
  }

  ${(props) =>
    props.fromGoogle === true
      ? `  
      border-radius: 0;
      width: 100%;
      height: 100%;
      padding: 0.5rem;
      `
      : `
      width: 15rem !important;
      height: 15rem !important;
      border-radius: 50% !important;
      color: red !important;
  `};
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
  ${({ isValid }) =>
    isValid &&
    `
      border: 1px solid #ff0000;
      animation: blink 1s linear infinite;
  `};

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  height: 20%;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  ${(props) =>
    props.type === "danger"
      ? `
        background: red;
        font-weight: bold;
        color: #ffffff;
      `
      : `
      background-color: ${({ theme }) => theme.soft};
        font-weight: bold;
        color: ${({ theme }) => theme.textSoft};
      `};
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const UserAction = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 14px;
  gap: 2rem;
`;

const Main = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  gap: 50px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 1rem;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
`;

export default function UserModal({ setOpenUser, currentUser }) {
  const {
    previewUrl,
    filePickerRef,
    handleFileInput,
    handleAddImgClick,
    handleChange,
    isValid,
    handleUpdate,
    handleDelete,
  } = useChannel(setOpenUser);
  const fromGoogle = currentUser?.fromGoogle;

  return (
    <Container>
      {currentUser && (
        <>
          <Wrapper>
            <Close onClick={() => setOpenUser(false)}>&times;</Close>
            <Title>Hey, {currentUser.username}</Title>
            <Main>
              <Left>
                <Profile
                  imgUrl={!previewUrl ? currentUser.imgUrl : previewUrl}
                  avail
                  fromGoogle={fromGoogle}
                >
                  <AddImg
                    avail
                    onClick={handleAddImgClick}
                    fromGoogle={fromGoogle}
                  >
                    +
                  </AddImg>
                  <input
                    id="file"
                    ref={filePickerRef}
                    type="file"
                    style={{ display: "none" }}
                    accept=".jpg,.png,.jpeg"
                    onChange={handleFileInput}
                  />
                </Profile>

                <>
                  {fromGoogle || (
                    <>
                      <Label>Your Password</Label>
                      <Input
                        type="password"
                        placeholder="password"
                        name="your_password"
                        required
                        minLength={8}
                        onChange={handleChange}
                        isValid={isValid}
                      />
                      <Label>New Password</Label>
                      <Input
                        type="password"
                        placeholder="password"
                        name="new_password"
                        onChange={handleChange}
                      />
                    </>
                  )}
                </>
              </Left>
              <Right>
                <Label>Username</Label>
                <Input
                  type="text"
                  placeholder="username"
                  name="username"
                  onChange={handleChange}
                />
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email"
                  name="email"
                  onChange={handleChange}
                />
                <Label>About</Label>
                <Desc
                  placeholder="Description"
                  rows={8}
                  name="desc"
                  onChange={handleChange}
                />

                <UserAction>
                  <Button
                    onClick={() => handleUpdate(currentUser)}
                    disabled={isValid && !fromGoogle}
                    style={{ background: "green", color: "white" }}
                  >
                    Update
                  </Button>
                  <Button
                    type="danger"
                    disabled={isValid && !fromGoogle}
                    onClick={() => handleDelete(currentUser)}
                  >
                    Delete
                  </Button>
                </UserAction>
              </Right>
            </Main>
          </Wrapper>
          <Overlay onClick={() => setOpenUser(false)} />
        </>
      )}
    </Container>
  );
}
