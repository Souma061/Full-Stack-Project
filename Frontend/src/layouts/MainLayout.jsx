import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContextUtils';

// Icons
import { FaRegBell, FaYoutube } from "react-icons/fa";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoMicSharp, IoSearchOutline } from "react-icons/io5";
import { MdHistory, MdHomeFilled, MdOutlineSubscriptions, MdOutlineVideoLibrary, MdOutlineWatchLater, MdThumbUp } from "react-icons/md";
import { RiVideoAddLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { SiYoutubeshorts } from "react-icons/si";

// Helper Component for Sidebar Items
const SidebarItem = ({ icon: Icon, text, to, isActive, isSidebarOpen }) => (
  <Link
    to={to || "#"}
    className={`flex items-center gap-5 px-3 py-2 rounded-lg hover:bg-[#272727] transition-colors ${isActive ? 'bg-[#272727] font-medium' : ''} ${!isSidebarOpen ? 'justify-center' : ''}`}
    title={!isSidebarOpen ? text : ""}
  >
    {Icon && <Icon className="text-2xl min-w-6" />}
    <span className={`text-sm truncate ${isSidebarOpen ? '' : 'hidden'}`}>{text}</span>
  </Link>
);

function MainLayout() {
  const { user, Logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const profileRef = useRef(null);

  const handleLogout = () => {
    Logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If profile is open AND click is NOT inside the profile component
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white overflow-hidden">

      {/*
        --- HEADER ---
        Using Grid to ensure 3 distinct sections that don't overlap or crush each other.
        - Left: Logo & Menu
        - Center: Search
        - Right: Profile & Actions
      */}
      <header className="h-14 fixed top-0 inset-x-0 bg-[#0f0f0f] z-50 grid grid-cols-[auto_1fr_auto] items-center px-4 gap-4 box-border">

        {/* Left Section: Menu & Logo */}
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="p-2 hover:bg-[#272727] rounded-full">
            <RxHamburgerMenu className="text-xl" />
          </button>
          <Link to="/" className="flex items-center gap-1">
            <FaYoutube className="text-3xl text-red-600" />
            <span className="text-xl font-bold tracking-tighter alternate-gothic relative bottom-px">YouTube</span>
          </Link>
        </div>

        {/* Center Section: Search Bar */}
        {/* We use 'max-w-2xl' to limit width on large screens, and 'justify-self-center' to keep it in the middle */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center gap-4 w-full max-w-180 justify-self-center">
          <div className="flex flex-1 items-center bg-[#121212] border border-[#303030] rounded-full overflow-hidden shadow-inner ml-8">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white px-4 py-2 focus:outline-none placeholder-gray-500"
              aria-label="Search videos"
            />
            <button
              type="submit"
              className="bg-[#222222] border-l border-[#303030] px-5 py-2 hover:bg-[#303030] transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Search"
            >
              <IoSearchOutline className="text-xl" />
            </button>
          </div>
          <button
            type="button"
            className="p-2.5 bg-[#181818] hover:bg-[#303030] rounded-full transition-colors shrink-0"
            aria-label="Search with voice"
          >
            <IoMicSharp className="text-xl" />
          </button>
        </form>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 justify-end min-w-56 sm:min-w-0">
          {/* Action Buttons (Hidden on very small screens if needed) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-2 hover:bg-[#272727] rounded-full transition-colors">
              <RiVideoAddLine className="text-xl" />
            </button>
            <button className="p-2 hover:bg-[#272727] rounded-full transition-colors">
              <FaRegBell className="text-xl" />
            </button>
          </div>

          {/* Profile / Sign In */}
          <div className="ml-2 pl-2">
            {user ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  aria-label="Profile menu"
                  aria-expanded={isProfileOpen}
                >
                  {/* Avatar rendering with Fallback */}
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName || 'User Avatar'}
                      className="w-8 h-8 rounded-full object-cover bg-gray-700 select-none"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName || "User") + "&background=random";
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold select-none text-white">
                      {(user.fullName?.[0] || user.username?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-72 bg-[#282828] border border-[#3e3e3e] rounded-xl shadow-2xl p-4 z-60 cursor-default" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-start gap-3 border-b border-[#3e3e3e] pb-3 mb-2">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.fullName || 'Profile'} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-lg font-bold">
                          {(user.fullName?.[0] || user.username?.[0] || "U").toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <p className="font-semibold truncate text-base">{user.fullName}</p>
                        <p className="text-sm text-gray-400 truncate">@{user.username}</p>
                        <Link to="/channel" className="text-blue-400 text-sm mt-1 block hover:underline" onClick={() => setIsProfileOpen(false)}>View your channel</Link>
                      </div>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-[#3e3e3e] rounded-lg transition-colors flex items-center gap-3 text-sm"
                    >
                      <span className="material-symbols-outlined">logout</span> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 border border-[#303030] rounded-full px-3 py-1.5 text-blue-400 hover:bg-[#263850] hover:border-[#263850] transition-colors whitespace-nowrap">
                <HiOutlineUserCircle className="text-2xl" />
                <span className="font-medium text-sm">Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* --- CONTENT LAYOUT --- */}
      <div className="flex flex-1 pt-14 h-full overflow-hidden">

        {/* Sidebar */}
        <aside
          className={`shrink-0 bg-[#0f0f0f] h-full overflow-y-auto custom-scrollbar flex flex-col p-2 transition-all duration-200
          ${isSidebarOpen ? 'w-60' : 'w-18 items-center'}`}
        >
          {/* Main Links */}
          <div className="flex flex-col border-b border-[#303030] pb-2 mb-2 w-full">
            <SidebarItem icon={MdHomeFilled} text="Home" to="/" isActive={location.pathname === '/'} isSidebarOpen={isSidebarOpen} />
            <SidebarItem icon={SiYoutubeshorts} text="Shorts" to="/shorts" isActive={location.pathname === '/shorts'} isSidebarOpen={isSidebarOpen} />
            <SidebarItem icon={MdOutlineSubscriptions} text="Subscriptions" to="/subscriptions" isActive={location.pathname === '/subscriptions'} isSidebarOpen={isSidebarOpen} />
          </div>

          {/* Library Links */}
          <div className="flex flex-col border-b border-[#303030] pb-2 mb-2 w-full">
            {isSidebarOpen && (
              <div className="px-3 py-2 font-bold text-lg flex items-center gap-2">
                <span>You</span> <span className="text-xl">›</span>
              </div>
            )}
            {!isSidebarOpen && <div className="h-4"></div>} {/* Spacer for collapsed mode */}

            <SidebarItem icon={MdHistory} text="History" to="/history" isActive={location.pathname === '/history'} isSidebarOpen={isSidebarOpen} />
            <SidebarItem icon={MdOutlineVideoLibrary} text="Your videos" to="/my-videos" isActive={location.pathname === '/my-videos'} isSidebarOpen={isSidebarOpen} />
            <SidebarItem icon={MdOutlineWatchLater} text="Watch Later" to="/watch-later" isActive={location.pathname === '/watch-later'} isSidebarOpen={isSidebarOpen} />
            <SidebarItem icon={MdThumbUp} text="Liked videos" to="/liked-videos" isActive={location.pathname === '/liked-videos'} isSidebarOpen={isSidebarOpen} />
          </div>

          {/* Sign in Prompt */}
          {!user && isSidebarOpen && (
            <div className="px-4 py-4 border-b border-[#303030]">
              <p className="text-sm mb-3">Sign in to like videos, comment, and subscribe.</p>
              <Link to="/login" className="inline-flex items-center gap-2 border border-[#303030] rounded-full px-3 py-1.5 text-blue-400 hover:bg-[#263850]">
                <HiOutlineUserCircle className="text-2xl" />
                <span className="font-medium text-sm">Sign in</span>
              </Link>
            </div>
          )}

          {isSidebarOpen && (
            <div className="px-4 py-4 text-[12px] text-[#aaaaaa] font-medium">
              <div className="flex flex-wrap gap-2 mb-2">
                {['About', 'Press', 'Copyright', 'Contact us', 'Creators', 'Advertise', 'Developers'].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <p className="text-[#717171] mt-2">© 2025 Google LLC</p>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto bg-[#0f0f0f] relative scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
