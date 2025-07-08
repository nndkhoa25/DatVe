import { initFlowbite } from "flowbite";
import React, { useEffect, useState } from "react";
import { IoCalendarOutline, IoChevronDownOutline } from "react-icons/io5";
import {
  getShowtimesByMovieAndDate,
  getShowtimesByMovieId,
} from "../../../api/showtimeApi";
import { getCinemaById } from "../../../api/cinemaApi";

const PickAnother = ({ movie, onShowtimeSelect }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showCinemas, setShowCinemas] = useState(false);

// Data từ database
  const [availableShowtimes, setAvailableShowtimes] = useState([]);
  const [availableCinemas, setAvailableCinemas] = useState([]);
  const [cinemaCache, setCinemaCache] = useState({}); // Cache cinema info
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get cinema name từ cache hoặc API
  const getCinemaName = async (cinemaId) => {
    // Kiểm tra cache trước
    if (cinemaCache[cinemaId]) {
      return cinemaCache[cinemaId].name;
    }

    try {
      const response = await getCinemaById(cinemaId);
      if (response.data) {
        // Lưu vào cache
        setCinemaCache((prev) => ({
          ...prev,
          [cinemaId]: response.data,
        }));
        return response.data.name;
      }
    } catch (error) {
      console.error("Error fetching cinema:", error);
    }

    // Fallback nếu không lấy được
    return `Cinema ${cinemaId.slice(-4)}`;
  };

  // Set default date từ ngày 11/6/2025
  useEffect(() => {
    initFlowbite();
    const defaultDate = "2025-06-11"; // Ngày bắt đầu từ hệ thống showtime
    setSelectedDate(defaultDate);
  }, []);

  // Fetch cinemas khi component mount hoặc movie thay đổi
  useEffect(() => {
    const fetchCinemas = async () => {
      if (!movie?.id) return;

      try {
        const response = await getShowtimesByMovieId(movie.id);
        if (response.data) {
          // Lấy unique cinema IDs từ showtimes
          const uniqueCinemaIds = [
            ...new Set(response.data.map((showtime) => showtime.cinemaId)),
          ];

          // Fetch cinema info cho từng ID
          const cinemaPromises = uniqueCinemaIds.map(async (cinemaId) => {
            const name = await getCinemaName(cinemaId);
            return { id: cinemaId, name };
          });

          const uniqueCinemas = await Promise.all(cinemaPromises);
          setAvailableCinemas(uniqueCinemas);

          if (uniqueCinemas.length > 0 && !selectedCinema) {
            setSelectedCinema(uniqueCinemas[0].name);
          }
        }
      } catch (err) {
        console.error("Error fetching cinemas:", err);
        setError("Không thể tải danh sách rạp");
      }
    };

    fetchCinemas();
  }, [movie?.id, cinemaCache]);

  // Fetch showtimes khi movie, date thay đổi
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!movie?.id || !selectedDate) return;

      setLoading(true);
      setError(null);

      try {
        console.log(
          `🎬 Fetching showtimes for movie ${movie.id} on ${selectedDate}`
        );

        const response = await getShowtimesByMovieAndDate(
          movie.id,
          selectedDate
        );

        if (response.error) {
          throw new Error(response.error.message);
        }

        const showtimesData = response.data || [];
        console.log(
          `🎭 Found ${showtimesData.length} showtimes:`,
          showtimesData
        );

        // Filter showtimes không bị ẩn
        const activeShowtimes = showtimesData.filter(
          (showtime) => !showtime.hidden
        );

        setAvailableShowtimes(activeShowtimes);

        // Set default time nếu chưa có và có dữ liệu
        if (activeShowtimes.length > 0 && !selectedTime) {
          const firstTime = formatShowTime(activeShowtimes[0].showTime);
          setSelectedTime(firstTime);
        }
      } catch (err) {
        console.error("Error fetching showtimes:", err);
        setError(err.message);
        setAvailableShowtimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movie?.id, selectedDate]);

  // Format showtime từ database
  const formatShowTime = (showTimeString) => {
    const time = new Date(showTimeString);
    return time.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Lấy unique time slots từ showtimes
  const getUniqueTimeSlots = () => {
    const times = availableShowtimes.map((showtime) =>
      formatShowTime(showtime.showTime)
    );
    return [...new Set(times)].sort();
  };

  // Lấy unique cinemas từ showtimes của ngày đã chọn
  const getAvailableCinemasForDate = () => {
    const cinemaIds = [
      ...new Set(availableShowtimes.map((showtime) => showtime.cinemaId)),
    ];
    return cinemaIds.map((id) => ({
      id: id,
      name: cinemaCache[id]?.name || `Cinema ${id.slice(-4)}`, // Dùng cache
    }));
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Chọn ngày";
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("vi-VN", options);
  };

  // Get min date (ngày 11/6/2025)
  const getMinDate = () => "2025-06-11";

  // Get max date (7 ngày từ ngày bắt đầu)
  const getMaxDate = () => "2025-06-17";

  const timeSlots = getUniqueTimeSlots();
  const cinemasForDate = getAvailableCinemasForDate();

  // Tìm và emit showtime khi user chọn đủ thông tin
  React.useEffect(() => {
    if (
      selectedDate &&
      selectedTime &&
      selectedCinema &&
      availableShowtimes.length > 0
    ) {
      // Tìm cinema ID từ cinema name
      const selectedCinemaObj = cinemasForDate.find(
        (c) => c.name === selectedCinema
      );

      if (selectedCinemaObj) {
        // Tìm showtime tương ứng
        const matchingShowtime = availableShowtimes.find((showtime) => {
          const showtimeTime = formatShowTime(showtime.showTime);
          return (
            showtime.cinemaId === selectedCinemaObj.id &&
            showtimeTime === selectedTime
          );
        });

        if (matchingShowtime && onShowtimeSelect) {
          console.log("🎬 Selected showtime:", matchingShowtime);
          onShowtimeSelect(matchingShowtime);
        }
      }
    }
  }, [
    selectedDate,
    selectedTime,
    selectedCinema,
    availableShowtimes,
    cinemasForDate,
    onShowtimeSelect,
  ]);

  return (
    <div
      aria-label="Date, time and cinema selection"
      className="bg-black bg-opacity-80 flex justify-center py-4 text-white text-sm font-normal select-none"
    >
      <div className="max-w-[600px] w-full flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
        {/* Date Picker */}
        <div className="relative w-full sm:w-auto min-w-[180px]">
          <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3 pointer-events-none">
            <IoCalendarOutline className="text-gray-500 text-[18px]" />
          </div>
          <input
            id="datepicker"
            name="date"
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime(""); // Reset time khi đổi ngày
            }}
            min={getMinDate()}
            max={getMaxDate()}
            className="border border-gray-600 bg-gray-700 text-white text-sm rounded-lg block w-full pl-10 pr-3 py-2.5 placeholder-gray-400 focus:ring-[#be1238] focus:border-[#be1238] transition-colors duration-200"
          />
        </div>

        {/* Time Selection */}
        <div className="relative w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowTimeSlots(!showTimeSlots)}
            disabled={loading || timeSlots.length === 0}
            className={`border border-gray-600 text-white text-sm rounded-lg px-4 py-2.5 min-w-[120px] flex items-center justify-between transition-colors duration-200 ${
              loading || timeSlots.length === 0
                ? "bg-gray-800 cursor-not-allowed opacity-50"
                : "bg-gray-700 hover:bg-gray-600 focus:ring-[#be1238] focus:border-[#be1238]"
            }`}
          >
            <span className="font-bold">
              {loading ? "Đang tải..." : selectedTime || "Chọn giờ"}
            </span>

            <IoChevronDownOutline
              className={`ml-2 transition-transform duration-200 ${
                showTimeSlots ? "rotate-180" : ""
              }`}
            />
          </button>
          {showTimeSlots && timeSlots.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setSelectedTime(time);
                    setShowTimeSlots(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-600 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                    selectedTime === time
                      ? "bg-[#be1238] text-white"
                      : "text-gray-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cinema Selection */}
        <div className="relative w-full sm:w-auto min-w-[200px]">
          <button
            type="button"
            onClick={() => setShowCinemas(!showCinemas)}
            disabled={loading || cinemasForDate.length === 0}
            className={`border border-gray-600 text-white text-sm rounded-lg px-4 py-2.5 w-full flex items-center justify-between transition-colors duration-200 ${
              loading || cinemasForDate.length === 0
                ? "bg-gray-800 cursor-not-allowed opacity-50"
                : "bg-gray-700 hover:bg-gray-600 focus:ring-[#be1238] focus:border-[#be1238]"
            }`}
          >
            <span className="font-bold truncate">
              {loading ? "Đang tải..." : selectedCinema || "Chọn rạp"}
            </span>

            <IoChevronDownOutline
              className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
                showCinemas ? "rotate-180" : ""
              }`}
            />
          </button>

          {showCinemas && cinemasForDate.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50">
              {cinemasForDate.map((cinema) => (
                <button
                  key={cinema.id}
                  onClick={() => {
                    setSelectedCinema(cinema.name);
                    setShowCinemas(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-600 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                    selectedCinema === cinema.name
                      ? "bg-[#be1238] text-white"
                      : "text-gray-300"
                  }`}
                >
                  {cinema.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status indicator */}
        {timeSlots.length === 0 && !loading && selectedDate && (
          <div className="text-yellow-400 text-xs">Không có suất chiếu</div>
        )}
      </div>
      {/* Error message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showTimeSlots || showCinemas) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowTimeSlots(false);
            setShowCinemas(false);
          }}
        />
      )}
    </div>
  );
};

export default PickAnother;
