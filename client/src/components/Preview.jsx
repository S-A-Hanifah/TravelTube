import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 80%;
  margin-bottom: 15px;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: dashed 0.3rem ${({ theme }) => theme.text};
  border-radius: 0.2rem;
  font-size: 2rem;
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
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
`;

export default function Preview({ preview, img, video }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (preview === "video" && video) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(video);
    } else if (preview === "img" && img) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(img);
    }
  }, [preview, img, video]);

  let display;
  if (preview === null) {
    display = <Wrapper>Preview</Wrapper>;
  } else if (preview === "video") {
    display = (
      <Wrapper avail>
        <Video src={previewUrl} controls />
      </Wrapper>
    );
  } else if (preview === "img") {
    display = <Wrapper imgUrl={previewUrl} avail></Wrapper>;
  }

  return <Container>{display}</Container>;
}
