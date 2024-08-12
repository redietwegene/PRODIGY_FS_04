import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/conditionSlice";

const Loading = () => {
	const dispatch = useDispatch();
	const [showCancel, setShowCancel] = useState(false);

	useEffect(() => {
		const timerId = setTimeout(() => {
			setShowCancel(true);
		}, 10000); // Show cancel button after 10 seconds

		// Cleanup function to clear the timeout if the component unmounts
		return () => {
			clearTimeout(timerId);
		};
	}, []);

	const handleCancel = () => {
		dispatch(setLoading(false)); // Stop loading
		// Optionally, you might want to perform additional cleanup or state updates here
	};

	return (
		<div
			className="flex flex-col items-center text-slate-300 min-h-screen w-full fixed top-0 justify-center z-50 bg-black/60"
			aria-live="polite" // Announce changes in loading state to screen readers
		>
			<div id="loader" className="w-16 h-16 border-4 border-t-4 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
			<div className="mt-5 h-10 w-24 flex justify-center items-center">
				{showCancel && (
					<div
						className="font-bold cursor-pointer border border-slate-700 py-2 px-4 rounded-md bg-slate-900 hover:bg-black/80"
						role="button"
						aria-label="Cancel loading"
						onClick={handleCancel}
					>
						<span>Cancel</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default Loading;
