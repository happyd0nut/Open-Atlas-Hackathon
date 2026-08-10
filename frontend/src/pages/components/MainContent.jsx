import {
    Summary,
    ListTodo,
    TriangleAlert,
    CalendarClock,
    FileText,
    CircleAlert,
    Download
} from "lucide-react";
import { supabase } from '../../../lib/supabaseClient'
import { useState, useEffect } from "react"
import { UserButton } from '@clerk/clerk-react'

const formatICSDate = (date) => {
    return date.replaceAll("-", "");
};

const escapeICSText = (text) => {
    return text
        .replaceAll("\\", "\\\\")
        .replaceAll(",", "\\,")
        .replaceAll(";", "\\;")
        .replaceAll("\n", "\\n");
};

const downloadCalendarInvite = (deadline) => {
    if (!deadline.date) {
        alert("This deadline does not have a complete date.");
        return;
    }

    const startDate = new Date(`${deadline.date}T00:00:00`);

    if (Number.isNaN(startDate.getTime())) {
        alert("This deadline has an invalid date.");
        return;
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const formattedStartDate = formatICSDate(deadline.date);

    const formattedEndDate = [
        endDate.getFullYear(),
        String(endDate.getMonth() + 1).padStart(2, "0"),
        String(endDate.getDate()).padStart(2, "0")
    ].join("");

    const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");

    const calendarContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Open Atlas//Document Deadline//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${crypto.randomUUID()}@openatlas`,
        `DTSTAMP:${timestamp}`,
        `DTSTART;VALUE=DATE:${formattedStartDate}`,
        `DTEND;VALUE=DATE:${formattedEndDate}`,
        `SUMMARY:${escapeICSText(deadline.title)}`,
        "DESCRIPTION:Deadline identified by Open Atlas.",
        "BEGIN:VALARM",
        "TRIGGER:-P1D",
        "ACTION:DISPLAY",
        `DESCRIPTION:Reminder: ${escapeICSText(deadline.title)}`,
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const calendarBlob = new Blob(
        [calendarContent],
        { type: "text/calendar;charset=utf-8" }
    );

    const downloadUrl = URL.createObjectURL(calendarBlob);

    const link = document.createElement("a");

    const safeFilename = deadline.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    link.href = downloadUrl;
    link.download = `${safeFilename || "deadline"}.ics`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
};

export default function MainContent({ loadId }) {

    const [completedItems, setCompletedItems] = useState([]);
    const [doc, setDoc] = useState(null);

    // Retreive target ID
    useEffect(() => {
        console.log("useEffect fired, loadId is:", loadId);

        const fetchDocument = async () => {
            console.log("fetchDocument called");

            const { data, error } = await supabase
                .from("documents")
                .select("*")
                .eq("id", loadId)
                .single();

            console.log("Supabase response:", { data, error });
            if (!error) setDoc(data);
        };

        fetchDocument();
    }, [loadId]);

    console.log("Main Content has recieved repsonse: ", doc)

    if (!doc) {
        return <div>Loading...</div>; // stops here until doc is populated
    }

    const toggleCompleted = (description) => {
        if (completedItems.includes(description)) {
            setCompletedItems(
                completedItems.filter(item => item !== description)
            );
        } else {
            setCompletedItems([...completedItems, description]);
        }
    };

    const actionItems = doc.ai_action_items
    const actionItemsList = actionItems.map((item, index) => {
        item = JSON.parse(item)
        return (
            <div key={index} className="flex items-center mb-2">
                <input
                    type="checkbox"
                    checked={completedItems.includes(item.description
                    )}
                    onChange={() => toggleCompleted(item.description)}
                    className="h-4 w-4 mr-3 mt-0.5 shrink-0 accent-[#2E6F66]" />

                <p className={completedItems.includes(item.description)
                    ? "line-through text-gray-400"
                    : ""}>
                    {item.description}
                </p>
            </div>
        )
    });

    const alerts = doc.ai_alerts

    const alertsList = alerts.map(alert => {
        alert = JSON.parse(alert)
        return (
            <div key={alert} className="flex flex-row w-full flex-1 rounded-lg mb-2">
                <div className="w-2 shrink-0 bg-[#E58126]"></div>
                <div className="flex flex-row w-full px-2 py-2 bg-[#EFECE7] gap-2 rounded-r-xl">
                    <CircleAlert className="w-5 h-5 mt-0.5 shrink-0 text-[#E58126]" />
                    <p>
                        {alert.description}
                    </p>
                </div>
            </div>
        )
    });

    const validDeadlines = doc.ai_deadlines
        .filter((deadline) => deadline.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const groupedDeadlines = validDeadlines.reduce((groups, deadline) => {
        const date = new Date(`${deadline.date}T00:00:00`);

        const monthYear = date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });

        if (!groups[monthYear]) {
            groups[monthYear] = [];
        }

        groups[monthYear].push(deadline);

        return groups;
    }, {});

    return (
        <>
            <div className="flex justify-between py-5 px-10 text-black">
                <h3>Dashboard</h3>
                <UserButton
                    appearance={{
                        elements: {
                        avatarBox: "w-8 h-8"
                        }
                    }}
                    />
            </div>
            <div className="flex flex-col mx-35 my-5 text-black">
                <div className="flex justify-start mb-5">
                    <FileText className="w-4 h-6 mr-2" style={{ color: '#0F3B36' }} />
                    <p className="text-left">
                        {doc.ai_title}
                    </p>
                </div>
                <div className="flex flex-col items-start my-3 px-5 py-5 rounded-lg bg-white shadow-sm">
                    <div className="flex items-center mb-2">
                        <Summary className="w-5 h-5 mr-2" style={{ color: '#0F3B36' }} strokeWidth={2} />
                        <h4>Document Summary</h4>
                    </div>
                    <div className="flex">
                        <p className="text-left">
                            {doc.ai_summary}
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
                        <div className="flex items-center mb-4">
                            <TriangleAlert className="w-5 h-5 mr-2" style={{ color: '#0F3B36' }} strokeWidth={2} />
                            <h4>Alerts</h4>
                        </div>
                        <div className={alertsList.length > 0 ? "text-left w-full" : "text-left text-[#A3A2A2] gap-2 w-full"}>
                            {alertsList.length > 0 ? (alertsList) : ("No Alerts Found")}
                        </div>
                    </div>
                    <div className="flex flex-col items-start px-5 py-5 rounded-lg bg-white shadow-sm">
                        <div className="flex items-center mb-4">
                            <CalendarClock
                                className="w-5 h-5 mr-2"
                                style={{ color: '#0F3B36' }}
                                strokeWidth={2}
                            />
                            <h4>Deadlines</h4>
                        </div>

                        <div className="w-full">
                            {validDeadlines.length > 0 ? (
                                Object.entries(groupedDeadlines).map(
                                    ([monthYear, monthDeadlines]) => (
                                        <div key={monthYear} className="mb-7 last:mb-0">
                                            <h5 className="mb-4 text-left text-lg font-semibold">
                                                {monthYear}
                                            </h5>
                                            <div className="flex flex-col gap-5">
                                                {monthDeadlines.map((deadline) => {

                                                    const date = new Date(`${deadline.date}T00:00:00`);

                                                    return (
                                                        <div key={`${deadline.title}-${deadline.date}`} className="flex w-full items-center gap-4">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#B5B5B5] bg-[#F5F3EF]">
                                                                <span className="text-lg font-semibold">
                                                                    {date.getDate()}
                                                                </span>
                                                            </div>

                                                            <p className="min-w-0 flex-1 text-left">
                                                                {deadline.title}
                                                            </p>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    downloadCalendarInvite(deadline)
                                                                }
                                                                aria-label={`Download calendar invite for ${deadline.title}`}
                                                                title="Download calendar invite"
                                                                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#0F3B36] text-white transition hover:opacity-90 active:bg-[#092B27]">
                                                                <Download className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )
                                )
                            ) : (
                                <p className="text-left text-[#A3A2A2]">
                                    No Deadlines Found
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
