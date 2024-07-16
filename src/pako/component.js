import React, { useState } from 'react';
import { TextEncoder, TextDecoder } from 'text-encoding-utf-8';
import * as PAKO from 'pako';

import compression from '.';

const byteSize = str => new Blob([str]).size;

function PakoTest() {
  const [data, setData] = useState('This is some data to compress');
  const [encodedData, setEncodedData] = useState(null);
  const [encoding, setEncoding] = useState('base64')

  const handleCompress = () => {
    //const encoder = new TextEncoder();
    //const bytes = encoder.encode(data);

    // Compress using PAKO (example with Gzip)
    //const compressedData = PAKO.gzip(bytes);
    const compressedData = PAKO.gzip(compression.stringToUint8Array(data))
    switch(encoding) {
      case "base64":
      // Encode to Base64 for easier handling (optional)
      const base64String = btoa(String.fromCharCode(...compressedData));
      setEncodedData(base64String);
        break;
      case "base85":
        setEncodedData(compression.toBase85(String.fromCharCode(...compressedData)))
        break;
      case "yenc":
        setEncodedData(compression.toYenc(compressedData))
        break;
      case "none":
        setEncodedData(String.fromCharCode(...compressedData))
        break;
      case "toString":
        setEncodedData(PAKO.gzip(compression.stringToUint8Array(data),{to:'string'}))
        break;
    }
    
  };

  const handleDecompress = () => {
    /*if (!encodedData) return;

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
    setEncodedData(text);*/

    switch(encoding) {
      case "base64":
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
        break;
      case "base85":
        break;
      case "yenc":
        break;
      case "none":
        break;
      case "toString":
          const strArray = data.split(",")
          const uint8Array2 = new Uint8Array(strArray.length);
          for (let i = 0; i < strArray.length; i++) {
            uint8Array2[i] = strArray[i];
          }
          const decompressedData2 = PAKO.inflate(uint8Array2);
        //setEncodedData(decompressedData)
        const decoder2 = new TextDecoder();
        const text2 = decoder2.decode(decompressedData2);
        setEncodedData(text2);
        break;
    }
  };

  return (
    <div>
      <h3>React Compressiong Test</h3>
      <textarea rows="10" cols="50" value={data} onChange={(e) => setData(e.target.value)} />
      <button onClick={handleCompress}>Compress</button>
      <button onClick={handleDecompress}>Decompress</button>
      <textarea rows="10" cols="50" value={encodedData}/>

      <p>
        Enconding:
      <select onChange={(e) => setEncoding(e.target.value)}>
        <option value="base64">Base64</option>
        <option value="base85">Base85</option>
        <option value="yenc">yEnc</option>
        <option value="none">none</option>
        <option value="toString">toString</option>
      </select>
      </p>
      <p>Previous Size: {byteSize(data)}</p>
      <p>New Size: {byteSize(encodedData)}</p>
      {encodedData && <p style={{maxWidth:"500px", width:"500px"}}>Result: {encodedData}</p>}
        
    </div>
  );
}

export default PakoTest