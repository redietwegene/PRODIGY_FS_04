import React, { useState } from "react";
import MemberAdd from "./MemberAdd";
import MemberRemove from "./MemberRemove";
import { useSelector } from "react-redux";

const Member = () => {
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [memberAddBox, setMemberAddBox] = useState(false);

	return (
		<div className="flex flex-col p-4 gap-4 text-white bg-gray-800 border-t border-gray-700 relative h-full overflow-auto">
			<div className="font-semibold text-xl text-center mb-4">
				Members ({selectedChat?.users?.length})
			</div>
			{memberAddBox ? (
				<MemberAdd setMemberAddBox={setMemberAddBox} />
			) : (
				<MemberRemove setMemberAddBox={setMemberAddBox} />
			)}
		</div>
	);
};

export default Member;
