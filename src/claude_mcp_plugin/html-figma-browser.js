var HtmlFigma = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/file-type/util.js
  var require_util = __commonJS({
    "node_modules/file-type/util.js"(exports2) {
      "use strict";
      exports2.stringToBytes = (string) => [...string].map((character) => character.charCodeAt(0));
      var uint8ArrayUtf8ByteString2 = (array, start, end) => {
        return String.fromCharCode(...array.slice(start, end));
      };
      exports2.readUInt64LE = (buffer, offset = 0) => {
        let n = buffer[offset];
        let mul = 1;
        let i = 0;
        while (++i < 8) {
          mul *= 256;
          n += buffer[offset + i] * mul;
        }
        return n;
      };
      exports2.tarHeaderChecksumMatches = (buffer) => {
        if (buffer.length < 512) {
          return false;
        }
        const MASK_8TH_BIT = 128;
        let sum = 256;
        let signedBitSum = 0;
        for (let i = 0; i < 148; i++) {
          const byte = buffer[i];
          sum += byte;
          signedBitSum += byte & MASK_8TH_BIT;
        }
        for (let i = 156; i < 512; i++) {
          const byte = buffer[i];
          sum += byte;
          signedBitSum += byte & MASK_8TH_BIT;
        }
        const readSum = parseInt(uint8ArrayUtf8ByteString2(buffer, 148, 154), 8);
        return (
          // Checksum in header equals the sum we calculated
          readSum === sum || // Checksum in header equals sum we calculated plus signed-to-unsigned delta
          readSum === sum - (signedBitSum << 1)
        );
      };
      exports2.multiByteIndexOf = (buffer, bytesToSearch, startAt = 0) => {
        if (Buffer && Buffer.isBuffer(buffer)) {
          return buffer.indexOf(Buffer.from(bytesToSearch), startAt);
        }
        const nextBytesMatch = (buffer2, bytes, startIndex) => {
          for (let i = 1; i < bytes.length; i++) {
            if (bytes[i] !== buffer2[startIndex + i]) {
              return false;
            }
          }
          return true;
        };
        let index = buffer.indexOf(bytesToSearch[0], startAt);
        while (index >= 0) {
          if (nextBytesMatch(buffer, bytesToSearch, index)) {
            return index;
          }
          index = buffer.indexOf(bytesToSearch[0], index + 1);
        }
        return -1;
      };
      exports2.uint8ArrayUtf8ByteString = uint8ArrayUtf8ByteString2;
    }
  });

  // node_modules/file-type/supported.js
  var require_supported = __commonJS({
    "node_modules/file-type/supported.js"(exports2, module2) {
      "use strict";
      module2.exports = {
        extensions: [
          "jpg",
          "png",
          "apng",
          "gif",
          "webp",
          "flif",
          "cr2",
          "orf",
          "arw",
          "dng",
          "nef",
          "rw2",
          "raf",
          "tif",
          "bmp",
          "jxr",
          "psd",
          "zip",
          "tar",
          "rar",
          "gz",
          "bz2",
          "7z",
          "dmg",
          "mp4",
          "mid",
          "mkv",
          "webm",
          "mov",
          "avi",
          "mpg",
          "mp2",
          "mp3",
          "m4a",
          "oga",
          "ogg",
          "ogv",
          "opus",
          "flac",
          "wav",
          "spx",
          "amr",
          "pdf",
          "epub",
          "exe",
          "swf",
          "rtf",
          "wasm",
          "woff",
          "woff2",
          "eot",
          "ttf",
          "otf",
          "ico",
          "flv",
          "ps",
          "xz",
          "sqlite",
          "nes",
          "crx",
          "xpi",
          "cab",
          "deb",
          "ar",
          "rpm",
          "Z",
          "lz",
          "msi",
          "mxf",
          "mts",
          "blend",
          "bpg",
          "docx",
          "pptx",
          "xlsx",
          "3gp",
          "3g2",
          "jp2",
          "jpm",
          "jpx",
          "mj2",
          "aif",
          "qcp",
          "odt",
          "ods",
          "odp",
          "xml",
          "mobi",
          "heic",
          "cur",
          "ktx",
          "ape",
          "wv",
          "wmv",
          "wma",
          "dcm",
          "ics",
          "glb",
          "pcap",
          "dsf",
          "lnk",
          "alias",
          "voc",
          "ac3",
          "m4v",
          "m4p",
          "m4b",
          "f4v",
          "f4p",
          "f4b",
          "f4a",
          "mie",
          "asf",
          "ogm",
          "ogx",
          "mpc",
          "arrow",
          "shp"
        ],
        mimeTypes: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/flif",
          "image/x-canon-cr2",
          "image/tiff",
          "image/bmp",
          "image/vnd.ms-photo",
          "image/vnd.adobe.photoshop",
          "application/epub+zip",
          "application/x-xpinstall",
          "application/vnd.oasis.opendocument.text",
          "application/vnd.oasis.opendocument.spreadsheet",
          "application/vnd.oasis.opendocument.presentation",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/zip",
          "application/x-tar",
          "application/x-rar-compressed",
          "application/gzip",
          "application/x-bzip2",
          "application/x-7z-compressed",
          "application/x-apple-diskimage",
          "application/x-apache-arrow",
          "video/mp4",
          "audio/midi",
          "video/x-matroska",
          "video/webm",
          "video/quicktime",
          "video/vnd.avi",
          "audio/vnd.wave",
          "audio/qcelp",
          "audio/x-ms-wma",
          "video/x-ms-asf",
          "application/vnd.ms-asf",
          "video/mpeg",
          "video/3gpp",
          "audio/mpeg",
          "audio/mp4",
          // RFC 4337
          "audio/opus",
          "video/ogg",
          "audio/ogg",
          "application/ogg",
          "audio/x-flac",
          "audio/ape",
          "audio/wavpack",
          "audio/amr",
          "application/pdf",
          "application/x-msdownload",
          "application/x-shockwave-flash",
          "application/rtf",
          "application/wasm",
          "font/woff",
          "font/woff2",
          "application/vnd.ms-fontobject",
          "font/ttf",
          "font/otf",
          "image/x-icon",
          "video/x-flv",
          "application/postscript",
          "application/x-xz",
          "application/x-sqlite3",
          "application/x-nintendo-nes-rom",
          "application/x-google-chrome-extension",
          "application/vnd.ms-cab-compressed",
          "application/x-deb",
          "application/x-unix-archive",
          "application/x-rpm",
          "application/x-compress",
          "application/x-lzip",
          "application/x-msi",
          "application/x-mie",
          "application/mxf",
          "video/mp2t",
          "application/x-blender",
          "image/bpg",
          "image/jp2",
          "image/jpx",
          "image/jpm",
          "image/mj2",
          "audio/aiff",
          "application/xml",
          "application/x-mobipocket-ebook",
          "image/heif",
          "image/heif-sequence",
          "image/heic",
          "image/heic-sequence",
          "image/ktx",
          "application/dicom",
          "audio/x-musepack",
          "text/calendar",
          "model/gltf-binary",
          "application/vnd.tcpdump.pcap",
          "audio/x-dsf",
          // Non-standard
          "application/x.ms.shortcut",
          // Invented by us
          "application/x.apple.alias",
          // Invented by us
          "audio/x-voc",
          "audio/vnd.dolby.dd-raw",
          "audio/x-m4a",
          "image/apng",
          "image/x-olympus-orf",
          "image/x-sony-arw",
          "image/x-adobe-dng",
          "image/x-nikon-nef",
          "image/x-panasonic-rw2",
          "image/x-fujifilm-raf",
          "video/x-m4v",
          "video/3gpp2",
          "application/x-esri-shape"
        ]
      };
    }
  });

  // node_modules/file-type/index.js
  var require_file_type = __commonJS({
    "node_modules/file-type/index.js"(exports, module) {
      "use strict";
      var {
        multiByteIndexOf,
        stringToBytes,
        readUInt64LE,
        tarHeaderChecksumMatches,
        uint8ArrayUtf8ByteString
      } = require_util();
      var supported = require_supported();
      var xpiZipFilename = stringToBytes("META-INF/mozilla.rsa");
      var oxmlContentTypes = stringToBytes("[Content_Types].xml");
      var oxmlRels = stringToBytes("_rels/.rels");
      var fileType = (input) => {
        if (!(input instanceof Uint8Array || input instanceof ArrayBuffer || Buffer.isBuffer(input))) {
          throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`Buffer\` or \`ArrayBuffer\`, got \`${typeof input}\``);
        }
        const buffer = input instanceof Uint8Array ? input : new Uint8Array(input);
        if (!(buffer && buffer.length > 1)) {
          return;
        }
        const check = (header, options) => {
          options = {
            offset: 0,
            ...options
          };
          for (let i = 0; i < header.length; i++) {
            if (options.mask) {
              if (header[i] !== (options.mask[i] & buffer[i + options.offset])) {
                return false;
              }
            } else if (header[i] !== buffer[i + options.offset]) {
              return false;
            }
          }
          return true;
        };
        const checkString = (header, options) => check(stringToBytes(header), options);
        if (check([255, 216, 255])) {
          return {
            ext: "jpg",
            mime: "image/jpeg"
          };
        }
        if (check([137, 80, 78, 71, 13, 10, 26, 10])) {
          const startIndex = 33;
          const firstImageDataChunkIndex = buffer.findIndex((el, i) => i >= startIndex && buffer[i] === 73 && buffer[i + 1] === 68 && buffer[i + 2] === 65 && buffer[i + 3] === 84);
          const sliced = buffer.subarray(startIndex, firstImageDataChunkIndex);
          if (sliced.findIndex((el, i) => sliced[i] === 97 && sliced[i + 1] === 99 && sliced[i + 2] === 84 && sliced[i + 3] === 76) >= 0) {
            return {
              ext: "apng",
              mime: "image/apng"
            };
          }
          return {
            ext: "png",
            mime: "image/png"
          };
        }
        if (check([71, 73, 70])) {
          return {
            ext: "gif",
            mime: "image/gif"
          };
        }
        if (check([87, 69, 66, 80], { offset: 8 })) {
          return {
            ext: "webp",
            mime: "image/webp"
          };
        }
        if (check([70, 76, 73, 70])) {
          return {
            ext: "flif",
            mime: "image/flif"
          };
        }
        if ((check([73, 73, 42, 0]) || check([77, 77, 0, 42])) && check([67, 82], { offset: 8 })) {
          return {
            ext: "cr2",
            mime: "image/x-canon-cr2"
          };
        }
        if (check([73, 73, 82, 79, 8, 0, 0, 0, 24])) {
          return {
            ext: "orf",
            mime: "image/x-olympus-orf"
          };
        }
        if (check([73, 73, 42, 0]) && (check([16, 251, 134, 1], { offset: 4 }) || check([8, 0, 0, 0], { offset: 4 })) && // This pattern differentiates ARW from other TIFF-ish file types:
        check([0, 254, 0, 4, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 1], { offset: 9 })) {
          return {
            ext: "arw",
            mime: "image/x-sony-arw"
          };
        }
        if (check([73, 73, 42, 0, 8, 0, 0, 0]) && (check([45, 0, 254, 0], { offset: 8 }) || check([39, 0, 254, 0], { offset: 8 }))) {
          return {
            ext: "dng",
            mime: "image/x-adobe-dng"
          };
        }
        if (check([73, 73, 42, 0]) && check([28, 0, 254, 0], { offset: 8 })) {
          return {
            ext: "nef",
            mime: "image/x-nikon-nef"
          };
        }
        if (check([73, 73, 85, 0, 24, 0, 0, 0, 136, 231, 116, 216])) {
          return {
            ext: "rw2",
            mime: "image/x-panasonic-rw2"
          };
        }
        if (checkString("FUJIFILMCCD-RAW")) {
          return {
            ext: "raf",
            mime: "image/x-fujifilm-raf"
          };
        }
        if (check([73, 73, 42, 0]) || check([77, 77, 0, 42])) {
          return {
            ext: "tif",
            mime: "image/tiff"
          };
        }
        if (check([66, 77])) {
          return {
            ext: "bmp",
            mime: "image/bmp"
          };
        }
        if (check([73, 73, 188])) {
          return {
            ext: "jxr",
            mime: "image/vnd.ms-photo"
          };
        }
        if (check([56, 66, 80, 83])) {
          return {
            ext: "psd",
            mime: "image/vnd.adobe.photoshop"
          };
        }
        const zipHeader = [80, 75, 3, 4];
        if (check(zipHeader)) {
          if (check([109, 105, 109, 101, 116, 121, 112, 101, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 101, 112, 117, 98, 43, 122, 105, 112], { offset: 30 })) {
            return {
              ext: "epub",
              mime: "application/epub+zip"
            };
          }
          if (check(xpiZipFilename, { offset: 30 })) {
            return {
              ext: "xpi",
              mime: "application/x-xpinstall"
            };
          }
          if (checkString("mimetypeapplication/vnd.oasis.opendocument.text", { offset: 30 })) {
            return {
              ext: "odt",
              mime: "application/vnd.oasis.opendocument.text"
            };
          }
          if (checkString("mimetypeapplication/vnd.oasis.opendocument.spreadsheet", { offset: 30 })) {
            return {
              ext: "ods",
              mime: "application/vnd.oasis.opendocument.spreadsheet"
            };
          }
          if (checkString("mimetypeapplication/vnd.oasis.opendocument.presentation", { offset: 30 })) {
            return {
              ext: "odp",
              mime: "application/vnd.oasis.opendocument.presentation"
            };
          }
          let zipHeaderIndex = 0;
          let oxmlFound = false;
          let type;
          do {
            const offset = zipHeaderIndex + 30;
            if (!oxmlFound) {
              oxmlFound = check(oxmlContentTypes, { offset }) || check(oxmlRels, { offset });
            }
            if (!type) {
              if (checkString("word/", { offset })) {
                type = {
                  ext: "docx",
                  mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                };
              } else if (checkString("ppt/", { offset })) {
                type = {
                  ext: "pptx",
                  mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                };
              } else if (checkString("xl/", { offset })) {
                type = {
                  ext: "xlsx",
                  mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                };
              }
            }
            if (oxmlFound && type) {
              return type;
            }
            zipHeaderIndex = multiByteIndexOf(buffer, zipHeader, offset);
          } while (zipHeaderIndex >= 0);
          if (type) {
            return type;
          }
        }
        if (check([80, 75]) && (buffer[2] === 3 || buffer[2] === 5 || buffer[2] === 7) && (buffer[3] === 4 || buffer[3] === 6 || buffer[3] === 8)) {
          return {
            ext: "zip",
            mime: "application/zip"
          };
        }
        if (check([48, 48, 48, 48, 48, 48], { offset: 148, mask: [248, 248, 248, 248, 248, 248] }) && // Valid tar checksum
        tarHeaderChecksumMatches(buffer)) {
          return {
            ext: "tar",
            mime: "application/x-tar"
          };
        }
        if (check([82, 97, 114, 33, 26, 7]) && (buffer[6] === 0 || buffer[6] === 1)) {
          return {
            ext: "rar",
            mime: "application/x-rar-compressed"
          };
        }
        if (check([31, 139, 8])) {
          return {
            ext: "gz",
            mime: "application/gzip"
          };
        }
        if (check([66, 90, 104])) {
          return {
            ext: "bz2",
            mime: "application/x-bzip2"
          };
        }
        if (check([55, 122, 188, 175, 39, 28])) {
          return {
            ext: "7z",
            mime: "application/x-7z-compressed"
          };
        }
        if (check([120, 1])) {
          return {
            ext: "dmg",
            mime: "application/x-apple-diskimage"
          };
        }
        if (check([102, 114, 101, 101], { offset: 4 }) || // `free`
        check([109, 100, 97, 116], { offset: 4 }) || // `mdat` MJPEG
        check([109, 111, 111, 118], { offset: 4 }) || // `moov`
        check([119, 105, 100, 101], { offset: 4 })) {
          return {
            ext: "mov",
            mime: "video/quicktime"
          };
        }
        if (checkString("ftyp", { offset: 4 }) && (buffer[8] & 96) !== 0) {
          const brandMajor = uint8ArrayUtf8ByteString(buffer, 8, 12).replace("\0", " ").trim();
          switch (brandMajor) {
            case "mif1":
              return { ext: "heic", mime: "image/heif" };
            case "msf1":
              return { ext: "heic", mime: "image/heif-sequence" };
            case "heic":
            case "heix":
              return { ext: "heic", mime: "image/heic" };
            case "hevc":
            case "hevx":
              return { ext: "heic", mime: "image/heic-sequence" };
            case "qt":
              return { ext: "mov", mime: "video/quicktime" };
            case "M4V":
            case "M4VH":
            case "M4VP":
              return { ext: "m4v", mime: "video/x-m4v" };
            case "M4P":
              return { ext: "m4p", mime: "video/mp4" };
            case "M4B":
              return { ext: "m4b", mime: "audio/mp4" };
            case "M4A":
              return { ext: "m4a", mime: "audio/x-m4a" };
            case "F4V":
              return { ext: "f4v", mime: "video/mp4" };
            case "F4P":
              return { ext: "f4p", mime: "video/mp4" };
            case "F4A":
              return { ext: "f4a", mime: "audio/mp4" };
            case "F4B":
              return { ext: "f4b", mime: "audio/mp4" };
            default:
              if (brandMajor.startsWith("3g")) {
                if (brandMajor.startsWith("3g2")) {
                  return { ext: "3g2", mime: "video/3gpp2" };
                }
                return { ext: "3gp", mime: "video/3gpp" };
              }
              return { ext: "mp4", mime: "video/mp4" };
          }
        }
        if (check([77, 84, 104, 100])) {
          return {
            ext: "mid",
            mime: "audio/midi"
          };
        }
        if (check([26, 69, 223, 163])) {
          const sliced = buffer.subarray(4, 4 + 4096);
          const idPos = sliced.findIndex((el, i, arr) => arr[i] === 66 && arr[i + 1] === 130);
          if (idPos !== -1) {
            const docTypePos = idPos + 3;
            const findDocType = (type) => [...type].every((c, i) => sliced[docTypePos + i] === c.charCodeAt(0));
            if (findDocType("matroska")) {
              return {
                ext: "mkv",
                mime: "video/x-matroska"
              };
            }
            if (findDocType("webm")) {
              return {
                ext: "webm",
                mime: "video/webm"
              };
            }
          }
        }
        if (check([82, 73, 70, 70])) {
          if (check([65, 86, 73], { offset: 8 })) {
            return {
              ext: "avi",
              mime: "video/vnd.avi"
            };
          }
          if (check([87, 65, 86, 69], { offset: 8 })) {
            return {
              ext: "wav",
              mime: "audio/vnd.wave"
            };
          }
          if (check([81, 76, 67, 77], { offset: 8 })) {
            return {
              ext: "qcp",
              mime: "audio/qcelp"
            };
          }
        }
        if (check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
          let offset = 30;
          do {
            const objectSize = readUInt64LE(buffer, offset + 16);
            if (check([145, 7, 220, 183, 183, 169, 207, 17, 142, 230, 0, 192, 12, 32, 83, 101], { offset })) {
              if (check([64, 158, 105, 248, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43], { offset: offset + 24 })) {
                return {
                  ext: "wma",
                  mime: "audio/x-ms-wma"
                };
              }
              if (check([192, 239, 25, 188, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43], { offset: offset + 24 })) {
                return {
                  ext: "wmv",
                  mime: "video/x-ms-asf"
                };
              }
              break;
            }
            offset += objectSize;
          } while (offset + 24 <= buffer.length);
          return {
            ext: "asf",
            mime: "application/vnd.ms-asf"
          };
        }
        if (check([0, 0, 1, 186]) || check([0, 0, 1, 179])) {
          return {
            ext: "mpg",
            mime: "video/mpeg"
          };
        }
        for (let start = 0; start < 2 && start < buffer.length - 16; start++) {
          if (check([73, 68, 51], { offset: start }) || // ID3 header
          check([255, 226], { offset: start, mask: [255, 230] })) {
            return {
              ext: "mp3",
              mime: "audio/mpeg"
            };
          }
          if (check([255, 228], { offset: start, mask: [255, 230] })) {
            return {
              ext: "mp2",
              mime: "audio/mpeg"
            };
          }
          if (check([255, 248], { offset: start, mask: [255, 252] })) {
            return {
              ext: "mp2",
              mime: "audio/mpeg"
            };
          }
          if (check([255, 240], { offset: start, mask: [255, 252] })) {
            return {
              ext: "mp4",
              mime: "audio/mpeg"
            };
          }
        }
        if (check([79, 112, 117, 115, 72, 101, 97, 100], { offset: 28 })) {
          return {
            ext: "opus",
            mime: "audio/opus"
          };
        }
        if (check([79, 103, 103, 83])) {
          if (check([128, 116, 104, 101, 111, 114, 97], { offset: 28 })) {
            return {
              ext: "ogv",
              mime: "video/ogg"
            };
          }
          if (check([1, 118, 105, 100, 101, 111, 0], { offset: 28 })) {
            return {
              ext: "ogm",
              mime: "video/ogg"
            };
          }
          if (check([127, 70, 76, 65, 67], { offset: 28 })) {
            return {
              ext: "oga",
              mime: "audio/ogg"
            };
          }
          if (check([83, 112, 101, 101, 120, 32, 32], { offset: 28 })) {
            return {
              ext: "spx",
              mime: "audio/ogg"
            };
          }
          if (check([1, 118, 111, 114, 98, 105, 115], { offset: 28 })) {
            return {
              ext: "ogg",
              mime: "audio/ogg"
            };
          }
          return {
            ext: "ogx",
            mime: "application/ogg"
          };
        }
        if (check([102, 76, 97, 67])) {
          return {
            ext: "flac",
            mime: "audio/x-flac"
          };
        }
        if (check([77, 65, 67, 32])) {
          return {
            ext: "ape",
            mime: "audio/ape"
          };
        }
        if (check([119, 118, 112, 107])) {
          return {
            ext: "wv",
            mime: "audio/wavpack"
          };
        }
        if (check([35, 33, 65, 77, 82, 10])) {
          return {
            ext: "amr",
            mime: "audio/amr"
          };
        }
        if (check([37, 80, 68, 70])) {
          return {
            ext: "pdf",
            mime: "application/pdf"
          };
        }
        if (check([77, 90])) {
          return {
            ext: "exe",
            mime: "application/x-msdownload"
          };
        }
        if ((buffer[0] === 67 || buffer[0] === 70) && check([87, 83], { offset: 1 })) {
          return {
            ext: "swf",
            mime: "application/x-shockwave-flash"
          };
        }
        if (check([123, 92, 114, 116, 102])) {
          return {
            ext: "rtf",
            mime: "application/rtf"
          };
        }
        if (check([0, 97, 115, 109])) {
          return {
            ext: "wasm",
            mime: "application/wasm"
          };
        }
        if (check([119, 79, 70, 70]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
          return {
            ext: "woff",
            mime: "font/woff"
          };
        }
        if (check([119, 79, 70, 50]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
          return {
            ext: "woff2",
            mime: "font/woff2"
          };
        }
        if (check([76, 80], { offset: 34 }) && (check([0, 0, 1], { offset: 8 }) || check([1, 0, 2], { offset: 8 }) || check([2, 0, 2], { offset: 8 }))) {
          return {
            ext: "eot",
            mime: "application/vnd.ms-fontobject"
          };
        }
        if (check([0, 1, 0, 0, 0])) {
          return {
            ext: "ttf",
            mime: "font/ttf"
          };
        }
        if (check([79, 84, 84, 79, 0])) {
          return {
            ext: "otf",
            mime: "font/otf"
          };
        }
        if (check([0, 0, 1, 0])) {
          return {
            ext: "ico",
            mime: "image/x-icon"
          };
        }
        if (check([0, 0, 2, 0])) {
          return {
            ext: "cur",
            mime: "image/x-icon"
          };
        }
        if (check([70, 76, 86, 1])) {
          return {
            ext: "flv",
            mime: "video/x-flv"
          };
        }
        if (check([37, 33])) {
          return {
            ext: "ps",
            mime: "application/postscript"
          };
        }
        if (check([253, 55, 122, 88, 90, 0])) {
          return {
            ext: "xz",
            mime: "application/x-xz"
          };
        }
        if (check([83, 81, 76, 105])) {
          return {
            ext: "sqlite",
            mime: "application/x-sqlite3"
          };
        }
        if (check([78, 69, 83, 26])) {
          return {
            ext: "nes",
            mime: "application/x-nintendo-nes-rom"
          };
        }
        if (check([67, 114, 50, 52])) {
          return {
            ext: "crx",
            mime: "application/x-google-chrome-extension"
          };
        }
        if (check([77, 83, 67, 70]) || check([73, 83, 99, 40])) {
          return {
            ext: "cab",
            mime: "application/vnd.ms-cab-compressed"
          };
        }
        if (check([33, 60, 97, 114, 99, 104, 62, 10, 100, 101, 98, 105, 97, 110, 45, 98, 105, 110, 97, 114, 121])) {
          return {
            ext: "deb",
            mime: "application/x-deb"
          };
        }
        if (check([33, 60, 97, 114, 99, 104, 62])) {
          return {
            ext: "ar",
            mime: "application/x-unix-archive"
          };
        }
        if (check([237, 171, 238, 219])) {
          return {
            ext: "rpm",
            mime: "application/x-rpm"
          };
        }
        if (check([31, 160]) || check([31, 157])) {
          return {
            ext: "Z",
            mime: "application/x-compress"
          };
        }
        if (check([76, 90, 73, 80])) {
          return {
            ext: "lz",
            mime: "application/x-lzip"
          };
        }
        if (check([208, 207, 17, 224, 161, 177, 26, 225, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 62])) {
          return {
            ext: "msi",
            mime: "application/x-msi"
          };
        }
        if (check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) {
          return {
            ext: "mxf",
            mime: "application/mxf"
          };
        }
        if (check([71], { offset: 4 }) && (check([71], { offset: 192 }) || check([71], { offset: 196 }))) {
          return {
            ext: "mts",
            mime: "video/mp2t"
          };
        }
        if (check([66, 76, 69, 78, 68, 69, 82])) {
          return {
            ext: "blend",
            mime: "application/x-blender"
          };
        }
        if (check([66, 80, 71, 251])) {
          return {
            ext: "bpg",
            mime: "image/bpg"
          };
        }
        if (check([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10])) {
          if (check([106, 112, 50, 32], { offset: 20 })) {
            return {
              ext: "jp2",
              mime: "image/jp2"
            };
          }
          if (check([106, 112, 120, 32], { offset: 20 })) {
            return {
              ext: "jpx",
              mime: "image/jpx"
            };
          }
          if (check([106, 112, 109, 32], { offset: 20 })) {
            return {
              ext: "jpm",
              mime: "image/jpm"
            };
          }
          if (check([109, 106, 112, 50], { offset: 20 })) {
            return {
              ext: "mj2",
              mime: "image/mj2"
            };
          }
        }
        if (check([70, 79, 82, 77])) {
          return {
            ext: "aif",
            mime: "audio/aiff"
          };
        }
        if (checkString("<?xml ")) {
          return {
            ext: "xml",
            mime: "application/xml"
          };
        }
        if (check([66, 79, 79, 75, 77, 79, 66, 73], { offset: 60 })) {
          return {
            ext: "mobi",
            mime: "application/x-mobipocket-ebook"
          };
        }
        if (check([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10])) {
          return {
            ext: "ktx",
            mime: "image/ktx"
          };
        }
        if (check([68, 73, 67, 77], { offset: 128 })) {
          return {
            ext: "dcm",
            mime: "application/dicom"
          };
        }
        if (check([77, 80, 43])) {
          return {
            ext: "mpc",
            mime: "audio/x-musepack"
          };
        }
        if (check([77, 80, 67, 75])) {
          return {
            ext: "mpc",
            mime: "audio/x-musepack"
          };
        }
        if (check([66, 69, 71, 73, 78, 58])) {
          return {
            ext: "ics",
            mime: "text/calendar"
          };
        }
        if (check([103, 108, 84, 70, 2, 0, 0, 0])) {
          return {
            ext: "glb",
            mime: "model/gltf-binary"
          };
        }
        if (check([212, 195, 178, 161]) || check([161, 178, 195, 212])) {
          return {
            ext: "pcap",
            mime: "application/vnd.tcpdump.pcap"
          };
        }
        if (check([68, 83, 68, 32])) {
          return {
            ext: "dsf",
            mime: "audio/x-dsf"
            // Non-standard
          };
        }
        if (check([76, 0, 0, 0, 1, 20, 2, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 0, 0, 70])) {
          return {
            ext: "lnk",
            mime: "application/x.ms.shortcut"
            // Invented by us
          };
        }
        if (check([98, 111, 111, 107, 0, 0, 0, 0, 109, 97, 114, 107, 0, 0, 0, 0])) {
          return {
            ext: "alias",
            mime: "application/x.apple.alias"
            // Invented by us
          };
        }
        if (checkString("Creative Voice File")) {
          return {
            ext: "voc",
            mime: "audio/x-voc"
          };
        }
        if (check([11, 119])) {
          return {
            ext: "ac3",
            mime: "audio/vnd.dolby.dd-raw"
          };
        }
        if ((check([126, 16, 4]) || check([126, 24, 4])) && check([48, 77, 73, 69], { offset: 4 })) {
          return {
            ext: "mie",
            mime: "application/x-mie"
          };
        }
        if (check([65, 82, 82, 79, 87, 49, 0, 0])) {
          return {
            ext: "arrow",
            mime: "application/x-apache-arrow"
          };
        }
        if (check([39, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], { offset: 2 })) {
          return {
            ext: "shp",
            mime: "application/x-esri-shape"
          };
        }
      };
      module.exports = fileType;
      Object.defineProperty(fileType, "minimumBytes", { value: 4100 });
      fileType.stream = (readableStream) => new Promise((resolve, reject) => {
        const stream = eval("require")("stream");
        readableStream.on("error", reject);
        readableStream.once("readable", () => {
          const pass = new stream.PassThrough();
          const chunk = readableStream.read(module.exports.minimumBytes) || readableStream.read();
          try {
            pass.fileType = fileType(chunk);
          } catch (error) {
            reject(error);
          }
          readableStream.unshift(chunk);
          if (stream.pipeline) {
            resolve(stream.pipeline(readableStream, pass, () => {
            }));
          } else {
            resolve(readableStream.pipe(pass));
          }
        });
      });
      Object.defineProperty(fileType, "extensions", {
        get() {
          return new Set(supported.extensions);
        }
      });
      Object.defineProperty(fileType, "mimeTypes", {
        get() {
          return new Set(supported.mimeTypes);
        }
      });
    }
  });

  // node_modules/html-figma/browser/index.js
  var index_exports = {};
  __export(index_exports, {
    context: () => context,
    htmlToFigma: () => htmlToFigma,
    replaceSvgFill: () => replaceSvgFill,
    setContext: () => setContext
  });

  // node_modules/html-figma/utils.js
  var hasChildren = (node) => (
    // @ts-expect-error
    node && Array.isArray(node.children)
  );
  function traverse(layer, cb, parent = null) {
    if (layer) {
      cb(layer, parent);
      if (hasChildren(layer)) {
        layer.children.forEach((child) => traverse(child, cb, layer));
      }
    }
  }
  function traverseMap(layer, cb, parent = null) {
    var _a;
    if (layer) {
      const newLayer = cb(layer, parent);
      if ((_a = newLayer === null || newLayer === void 0 ? void 0 : newLayer.children) === null || _a === void 0 ? void 0 : _a.length) {
        newLayer.children = newLayer.children.map((child) => traverseMap(child, cb, layer));
      }
      return newLayer;
    }
  }
  var capitalize = (str) => str[0].toUpperCase() + str.substring(1);
  function getRgb(colorString) {
    if (!colorString) {
      return null;
    }
    const [_1, r, g, b, _2, a] = colorString.match(/rgba?\(([\d\.]+), ([\d\.]+), ([\d\.]+)(, ([\d\.]+))?\)/) || [];
    const none = a && parseFloat(a) === 0;
    if (r && g && b && !none) {
      return {
        r: parseInt(r) / 255,
        g: parseInt(g) / 255,
        b: parseInt(b) / 255,
        a: a ? parseFloat(a) : 1
      };
    }
    return null;
  }
  var fastClone = (data) => typeof data === "symbol" ? null : JSON.parse(JSON.stringify(data));
  var toNum = (v) => {
    if (!/px$/.test(v) && v !== "0")
      return 0;
    const n = parseFloat(v);
    return !isNaN(n) ? n : 0;
  };
  var toPercent = (v) => {
    if (!/%$/.test(v) && v !== "0")
      return 0;
    const n = parseInt(v);
    return !isNaN(n) ? n / 100 : 0;
  };
  var parseUnits = (str, relative) => {
    if (!str) {
      return null;
    }
    let value = toNum(str);
    if (relative && !value) {
      const percent = toPercent(str);
      if (!percent)
        return null;
      value = relative * percent;
    }
    if (value) {
      return {
        unit: "PIXELS",
        value
      };
    }
    return null;
  };
  var LENGTH_REG = /^[0-9]+[a-zA-Z%]+?$/;
  var isLength = (v) => v === "0" || LENGTH_REG.test(v);
  var parseMultipleCSSValues = (str) => {
    const parts = [];
    let lastSplitIndex = 0;
    let skobka = false;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "," && !skobka) {
        parts.push(str.slice(lastSplitIndex, i));
        lastSplitIndex = i + 1;
      } else if (str[i] === "(") {
        skobka = true;
      } else if (str[i] === ")") {
        skobka = false;
      }
    }
    parts.push(str.slice(lastSplitIndex));
    return parts.map((s) => s.trim());
  };
  var parseBoxShadowValue = (str) => {
    if (str.startsWith("rgb")) {
      const colorMatch = str.match(/(rgba?\(.+?\))(.+)/);
      if (colorMatch) {
        str = (colorMatch[2] + " " + colorMatch[1]).trim();
      }
    }
    const PARTS_REG = /\s(?![^(]*\))/;
    const parts = str.split(PARTS_REG);
    const inset = parts.includes("inset");
    const last = parts.slice(-1)[0];
    const color = !isLength(last) ? last : "rgba(0, 0, 0, 1)";
    const nums = parts.filter((n) => n !== "inset").filter((n) => n !== color).map(toNum);
    const [offsetX, offsetY, blurRadius, spreadRadius] = nums;
    const parsedColor = getRgb(color);
    if (!parsedColor) {
      console.error("Parse color error: " + color);
    }
    return {
      inset,
      offsetX,
      offsetY,
      blurRadius,
      spreadRadius,
      color: parsedColor || { r: 0, g: 0, b: 0, a: 1 }
    };
  };
  var getOpacity = (styles) => {
    return Number(styles.opacity);
  };
  var parseBoxShadowValues = (str) => {
    const values = parseMultipleCSSValues(str);
    return values.map((s) => parseBoxShadowValue(s));
  };
  var defaultPlaceholderColor = getRgb("rgba(178, 178, 178, 1)");

  // node_modules/html-figma/browser/dom-utils.js
  var import_file_type = __toESM(require_file_type());

  // node_modules/html-figma/browser/utils.js
  var context = {
    // @ts-expect-error
    window,
    document
  };
  var setContext = (window2) => {
    context.document = window2.document;
    context.window = window2;
  };
  var replaceSvgFill = (svg, fillColor) => {
    const endTagIndex = svg.indexOf(">");
    const mainTag = svg.slice(1, endTagIndex);
    const fillAttr = `fill="${fillColor}"`;
    const mainTagWithFill = mainTag.includes("fill=") ? mainTag.replace(/fill\=(.*?)\s/, `fill="${fillColor}" `) : mainTag + fillAttr;
    return `<${mainTagWithFill}>${svg.slice(endTagIndex)}`;
  };

  // node_modules/html-figma/browser/dom-utils.js
  function getBoundingClientRect(el, pseudo) {
    const { getComputedStyle } = context.window;
    const computed = getComputedStyle(el, pseudo);
    const display = computed.display;
    if (pseudo) {
      return getBoundingClientRectPseudo(el, pseudo, computed);
    }
    return el.getBoundingClientRect();
  }
  function getBoundingClientRectPseudo(el, pseudo, style) {
    const dest = {};
    const copy = document.createElement("span");
    for (let i = 0, l = style.length; i < l; i++) {
      const prop = style[i];
      copy.style[prop] = style.getPropertyValue(prop) || style[prop];
    }
    pseudo === "after" ? el.append(copy) : el.prepend(copy);
    const rect = copy.getBoundingClientRect();
    el.removeChild(copy);
    return rect;
  }
  var getUrl = (url) => {
    if (!url) {
      return "";
    }
    let final = url.trim();
    if (final.startsWith("//")) {
      final = "https:" + final;
    }
    if (final.startsWith("/")) {
      final = "https://" + window.location.host + final;
    }
    return final;
  };
  var prepareUrl = (url) => {
    if (url.startsWith("data:")) {
      return url;
    }
    const urlParsed = new URL(url);
    return urlParsed.toString();
  };
  function isHidden(element, pseudo) {
    const { getComputedStyle } = context.window;
    let el = element;
    do {
      const computed = getComputedStyle(el, pseudo);
      if (computed.opacity === "0" || computed.display === "none" || computed.visibility === "hidden") {
        return true;
      }
      if (computed.overflow !== "visible" && el.getBoundingClientRect().height < 1) {
        return true;
      }
    } while (el = el.parentElement);
    return false;
  }
  var ElemTypes;
  (function(ElemTypes2) {
    ElemTypes2[ElemTypes2["Textarea"] = 0] = "Textarea";
    ElemTypes2[ElemTypes2["Input"] = 1] = "Input";
    ElemTypes2[ElemTypes2["Image"] = 2] = "Image";
    ElemTypes2[ElemTypes2["Picture"] = 3] = "Picture";
    ElemTypes2[ElemTypes2["Video"] = 4] = "Video";
    ElemTypes2[ElemTypes2["SVG"] = 5] = "SVG";
    ElemTypes2[ElemTypes2["SubSVG"] = 6] = "SubSVG";
    ElemTypes2[ElemTypes2["Element"] = 7] = "Element";
  })(ElemTypes || (ElemTypes = {}));
  var getElemType = (el) => {
    if (el instanceof context.window.HTMLInputElement) {
      return ElemTypes.Input;
    }
    if (el instanceof context.window.HTMLTextAreaElement) {
      return ElemTypes.Textarea;
    }
    if (el instanceof context.window.HTMLPictureElement) {
      return ElemTypes.Picture;
    }
    if (el instanceof context.window.HTMLImageElement) {
      return ElemTypes.Image;
    }
    if (el instanceof context.window.HTMLVideoElement) {
      return ElemTypes.Video;
    }
    if (el instanceof context.window.SVGSVGElement) {
      return ElemTypes.SVG;
    }
    if (el instanceof context.window.SVGElement) {
      return ElemTypes.SubSVG;
    }
    if (el instanceof context.window.HTMLElement) {
      return ElemTypes.Element;
    }
  };
  var isElemType = (el, type) => {
    return getElemType(el) === type;
  };
  var getLineHeight = (el, computedStyles) => {
    var _a;
    const computedLineHeight = parseUnits(computedStyles.lineHeight);
    if (computedLineHeight) {
      return computedLineHeight;
    }
    if (isElemType(el, ElemTypes.Input)) {
      return parseUnits(computedStyles.height);
    }
    const fontSize = (_a = parseUnits(computedStyles.fontSize)) === null || _a === void 0 ? void 0 : _a.value;
    if (!fontSize)
      return null;
    return { value: Math.floor(fontSize * 1.2), unit: "PIXELS" };
  };

  // node_modules/html-figma/browser/text-to-figma.js
  var textToFigma = (node, { fromTextInput = false } = {}) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const textValue = (_a = node.textContent || node.value || node.placeholder) === null || _a === void 0 ? void 0 : _a.trim();
    if (!textValue)
      return;
    const { getComputedStyle } = context.window;
    const parent = node.parentElement;
    if (isHidden(parent)) {
      return;
    }
    const computedStyles = getComputedStyle(fromTextInput ? node : parent);
    const range = context.document.createRange();
    range.selectNode(node);
    const rect = fastClone(range.getBoundingClientRect());
    const lineHeight = getLineHeight(node, computedStyles);
    range.detach();
    if (lineHeight && lineHeight.value && rect.height < lineHeight.value) {
      const delta = lineHeight.value - rect.height;
      rect.top -= delta / 2;
      rect.height = lineHeight.value;
    }
    if (rect.height < 1 || rect.width < 1) {
      return;
    }
    let x = Math.round(rect.left);
    let y = Math.round(rect.top);
    let width = Math.round(rect.width);
    let height = Math.round(rect.height);
    if (fromTextInput) {
      const borderLeftWidth = ((_b = parseUnits(computedStyles.borderLeftWidth)) === null || _b === void 0 ? void 0 : _b.value) || 0;
      const borderRightWidth = ((_c = parseUnits(computedStyles.borderRightWidth)) === null || _c === void 0 ? void 0 : _c.value) || 0;
      const paddingLeft = ((_d = parseUnits(computedStyles.paddingLeft)) === null || _d === void 0 ? void 0 : _d.value) || 0;
      const paddingRight = ((_e = parseUnits(computedStyles.paddingRight)) === null || _e === void 0 ? void 0 : _e.value) || 0;
      const paddingTop = ((_f = parseUnits(computedStyles.paddingTop)) === null || _f === void 0 ? void 0 : _f.value) || 0;
      const paddingBottom = ((_g = parseUnits(computedStyles.paddingBottom)) === null || _g === void 0 ? void 0 : _g.value) || 0;
      x = x + borderLeftWidth + (fromTextInput ? paddingLeft : 0);
      y = y + paddingTop;
      width = width - borderRightWidth - paddingRight;
      height = height - paddingTop - paddingBottom;
    }
    const textNode = {
      x,
      y,
      width,
      height,
      ref: node,
      type: "TEXT",
      characters: (textValue === null || textValue === void 0 ? void 0 : textValue.replace(/\s+/g, " ")) || ""
    };
    const fills = [];
    let rgb = getRgb(computedStyles.color);
    const isPlaceholder = fromTextInput && !node.value && node.placeholder;
    rgb = isPlaceholder ? defaultPlaceholderColor : rgb;
    if (rgb) {
      fills.push({
        type: "SOLID",
        color: {
          r: rgb.r,
          g: rgb.g,
          b: rgb.b
        },
        blendMode: "NORMAL",
        visible: true,
        opacity: rgb.a || 1
      });
    }
    if (fills.length) {
      textNode.fills = fills;
    }
    const letterSpacing = parseUnits(computedStyles.letterSpacing);
    if (letterSpacing) {
      textNode.letterSpacing = letterSpacing;
    }
    if (lineHeight) {
      textNode.lineHeight = lineHeight;
    }
    const { textTransform } = computedStyles;
    switch (textTransform) {
      case "uppercase": {
        textNode.textCase = "UPPER";
        break;
      }
      case "lowercase": {
        textNode.textCase = "LOWER";
        break;
      }
      case "capitalize": {
        textNode.textCase = "TITLE";
        break;
      }
    }
    const fontSize = parseUnits(computedStyles.fontSize);
    if (fontSize) {
      textNode.fontSize = Math.round(fontSize.value);
    }
    if (computedStyles.fontFamily) {
      textNode.fontFamily = computedStyles.fontFamily;
    }
    if (computedStyles.textDecoration) {
      if (computedStyles.textDecoration === "underline" || computedStyles.textDecoration === "strikethrough") {
        textNode.textDecoration = computedStyles.textDecoration.toUpperCase();
      }
    }
    if (computedStyles.textAlign) {
      if (["left", "center", "right", "justified"].includes(computedStyles.textAlign)) {
        textNode.textAlignHorizontal = computedStyles.textAlign.toUpperCase();
      }
    }
    return textNode;
  };

  // node_modules/html-figma/browser/border.js
  var getBorder = (computedStyle) => {
    if (!computedStyle.border) {
      return;
    }
    const parsed = computedStyle.border.match(/^([\d\.]+)px\s*(\w+)\s*(.*)$/);
    if (!parsed)
      return;
    let [_match, width, type, color] = parsed;
    if (width && width !== "0" && type !== "none" && color) {
      const rgb = getRgb(color);
      if (!rgb)
        return;
      return {
        strokes: [
          {
            type: "SOLID",
            color: {
              r: rgb.r,
              b: rgb.b,
              g: rgb.g
            },
            opacity: rgb.a || 1
          }
        ],
        strokeWeight: Math.round(parseFloat(width))
      };
    }
  };
  var getBorderPin = (rect, computedStyle) => {
    const directions = ["top", "left", "right", "bottom"];
    const layers = [];
    for (const dir of directions) {
      const computed = computedStyle["border" + capitalize(dir)];
      if (!computed) {
        continue;
      }
      const parsed = computed.match(/^([\d\.]+)px\s*(\w+)\s*(.*)$/);
      if (!parsed)
        continue;
      let [_match, borderWidth, type, color] = parsed;
      if (borderWidth && borderWidth !== "0" && type !== "none" && color) {
        const rgb = getRgb(color);
        if (rgb) {
          const width = ["top", "bottom"].includes(dir) ? rect.width : parseFloat(borderWidth);
          const height = ["left", "right"].includes(dir) ? rect.height : parseFloat(borderWidth);
          layers.push({
            type: "RECTANGLE",
            x: dir === "left" ? rect.left : dir === "right" ? rect.right - width : rect.left,
            y: dir === "top" ? rect.top - height : dir === "bottom" ? rect.bottom : rect.top,
            width,
            height,
            children: [],
            fills: [
              {
                type: "SOLID",
                color: {
                  r: rgb.r,
                  b: rgb.b,
                  g: rgb.g
                },
                opacity: rgb.a || 1
              }
            ]
          });
        }
      }
    }
    if (!layers.length)
      return;
    return [{
      type: "FRAME",
      clipsContent: false,
      name: "::borders",
      x: Math.round(rect.left),
      y: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      children: layers,
      // @ts-expect-error
      fills: []
    }];
  };

  // node_modules/html-figma/browser/add-constraints.js
  function setData(node, key, value) {
    if (!node.data) {
      node.data = {};
    }
    node.data[key] = value;
  }
  var addConstraintToLayer = (layer, elem, pseudo) => {
    const { getComputedStyle, HTMLElement } = context.window;
    if (layer.type === "SVG") {
      layer.constraints = {
        horizontal: "CENTER",
        vertical: "MIN"
      };
      return;
    }
    if (!elem) {
      layer.constraints = {
        horizontal: "SCALE",
        vertical: "MIN"
      };
      return;
    }
    const el = elem instanceof HTMLElement ? elem : elem.parentElement;
    const parent = el && el.parentElement;
    if (!el || !parent)
      return;
    const currentDisplay = el.style.display;
    el.style.setProperty("display", "none", "!important");
    let computed = getComputedStyle(el, pseudo);
    const hasFixedWidth = computed.width && computed.width.trim().endsWith("px");
    const hasFixedHeight = computed.height && computed.height.trim().endsWith("px");
    el.style.display = currentDisplay;
    const parentStyle = getComputedStyle(parent);
    let hasAutoMarginLeft = computed.marginLeft === "auto";
    let hasAutoMarginRight = computed.marginRight === "auto";
    let hasAutoMarginTop = computed.marginTop === "auto";
    let hasAutoMarginBottom = computed.marginBottom === "auto";
    computed = getComputedStyle(el, pseudo);
    if (["absolute", "fixed"].includes(computed.position)) {
      setData(layer, "position", computed.position);
    }
    if (hasFixedHeight) {
      setData(layer, "heightType", "fixed");
    }
    if (hasFixedWidth) {
      setData(layer, "widthType", "fixed");
    }
    const isInline = computed.display && computed.display.includes("inline");
    if (isInline) {
      const parentTextAlign = parentStyle.textAlign;
      if (parentTextAlign === "center") {
        hasAutoMarginLeft = true;
        hasAutoMarginRight = true;
      } else if (parentTextAlign === "right") {
        hasAutoMarginLeft = true;
      }
      if (computed.verticalAlign === "middle") {
        hasAutoMarginTop = true;
        hasAutoMarginBottom = true;
      } else if (computed.verticalAlign === "bottom") {
        hasAutoMarginTop = true;
        hasAutoMarginBottom = false;
      }
      setData(layer, "widthType", "shrink");
    }
    const parentJustifyContent = parentStyle.display === "flex" && (parentStyle.flexDirection === "row" && parentStyle.justifyContent || parentStyle.flexDirection === "column" && parentStyle.alignItems);
    if (parentJustifyContent === "center") {
      hasAutoMarginLeft = true;
      hasAutoMarginRight = true;
    } else if (parentJustifyContent && (parentJustifyContent.includes("end") || parentJustifyContent.includes("right"))) {
      hasAutoMarginLeft = true;
      hasAutoMarginRight = false;
    }
    const parentAlignItems = parentStyle.display === "flex" && (parentStyle.flexDirection === "column" && parentStyle.justifyContent || parentStyle.flexDirection === "row" && parentStyle.alignItems);
    if (parentAlignItems === "center") {
      hasAutoMarginTop = true;
      hasAutoMarginBottom = true;
    } else if (parentAlignItems && (parentAlignItems.includes("end") || parentAlignItems.includes("bottom"))) {
      hasAutoMarginTop = true;
      hasAutoMarginBottom = false;
    }
    if (layer.type === "TEXT") {
      if (computed.textAlign === "center") {
        hasAutoMarginLeft = true;
        hasAutoMarginRight = true;
      } else if (computed.textAlign === "right") {
        hasAutoMarginLeft = true;
        hasAutoMarginRight = false;
      }
    }
    layer.constraints = {
      horizontal: hasAutoMarginLeft && hasAutoMarginRight ? "CENTER" : hasAutoMarginLeft ? "MAX" : "SCALE",
      vertical: hasAutoMarginBottom && hasAutoMarginTop ? "CENTER" : hasAutoMarginTop ? "MAX" : "MIN"
    };
  };

  // node_modules/html-figma/browser/element-to-figma.js
  var elementToFigma = (el, pseudo) => {
    if (el.nodeType === Node.TEXT_NODE) {
      return textToFigma(el);
    }
    if (el.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    if (el.nodeType !== Node.ELEMENT_NODE || isHidden(el, pseudo) || isElemType(el, ElemTypes.SubSVG)) {
      return;
    }
    const { getComputedStyle } = context.window;
    if (el.parentElement && isElemType(el, ElemTypes.Picture)) {
      return;
    }
    const computedStyle = getComputedStyle(el, pseudo);
    if (isElemType(el, ElemTypes.SVG)) {
      const rect2 = el.getBoundingClientRect();
      const fill = computedStyle.fill;
      return {
        type: "SVG",
        ref: el,
        // add FILL to SVG to get right color in figma
        svg: replaceSvgFill(el.outerHTML, fill),
        x: Math.round(rect2.left),
        y: Math.round(rect2.top),
        width: Math.round(rect2.width),
        height: Math.round(rect2.height)
      };
    }
    const rect = getBoundingClientRect(el, pseudo);
    if (rect.width < 1 || rect.height < 1) {
      return;
    }
    const fills = [];
    const color = getRgb(computedStyle.backgroundColor);
    if (color) {
      fills.push({
        type: "SOLID",
        color: {
          r: color.r,
          g: color.g,
          b: color.b
        },
        opacity: color.a || 1
      });
    }
    const overflowHidden = computedStyle.overflow !== "visible";
    const rectNode = {
      type: "FRAME",
      ref: el,
      x: Math.round(rect.left),
      y: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      clipsContent: !!overflowHidden,
      fills,
      children: [],
      opacity: getOpacity(computedStyle)
    };
    const zIndex = Number(computedStyle.zIndex);
    if (isFinite(zIndex)) {
      rectNode.zIndex = zIndex;
    }
    const stroke = getBorder(computedStyle);
    if (stroke) {
      rectNode.strokes = stroke.strokes;
      rectNode.strokeWeight = stroke.strokeWeight;
    } else {
      rectNode.borders = getBorderPin(rect, computedStyle);
    }
    if (computedStyle.backgroundImage && computedStyle.backgroundImage !== "none") {
      const urlMatch = computedStyle.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
      const url = urlMatch && urlMatch[1];
      if (url) {
        fills.push({
          url: prepareUrl(url),
          type: "IMAGE",
          // TODO: backround size, position
          scaleMode: computedStyle.backgroundSize === "contain" ? "FIT" : "FILL",
          imageHash: null
        });
      }
    }
    if (isElemType(el, ElemTypes.Image)) {
      const url = el.src;
      if (url) {
        fills.push({
          url,
          type: "IMAGE",
          // TODO: object fit, position
          scaleMode: computedStyle.objectFit === "contain" ? "FIT" : "FILL",
          imageHash: null
        });
      }
    }
    if (isElemType(el, ElemTypes.Picture)) {
      const firstSource = el.querySelector("source");
      if (firstSource) {
        const src = getUrl(firstSource.srcset.split(/[,\s]+/g)[0]);
        if (src) {
          fills.push({
            url: src,
            type: "IMAGE",
            // TODO: object fit, position
            scaleMode: computedStyle.objectFit === "contain" ? "FIT" : "FILL",
            imageHash: null
          });
        }
      }
    }
    if (isElemType(el, ElemTypes.Video)) {
      const url = el.poster;
      if (url) {
        fills.push({
          url,
          type: "IMAGE",
          // TODO: object fit, position
          scaleMode: computedStyle.objectFit === "contain" ? "FIT" : "FILL",
          imageHash: null
        });
      }
    }
    if (computedStyle.boxShadow && computedStyle.boxShadow !== "none") {
      const parsed = parseBoxShadowValues(computedStyle.boxShadow);
      const hasShadowSpread = parsed.findIndex(({ spreadRadius }) => Boolean(spreadRadius)) !== -1;
      if (hasShadowSpread) {
        rectNode.clipsContent = true;
      }
      rectNode.effects = parsed.map((shadow) => ({
        color: shadow.color,
        type: "DROP_SHADOW",
        radius: shadow.blurRadius,
        spread: shadow.spreadRadius,
        blendMode: "NORMAL",
        visible: true,
        offset: {
          x: shadow.offsetX,
          y: shadow.offsetY
        }
      }));
    }
    const borderTopLeftRadius = parseUnits(computedStyle.borderTopLeftRadius, rect.height);
    if (borderTopLeftRadius) {
      rectNode.topLeftRadius = borderTopLeftRadius.value;
    }
    const borderTopRightRadius = parseUnits(computedStyle.borderTopRightRadius, rect.height);
    if (borderTopRightRadius) {
      rectNode.topRightRadius = borderTopRightRadius.value;
    }
    const borderBottomRightRadius = parseUnits(computedStyle.borderBottomRightRadius, rect.height);
    if (borderBottomRightRadius) {
      rectNode.bottomRightRadius = borderBottomRightRadius.value;
    }
    const borderBottomLeftRadius = parseUnits(computedStyle.borderBottomLeftRadius, rect.height);
    if (borderBottomLeftRadius) {
      rectNode.bottomLeftRadius = borderBottomLeftRadius.value;
    }
    const result = rectNode;
    if (!pseudo && getComputedStyle(el, "before").content !== "none") {
      result.before = elementToFigma(el, "before");
      if (result.before) {
        addConstraintToLayer(result.before, el, "before");
        result.before.name = "::before";
      }
    }
    if (!pseudo && getComputedStyle(el, "after").content !== "none") {
      result.after = elementToFigma(el, "after");
      if (result.after) {
        addConstraintToLayer(result.after, el, "after");
        result.after.name = "::after";
      }
    }
    if (isElemType(el, ElemTypes.Input) || isElemType(el, ElemTypes.Textarea)) {
      result.textValue = textToFigma(el, { fromTextInput: true });
    }
    return result;
  };

  // node_modules/html-figma/browser/html-to-figma.js
  var __rest = function(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  var removeMeta = (layerWithMeta) => {
    const { textValue, before, after, borders, ref, type, zIndex } = layerWithMeta, rest = __rest(layerWithMeta, ["textValue", "before", "after", "borders", "ref", "type", "zIndex"]);
    if (!type)
      return;
    return Object.assign({ type }, rest);
  };
  var mapDOM = (root) => {
    const elems = [];
    const walk = context.document.createTreeWalker(root, NodeFilter.SHOW_ALL, null, false);
    const refs = /* @__PURE__ */ new Map();
    let n = walk.currentNode;
    do {
      if (!n.parentElement)
        continue;
      const figmaEl = elementToFigma(n);
      if (figmaEl) {
        addConstraintToLayer(figmaEl, n);
        const children = refs.get(n.parentElement) || [];
        refs.set(n.parentElement, [...children, figmaEl]);
        elems.push(figmaEl);
      }
    } while (n = walk.nextNode());
    const result = elems[0];
    for (let i = 0; i < elems.length; i++) {
      const elem = elems[i];
      if (elem.type !== "FRAME")
        continue;
      elem.children = elem.children || [];
      elem.before && elem.children.push(elem.before);
      const children = refs.get(elem.ref) || [];
      children && elem.children.push(...children);
      if (!elem.textValue) {
        elem.children = elem.children.filter(Boolean);
      } else {
        elem.children = [elem.textValue];
      }
      if (elem.borders) {
        elem.children = elem.children.concat(elem.borders);
      }
      elem.after && elem.children.push(elem.after);
      elem.children.sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
    }
    const layersWithoutMeta = traverseMap(result, (layer) => {
      return removeMeta(layer);
    });
    traverse(layersWithoutMeta, (layer) => {
      if (layer.type === "FRAME" || layer.type === "GROUP") {
        const { x, y } = layer;
        if (x || y) {
          traverse(layer, (child) => {
            if (child === layer) {
              return;
            }
            child.x = child.x - x;
            child.y = child.y - y;
          });
        }
      }
    });
    return layersWithoutMeta;
  };
  function htmlToFigma(selector = "body") {
    let layers = [];
    const el = isElemType(selector, ElemTypes.Element) ? selector : context.document.querySelectorAll(selector || "body")[0];
    if (!el) {
      throw Error(`Element not found`);
    }
    for (const use of Array.from(el.querySelectorAll("use"))) {
      try {
        const symbolSelector = use.href.baseVal;
        const symbol = context.document.querySelector(symbolSelector);
        if (symbol) {
          use.outerHTML = symbol.innerHTML;
        }
      } catch (err) {
        console.warn("Error querying <use> tag href", err);
      }
    }
    const data = mapDOM(el);
    return data ? data : [];
  }
  return __toCommonJS(index_exports);
})();
