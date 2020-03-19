import styled, { createGlobalStyle } from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Container = styled.div`
  height: 100%;
  margin: auto;
  max-width: 1000px;
  padding: 0px 20px;
`;

export const Notifications = styled.div`
  position: fixed;
  right: 10px;
  top: 10px;
`;

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0px;
    outline: 0px;
    padding: 0px;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    background-color: #F5F5F5;
  }

  body, input, button {
    border-radius: 0px !important;
    font-family: Roboto, sans-serif;
    font-size: 1rem !important;
  }
`;
