import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const faqCardStyle = {
  background: "#fff",
  padding: 30,
  borderRadius: 12,
  flex: "1 1 260px",
  maxWidth: 500,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  textAlign: "left",
};

const faqTitle = {
  fontSize: "1.1rem",
  fontWeight: 700,
  marginBottom: 10,
};

const faqText = {
  fontSize: "0.95rem",
  color: "#444",
};


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
