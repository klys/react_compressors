import React, { useState } from 'react';
import { TextEncoder, TextDecoder } from 'text-encoding-utf-8';
import * as PAKO from 'pako';

import compression from '.';

const byteSize = str => new Blob([str]).size;

function PakoTest() {
  const [data, setData] = useState('This is some data to compress');
  const [encodedData, setEncodedData] = useState('');
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
        setEncodedData(compression.toBase85(data))
        break;
      case "yenc":
        setEncodedData(compression.toYenc(compression.stringToUint8Array(data)))
        break;
      case "none":
        setEncodedData(compressedData)
        break;
      case "toString":
        setEncodedData(PAKO.gzip(compression.stringToUint8Array(data),{to:'string'}))
        break;
      case "toHex":
        setEncodedData(compression.toHex(PAKO.gzip(compression.stringToUint8Array(data),{to:'string'})))
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
        setEncodedData(compression.fromBase85(data))
        break;
      case "yenc":
        setEncodedData(compression.uint8ArrayToString(compression.fromYenc(data)))
        break;
      case "none":
        //const bytes3 = atob(data);
        const uint8Array3 = new Uint8Array(data.length);
        console.log("data: ",data)
        console.log("Lenght:",data.length)
        for (let i = 0; i < data.length; i++) {
          uint8Array3[i] = data.charCodeAt(i);
        }

        // Decompress using PAKO (example with Gzip)
        const decompressedData3 = PAKO.inflate(uint8Array3);
        //setEncodedData(decompressedData)
        const decoder3 = new TextDecoder();
        const text3 = decoder3.decode(decompressedData3);
        setEncodedData(text3)
        break;
      case "toString":
          const strArray = data.split(",")
          console.log(strArray.length)
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

  const handleSend = async () => {
    const strArray = data.split(",")
    const uint8Array2 = new Uint8Array(strArray.length);
          for (let i = 0; i < strArray.length; i++) {
            uint8Array2[i] = strArray[i];
          }
    const response = await fetch("http://localhost:4001/api/v1/account/picture2/1",{
      method:"PUT",
      headers:{
        'Authorization':`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1widXNlcmlkXCI6XCIzXCJ9IiwiZXhwIjoxNzIxMTQ0NTU2LCJpYXQiOjE3MjExNDA5NTZ9.CjkrRO1HGdkVgI4Gqmy6O7e1hzxAEX_1LDPxpAZ9dMI`,
        "Content-Type":"application/octet-stream",
        'Accept': 'application/octet-stream',
      },
      body:uint8Array2
    })

    console.log(await response.json())
  }

  const handlePicture = (picture_data) => {
    console.log("picture_data",picture_data)
    const readPictureBits = new FileReader();
        readPictureBits.onload = (binary_data) => {
          console.log("uncompressed", binary_data.target.result)
          const compressed = PAKO.gzip(binary_data.target.result, {to:'string'})
          console.log("compressed", compressed)
          setEncodedData(compressed)
        }
        readPictureBits.readAsArrayBuffer(new Blob(picture_data[0], {type:"application/octet-stream"}))
  }

  return (
    <div>
      <h3>React Compressiong Test</h3>
      
      <textarea rows="10" cols="50" value={data} onChange={(e) => setData(e.target.value)} />
      <button onClick={handleCompress}>Compress</button>
      <button onClick={handleDecompress}>Decompress</button>
      <button onClick={handleSend}>Send</button>
      <textarea rows="10" cols="50" value={encodedData}/>
      <p>File: <input type="file" onChange={(e) => handlePicture(e)}/></p>
      <p>
        Enconding:
      <select onChange={(e) => setEncoding(e.target.value)}>
        <option value="base64">Base64</option>
        <option value="base85">Base85</option>
        <option value="yenc">yEnc</option>
        <option value="none">none</option>
        <option value="toString">toString</option>
        <option value="toHex">toHex</option>
      </select>
      </p>
      <p>Previous Size: Bytes: {byteSize(data)} bytes  /// length:{data.length}</p>
      <p>New Size: Bytes: {byteSize(encodedData)} bytes /// length:{encodedData.length}</p>
      {encodedData && <p style={{maxWidth:"500px", width:"500px"}}>Result: {JSON.stringify(encodedData)}</p>}
        
    </div>
  );
}

export default PakoTest