import { ChangeEvent, useState } from "react";

function FileUploadMultiple() {
  const [files, setFiles] = useState();

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUploadClick = async () => {
    if (!files) {
      return;
    }

    const data = new FormData();
    files.forEach((file, i) => {
      data.append(`file-${i}`, file, file.name);
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple />

      <ul>
        {/* {files &&
          files.map((file, i) => (
            <li key={i}>
              {file.name} - {file.type}
            </li>
          ))} */}
      </ul>

      <button onClick={handleUploadClick}>Upload</button>
    </div>
  );
}

export default FileUploadMultiple;
