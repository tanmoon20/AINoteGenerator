import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import '@aws-amplify/ui-react/styles.css';
import {
  withAuthenticator
} from "@aws-amplify/ui-react"
import { useState } from "react";
import { MyProvider } from './layouts/UserContext';

const App = () => {
  const routing = useRoutes(Themeroutes);
  
  return (
    <MyProvider>
      {routing}
    </MyProvider>
  );
};

export default App;
