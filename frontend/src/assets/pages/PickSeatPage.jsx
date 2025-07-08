import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PickSeat from "../components/MovieDetail/PickSeat";
import MovieCover from "../components/MovieDetail/MovieCover";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PickAnother from "../components/MovieDetail/PickAnother";
import { getMovieById } from "../../api/movieApi";

const PickSeatPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [chatbotInfo, setChatbotInfo] = useState(null);

  // Extract chatbot info once on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromChatbot = urlParams.get("fromChatbot");

    if (fromChatbot === "true") {
      const chatbotData = {
        movie: urlParams.get("movie"),
        showtime: urlParams.get("showtime"),
        cinema: urlParams.get("cinema"),
        suggestedSeats: urlParams.get("suggestedSeats")?.split(",") || [],
        fromChatbot: true,
      };
      console.log("=== CHATBOT INFO DETECTED ===", chatbotData);
      setChatbotInfo(chatbotData);
    }
  }, []); // Only run once on mount

  // Separate useEffect for fetching movie data
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("=== DEBUG: Starting API call ===");
        console.log("Movie ID from params:", id);
        console.log("API Base URL: http://localhost:8080/api");
        console.log("Full API URL:", `http://localhost:8080/api/movies/${id}`);

        const response = await getMovieById(id);
        console.log("Raw API Response:", response);

        // Kiểm tra nếu có lỗi từ API
        if (response.error) {
          console.error("API returned error:", response.error);
          throw new Error(
            response.error.message || "Không thể tải thông tin phim"
          );
        }

        // Lấy dữ liệu từ response.data
        const movieData = response.data;
        console.log("Extracted Movie Data:", movieData);
        console.log("Movie Data type:", typeof movieData);
        console.log(
          "Movie Data keys:",
          movieData ? Object.keys(movieData) : "null"
        );

        if (!movieData) {
          // If no movie data, try to use chatbot info as fallback
          if (chatbotInfo && chatbotInfo.movie) {
            console.log("Using chatbot movie info as fallback");
            const fallbackMovie = {
              id: id,
              title: chatbotInfo.movie,
              thumbnailURL: "/default-movie-poster.jpg", // Default image
              description: `Phim ${chatbotInfo.movie}`,
              genre: "Action",
              duration: 120,
              releaseDate: new Date().toISOString(),
            };
            setMovie(fallbackMovie);
            console.log("Set fallback movie data:", fallbackMovie);
            return;
          }
          throw new Error("Không tìm thấy phim với ID này");
        }

        setMovie(movieData);
        console.log("Successfully set movie data to state");
      } catch (err) {
        console.error("=== ERROR in fetchMovieData ===");
        console.error("Error type:", typeof err);
        console.error("Error message:", err.message);
        console.error("Full error:", err);

        // Try using chatbot info or demo data as final fallback
        if (chatbotInfo && chatbotInfo.movie) {
          console.log("API failed, using chatbot info as fallback");
          const fallbackMovie = {
            id: id,
            title: chatbotInfo.movie,
            thumbnailURL:
              "https://via.placeholder.com/500x750/1a1a1a/ffffff?text=" +
              encodeURIComponent(chatbotInfo.movie),
            description: `Phim ${chatbotInfo.movie} - Được đề xuất bởi Neko AI`,
            genre: "Action/Adventure",
            duration: 120,
            releaseDate: new Date().toISOString(),
            director: "Unknown",
            actors: ["Unknown"],
            tags: ["Action"],
          };
          setMovie(fallbackMovie);
          setError(null);
        } else {
          // Use demo data if all else fails
          console.log("Using demo movie data");
          const demoMovie = {
            id: id,
            title: "Demo Movie",
            thumbnailURL:
              "https://via.placeholder.com/500x750/1a1a1a/ffffff?text=Demo+Movie",
            description: "Demo movie for testing purposes",
            genre: "Action",
            duration: 120,
            releaseDate: new Date().toISOString(),
            director: "Demo Director",
            actors: ["Demo Actor"],
            tags: ["Demo"],
          };
          setMovie(demoMovie);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log("=== DEBUG: useEffect triggered ===");
      console.log("ID exists, calling fetchMovieData");
      fetchMovieData();
    } else {
      console.log("=== DEBUG: No ID found ===");
      setError("Không có ID phim trong URL");
      setLoading(false);
    }
  }, [id]); // Remove chatbotInfo from dependency

  const getBackgroundImage = () => {
    return (
      movie?.thumbnailURL ||
      "https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=Loading"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#be1238] mx-auto mb-4"></div>
          <p className="text-lg">Đang tải thông tin phim...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-4">
          <h2 className="text-xl font-bold mb-4">Có lỗi xảy ra</h2>
          <p className="text-red-500 text-lg mb-4">Lỗi: {error}</p>
          <div className="text-gray-400 text-sm mb-4">
            <p>Movie ID từ URL: {id || "Không có"}</p>
            <p>API Base URL: http://localhost:8080/api</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              window.location.reload();
            }}
            className="bg-[#be1238] px-4 py-2 rounded hover:bg-[#9F0F2F] mr-2"
          >
            Thử lại
          </button>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  console.log("=== RENDER DEBUG ===");
  console.log("Movie:", movie);
  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("ChatbotInfo:", chatbotInfo);

  return (
    <div className="min-h-screen">
      <NavBar />
      {/* Dynamic background image */}
      <div
        className="fixed inset-0 w-full h-full object-cover brightness-[0.3] -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getBackgroundImage()})`,
        }}
      ></div>
      {movie && <MovieCover movie={movie} />}

      {/* Chatbot Info Notification */}
      {chatbotInfo && chatbotInfo.fromChatbot && (
        <div className="max-w-6xl mx-auto px-4 md:px-[100px] py-4">
          <div className="bg-gradient-to-r from-[#BE1238]/20 to-[#ff4757]/20 border border-[#BE1238]/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#BE1238] to-[#ff4757] rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🤖</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm mb-1">
                  Thông tin từ Neko AI Assistant
                </h3>
                <div className="text-gray-300 text-xs space-y-1">
                  {chatbotInfo.movie && <p>🎬 Phim: {chatbotInfo.movie}</p>}
                  {chatbotInfo.showtime && (
                    <p>⏰ Suất chiếu: {chatbotInfo.showtime}</p>
                  )}
                  {chatbotInfo.cinema && <p>📍 Rạp: {chatbotInfo.cinema}</p>}
                  {chatbotInfo.suggestedSeats?.length > 0 && (
                    <p>🪑 Ghế gợi ý: {chatbotInfo.suggestedSeats.join(", ")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {movie && (
        <>
          <PickAnother movie={movie} onShowtimeSelect={setSelectedShowtime} />
          <PickSeat
            movie={movie}
            selectedShowtime={selectedShowtime}
            chatbotInfo={chatbotInfo}
          />
        </>
      )}
      <Footer />
    </div>
  );
};

export default PickSeatPage;
