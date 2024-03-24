// @flow
import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import NFTStorageService from "@/services/nftStorage";
import Spinner from "./spinner";
import { LuUploadCloud } from "react-icons/lu";

const AttachFileComponent = ({
  type,
  setFile,
  fileName,
  setFileName,
}) => {
  const [loading, setLoading] = useState(false);

  const [types, setTypes] = useState({
    "audio/mpeg": [".mp3"],
    "audio/ogg": [".ogg"],
  });
  const onDrop = useCallback(async (acceptedFiles) => {
    // Do something with the files
    setLoading(true);
    try {
      // const client = new NFTStorageService();
      console.log(acceptedFiles[0]);
      setFile(acceptedFiles[0]);
      // const cid = await client.storeToken(acceptedFiles);
      // console.log(cid);
      setFileName(acceptedFiles[0].name);
      // setInscriptionText(cid);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: [".zip"],
    maxFiles: 1,
  });

  useEffect(() => {
    if (type === "audio") {
      setTypes({
        "audio/mpeg": [".mp3"],
        "audio/ogg": [".ogg"],
      });
    } else if (type === "image") {
      setTypes({
        "image/jpeg": [],
        "image/png": [],
        "image/webp": [],
      });
    } else {
      setTypes({
        "image/jpeg": [],
        "image/png": [],
        "image/webp": [],
      });
    }
  }, [type]);

  return (
    <>
      <p className="text-lg font-semibold">Upload</p>
      <p className="mb-4">
        Compress all your files in a single ZIP-file and upload it to get the
        process started.
      </p>

      <div
        {...getRootProps()}
        className="w-full min-h-[200px] flex justify-center items-center cs-border rounded-md my-2 dark:text-gray-300 text-gray-800 cursor-pointer"
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {fileName ? (
              <div className="flex justify-center items-center text-4xl font-bold">
                {fileName}
              </div>
            ) : (
              <div>
                <LuUploadCloud className="text-center text-[50px] mx-auto" />

                <p className="text-center font-semibold">
                  Drag and drop your Zip-file here, or click to select it.
                </p>

                <p className="text-[12px] text-center">
                  Supported file formats (compressed in a zip-file) in beta:
                  .jpg, .webp, .png
                </p>

                <p className="text-[12px] text-center">
                  Max. 25KB per file in beta.
                </p>
              </div>
            )}
          </>
        )}
        <input {...getInputProps()} />
      </div>
    </>
  );
};
export default AttachFileComponent;
