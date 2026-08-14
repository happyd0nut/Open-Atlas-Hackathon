import { UploadCloud, FileText, LoaderCircle, X } from 'lucide-react'
import { ChangeEvent, useState } from "react"
import axios from "axios"
import { supabase } from '../../../lib/supabaseClient'
import {useDropzone} from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useUser } from '@clerk/clerk-react'

export default function UploadBox() {

    const navigate = useNavigate();

    const { user, isSignedIn } = useUser();
    
    const allStatuses = {
        IDLE: 'Idle',
        UPLOADING: 'Uploading',
        SUCCESS: 'Success',
        ERROR: 'Error',
    }

    const [status, setStatus] = useState(allStatuses.IDLE)

    // sets default state to English
    const [selectedLanguage, setSelectedLanguage] = useState("English")

    // loading, processing a document
    const [isLoading, setIsLoading] = useState(false)

    // error state if user doesn't upload a pdf
    const [errorMessage, setErrorMessage] = useState("")

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
        formData.append("language", selectedLanguage);

        setIsLoading(true)

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

            console.log("Sending to Supabase ...")
            
            const { data: entry, error } = await supabase.from('documents').insert([
                {
                    user_id: user.id,
                    file_name: data.filename,
                    ai_title: data.analysis.document_title,
                    ai_summary: data.analysis.summary,
                    ai_alerts: data.analysis.alerts,
                    ai_action_items: data.analysis.action_items,
                    ai_deadlines: data.analysis.deadlines
                },
            ]).select()
            
            console.log("Created entry:", entry[0].id)
            navigate(`/dashboard/${entry[0].id}`);

        } catch (error) {
            console.log("upload error", error)

            setStatus(allStatuses.ERROR)
            setErrorMessage("You must upload a valid PDF document.")
        }
        finally {
            setIsLoading(false)
        }

        // Currently result is bound to navigate; on reload may forget data; best to upload to database first
        // Later idea: put id into the url and load that way as input
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
            <LoaderCircle className="h-10 w-10 animate-spin text-[#2E6F66]" />

            <p className="mt-6 font-medium">
                Analyzing your document...
            </p>
            </div>
        )
        }
    if (status === allStatuses.ERROR) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full mb-2 bg-red-50">
                    <X className="h-6 w-6 text-red-600" />
                </div>

                <p className="mt-6 font-medium text-black">
                    Upload failed
                </p>

                <p className="mt-2 text-sm text-gray-500">
                    {errorMessage}
                </p>

                <button
                    type="button"
                    className="mt-6 rounded-md bg-[#0F3B36] px-4 py-2 text-sm font-medium text-white cursor-pointer hover:opacity-90 active:bg-[#0A2B27]"
                    onClick={() => {
                        setStatus(allStatuses.IDLE)
                        setErrorMessage("")
                    }}
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <>   
            <>
                <div {...getRootProps({className : "flex flex-col items-center border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center"})}>
                    <UploadCloud className="w-6 h-6 icon" />
                    
                    <input {...getInputProps()} />
                    
                    <p>Drag your document or click to upload</p>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Lease, insurance, visa notice, medical bill, bank letter — we'll explain it.
                    </p>
                    {acceptedFiles[0] && (
                        <div className="mt-4 mb-2 text-[#374151] font-medium">
                            📄 {acceptedFiles[0].name}
                        </div>
                    )}

                    {/* Browse Files button */}
                    <button className="rounded-md mx-2 px-4 py-2 text-sm font-medium bg-white border border-[#0F3B36] text-[#0F3B36] mt-4 cursor-pointer hover:opacity-90 active:bg-[#EFECE7]">
                        Browse Files
                    </button>

                    {/* Preferred Language */}
                    <div
                        className="w-full max-w-sm mt-6 text-left"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p>
                            Preferred language
                        </p>

                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black"
                        >
                            <option value="English">English</option>
                            <option value="Spanish">Español — Spanish</option>
                            <option value="Chinese">中文 — Chinese</option>
                            <option value="Hindi">हिन्दी — Hindi</option>
                            <option value="Arabic">العربية — Arabic</option>
                            <option value="French">Français — French</option>
                            <option value="Portuguese">Português — Portuguese</option>
                            <option value="Bengali">বাংলা — Bengali</option>
                            <option value="Russian">Русский — Russian</option>
                            <option value="Korean">한국어 — Korean</option>
                            <option value="Vietnamese">Tiếng Việt — Vietnamese</option>
                            <option value="Haitian Creole">Kreyòl Ayisyen — Haitian Creole</option>
                        </select>
                    </div>

                    {/* Upload button only appears after a file is selected */}
                    {acceptedFiles[0] && (
                        <button
                            className="rounded-md bg-[#0F3B36] mx-2 px-4 py-2 text-sm font-medium text-white mt-6 cursor-pointer hover:opacity-90 active:bg-[#0A2B27]"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleUpload();
                            }}
                        >
                            Upload
                        </button>
                    )}

                </div>
            </>
            
            

        </>
    )
}
