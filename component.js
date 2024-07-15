import React, { useState } from 'react';
import { TextEncoder, TextDecoder } from 'text-encoding-utf-8';
import * as PAKO from 'pako';


const byteSize = str => new Blob([str]).size;

function PakoTest() {
  const [data, setData] = useState('This is some data to compress');
  const [encodedData, setEncodedData] = useState(null);

  const handleCompress = () => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);

    // Compress using PAKO (example with Gzip)
    const compressedData = PAKO.gzip(bytes);

    // Encode to Base64 for easier handling (optional)
    const base64String = btoa(String.fromCharCode(...compressedData));
    setEncodedData(base64String);
  };

  const handleDecompress = () => {
    if (!encodedData) return;

    // Decode from Base64 (if previously encoded)
    const bytes = atob(data);
    const uint8Array = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      uint8Array[i] = bytes.charCodeAt(i);
    }

    // Decompress using PAKO (example with Gzip)
    const decompressedData = PAKO.inflate(uint8Array);
    //setEncodedData(decompressedData)
    const decoder = new TextDecoder();
    const text = decoder.decode(decompressedData);
    setEncodedData(text);
  };

  return (
    <div>
      <textarea value={data} onChange={(e) => setData(e.target.value)} />
      <button onClick={handleCompress}>Compress</button>
      <button onClick={handleDecompress}>Decompress</button>

      {encodedData && <p>Encoded Data: {encodedData}</p>}
        <p>{byteSize(encodedData)}</p>
    </div>
  );
}

export default PakoTest