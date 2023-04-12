import styled from "styled-components";
import { useCRUD } from "../hooks/useCRUD";
import Preview from "./Preview";
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

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const UserAction = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Buttons = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
  font-size: 14px;
`;

const Main = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 50px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  flex: 1;
`;

export default function VideoModal({ setOpen, details }) {
  const {
    setImg,
    setVideo,
    img,
    video,
    imgPerc,
    videoPerc,
    handleChange,
    handleTags,
    handleUpdate,
    handleDelete,
  } = useCRUD(setOpen);

  const [preview, setPreview] = useState(null);

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>&times;</Close>
        <Title>Your Video</Title>
        <Main>
          <Left>
            <Preview img={img} video={video} preview={preview} />
            <>
              <Label>Video:</Label>
              {videoPerc > 0 ? (
                "Uploading: " + videoPerc + "%"
              ) : (
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files[0])}
                />
              )}
              <Button
                style={{ display: "inline-block" }}
                onClick={() => setPreview("video")}
              >
                view
              </Button>
            </>
            <>
              <Label>Thumbnail:</Label>
              {imgPerc > 0 ? (
                "Uploading: " + imgPerc + "%"
              ) : (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImg(e.target.files[0])}
                />
              )}
              <Button
                style={{ display: "inline-block" }}
                onClick={() => setPreview("img")}
              >
                view
              </Button>
            </>
          </Left>
          <Right>
            <Input
              type="text"
              placeholder="Title"
              name="title"
              onChange={handleChange}
            />
            <Desc
              placeholder="Description"
              rows={8}
              name="desc"
              onChange={handleChange}
            />
            <Input
              type="text"
              placeholder="Seperate Tags With Commas"
              onChange={(e) => handleTags(e)}
            />

            <UserAction>
              <Buttons onClick={() => handleUpdate(details)}>Update</Buttons>
              <Buttons
                style={{
                  background: "red",
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
                onClick={() => handleDelete(details._id)}
              >
                Delete
              </Buttons>
            </UserAction>
          </Right>
        </Main>
      </Wrapper>
      <Overlay onClick={() => setOpen(false)} />
    </Container>
  );
}
