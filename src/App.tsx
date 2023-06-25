import React from "react";
import AuthComponent from "./auth";
import CostComponent from "./cost";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <h1>Hello React Router</h1>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/output">Output</a>
        </li>
      </ul>
      <Switch>
        <Route exact path="/">
          <AuthComponent />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

function NotFound() {
  return <h2>Not Found Page</h2>;
}

export default App;
