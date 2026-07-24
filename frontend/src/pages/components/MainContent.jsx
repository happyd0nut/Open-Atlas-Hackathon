import { User, Summary, ListTodo, TriangleAlert, CalendarClock, FileText, CircleAlert, Square } from 'lucide-react'

export default function MainContent({ result }) {

    // Guard against result
    if (!result) return <p>No upload data available.</p>;

    const actionItems = result.analysis.action_items
    const actionItemsList = actionItems.map(item => (
        <div key={item.description} className="flex flex-row">            
            <Square className="w-5 h-5 mt-0.5 shrink-0 mr-2"/>
            <div key={item.description}>
                {item.description}
            </div>
        </div>

    ));

    const alerts = result.analysis.alerts

    const alertsList = alerts.map(alert => (
        <div key={alert.description} className="flex flex-row rounded-lg mb-2">
            <div className="w-7 bg-[#E58126]">
            </div>
            <div className="flex flex-row px-2 py-2 bg-[#EFECE7] gap-2 rounded-r-xl"> 
                <CircleAlert className="w-5 h-5 mt-0.5 shrink-0 text-[#E58126]"/>
                <p>
                    {alert.description}
                </p>
            </div>
        </div>
    ));

    return (
        <>      
            <div className="flex justify-between py-5 px-10 text-black">
                <p className="font-extrabold">Dashboard</p>
                <User className="w-6 h-6" style={{ color: '#0F3B36' }} />
            </div>
            <div className="flex flex-col mx-35 my-5 text-black">
                <div className="flex justify-start mb-5">
                    <FileText className="w-4 h-6 mr-2" style={{ color: '#0F3B36' }}/>
                    <p className="font-bold text-left">
                        {result.analysis.document_title} <span className="font-normal"> - analyzed just now</span>
                    </p>
                </div>
                <div className="flex flex-col items-start my-3 px-5 py-5 rounded-lg bg-white shadow-md">
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
                <div className="flex flex-col items-start my-3 px-5 py-5 rounded-lg bg-white shadow-md">
                    <div className="flex mb-2">
                        <ListTodo className="w-4 h-6 mr-2" style={{ color: '#0F3B36' }} strokeWidth={3} />
                        <p className="font-bold">Action Items</p>
                    </div>
                    <div className={actionItems.length > 0 ? "text-left" : "text-left text-[#A3A2A2]"}>
                        {actionItems.length > 0 ? (actionItemsList) : ("No Action Items")}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6 my-3 ">
                    <div className="flex flex-col items-start px-5 py-5 rounded-lg bg-white shadow-md">
                        <div className="flex mb-2">
                            <TriangleAlert className="w-4 h-5 mr-2" style={{ color: '#0F3B36' }} strokeWidth={3} />
                            <p className="font-bold">Alerts</p>
                        </div>
                        <div className={alertsList.length > 0 ? "text-left" : "text-left text-[#A3A2A2] gap-2"}>
                            {alertsList.length > 0 ? (alertsList) : ("No Alerts Found")}
                        </div>
                    </div>
                    <div className="flex flex-col items-start px-5 py-5 rounded-lg bg-white shadow-md">
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
