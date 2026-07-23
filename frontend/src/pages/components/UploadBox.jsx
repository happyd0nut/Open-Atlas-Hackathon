import { UploadCloud, FileText, X } from 'lucide-react'
import { ChangeEvent, useState } from "react"
import axios from "axios"
import {useDropzone} from "react-dropzone";
import { useNavigate } from "react-router-dom";

export default function UploadBox() {

    const navigate = useNavigate();
    
    const allStatuses = {
        IDLE: 'Idle',
        UPLOADING: 'Uploading',
        SUCCESS: 'Success',
        ERROR: 'Error',
    }

    const [status, setStatus] = useState(allStatuses.IDLE)

    // Using useDropzone Hook
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

    const fileList = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const handleUpload = async () => {
        // Do something with accepted files
        console.log("files:", fileList)
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        try { // TODO: replace with the post backend url
            // await axios.post("https://httpbin.org/post", formData);
            const response = await fetch("/api/upload", {
                method : "POST",
                body : formData
            })

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`)
            }
            
            console.log("Upload succeeded:")

            const data = await response.json()
            console.log(data)

            navigate("/dashboard", { state: { uploadResult: data } });

        } catch (error){
            console.log("upload error", error)
        }

        // TODO: Save data to databse!!! Then retrieve after navigation to new page

        // Currently result is bound to navigate; on reload may forget data; best to upload to database first
    }

    return (
        <>   
            <>
                <div {...getRootProps({className : "flex flex-col items-center border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center"})}>
                    <UploadCloud className="w-6 h-6" style={{ color: '#0F3B36' }} />
                    
                    <input {...getInputProps()} />
                    
                    <p>Drag your document or click to upload</p>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Lease, insurance, visa notice, medical bill, bank letter — we'll explain it.
                    </p>
                    <div className="flex flex-row ">
                        <button className="rounded-md bg-[#0F3B36] mx-2 px-4 py-2 text-sm font-medium text-white mt-4">
                            Choose File
                        </button>
                        {acceptedFiles[0] && 
                        <button className="rounded-md bg-[#0F3B36] mx-2 px-4 py-2 text-sm font-medium text-white mt-4" 
                            onClick={(e) => {
                                e.stopPropagation(); // prevents dropzone's onClick from firing
                                handleUpload();
                            }}>
                            Upload File
                        </button>
                        }
                    </div>
                    <p className="py-3">{fileList}</p>
                </div>
            </>
            
            

        </>
    )
}
