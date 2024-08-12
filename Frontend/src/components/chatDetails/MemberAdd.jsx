import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { setChatLoading, setLoading } from "../../redux/slices/conditionSlice";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { ChatShimmerSmall } from "../loading/ChatShimmer";
import { IoCheckmarkCircleOutline, IoPersonAddOutline } from "react-icons/io5";
import { VscError } from "react-icons/vsc";

const MemberAdd = ({ setMemberAddBox }) => {
	const dispatch = useDispatch();
	const isChatLoading = useSelector((store) => store?.condition?.isChatLoading);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [inputUserName, setInputUserName] = useState("");
	const [addUserName, setAddUserName] = useState("");
	const [addUserId, setAddUserId] = useState("");

	// Fetch all users
	useEffect(() => {
		const getAllUsers = () => {
			dispatch(setChatLoading(true));
			const token = localStorage.getItem("token");
			fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((json) => {
					setUsers(json.data || []);
					setSelectedUsers(json.data || []);
					dispatch(setChatLoading(false));
				})
				.catch((err) => {
					console.log(err);
					dispatch(setChatLoading(false));
				});
		};
		getAllUsers();
	}, [dispatch]);

	// Filter users based on search input
	useEffect(() => {
		setSelectedUsers(
			users.filter((user) => {
				const searchTerm = inputUserName.toLowerCase();
				return (
					user.firstName.toLowerCase().includes(searchTerm) ||
					user.lastName.toLowerCase().includes(searchTerm) ||
					user.email.toLowerCase().includes(searchTerm)
				);
			})
		);
	}, [inputUserName, users]);

	// Handle add user
	const handleAddUser = (userId, userName) => {
		if (selectedChat?.users?.find((user) => user?._id === userId)) {
			toast.warn(`${userName} is already added`);
			setAddUserId("");
			setAddUserName("");
			return;
		}
		setAddUserId(userId);
		setAddUserName(userName);
	};

	// Call API to add user to chat
	const handleAddUserCall = () => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/groupadd`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				userId: addUserId,
				chatId: selectedChat?._id,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				toast.success(`${addUserName} added successfully`);
				setAddUserId("");
				setAddUserName("");
				dispatch(addSelectedChat(json?.data));
				dispatch(setLoading(false));
				setMemberAddBox(false);
			})
			.catch((err) => {
				console.log(err);
				toast.error("Failed to add user");
				dispatch(setLoading(false));
			});
	};

	return (
		<div className="p-4 bg-gray-800 border-t border-gray-700 relative h-full overflow-auto">
			<div className="font-medium text-lg text-center mb-3">
				Total Users ({users?.length || 0})
			</div>
			<div className="w-full bg-gray-700 mb-3 h-px"></div>
			<div
				onClick={() => setMemberAddBox(false)}
				className="bg-gray-700 hover:bg-gray-600 h-8 w-8 rounded-full flex items-center justify-center absolute top-4 left-3 cursor-pointer"
			>
				<FaArrowLeft title="Back" fontSize={16} />
			</div>
			<div className="flex items-center gap-2 mb-3">
				<input
					type="text"
					placeholder="Search Users..."
					className="flex-1 border border-gray-600 py-2 px-3 rounded-md bg-gray-900 text-white outline-none placeholder-gray-400"
					onChange={(e) => setInputUserName(e.target.value)}
				/>
				<FaSearch title="Search Users" className="text-gray-400" />
			</div>
			<div className="flex flex-col gap-2 mb-3">
				{selectedUsers.length === 0 && isChatLoading ? (
					<ChatShimmerSmall />
				) : (
					<>
						{selectedUsers.length === 0 && (
							<div className="flex justify-center items-center text-white">
								<h1 className="text-base font-semibold">No users found.</h1>
							</div>
						)}
						{selectedUsers.map((user) => (
							<div
								key={user._id}
								className="flex items-center gap-2 p-2 border border-gray-600 rounded-lg bg-gray-900 hover:bg-gray-700 cursor-pointer"
							>
								<img
									className="h-12 w-12 rounded-full"
									src={user.image}
									alt="user"
								/>
								<div className="flex-1">
									<span className="block truncate capitalize text-white">
										{user.firstName} {user.lastName}
									</span>
								</div>
								<div
									title="Add User"
									className="border border-gray-600 p-2 rounded-md cursor-pointer hover:bg-gray-700"
									onClick={() => handleAddUser(user._id, user.firstName)}
								>
									<IoPersonAddOutline fontSize={20} />
								</div>
							</div>
						))}
					</>
				)}
			</div>
			{addUserName && (
				<div className="fixed bottom-0 right-0 w-full p-4">
					<div className="flex items-center justify-between p-3 bg-blue-800 border border-gray-600 rounded-lg">
						<h1 className="text-white">
							Confirm addition of '{addUserName}'?
						</h1>
						<div className="flex gap-2">
							<div
								onClick={() => {
									setAddUserName("");
									setAddUserId("");
								}}
								className="border border-gray-600 p-2 rounded-md cursor-pointer hover:bg-gray-700"
							>
								<VscError fontSize={20} />
							</div>
							<div
								onClick={handleAddUserCall}
								className="border border-gray-600 p-2 rounded-md cursor-pointer hover:bg-gray-700"
							>
								<IoCheckmarkCircleOutline fontSize={20} />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MemberAdd;
