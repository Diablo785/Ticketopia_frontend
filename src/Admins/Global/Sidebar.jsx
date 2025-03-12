import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed left-0 bg-gray-800 text-white z-1000 shadow-lg transition-all duration-300 ${isOpen ? "w-[275px]" : "w-[55px]"}`}
      style={{ height: "100vh" }}
    >
      <button
        onClick={onToggle}
        className="text-white text-xl p-3 flex items-center transition-all duration-300 justify-center z-20"
        style={{ position: "relative", zIndex: 20 }}
      >
        <MenuIcon
          style={{
            fontSize: isOpen ? "48px" : "32px",
            transition: "font-size 0.3s ease",
          }}
        />
      </button>

      <div
        className={`flex flex-col h-full p-4 transition-all duration-300 ${isOpen ? "block" : "hidden"}`}
      >
        <Link
          to="/"
          className={`flex items-center p-2 mb-4 rounded-lg hover:bg-gray-600 transition-colors ${isActive("/") ? "bg-gray-600 text-yellow-500" : "bg-gray-700 text-white"}`}
        >
          <HomeIcon className="mr-2" />
          <span className={`${isOpen ? "block" : "hidden"}`}>Home</span>
        </Link>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center p-2 mb-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <ArrowBackIcon className="mr-2" />
          <span className={`${isOpen ? "block" : "hidden"}`}>Back</span>
        </button>

        <h2
          className={`${isOpen ? "block" : "hidden"} text-2xl font-bold mb-4`}
        >
          Admin Panel
        </h2>

        <h3
          className={`${isOpen ? "block" : "hidden"} text-xl font-semibold border-b border-gray-600 pb-2 mb-3`}
        >
          Management
        </h3>
        <ul className="flex flex-col space-y-2">
          <li>
            <Link
              to="/admin/add-events"
              className={`block p-3 rounded-lg hover:bg-[#FF6347] hover:text-gray-900 transition-all duration-200 transform hover:scale-105 shadow-md ${isActive("/admin/add-event") ? "bg-gray-500 text-yellow-500" : "bg-gray-700 text-gray-300"}`}
            >
              {isOpen ? (
                <span className="font-semibold">➕ Add Event</span>
              ) : (
                <span>➕</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/manage-events"
              className={`block p-3 rounded-lg hover:bg-[#FF6347] hover:text-gray-900 transition-all duration-200 transform hover:scale-105 shadow-md ${isActive("/admin/manage-events") ? "bg-gray-500 text-yellow-500" : "bg-gray-700 text-gray-300"}`}
            >
              {isOpen ? (
                <span className="font-semibold">🗂️ Manage Events</span>
              ) : (
                <span>🗂️</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/view-reports"
              className={`block p-3 rounded-lg hover:bg-[#FF6347] hover:text-gray-900 transition-all duration-200 transform hover:scale-105 shadow-md ${isActive("/admin/view-reports") ? "bg-gray-500 text-yellow-500" : "bg-gray-700 text-gray-300"}`}
            >
              {isOpen ? (
                <span className="font-semibold">📊 View Reports</span>
              ) : (
                <span>📊</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/manage-users"
              className={`block p-3 rounded-lg hover:bg-[#FF6347] hover:text-gray-900 transition-all duration-200 transform hover:scale-105 shadow-md ${isActive("/admin/manage-users") ? "bg-gray-500 text-yellow-500" : "bg-gray-700 text-gray-300"}`}
            >
              {isOpen ? (
                <span className="font-semibold">👤 Manage Users</span>
              ) : (
                <span>👤</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className={`block p-3 rounded-lg hover:bg-[#FF6347] hover:text-gray-900 transition-all duration-200 transform hover:scale-105 shadow-md ${isActive("/admin/settings") ? "bg-gray-500 text-yellow-500" : "bg-gray-700 text-gray-300"}`}
            >
              {isOpen ? (
                <span className="font-semibold">⚙️ Settings</span>
              ) : (
                <span>⚙️</span>
              )}
            </Link>
          </li>
          {/* New Buttons for Managing Venues and Organizers */}
          <li>
            <Link
              to="/admin/manage-venues"
              className={`block p-3 rounded-lg hover:bg-[#FF6347] hover:text-gray-900 transition-all duration-200 transform hover:scale-105 shadow-md ${isActive("/admin/manage-venues") ? "bg-gray-500 text-yellow-500" : "bg-gray-700 text-gray-300"}`}
            >
              {isOpen ? (
                <span className="font-semibold">🏢 Manage Venues</span>
              ) : (
                <span>🏢</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/manage-organizers"
              className={`block p-3 rounded-lg hover:bg-[#FF6347] hover:text-gray-900 transition-all duration-200 transform hover:scale-105 shadow-md ${isActive("/admin/manage-organizers") ? "bg-gray-500 text-yellow-500" : "bg-gray-700 text-gray-300"}`}
            >
              {isOpen ? (
                <span className="font-semibold">👥 Manage Organizers</span>
              ) : (
                <span>👥</span>
              )}
            </Link>
          </li>
        </ul>
      </div>

      <div
        className={`flex flex-col justify-between h-full p-2 bg-gray-700 transition-colors ${isOpen ? "hidden" : "block"}`}
      >
        <ul className="flex flex-col space-y-8 text-center mb-20 text-2xl">
          <li>
            <Link
              to="/admin/add-events"
              className={`${isActive("/admin/add-event") ? "text-yellow-500" : "text-white"}`}
            >
              <span>➕</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/manage-events"
              className={`${isActive("/admin/manage-events") ? "text-yellow-500" : "text-white"}`}
            >
              <span>🗂️</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/view-reports"
              className={`${isActive("/admin/view-reports") ? "text-yellow-500" : "text-white"}`}
            >
              <span>📊</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/manage-users"
              className={`${isActive("/admin/manage-users") ? "text-yellow-500" : "text-white"}`}
            >
              <span>👤</span>
            </Link>
          </li>
        </ul>

        <div className="flex flex-col items-center mb-20">
          <Link
            to="/"
            className={`flex items-center justify-center mb-6 ${isActive("/") ? "text-yellow-500" : "text-white"}`}
          >
            <HomeIcon style={{ fontSize: "36px", transition: "color 0.3s" }} />
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center"
          >
            <ArrowBackIcon style={{ fontSize: "36px" }} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
