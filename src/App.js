import './App.css';
import React, { useState } from 'react';
import { ReclaimClient } from '@reclaimprotocol/js-sdk';

function App() {
  const [verificationUrl, setVerificationUrl] = useState(null);
  const [instagramId, setInstagramId] = useState('');
  const [verificationResult, setVerificationResult] = useState('');

  const initiateInstagramVerification = async () => {
    const APP_ID = "0x123deAa13AB29EEDFe302b05a30B71c9B4E83b00";
    const APP_SECRET = "0xa1378984d8536346bc84a0100d51f1ad8b1a04703746bba966b05ca0de3d472c";

    const reclaimClient = new ReclaimClient(APP_ID);

    // Validate if Instagram ID is provided
    if (!instagramId) {
      setVerificationResult('Please provide an Instagram ID.');
      return;
    }

    // Instagram follower count provider ID
    const providerId = '51ab336f-f4da-4f93-ac48-a789804438f5';

    // Build the HTTP provider v2
    const providerV2 = await reclaimClient.buildHttpProviderV2ByID([providerId]);

    // Build the requested proofs
    const requestProofs = reclaimClient.buildRequestedProofs(providerV2, reclaimClient.getAppCallbackUrl());

    // Set the signature
    reclaimClient.setSignature(await reclaimClient.getSignature(requestProofs, APP_SECRET));

    // Create a verification request
    const reclaimReq = await reclaimClient.createVerificationRequest([providerId]);

    // Start the verification request
    const verificationUrl = await reclaimReq.start();

    setVerificationUrl(verificationUrl);

    // Listen for success or error events
    reclaimReq.on('success', (data) => {
      console.log('Verification successful. Proofs:', data);
      setVerificationResult('Instagram ID exists on the platform.');
    });

    reclaimReq.on('error', (error) => {
      console.error('Verification failed. Error:', error);
      setVerificationResult('Verification failed. Please try again.');
    });
  };

  const openVerificationUrl = () => {
    if (verificationUrl) {
      window.open(verificationUrl, '_blank');
    }
  };

  const handleInputChange = (event) => {
    setInstagramId(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Instagram ID Verification</h1>
        <label>
          Enter your Instagram ID:
          <input type="text" value={instagramId} onChange={handleInputChange} />
        </label>
        <button onClick={initiateInstagramVerification}>Verify Instagram ID</button>
        <p>{verificationResult}</p>
        {verificationUrl && <p>Click <a href="#" onClick={openVerificationUrl}>here</a> to initiate verification process.</p>}
      </header>
    </div>
  );
}

export default App;
