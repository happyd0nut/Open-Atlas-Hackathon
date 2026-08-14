import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EllipsisVertical, Upload, FileText } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../../../lib/supabaseClient";

export default function SideBar() {

    const { user, isSignedIn } = useUser();
    const navigate = useNavigate();

    const [documents, setDocuments] = useState([]);

    useEffect(() => {

        const fetchDocuments = async () => {

            if (!isSignedIn || !user) {
                return;
            }

            const { data, error } = await supabase
                .from("documents")
                .select("id, ai_title, file_name")
                .eq("user_id", user.id)
                .order("id", { ascending: false });

            if (error) {
                console.error("Error loading documents:", error);
                return;
            }

            setDocuments(data);
        };

        fetchDocuments();

    }, [user, isSignedIn]);

    return (
        <>
            <div className="flex items-center justify-between">
                <h3>
                    Documents
                </h3>

                <EllipsisVertical
                    className="w-5 h-6 color-black"
                />
            </div>

            <Link
                to="/"
                className="flex items-center gap-2 mt-8"
            >
                <Upload className="w-5 h-5" />
                <p>Upload New Doc</p>
            </Link>

            <div className="mt-8 flex flex-col gap-2">

                {documents.map((document) => (
                    <button
                        key={document.id}
                        onClick={() =>
                            navigate(`/dashboard/${document.id}`)
                        }
                        className="flex items-center gap-2 text-left p-2 rounded-lg cursor-pointer doc-entry"
                    >
                        <FileText className="w-4 h-4 flex-shrink-0" />

                        <p className="truncate">
                            {document.ai_title || document.file_name}
                        </p>
                    </button>
                ))}

            </div>
        </>
    );
}
