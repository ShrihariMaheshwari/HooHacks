import React, { useState, useEffect, useRef } from "react";
import { copy, tick, loader, linkIcon } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);
  const [showRecommendedVideos, setShowRecommendedVideos] = useState(false);
  const [summaryHeight, setSummaryHeight] = useState(0);
  const [isSummaryLoaded, setIsSummaryLoaded] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const summaryRef = useRef(null);
  const lectureNotesRef = useRef(null);

  useEffect(() => {
    if (summaryRef.current) {
      setSummaryHeight(summaryRef.current.offsetHeight);
    }
  }, [article.summary]);

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const simulateVideoLoading = () => {
    return new Promise((resolve) => setTimeout(resolve, 3000)); // 3 seconds timeout
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start the single loading animation for the entire operation

    try {
      // Create a promise for the summary data fetching
      const summaryPromise = getSummary({ articleUrl: article.url }).unwrap();
      // Create a promise for the timeout to simulate video loading
      const timeoutPromise = simulateVideoLoading();

      // Use Promise.all to wait for both promises to resolve
      const [summaryData] = await Promise.all([summaryPromise, timeoutPromise]);

      // Process the summary data
      if (summaryData?.summary) {
        const newArticle = { ...article, summary: summaryData.summary };
        const updatedAllArticles = [newArticle, ...allArticles];

        setArticle(newArticle);
        setAllArticles(updatedAllArticles);
        localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
      }

      // After both promises have resolved, update the states to show content
      setShowRecommendedVideos(true); // Show the recommended videos
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle any errors here
    } finally {
      setIsLoading(false); // Stop the loading animation for the entire operation
    }
  };
  
  useEffect(() => {
    if (isSummaryLoaded && lectureNotesRef.current) {
      lectureNotesRef.current.scrollIntoView({ behavior: "smooth" });
      setIsSummaryLoaded(false);
    }
  }, [isSummaryLoaded]);

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
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

        <div className="my-10 max-w-full flex justify-center items-center">
          {isFetching ? (
            <img
              src={loader}
              alt="loader"
              className="w-20 h-20 object-contain"
            />
          ) : error ? (
            <p className="font-inter font-bold text-black text-center">
              Well, that wasn't supposed to happen...
              <br />
              <span className="font-satoshi font-normal text-gray-700">
                {error?.data?.error}
              </span>
            </p>
          ) : (
            article.summary && (
              <div
                ref={lectureNotesRef}
                className="flex flex-col gap-3 items-center w-full"
              >
                <h2 className="font-satoshi font-bold text-gray-600 text-xl text-center">
                  Lectures <span className="blue_gradient">Notes</span>
                </h2>
                <div
                  className="summary_box w-full"
                  style={{ width: "100%" }}
                  ref={summaryRef}
                >
                  <ul className="list-disc text-left pl-10">
                    {article.summary
                      .split(". ")
                      .filter((sentence) => sentence.trim().length > 0)
                      .map((sentence, index) => (
                        <li
                          key={index}
                          className="font-inter font-medium text-sm text-gray-700 mb-2"
                        >
                          {sentence.trim().endsWith(".")
                            ? sentence.trim()
                            : `${sentence.trim()}.`}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {isLoadingVideos ? (
        <div className="flex justify-center items-center w-full">
          <img
            src={loader}
            alt="Loading..."
            className="w-20 h-20 object-contain"
          />
        </div>
      ) : (
        showRecommendedVideos && (
          <section
            className="relative w-full overflow-hidden px-5"
            style={{ paddingTop: `${summaryHeight + 10}px` }}
          >
            <h2 className="font-satoshi font-bold text-gray-600 text-xl text-center mb-4">
              Suggested <span className="blue_gradient">Videos</span>
            </h2>
            <div
              className="flex overflow-x-auto space-x-4 pb-4"
              style={{
                position: "relative",
                width: "calc(100% - 40px)",
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              <div className="flex-shrink-0 w-60 h-40 bg-gray-200 rounded-lg flex flex-col justify-center items-center mr-4">
                <img
                  src="path_to_dummy_video_thumbnail_1.jpg"
                  alt="Dummy Video 1"
                  className="w-full h-32 rounded-t-lg"
                />
                <p className="font-satoshi font-bold text-sm text-gray-600 mt-2">
                  Dummy Video Title 1
                </p>
              </div>
              <div className="flex-shrink-0 w-60 h-40 bg-gray-200 rounded-lg flex flex-col justify-center items-center mr-4">
                <img
                  src="path_to_dummy_video_thumbnail_2.jpg"
                  alt="Dummy Video 2"
                  className="w-full h-32 rounded-t-lg"
                />
                <p className="font-satoshi font-bold text-sm text-gray-600 mt-2">
                  Dummy Video Title 2
                </p>
              </div>
              <div className="flex-shrink-0 w-60 h-40 bg-gray-200 rounded-lg flex flex-col justify-center items-center mr-4">
                <img
                  src="path_to_dummy_video_thumbnail_3.jpg"
                  alt="Dummy Video 3"
                  className="w-full h-32 rounded-t-lg"
                />
                <p className="font-satoshi font-bold text-sm text-gray-600 mt-2">
                  Dummy Video Title 3
                </p>
              </div>
              <div className="flex-shrink-0 w-60 h-40 bg-gray-200 rounded-lg flex flex-col justify-center items-center mr-4">
                <img
                  src="path_to_dummy_video_thumbnail_4.jpg"
                  alt="Dummy Video 4"
                  className="w-full h-32 rounded-t-lg"
                />
                <p className="font-satoshi font-bold text-sm text-gray-600 mt-2">
                  Dummy Video Title 4
                </p>
              </div>
            </div>
          </section>
        )
      )}
    </>
  );
};

export default Demo;
