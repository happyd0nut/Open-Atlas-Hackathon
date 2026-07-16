import { UploadCloud, FileText, X } from 'lucide-react'
import { ChangeEvent, useState } from "react"
import axios from "axios"
import {useDropzone} from "react-dropzone";



export default function UploadBox() {
    
    const allStatuses = {
        IDLE: 'Idle',
        UPLOADING: 'Uploading',
        SUCCESS: 'Success',
        ERROR: 'Error',
    }
    // const [file, setFile] = useState(null);
    const [status, setStatus] = useState(allStatuses.IDLE)

    // Using useDropzone Hook
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone(
        { onDrop : async (files) => {
            // Do something with accepted files
            const formData = new FormData();
            formData.append("file", files[0])

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

            } catch (error){
                console.log("upload error", error)
            }
            // try {
                // const response = await fetch('https://httpbin.org/post', {
                    // method: 'POST',
                    // headers: {'Content-Type': 'multipart/form-data'},
                    // body: formData
                // });
                // const data = await response.json();

                // if (!response.ok) {
                //     throw new Error(`HTTP error! Status: ${response.status}`);
                // }

                // const data = await response.json(); // Await the JSON response body
            //     return data;
            // } catch (error) {
            //     console.error('Post request failed:', error);
            // }
        }}
    );

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
        {file.path} - {file.size} bytes
        </li>
    ));

    // // Event is a ChangeEvent from React
    // function handleFileChange(e) {
    //     if (e.target.files[0]) {
    //         setFile(e.target.files[0])
    //     }
    // }

    // async function handleFileUpload() {
    //     if (!file) return;
    //     setStatus(allStatuses.UPLOADING);

    //     const formData = new FormData();
    //     formData.append("file", file)

    //     try { // TODO: replace with the post backend url
    //         await axios.post("https://httpbin.org/post", formData, {
    //             headers : {
    //                 "Content-Type" : "multipart/form-data"
    //             }
    //         });
    //         setStatus(allStatuses.SUCCESS);
    //     } catch {
    //         setStatus(allStatuses.ERROR);
    //     }
    // }

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
                    if 
                    <button className="rounded-md bg-[#0F3B36] px-4 py-2 text-sm font-medium text-white mt-4">
                        Choose File
                    </button>
                    <p className="py-3">{files}</p>
                </div>
            </>
            
            

        </>
    )
}
