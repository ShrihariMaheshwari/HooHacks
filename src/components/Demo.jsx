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

  const summaryRef = useRef(null);
  const lectureNotesRef = useRef(null);

  useEffect(() => {
    if (summaryRef.current) {
      setSummaryHeight(summaryRef.current.offsetHeight);
    }
  }, [article.summary]);

  const [isSummaryLoaded, setIsSummaryLoaded] = useState(false);
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowRecommendedVideos(true);

    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };

      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);

      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
      console.log(newArticle);
      setIsSummaryLoaded(true);
    }
  };

  useEffect(() => {
    if (isSummaryLoaded && lectureNotesRef.current) {
      lectureNotesRef.current.scrollIntoView({ behavior: "smooth" });
      setIsSummaryLoaded(false); // Reset the flag after scrolling
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

      {showRecommendedVideos && (
        <section
          className="relative w-full overflow-hidden px-5" // Apply horizontal padding to the section
          style={{ paddingTop: `${summaryHeight + 10}px` }}
        >
          <h2 className="font-satoshi font-bold text-gray-600 text-xl text-center mb-4">
            Recommended <span className="blue_gradient">Videos</span>
          </h2>
          <div
            className="flex overflow-x-auto space-x-4 pb-4"
            style={{
              position: "relative", // Change to relative if absolute positioning is not necessary
              width: "calc(100% - 40px)", // Adjust width based on the parent's padding
              paddingLeft: "20px", // Match the parent's horizontal padding
              paddingRight: "20px", // Match the parent's horizontal padding
            }}
          >
            <div className="flex-shrink-0 w-60 h-40 bg-gray-200 rounded-lg flex justify-center items-center mr-4">
              <span>Video 1</span>
            </div>
            <div className="flex-shrink-0 w-60 h-40 bg-gray-200 rounded-lg flex justify-center items-center mr-4">
              <span>Video 2</span>
            </div>
            <div className="flex-shrink-0 w-60 h-40 bg-gray-200 rounded-lg flex justify-center items-center mr-4">
              <span>Video 3</span>
            </div>
            <div className="flex-shrink-0 w-60 h-40 bg-gray-200 rounded-lg flex justify-center items-center mr-4">
              <span>Video 4</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Demo;
