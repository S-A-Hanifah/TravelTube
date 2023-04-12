import React, { useState } from "react";
import styled from "styled-components";
import useAccess from "../hooks/useAccess";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
  width: 30%;
  height: 70%;
  box-shadow: 0.1rem 0.1rem 1rem 0.1rem ${({ theme }) => theme.textSoft};
  margin-top: -20px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
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

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const Query = styled.div`
  margin-top: 15px;
`;

const Switch = styled.span`
  text-decoration: underline 1px solid ${({ theme }) => theme.text};
  cursor: pointer;
  margin-left: 5px;

  &:hover {
    opacity: 0.5;
  }
`;

export default function SignIn() {
  const { handleSignUp, handleChange, handleLogin, signInWithGoogle } =
    useAccess();

  const [form, setForm] = useState("signup");

  let content;

  if (form === "signup") {
    content = (
      <>
        <Title>Sign Up</Title>
        <Input name="username" placeholder="username" onChange={handleChange} />
        <Input name="email" placeholder="email" onChange={handleChange} />
        <Input
          name="password"
          type="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button onClick={(e) => handleSignUp(e)}>Sign up</Button>
        <Title>or</Title>
        <Button onClick={signInWithGoogle}>Google</Button>
        <Query>
          Have an account?
          <Switch onClick={() => setForm("login")}> Login</Switch>
        </Query>
      </>
    );
  } else {
    content = (
      <>
        <Title>Sign in</Title>
        <SubTitle>to continue to TravelTube</SubTitle>
        <Input name="username" placeholder="username" onChange={handleChange} />

        <Input
          name="password"
          type="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button onClick={handleLogin}>Sign in</Button>
        <Title>or</Title>
        <Button onClick={signInWithGoogle}>Google</Button>
        <Query>
          Don't Have an account?
          <Switch onClick={() => setForm("signup")}>Sign Up</Switch>
        </Query>
      </>
    );
  }

  return (
    <Container>
      <Wrapper>{content}</Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
}
