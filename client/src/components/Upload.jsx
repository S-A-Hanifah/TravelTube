import styled from "styled-components";
import { useCRUD } from "../hooks/useCRUD";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  position: fixed;
  left: 35%;
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
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 4;
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

const Label = styled.label`
  font-size: 14px;
`;

export default function Upload({ setOpen }) {
  const {
    setImg,
    setVideo,
    imgPerc,
    videoPerc,
    handleChange,
    handleTags,
    handleCreate,
  } = useCRUD(setOpen);

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>&times;</Close>
        <Title>Upload A Video</Title>
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
        <Button onClick={handleCreate}>Upload</Button>
      </Wrapper>
      <Overlay onClick={() => setOpen(false)} />
    </Container>
  );
}
