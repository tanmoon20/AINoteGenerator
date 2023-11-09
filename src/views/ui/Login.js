import React, { useState, useContext } from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
}
from 'mdb-react-ui-kit';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../layouts/UserContext';

function Login() {

  const [justifyActive, setJustifyActive] = useState('tab1');;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const { user, setUser } = useContext(MyContext);

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  const signIn = async () => {
    try {
      const user =await Auth.signIn(username, password);
      console.log('Signed in successfully');
      setUser(user);
      console.log(user);
      navigate('/starter')
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signUp = async () => {
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email
        },
        autoSignIn: { 
          enabled: true,
        }
      });
      console.log(user);
      navigate('/validate')
    } catch (error) {
      console.log('error signing up:', error);
    }
  }

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

      <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>

        <MDBTabsPane show={justifyActive === 'tab1'}>
          <MDBInput wrapperClass='mb-4 text-primary' label='Username' id='username1' type='text' onChange={(e) => setUsername(e.target.value)}/>
          <MDBInput wrapperClass='mb-4 text-primary' label='Password' id='password1' type='password' onChange={(e) => setPassword(e.target.value)}/>

          <div className="d-flex justify-content-between mx-4 mb-4">
            {/* <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' /> */}
            <a href="!#/login">Forgot password?</a>
          </div>

          <MDBBtn className="mb-4 w-100" onClick={signIn}>Sign in</MDBBtn>

        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === 'tab2'}>
          <MDBInput wrapperClass='mb-4 text-primary' label='Username' id='username2' type='text' onChange={(e) => setUsername(e.target.value)}/>
          <MDBInput wrapperClass='mb-4 text-primary' label='Password' id='password2' type='password'onChange={(e) => setPassword(e.target.value)}/>
          <MDBInput wrapperClass='mb-4 text-primary' label='Email' id='email2' type='email' onChange={(e) => setEmail(e.target.value)}/>
        
          <div className='d-flex justify-content-center mb-4'>
            {/* <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I have read and agree to the terms' /> */}
          </div>

          <MDBBtn className="mb-4 w-100" onClick={signUp}>Sign up</MDBBtn>

        </MDBTabsPane>

      </MDBTabsContent>

    </MDBContainer>
  );
}

export default Login;