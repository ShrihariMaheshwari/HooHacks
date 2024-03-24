import React, { useState } from "react";
import { loader, linkIcon } from "../assets";

const Demo = () => {
  const [article, setArticle] = useState({ url: "" });
  const [lectureNotes, setLectureNotes] = useState("");
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch suggested videos
  const fetchSuggestedVideos = async () => {
    try {
      const response = await fetch(
        "https://kaizen-backend.vercel.app/api/v1/video/suggest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: article.url }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch suggested videos");
      }
      setSuggestedVideos(data); // Assuming the entire response is the array of videos
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start the loading animation

    try {
      const response = await fetch(
        "https://kaizen-backend.vercel.app/api/v1/video/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: article.url }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch lecture notes");
      }

      setLectureNotes(data.notes); // Set the fetched notes
      await fetchSuggestedVideos(); // Fetch suggested videos after fetching lecture notes
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false); // Stop the loading animation
    }
  };

  return (
    <>
      <section className="mt-20 w-full max-w-xl">
        <div className="flex flex-col w-full gap-2">
          <form
            className="relative flex justify-center items-center"
            onSubmit={handleSubmit}
          >
            <img
              src={linkIcon}
              alt="link_icon"
              className="absolute left-0 my-2 ml-3 w-5"
            />
            <input
              type="url"
              placeholder="Enter an URL"
              value={article.url}
              onChange={(e) =>
                setArticle({
                  ...article,
                  url: e.target.value,
                })
              }
              required
              className="url_input peer"
            />
            <button
              type="submit"
              className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
            >
              <p>↵</p>
            </button>
          </form>
        </div>
      </section>

      <div className="my-10 max-w-full flex justify-center items-center">
        {isLoading ? (
          <img
            src={loader}
            alt="Loading..."
            className="w-20 h-20 object-contain"
          />
        ) : (
          <>
            {lectureNotes && (
              <>
                <section className="relative w-full overflow-hidden px-5">
                  <h2 className="font-satoshi font-bold text-gray-600 text-xl text-center mb-4">
                    Lecture <span className="blue_gradient">Notes</span>
                  </h2>
                  <div
                    className=" w-full"  
                    dangerouslySetInnerHTML={{ __html: lectureNotes }}
                  ></div>
                </section>
              </>
            )}
          </>
        )}
      </div>

      {!isLoading && suggestedVideos.length > 0 && (
        <section className="relative w-full overflow-hidden px-5">
          <h2 className="font-satoshi font-bold text-gray-600 text-xl text-center mb-4">
            Suggested <span className="blue_gradient">Videos</span>
          </h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {suggestedVideos.suggestions.map((video, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-60 h-40 bg-gray-200 rounded-lg flex flex-col justify-center items-center mr-4"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-32 rounded-t-lg"
                />
                <p className="font-satoshi font-bold text-sm text-gray-600 mt-2">
                  {video.title}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default Demo;
