import { useState } from "react";
import ActivityComment from "./ActivityComment";
import ActivityLikedPosts from "./ActivityLikedPosts";
import ActivityPost from "./ActivityPost";

export default function Activity() {
  const [tap, setTap] = useState<string | null>("post");
  return (
    <div>
      <div className="mb-2 p-2 text-4xl font-bold">My Activity</div>

      <div className="flex flex-row ">
        <div
          onClick={() => setTap("post")}
          className="flex items-center justify-center p-1 w-24 bg-[#3182ce] hover:bg-[#2b6cb0] border-r-1 border-r-white text-white cursor-pointer"
        >
          Posts
        </div>
        <div
          onClick={() => setTap("comment")}
          className="flex items-center justify-center p-1 w-24 bg-[#3182ce] hover:bg-[#2b6cb0] border-r-1 border-r-white text-white cursor-pointer"
        >
          Comments
        </div>
        <div
          onClick={() => setTap("likes")}
          className="flex items-center justify-center p-1 w-24 bg-[#3182ce] hover:bg-[#2b6cb0] text-white cursor-pointer"
        >
          Liked Posts
        </div>
      </div>

      {tap == "post" && (
        <div>
          <ActivityPost />
        </div>
      )}
      {tap == "comment" && (
        <div>
          <ActivityComment />
        </div>
      )}
      {tap == "likes" && (
        <div>
          <ActivityLikedPosts />
        </div>
      )}
    </div>
  );
}
