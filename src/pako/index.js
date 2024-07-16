/*
    Compression

    Utilities used to compress data


    Actual Software:
        pako -> https://www.npmjs.com/package/pako
        simple-yenc -> https://www.npmjs.com/package/simple-yenc/v/0.1.0
        @nurliman/base85 -> https://www.npmjs.com/package/@nurliman/base85

    Current Result:
        Impossible to get the encoded data be saved on SQL

        Neither yEnc, base85 and pako solved the issue.

        Is necessary another encoder better and reliables as base64 for saving on SQL

*/

import pako from 'pako'

import { Buffer } from "buffer";

import base85 from "@nurliman/base85";

import {stringify, encode, decode} from "simple-yenc";

String.prototype.hexEncode = function(){
  var hex, i;

  var result = "";
  for (i=0; i<this.length; i++) {
      hex = this.charCodeAt(i).toString(16);
      result += ("000"+hex).slice(-4);
  }

  return result
}

String.prototype.hexDecode = function(){
  var j;
  var hexes = this.match(/.{1,4}/g) || [];
  var back = "";
  for(j = 0; j<hexes.length; j++) {
      back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
}

const compression = {
    stringToUint8Array: (text) => {
        // Encode the string as UTF-8 bytes
        const encodedBytes = Buffer.from(text, 'utf8');
      
        // Create a Uint8Array from the encoded bytes
        return new Uint8Array(encodedBytes);
      },
      
      uint8ArrayToString: (uint8Array) => {
        // Decode the bytes from the Uint8Array as UTF-8
        return new TextDecoder('utf8').decode(uint8Array);
      },

      sizer: (str) => {
        return new Blob([str]).size;
      },

      deflate: (text_uncompressed) => {
        return compression.toYenc(pako.deflate( compression.stringToUint8Array(text_uncompressed)))
      },

      inflate: (text_compressed) => {
        try {
            return compression.uint8ArrayToString( compression.fromYenc(pako.inflate(compression.stringToUint8Array(text_compressed))));
            // ... continue processing
          } catch (err) {
            console.log(err);
            return ''
          }
      },

      toBase64: (text) => {
        return Buffer.from(text).toString('base64')
      },

      fromBase64: (base64) => {
        return Buffer.from(base64).toString('ascii')
      },

      toBase85: (text) => {
        return base85.encode(text, {wrap: false})
      },

      fromBase85: (base85text) => {
        return base85.decode(base85text)
      },

      toYenc: (uint8Array) => {
        // return a string
        return encode(uint8Array)
      },

      fromYenc: (yenc) => {
        // return uint8Array
        return decode(yenc)
      },

      toHex: (binary) => {
        console.log("binary", binary)
        return compression.uint8ArrayToString(binary).hexEncode()
      }

}

export default compression;

