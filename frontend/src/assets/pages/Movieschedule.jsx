import React, { useState } from "react";
import Dates from "../components/Dates";
import MovieList from "../components/MovieList";
import NavBar from "../components/NavBar";
import { FaCalendarAlt, FaFilm } from "react-icons/fa";

import Footer from "../components/Footer";

const MovieSchedule = () => {
  // Set default date to 2025-06-11 (format: yyyy-mm-dd)
  const [selectedDate, setSelectedDate] = useState("2025-06-11");

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <NavBar />
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border border-[#BE1238] rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-[#ff4757] rounded-full"></div>
          <div className="absolute top-40 right-40 w-16 h-16 bg-[#BE1238] rounded-full blur-xl"></div>
          <div className="absolute bottom-40 left-40 w-12 h-12 bg-[#ff4757] rounded-full blur-xl"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 pt-4 pb-12 text-white">
          <div className="px-[100px]"></div>
        </div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 pb-16">
        <div className="px-[100px]">
          {/* Date Selection Section */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <FaCalendarAlt className="text-[#BE1238] text-xl" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                    Chọn Ngày Xem Phim
                  </h2>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-[#BE1238] to-[#ff4757] mx-auto rounded-full"></div>
                <p className="text-gray-400 mt-3 text-sm">
                  Vui lòng chọn ngày để xem lịch chiếu chi tiết
                </p>
                {/* Display selected date */}
                <p className="text-[#BE1238] mt-2 text-sm font-semibold">
                  Ngày đã chọn: {formatDateForDisplay(selectedDate)}
                </p>
              </div>

              <div className="flex justify-center">
                <div className="bg-black/30 rounded-lg p-4 border border-gray-600/30">
                  <Dates
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Movie List Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <FaFilm className="text-[#ff4757] text-xl" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Lịch Chiếu Phim
                  </h2>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-[#ff4757] to-[#BE1238] mx-auto rounded-full"></div>
                <p className="text-gray-400 mt-3 text-sm">
                  Danh sách phim chiếu rạp ngày
                  <span className="text-[#BE1238] font-semibold ml-1">
                    {new Date(selectedDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                </p>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border border-gray-600/30">
                <MovieList selectedDate={selectedDate} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieSchedule;
