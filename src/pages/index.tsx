import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios, { AxiosResponse } from "axios";
import { BsFillFolderSymlinkFill } from "react-icons/bs";

interface File {
  name: string;
  type: string;
  size: number;
  progress: number;
}

export default function Upload() {
  const [totalProgress, setTotalProgress] = useState(0);
  const [trackerOver, setTrackerOver] = useState(false);
  const [csvdownloadLink, setCsvDownloadLink] = useState("");
  const [error, setError] = useState("");

  const onDrop = async (acceptedFiles: any[]) => {
    setCsvDownloadLink("");
    setError("");
    setTrackerOver(false);
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("videos", file);
    });

    try {
      const data = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
            );

            setTotalProgress(progress);
          },
        }
      );

      console.log("Files uploaded successfully! ", data);
      setCsvDownloadLink(data.data);
    } catch (e: any) {
      setError(
        e?.message ??
          "something went wrong unable to complete the upload process"
      );
    }
    setTotalProgress(0);
  };

  const onDragOver = () => {
    setTrackerOver(true);
  };
  const onDragLeave = () => {
    setTrackerOver(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragOver,
    onDragLeave,
  });

  return (
    <div className="container">
      {error && <div className="error">{error}</div>}
      <div className="wrapper">
        <div
          {...getRootProps()}
          className={`drop-zone ${trackerOver ? "tracker-over" : ""}`}
        >
          <div className="drop">
            <input {...getInputProps()} accept="video/*" />
            <div className="icon">
              <BsFillFolderSymlinkFill />
            </div>
            <h2>Drag your videos here, or click to select videos</h2>
            <button>Browse Videos</button>
          </div>
        </div>
        {csvdownloadLink ? (
          <a className="download-link" href={csvdownloadLink}>
            Download Share Links
          </a>
        ) : null}
        {totalProgress > 0 ? (
          <progress value={totalProgress} max={100} />
        ) : null}
      </div>
    </div>
  );
}
