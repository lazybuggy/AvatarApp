import React, { useEffect } from "react";
import "./App.css";

import {
  AmplifyAuthenticator,
  AmplifySignIn,
} from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import config from './aws-exports';
// import { Auth } from 'aws-amplify';

// Auth.forgotPassword()
//     .then(data => console.log(data))
//     .catch(err => console.log(err));

// // Collect confirmation code and new password, then
// Auth.forgotPasswordSubmit()
//     .then(data => console.log(data))
//     .catch(err => console.log(err));

function Authenticator(props) {
  console.log("these are props", props);
  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      props.setAuthState(nextAuthState);
      props.setUser(authData);
      if(nextAuthState === AuthState.SignedIn && authData ){
      props.history.push('/admin');
      console.log('wongonbgubi wtfff')

      }
    });
  }, []);

  return (
    <div className="App">
      {/* <AmplifyAuthenticator> */}
      <AmplifyAuthenticator amplifyConfig={config} >
        <AmplifySignIn
          headerText="Admin Sign In"
          slot="sign-in"
          hideSignUp="true"
          // forgot-password={true}
        />
          {/* <AmplifyForgotPassword headerText="Oh No! You Forgot your password" slot="forgot-password"></AmplifyForgotPassword>
          <AmplifyRequireNewPassword headerText="My Custom Require New Password Text" slot="require-new-password"></AmplifyRequireNewPassword> */}

        {/* {props.history.push('/')} */}
        {/* <AmplifySignOut /> */}
      </AmplifyAuthenticator>
      <div>bye not authen</div>
    </div>
  );
}

export default Authenticator;
