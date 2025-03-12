import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  userid: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookReviewList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/post/list/bookreview",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const res = await response.json();
        setPosts(res.data);
        console.log(res.data); // Do something with the data
      } catch (error) {
        console.error("Error fetching BookReviews:", error);
      }
    };

    fetchData(); // Call the async function
  }, []);

  return (
    <div>
      <h1>All Posts</h1>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/bookreview/${post.id}`}>
                {/* Show a truncated preview */}
                <div>{post.title}</div>
                <small>{new Date(post.createdAt).toLocaleString()}</small>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
