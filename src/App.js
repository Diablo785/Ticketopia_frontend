import React, { useEffect, useState } from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import '@mantine/notifications/styles.css'; 
import "@mantine/core/styles.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./Users/Pages/HomePage";
import EventDetailsPage from "./Users/Pages/EventDetailsPage";
import DiscountPage from "./Users/Pages/DiscountPage";
import AuthPage from "./Users/Pages/Auth/Authentification";
import ProfilePage from "./Users/Pages/ProfilePage";
import UserHeader from "./Users/Global/Header";
import Footer from "./Users/Global/Footer";
import AdminPage from "./Admins/Pages/AdminPage";
import AdminRoute from "./Admins/AdminRoute";
import Sidebar from "./Admins/Global/Sidebar";
import ManageVenues from "./Admins/Pages/ManageVenues";
import ManageOrganizers from "./Admins/Pages/ManageOrganizers";
import AddEvents from "./Admins/Pages/AddEvents";
import { UserProvider, useUser } from "./Users/Context/UserContext";
import { CartProvider } from "./Users/Context/CartContext";
import { useAuthToken } from "./utils/useAuthToken";
import { useFetch } from "./utils/useFetch";
import { NothingFoundBackground } from "./404/NothingFoundBackground.tsx";

function useIsAdminRoute() {
  const location = useLocation();
  return location.pathname.startsWith("/admin");
}

function UserLayout() {
  return (
    <>
      <UserHeader />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/event-details" element={<EventDetailsPage />} />
          <Route path="/discount" element={<DiscountPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NothingFoundBackground />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <Sidebar isOpen={isOpen} onToggle={handleToggleSidebar} />
      <main
        className={`flex-grow transition-all duration-300 ${isOpen ? "ml-[275px]" : "ml-[55px]"}`}
      >
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/manage-venues"
            element={
              <AdminRoute>
                <ManageVenues />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/manage-organizers"
            element={
              <AdminRoute>
                <ManageOrganizers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add-events"
            element={
              <AdminRoute>
                <AddEvents />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NothingFoundBackground />} />
        </Routes>
      </main>
    </>
  );
}

function AppLayout() {
  const isAdminRoute = useIsAdminRoute();
  const { token } = useAuthToken();
  const { fetchWithAuth } = useFetch();
  const { setUserData } = useUser();
  const location = useLocation();
  const isEventDetailsPage = location.pathname === "/event-details";

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetchWithAuth(
            "https://www.ticketopia.store/api/user",
          );
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [token, fetchWithAuth, setUserData]);

  return (
    <div
      className={`flex flex-col min-h-screen ${isEventDetailsPage ? "pb-36 md:pb-0" : ""}`}
    >
      {isAdminRoute ? <AdminLayout /> : <UserLayout />}
    </div>
  );
}

function App() {
  return (
    <MantineProvider>
      <Router basename="/react">
        <Notifications /> 
        <CartProvider>
          <UserProvider>
            <AppLayout />
          </UserProvider>
        </CartProvider>
      </Router>
    </MantineProvider>
  );
}

export default App;
