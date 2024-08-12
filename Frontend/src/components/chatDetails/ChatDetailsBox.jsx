import React, { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import Overview from "./Overview";
import Member from "./Member";
import { IoSettingsOutline } from "react-icons/io5";
import ChatSetting from "./ChatSetting";
import { useSelector } from "react-redux";

const ChatDetailsBox = () => {
    const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
    const [detailView, setDetailView] = useState("overview");

    return (
        <>
            <div className="w-fit h-[60vh] p-2 flex flex-col gap-2 bg-gray-900 border-r border-gray-700">
                <div
                    className={`flex items-center gap-3 p-2 text-white rounded-md cursor-pointer transition ${
                        detailView === "overview"
                            ? "bg-blue-800"
                            : "bg-gray-800 hover:bg-gray-700"
                    }`}
                    onClick={() => setDetailView("overview")}
                    title="Overview"
                >
                    <CiCircleInfo fontSize={20} />
                    <span className="hidden sm:inline">Overview</span>
                </div>
                {selectedChat?.isGroupChat && (
                    <div
                        className={`flex items-center gap-3 p-2 text-white rounded-md cursor-pointer transition ${
                            detailView === "members"
                                ? "bg-blue-800"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                        onClick={() => setDetailView("members")}
                        title="Members"
                    >
                        <HiOutlineUsers fontSize={20} />
                        <span className="hidden sm:inline">Members</span>
                    </div>
                )}
                <div
                    className={`flex items-center gap-3 p-2 text-white rounded-md cursor-pointer transition ${
                        detailView === "setting"
                            ? "bg-blue-800"
                            : "bg-gray-800 hover:bg-gray-700"
                    }`}
                    onClick={() => setDetailView("setting")}
                    title="Settings"
                >
                    <IoSettingsOutline fontSize={20} />
                    <span className="hidden sm:inline">Settings</span>
                </div>
            </div>
            <div className="w-full h-[60vh] p-4 bg-gray-800">
                {detailView === "overview" && <Overview />}
                {detailView === "members" && <Member />}
                {detailView === "setting" && <ChatSetting />}
            </div>
        </>
    );
};

export default ChatDetailsBox;
