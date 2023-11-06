import React from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
}
from 'mdb-react-ui-kit';
import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Validate() {

    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    async function confirmSignUp() {
        try {
          await Auth.confirmSignUp(username, code);
          navigate('/login');
        } catch (error) {
          console.log('error confirming sign up', error);
        }
    }

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

      <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='text' onChange={(e)=>setUsername(e.target.value)}/>
      <MDBInput wrapperClass='mb-4' label='Authentication code' id='form2' type='text' onChange={(e)=>setCode(e.target.value)}/>

      <MDBBtn className="mb-4" onClick={confirmSignUp}>Confirm</MDBBtn>

    </MDBContainer>
  );
}

export default Validate;