import React from "react";
import AuthComponent from "./auth";
import "./App.css";

const App: React.FC = () => {
  return (
    <div>
      <h1>アプリケーション</h1>
      <AuthComponent />
    </div>
  );
};

export default App;
