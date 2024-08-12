import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	IoCheckmarkCircleOutline,
	IoPersonAddOutline,
	IoPersonRemoveOutline,
} from "react-icons/io5";
import { VscError } from "react-icons/vsc";
import { CiCircleInfo } from "react-icons/ci";
import { toast } from "react-toastify";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { setLoading } from "../../redux/slices/conditionSlice";

const MemberRemove = ({ setMemberAddBox }) => {
	const dispatch = useDispatch();
	const authUserId = useSelector((store) => store?.auth?._id);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [removeUserName, setRemoveUserName] = useState("");
	const [removeUserId, setRemoveUserId] = useState("");

	const handleRemoveUser = (userId, userName) => {
		setRemoveUserId(userId);
		setRemoveUserName(userName);
	};

	const handleRemoveUserCall = () => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/groupremove`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				userId: removeUserId,
				chatId: selectedChat?._id,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				toast.success(`${removeUserName} removed successfully`);
				setRemoveUserId("");
				setRemoveUserName("");
				dispatch(addSelectedChat(json?.data));
				dispatch(setLoading(false));
			})
			.catch((err) => {
				console.log(err);
				toast.error("Failed to remove user");
				dispatch(setLoading(false));
			});
	};

	return (
		<div className="p-4 bg-gray-800 border-t border-gray-700 relative h-full overflow-auto">
			{selectedChat?.groupAdmin?._id === authUserId && (
				<div
					className="flex items-center gap-2 p-2 border border-gray-600 rounded-lg bg-gray-900 hover:bg-gray-700 cursor-pointer transition-all"
					onClick={() => setMemberAddBox(true)}
				>
					<div className="flex items-center justify-center h-10 w-10 rounded-full border border-gray-400">
						<IoPersonAddOutline className="text-white" fontSize={18} />
					</div>
					<span className="text-white">Add members</span>
				</div>
			)}
			<div className="w-full bg-gray-700 h-px my-2"></div>
			<div className="flex flex-col gap-2">
				{selectedChat?.users?.map((user) => (
					<div
						key={user._id}
						className="flex items-center gap-2 p-2 border border-gray-600 rounded-lg bg-gray-900 hover:bg-gray-700 cursor-pointer transition-all"
					>
						<img
							className="h-10 w-10 rounded-full"
							src={user?.image}
							alt="user"
						/>
						<div className="flex-1">
							<span className="text-white capitalize">
								{user?.firstName} {user?.lastName}
							</span>
							{user?._id === selectedChat?.groupAdmin?._id && (
								<span className="text-blue-300 text-xs">Admin</span>
							)}
						</div>
						{user?._id !== selectedChat?.groupAdmin?._id && (
							<>
								{selectedChat?.groupAdmin?._id === authUserId ? (
									<div
										title="Remove User"
										className="p-2 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-700 transition-all"
										onClick={() =>
											handleRemoveUser(user._id, user.firstName)
										}
									>
										<IoPersonRemoveOutline className="text-white" />
									</div>
								) : (
									<CiCircleInfo
										onClick={() =>
											toast.warn("You're not admin")
										}
										fontSize={25}
										className="text-white cursor-pointer"
										title="Not Allowed"
									/>
								)}
							</>
						)}
					</div>
				))}
			</div>
			{removeUserName && (
				<div className="fixed bottom-1 right-0 w-full p-4 bg-gray-900 border-t border-gray-700">
					<div className="flex items-center justify-between p-3 bg-blue-800 border border-gray-600 rounded-lg">
						<h1 className="text-white">Confirm removal of '{removeUserName}'?</h1>
						<div className="flex gap-2">
							<div
								onClick={() => {
									setRemoveUserName("");
									setRemoveUserId("");
								}}
								className="p-2 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-700 transition-all"
							>
								<VscError className="text-white" fontSize={19} />
							</div>
							<div
								onClick={handleRemoveUserCall}
								className="p-2 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-700 transition-all"
							>
								<IoCheckmarkCircleOutline className="text-white" fontSize={19} />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MemberRemove;
