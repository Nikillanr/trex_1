
import './App.css';
import React, { useState } from 'react';

// Prototype
import { ReclaimClient } from '@reclaimprotocol/js-sdk';

// call when user clicks on a button
// onClick={getVerificationReq}

// 1. Create a new ReclaimClient with your app id
// 2. Build the http provider v2 by provider id
// 3. Build the requested proofs by provider v2 and callback url
// 4. Set the signature by getting the signature from the client
// 5. Create a verification request by providers
// 6. Start the verification request
// 7. Listen for success or error events



// The success event will return the proofs
// The error event will return the error message

// The user will be redirected to the Reclaim app to complete the verification process

// The user will be redirected back to the callback url with the proofs


  const getVerificationReq = async (setRequest) => {
    const APP_ID = "0x123deAa13AB29EEDFe302b05a30B71c9B4E83b00";
    const APP_SECRET ="0xa1378984d8536346bc84a0100d51f1ad8b1a04703746bba966b05ca0de3d472c" // do not store on frontend in production
  
  
    const reclaimClient = new ReclaimClient(APP_ID);
  
    const providers = [
    '51ab336f-f4da-4f93-ac48-a789804438f5', // Instagram follow count
    '709c5dc1-d647-4b1c-9302-a83f2b9c1478', // Instagram Username
    ];
  
    const providerV2 = await reclaimClient.buildHttpProviderV2ByID(providers);
    const requestProofs = reclaimClient.buildRequestedProofs(providerV2, reclaimClient.getAppCallbackUrl());
  
    reclaimClient.setSignature(await reclaimClient.getSignature(requestProofs,APP_SECRET))
  
    const reclaimReq = await reclaimClient.createVerificationRequest(providers);
    setRequest(reclaimReq.template);
    console.log('req', reclaimReq.template);
    const url = await reclaimReq.start();
    console.log(url);
  
    reclaimReq.on('success', (data) => {
      if (data) {
        const proofs = data;
        console.log('Verification successful. Proofs:', proofs);
        // TODO: update business logic based on successful proof
      }
    });
  
    reclaimReq.on('error', (data) => {
      if (data) {
        const proofs = data;
        console.log('Verification failed. Error:', proofs);
        // TODO: update business logic based on proof generation failure
      }
    });
  };
  
  

function App() {
  const [request, setRequest] = useState(null);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Reclaim Protocol</h1>
        <button onClick={() => getVerificationReq(setRequest)}>Get Verification Request</button>
        {request && <p>{JSON.stringify(request)}</p>} {/* display the request if it exists */}

      </header>
    </div>
  );
}

export default App;

