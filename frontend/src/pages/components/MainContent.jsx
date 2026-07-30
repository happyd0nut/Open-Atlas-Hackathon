import { User, Summary, ListTodo, TriangleAlert, CalendarClock, FileText, CircleAlert, Square } from 'lucide-react'
import { useState } from "react"

export default function MainContent({ result }) {

    // Guard against result
    if (!result) return <p>No upload data available.</p>;

    const [completedItems, setCompletedItems] = useState([])
    const toggleCompleted = (description) => {
    if (completedItems.includes(description)) {
        setCompletedItems(
            completedItems.filter(item => item !== description)
        );
    } else {
        setCompletedItems([...completedItems, description]);
    }
};

    const actionItems = result.analysis.action_items
    const actionItemsList = actionItems.map(item => (
    <div key={item.description} className="flex items-center mb-2">

        <input
            type="checkbox"
            checked={completedItems.includes(item.description)}
            onChange={() => toggleCompleted(item.description)}
            className="h-4 w-4 mr-3 mt-0.5 shrink-0 accent-[#2E6F66]"
        />

        <p
            className={
                completedItems.includes(item.description)
                    ? "line-through text-gray-400"
                    : ""
            }
        >
            {item.description}
        </p>

    </div>
));

    const alerts = result.analysis.alerts

    const alertsList = alerts.map(alert => (
        <div key={alert.description} className="flex flex-row rounded-lg mb-4">
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
                <h3>Dashboard</h3>
                <User className="w-6 h-6" style={{ color: '#0F3B36' }} />
            </div>
            <div className="flex flex-col mx-35 my-5 text-black">
                <div className="flex justify-start mb-5">
                    <FileText className="w-4 h-6 mr-2" style={{ color: '#0F3B36' }}/>
                    <p className="text-left">
                        {result.analysis.document_title} 
                    </p>
                </div>
                <div className="flex flex-col items-start my-3 px-5 py-5 rounded-lg bg-white shadow-sm">
                    <div className="flex items-center mb-2">
                        <Summary className="w-5 h-5 mr-2" style={{ color: '#0F3B36' }} strokeWidth={2} />
                        <h4>Document Summary</h4>
                    </div>
                    <div className="flex">
                        <p className="text-left">
                            {result.analysis.summary}
                        </p>
                    </div>
                        
                </div>
                <div className="flex flex-col items-start my-3 px-5 py-5 rounded-lg bg-white shadow-sm">
                    <div className="flex items-center mb-2">
                        <ListTodo className="w-5 h-5 mr-2" style={{ color: '#0F3B36' }} strokeWidth={2} />
                        <h4>Action Items</h4>
                    </div>
                    <p className={actionItems.length > 0 ? "text-left" : "text-left text-[#A3A2A2]"}>
                        {actionItems.length > 0 ? (actionItemsList) : ("No Action Items")}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-6 my-3 ">
                    <div className="flex flex-col items-start px-5 py-5 rounded-lg bg-white shadow-sm">
                        <div className="flex items-center mb-2">
                            <TriangleAlert className="w-5 h-5 mr-2" style={{ color: '#0F3B36' }} strokeWidth={2} />
                            <h4>Alerts</h4>
                        </div>
                        <div className={alertsList.length > 0 ? "text-left" : "text-left text-[#A3A2A2] gap-2"}>
                            {alertsList.length > 0 ? (alertsList) : ("No Alerts Found")}
                        </div>
                    </div>
                    <div className="flex flex-col items-start px-5 py-5 rounded-lg bg-white shadow-sm">
                        <div className="flex items-center mb-2">
                            <CalendarClock className="w-5 h-5 mr-2" style={{ color: '#0F3B36' }} strokeWidth={2} />
                            <h4>Deadlines</h4>
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
