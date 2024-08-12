import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const MessageLoading = () => {
	return (
		<div
			className="flex justify-center items-center w-full px-4 py-2 overflow-hidden scroll-style h-[66vh] bg-black/70"
			aria-live="polite" // Announce loading status to screen readers
		>
			<AiOutlineLoading3Quarters
				fontSize={30}
				color="white"
				className="animate-spin"
				aria-label="Loading messages" // Improve accessibility
			/>
		</div>
	);
};

export default MessageLoading;
