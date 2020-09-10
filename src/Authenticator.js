import React, { useEffect } from "react";
import "./App.css";

import {
  AmplifyAuthenticator,
  AmplifySignOut,
  AmplifySignIn,
} from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

function Authenticator(props) {
  console.log("these are props", props);
  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      props.setAuthState(nextAuthState);
      props.setUser(authData);
      if(nextAuthState === AuthState.SignedIn && authData ){
      props.history.push('/admin');
      }
    });
  }, []);

  return (
    <div className="App">
      <AmplifyAuthenticator>
        <AmplifySignIn
          headerText="Admin Sign In"
          slot="sign-in"
          hideSignUp="true"
        />
        {/* {props.history.push('/')} */}
        {/* <AmplifySignOut /> */}
      </AmplifyAuthenticator>
      <div>bye not authen</div>
    </div>
  );
}

export default Authenticator;
