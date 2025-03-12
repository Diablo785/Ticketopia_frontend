import React, { useState } from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { Button, Group, PasswordInput, Progress, Text, Box, Center } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useInputState } from "@mantine/hooks";

// Password requirement component
function PasswordRequirement({ meets, label }) {
  return (
    <Text component="div" c={meets ? "teal" : "red"} mt={5} size="sm">
      <Center inline>
        {meets ? <IconCheck size={14} stroke={1.5} /> : <IconX size={14} stroke={1.5} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

// Password strength requirements
const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

// Function to calculate password strength
function getStrength(password) {
  let multiplier = password.length > 7 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

const ProfilePage = () => {
  const { userData } = useUser();
  const navigate = useNavigate();

  const savedUserData = JSON.parse(localStorage.getItem("user_data"));
  const user = savedUserData || userData;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordValue, setPasswordValue] = useInputState("");

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const strength = getStrength(passwordValue);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(passwordValue)} />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: "0ms" } }}
        value={passwordValue.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0}
        color={strength > 80 ? "teal" : strength > 50 ? "yellow" : "red"}
        key={index}
        size={4}
      />
    ));

  if (!user) {
    return <div className="text-gray-400 text-center mt-10">Loading...</div>;
  }

  // Validate form input
  const validateForm = () => {
    let isValid = true;
    let validationErrors = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };

    if (!currentPassword) {
      validationErrors.currentPassword = "Current password is required!";
      isValid = false;
    }

    if (!passwordValue) {
      validationErrors.newPassword = "New password is required!";
      isValid = false;
    } else if (passwordValue.length < 8) {
      validationErrors.newPassword = "New password must be at least 8 characters!";
      isValid = false;
    }

    if (passwordValue !== confirmNewPassword) {
      validationErrors.confirmNewPassword = "New passwords do not match!";
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  const handleChangePassword = () => {
    if (!validateForm()) {
      return;
    }

    notifications.show({
      title: "Success",
      message: "Password changed successfully!",
      color: "green",
    });

    setIsModalOpen(false);
    setCurrentPassword("");
    setPasswordValue("");
    setConfirmNewPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#242424] p-6">
      <div className="w-full max-w-lg bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-6 border border-gray-700">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Profile</h1>

        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white">
            <img
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold text-white">{user.name || "Guest"}</h2>
          <p className="text-gray-300">{user.email || "No email provided"}</p>
        </div>

        <div className="border-t border-gray-600 pt-4">
          <div className="mb-4">
            <label className="font-semibold text-gray-400">Email:</label>
            <p className="text-gray-300">{user.email || "No email"}</p>
          </div>
          <div className="mb-4">
            <label className="font-semibold text-gray-400">Joined On:</label>
            <p className="text-gray-300">
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-2 px-4 rounded-lg text-white font-semibold shadow-md"
        >
          Change Password
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#3a3a3a] p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white text-center">Change Password</h2>

            <div className="mb-4">
              <label className="block text-gray-300">Current Password</label>
              <PasswordInput
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                error={errors.currentPassword}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">New Password</label>
              <PasswordInput
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder="Enter your new password"
                error={errors.newPassword}
              />
              <Group gap={5} grow mt="xs" mb="md">
                {bars}
              </Group>
              <PasswordRequirement label="Has at least 8 characters" meets={passwordValue.length > 7} />
              {checks}
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">Confirm New Password</label>
              <PasswordInput
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm your new password"
                error={errors.confirmNewPassword}
              />
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setIsModalOpen(false)} color="#2e2e2e">
                Cancel
              </Button>
              <Button onClick={handleChangePassword} color="blue">
                Change Password
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
