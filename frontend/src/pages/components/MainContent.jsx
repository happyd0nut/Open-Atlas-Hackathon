import { User, Summary, ListTodo, TriangleAlert, CalendarClock, FileText } from 'lucide-react'

export default function MainContent({ result }) {

    // Guard against result
    // if (!result) return <p>No upload data available.</p>;

    return (
        <>      
            <div className="flex justify-between py-5 px-10 text-black">
                <p className="font-extrabold">Dashboard</p>
                <User className="w-6 h-6" style={{ color: '#0F3B36' }} />
            </div>
            <div className="flex flex-col mx-35 my-10 text-black">
                <div className="flex justify-start mb-5">
                    <FileText className="w-4 h-6 mr-2" style={{ color: '#0F3B36' }}/>
                    <p className="font-bold text-left">
                        {result.analysis.document_title} <span className="font-normal"> - analyzed just now</span>
                    </p>
                </div>
                <div className="flex flex-col items-start my-3 px-5 py-5 rounded-lg bg-white">
                    <div className="flex mb-2">
                        <Summary className="w-4 h-6 mr-2" style={{ color: '#0F3B36' }} strokeWidth={3} />
                        <p className="font-bold">Document Summary</p>
                    </div>
                    <div className="flex">
                        <p className="text-left">
                            {result.analysis.summary}
                        </p>
                    </div>
                        
                </div>
                <div className="flex flex-col items-start my-3 px-5 py-5 rounded-lg bg-white">
                    <div className="flex mb-2">
                        <ListTodo className="w-4 h-6 mr-2" style={{ color: '#0F3B36' }} strokeWidth={3} />
                        <p className="font-bold">Action Items</p>
                    </div>
                    <p>
                        ACTION ITEMS GO HERE
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-6 my-3 ">
                    <div className="flex flex-col items-start px-5 py-5 rounded-lg bg-white">
                        <div className="flex mb-2">
                            <TriangleAlert className="w-4 h-5 mr-2" style={{ color: '#0F3B36' }} strokeWidth={3} />
                            <p className="font-bold">Alerts</p>
                        </div>
                        <p>
                            ALERTS GO HERE
                        </p>
                    </div>
                    <div className="flex flex-col items-start px-5 py-5 rounded-lg bg-white">
                        <div className="flex mb-2">
                            <CalendarClock className="w-4 h-5 mr-2" style={{ color: '#0F3B36' }} strokeWidth={3} />
                            <p className="font-bold">Deadlines</p>
                        </div>
                        <p>
                            DEADLINES GO HERE
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
