import React, { useState, useEffect, useRef } from 'react';
import { IconChevronDown, IconShoppingCart, IconLogout, IconHistory, IconSettings, IconSwitchHorizontal, IconTrash, IconSearch } from '@tabler/icons-react';
import cx from 'clsx';
import { Avatar, Burger, Container, Group, Menu, Tabs, Text, UnstyledButton, Autocomplete, useMantineTheme, Modal, Button, PasswordInput } from '@mantine/core';
import { notifications } from "@mantine/notifications";
import { useDisclosure } from '@mantine/hooks';
import { useCart } from '../Context/CartContext';
import { useUser } from '../Context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import classes from './Header.module.css';
import Cart from '../Components/Cart/Cart';

const tabs = [
  { label: 'Home', path: '/' },
  { label: 'Orders', path: '/orders' },
  { label: 'Education', path: '/education' },
  { label: 'Community', path: '/community' },
  { label: 'Forums', path: '/forums' },
];

const Header = () => {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // Modal state for confirmation
  const cartButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current URL path
  const [password, setPassword] = useState(''); // State to store password input
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const { cartItems, timer, isCartOpen, setIsCartOpen } = useCart();
  const { setUserData, userData } = useUser();

  const savedUserData = JSON.parse(localStorage.getItem('user_data'));
  const isLoggedIn = !!localStorage.getItem('auth_token');

  const defaultImage = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png';
  const user = savedUserData || userData || { name: 'Guest' };

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab.label} key={tab.label} onClick={() => navigate(tab.path)}>
      {tab.label}
    </Tabs.Tab>
  ));
  
  const activeTab = tabs.find(tab => tab.path === location.pathname)?.label || null;

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('https://ticketopia-backend-main-dc9cem.laravel.cloud/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Failed to logout: ${errorMessage.message}`);
      }

      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUserData(null);
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleDeleteAccount = () => {
    // Logic to delete account goes here (e.g., call API to delete user)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUserData(null);
    notifications.show({
      title: 'Account Deleted',
      message: 'Your account has been successfully deleted.',
      color: 'green', // Red color to indicate the action
    });
    setConfirmationModalOpen(false);
    setPassword('');
    navigate('/');
  };

  const handlePasswordChange = (event) => {
    const enteredPassword = event.target.value;
    setPassword(enteredPassword);
    // You can add validation here if needed
    setIsPasswordValid(enteredPassword.length > 7); // Enable button if password is entered
  };

  const handleOpenConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModalOpen(false);
  };

  useEffect(() => {
    if (userData) {
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between" align="center">
          <Text className={classes.websiteName} size="xl" fw={700} style={{ display: isMobile ? 'none' : 'block' }}>
            TickEtopia
          </Text>
          <Burger opened={opened} onClick={toggle} size="sm" className={classes.burgerMenuButton} />

          <div className={classes.userMenuWrapper}>
            {cartItems.length > 0 && (
              <div className="relative">
                <IconShoppingCart
                  size={24}
                  stroke={1.5}
                  className={classes.cartIcon}
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  ref={cartButtonRef}
                />
                <div className="absolute top-0 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full"
                  style={{ transform: 'translate(25%, -25%)' }}>
                  {cartItems.length}
                </div>
                <div className="absolute top-0 right-16 text-sm font-bold text-gray-600 bg-white px-2 py-1 rounded shadow-md"
                  style={{ transform: 'translate(50%, 0)' }}>
                  {formatTime(timer)}
                </div>
              </div>
            )}
            <Menu
              width={260}
              position="bottom-end"
              transitionProps={{ transition: 'pop-top-right' }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
            >
              <Menu.Target>
                <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                  <Group gap={7}>
                    <Avatar src={defaultImage} alt={user.name} radius="xl" size={20} />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      {user.name}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                {isLoggedIn ? (
                  <>
                    <Menu.Item leftSection={<IconHistory size={16} color={theme.colors.blue[6]} stroke={1.5} />}>
                      Purchase History
                    </Menu.Item>
                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />} onClick={() => navigate('/profile')}>
                      Account settings
                    </Menu.Item>
                    <Menu.Item leftSection={<IconSwitchHorizontal size={16} stroke={1.5} />}>
                      Change account
                    </Menu.Item>
                    <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />} onClick={handleLogout}>
                      Logout
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item color="red" leftSection={<IconTrash size={16} stroke={1.5} />} onClick={handleOpenConfirmationModal}>
                      Delete account
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Item onClick={() => navigate('/auth')}>Login</Menu.Item>
                    <Menu.Item onClick={() => navigate('/register')}>Register</Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          </div>
        </Group>
      </Container>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        title="Confirm Account Deletion"
      >
        <Text size="sm">
          Are you sure you want to delete your account? This action cannot be undone.
        </Text>
        
        {/* Password input field */}
        <PasswordInput
          label="Enter your password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          style={{ marginTop: 20 }}
        />
        
        <Group position="apart" style={{ marginTop: 20 }}>
          <Button variant="outline" onClick={handleCloseConfirmationModal}>
            Cancel
          </Button>
          
          {/* Disable Delete Account button if no password is entered */}
          <Button 
            color="red" 
            onClick={handleDeleteAccount} 
            disabled={!isPasswordValid}
          >
            Delete Account
          </Button>
        </Group>
      </Modal>

      <Container size="md" className={classes.tabsAndSearch}>
        {!isMobile && (
          <Tabs value={activeTab} variant="outline" classNames={{ root: classes.tabs, list: classes.tabsList, tab: classes.tab }}>
            <Tabs.List>
              {tabs.map((tab) => (
                <Tabs.Tab value={tab.label} key={tab.label} onClick={() => navigate(tab.path)}>
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        )}

        {!isMobile && (
          <Autocomplete
            className={classes.search}
            placeholder="Search"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
          />
        )}

        {opened && isMobile && (
          <div className={classes.mobileMenu}>
            <Tabs value={activeTab} variant="outline" classNames={{ root: classes.tabs, list: classes.tabsList, tab: classes.tab }}>
              <Tabs.List>{items}</Tabs.List>
            </Tabs>
            <Autocomplete
              className={classes.search}
              placeholder="Search"
              leftSection={<IconSearch size={16} stroke={1.5} />}
              data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
            />
          </div>
        )}
      </Container>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartButtonRef={cartButtonRef} />
    </div>
  );
};

export default Header;
