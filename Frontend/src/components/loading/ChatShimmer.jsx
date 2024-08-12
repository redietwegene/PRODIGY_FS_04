import React from "react";


const ShimmerItem = ({ className, width, height }) => (
    <div className={`rounded-lg border border-slate-600 shimmer-animated ${className}`} style={{ width, height }}></div>
);

const ChatShimmer = () => (
    <>
        {Array(10)
            .fill("")
            .map((_, idx) => (
                <div
                    key={idx}
                    className="w-full h-16 border-slate-500 border rounded-lg flex justify-start items-center p-2 font-semibold gap-2 hover:bg-black/50 transition-all cursor-pointer text-white"
                >
                    <ShimmerItem className="h-12 min-w-12" />
                    <div className="w-full">
                        <ShimmerItem className="line-clamp-1 capitalize mb-3.5" width="75%" height="0.75rem" />
                        <ShimmerItem className="line-clamp-1 capitalize" width="50%" height="0.75rem" />
                    </div>
                </div>
            ))}
    </>
);

export const ChatShimmerSmall = () => (
    <>
        {Array(10)
            .fill("")
            .map((_, idx) => (
                <div
                    key={idx}
                    className="w-full h-12 border-slate-500 border rounded-lg flex justify-start items-center p-2 font-semibold gap-2 hover:bg-black/50 transition-all cursor-pointer text-white"
                >
                    <ShimmerItem className="h-10 min-w-10" />
                    <ShimmerItem className="line-clamp-1 capitalize" width="75%" height="0.75rem" />
                    <ShimmerItem className="h-8 min-w-8" width="100%" height="2rem" />
                </div>
            ))}
    </>
);

export default ChatShimmer;
