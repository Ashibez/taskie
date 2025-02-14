import React, { useState, useRef, useEffect } from 'react';
import '../../styles/Navbar.css';
import { ClipLoader, PulseLoader, BeatLoader } from 'react-spinners';
import Lottie from 'lottie-react';
import templateAnimation from '../../assets/template-animation.json';
import TemplateAnimation from '../TemplateAnimation';

function Navbar({ 
    onBoardChange, 
    boards, 
    setBoards, 
    recentBoards, 
    setRecentBoards,
    canCreateBoard 
}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showBoardModal, setShowBoardModal] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [selectedBackground, setSelectedBackground] = useState('');
    const [visibility, setVisibility] = useState('private');
    const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showRecentDropdown, setShowRecentDropdown] = useState(false);
    const [showWorkspacesDropdown, setShowWorkspacesDropdown] = useState(false);
    const recentDropdownRef = useRef(null);
    const workspacesDropdownRef = useRef(null);
    const [showStarredDropdown, setShowStarredDropdown] = useState(false);
    const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
    const starredDropdownRef = useRef(null);
    const templatesDropdownRef = useRef(null);
    const [showTemplatesList, setShowTemplatesList] = useState(false);

    const backgroundColors = [
        '#0079bf', '#d29034', '#519839', '#b04632',
        '#89609e', '#cd5a91', '#4bbf6b', '#00aecc'
    ];

    const backgroundImages = [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=2076&auto=format&fit=crop',
        // Add more background images
    ];

    const visibilityOptions = {
        private: {
            icon: '🔒',
            title: 'Private',
            description: 'Only board members can see and edit this board'
        },
        public: {
            icon: '🌍',
            title: 'Public',
            description: 'Anyone on the internet can see this board'
        }
    };

    const templateSuggestions = [
        {
            id: 'template-1',
            title: 'Project Management',
            description: 'Track tasks, deadlines, and team progress',
            icon: '💼',
            background: '#0079bf',
            lists: ['Backlog', 'To Do', 'In Progress', 'Done']
        },
        {
            id: 'template-2',
            title: 'Weekly Planner',
            description: 'Organize your week with daily tasks',
            icon: '📅',
            background: '#519839',
            lists: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        {
            id: 'template-3',
            title: 'Team Goals',
            description: 'Set and track team objectives',
            icon: '🎯',
            background: '#b04632',
            lists: ['Q1 Goals', 'Q2 Goals', 'Q3 Goals', 'Q4 Goals']
        }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (recentDropdownRef.current && !recentDropdownRef.current.contains(event.target)) {
                setShowRecentDropdown(false);
            }
            if (workspacesDropdownRef.current && !workspacesDropdownRef.current.contains(event.target)) {
                setShowWorkspacesDropdown(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (starredDropdownRef.current && !starredDropdownRef.current.contains(event.target)) {
                setShowStarredDropdown(false);
            }
            if (templatesDropdownRef.current && !templatesDropdownRef.current.contains(event.target)) {
                setShowTemplatesDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const savedBoards = localStorage.getItem('boards');
        const savedRecentBoards = localStorage.getItem('recentBoards');
        
        if (savedBoards) {
            setBoards(JSON.parse(savedBoards));
        }
        if (savedRecentBoards) {
            setRecentBoards(JSON.parse(savedRecentBoards));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('boards', JSON.stringify(boards));
    }, [boards]);

    useEffect(() => {
        localStorage.setItem('recentBoards', JSON.stringify(recentBoards));
    }, [recentBoards]);

    const handleCreateBoard = () => {
        if (!canCreateBoard()) {
            // Maybe show a message about board limit
            return;
        }
        
        if (newBoardTitle.trim()) {
            setIsLoading(true);
            
            const timestamp = Date.now();
            const defaultLists = [
                { 
                    id: `list-${timestamp}-1`, 
                    title: 'To Do', 
                    cards: []
                },
                { 
                    id: `list-${timestamp}-2`, 
                    title: 'In Progress', 
                    cards: []
                },
                { 
                    id: `list-${timestamp}-3`, 
                    title: 'Done', 
                    cards: []
                }
            ];

            const newBoard = {
                id: `board-${timestamp}`,
                title: newBoardTitle,
                backgroundColor: selectedBackground.startsWith('#') ? selectedBackground : undefined,
                backgroundImage: selectedBackground.startsWith('http') ? selectedBackground : undefined,
                visibility: visibility,
                lists: defaultLists,
                createdAt: new Date().toISOString(),
                lastAccessed: new Date().toISOString()
            };

            setTimeout(() => {
                // Add to boards list
                setBoards(prevBoards => [...prevBoards, newBoard]);
                
                // Add to recent boards and switch to new board
                handleBoardSelect(newBoard);
                
                // Reset form and close modals
                setNewBoardTitle('');
                setShowBoardModal(false);
                setShowDropdown(false);
                setIsLoading(false);
            }, 1500);
        }
    };

    const handleBoardSelect = (board) => {
        setRecentBoards(prevBoards => {
            const filteredBoards = prevBoards.filter(b => b.id !== board.id);
            const updatedBoards = [board, ...filteredBoards];
            return updatedBoards.slice(0, 5);
        });
        
        onBoardChange(board);
    };

    const handleTemplateSelect = (template) => {
        const timestamp = Date.now();
        const newBoard = {
            id: `board-${timestamp}`,
            title: template.title,
            backgroundColor: template.background,
            lists: template.lists.map((title, index) => ({
                id: `list-${timestamp}-${index}`,
                title,
                cards: []
            })),
            createdAt: new Date().toISOString(),
            lastAccessed: new Date().toISOString()
        };
        
        // Update boards state
        setBoards(prevBoards => [...prevBoards, newBoard]);
        
        // Update recent boards and switch to new board
        handleBoardSelect(newBoard);
        
        // Close both the templates list modal and the dropdown
        setShowTemplatesList(false);
        setShowTemplatesDropdown(false);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <div className="navbar-logo">
                        <h1 onClick={() => onBoardChange(null)}>Taskie</h1>
                    </div>
                    <div className="navbar-menu">
                        <div className="nav-dropdown" ref={workspacesDropdownRef}>
                            <button 
                                className={`nav-button ${showWorkspacesDropdown ? 'active' : ''}`}
                                onClick={() => setShowWorkspacesDropdown(!showWorkspacesDropdown)}
                            >
                                Workspaces <span className="arrow-down">▼</span>
                            </button>
                            {showWorkspacesDropdown && (
                                <div className="nav-dropdown-menu">
                                    <div className="dropdown-section">
                                        <h3>Your Workspaces</h3>
                                        <button className="workspace-item">
                                            <span className="workspace-icon">👤</span>
                                            <div className="workspace-info">
                                                <div className="workspace-name">Personal</div>
                                                <div className="workspace-type">Free Workspace</div>
                                            </div>
                                        </button>
                                        <button className="workspace-item">
                                            <span className="workspace-icon">💼</span>
                                            <div className="workspace-info">
                                                <div className="workspace-name">Work Projects</div>
                                                <div className="workspace-type">Team Workspace</div>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="dropdown-footer">
                                        <button className="create-workspace-btn">
                                            <span>➕</span> Create Workspace
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="nav-dropdown" ref={recentDropdownRef}>
                            <button 
                                className={`nav-button ${showRecentDropdown ? 'active' : ''}`}
                                onClick={() => setShowRecentDropdown(!showRecentDropdown)}
                            >
                                Recent <span className="arrow-down">▼</span>
                            </button>
                            {showRecentDropdown && (
                                <div className="nav-dropdown-menu">
                                    <div className="dropdown-section">
                                        <div className="dropdown-header">
                                            <span className="header-icon">🕒</span>
                                            <h3>Recent Boards</h3>
                                        </div>
                                        {recentBoards.length > 0 ? (
                                            recentBoards.map(board => (
                                                <button 
                                                    key={board.id} 
                                                    className="recent-board-item"
                                                    onClick={() => handleBoardSelect(board)}
                                                >
                                                    <div 
                                                        className="board-preview-icon"
                                                        style={{
                                                            backgroundColor: board.backgroundColor,
                                                            backgroundImage: board.backgroundImage ? `url(${board.backgroundImage})` : undefined
                                                        }}
                                                    ></div>
                                                    <div className="board-info">
                                                        <div className="board-name">{board.title}</div>
                                                        <div className="board-workspace">Personal</div>
                                                    </div>
                                                    <span className="board-timestamp">
                                                        {new Date(board.lastAccessed || board.createdAt).toLocaleDateString()}
                                                    </span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="no-items">No recent boards</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="nav-dropdown" ref={starredDropdownRef}>
                            <button 
                                className={`nav-button ${showStarredDropdown ? 'active' : ''}`}
                                onClick={() => setShowStarredDropdown(!showStarredDropdown)}
                            >
                                Starred <span className="arrow-down">▼</span>
                            </button>
                            {showStarredDropdown && (
                                <div className="nav-dropdown-menu">
                                    <div className="dropdown-section">
                                        <div className="dropdown-header">
                                            <span className="header-icon">⭐</span>
                                            <h3>Starred Boards</h3>
                                        </div>
                                        <div className="dropdown-description">
                                            Star important boards to access them easily and quickly
                                        </div>
                                        {boards.filter(board => board.starred).length > 0 ? (
                                            boards.filter(board => board.starred).map(board => (
                                                <button 
                                                    key={board.id} 
                                                    className="starred-board-item"
                                                    onClick={() => onBoardChange(board)}
                                                >
                                                    <div 
                                                        className="board-preview-icon"
                                                        style={{
                                                            backgroundColor: board.backgroundColor,
                                                            backgroundImage: board.backgroundImage ? `url(${board.backgroundImage})` : undefined
                                                        }}
                                                    ></div>
                                                    <div className="board-info">
                                                        <div className="board-name">{board.title}</div>
                                                        <div className="board-workspace">Personal</div>
                                                    </div>
                                                    <span className="star-icon">⭐</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="no-items">No starred boards yet</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="nav-dropdown" ref={templatesDropdownRef}>
                            <button 
                                className={`nav-button ${showTemplatesDropdown ? 'active' : ''}`}
                                onClick={() => setShowTemplatesDropdown(!showTemplatesDropdown)}
                            >
                                Templates <span className="arrow-down">▼</span>
                            </button>
                            {showTemplatesDropdown && (
                                <div className="nav-dropdown-menu templates-menu">
                                    <div className="dropdown-section">
                                        <div className="dropdown-header">
                                            <span className="header-icon">📋</span>
                                            <h3>Template Suggestions</h3>
                                        </div>
                                        <div className="template-grid">
                                            {templateSuggestions.map(template => (
                                                <button 
                                                    key={template.id}
                                                    className="template-card"
                                                    onClick={() => handleTemplateSelect(template)}
                                                    style={{ backgroundColor: template.background }}
                                                >
                                                    <div className="template-card-content">
                                                        <span className="template-icon">{template.icon}</span>
                                                        <div className="template-info">
                                                            <div className="template-title">{template.title}</div>
                                                            <div className="template-description">{template.description}</div>
                                                        </div>
                                                    </div>
                                                    <div className="template-preview">
                                                        {template.lists.slice(0, 3).map((list, index) => (
                                                            <div key={index} className="preview-list">
                                                                <div className="preview-list-title">{list}</div>
                                                                <div className="preview-card"></div>
                                                                <div className="preview-card"></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="navbar-right">
                    <div className="create-dropdown" ref={dropdownRef}>
                        <button 
                            className={`nav-button create-button ${showDropdown ? 'active' : ''}`}
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            Create <span className="arrow-down">▼</span>
                        </button>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <div 
                                    className="dropdown-item"
                                    onClick={() => setShowBoardModal(true)}
                                >
                                    <div className="dropdown-item-title">Create board</div>
                                    <div className="dropdown-item-description">
                                        A board is made up of cards ordered on lists. Use it to manage projects, track information, or organize anything.
                                    </div>
                                </div>
                                <div 
                                    className="dropdown-item template-item"
                                    onClick={() => {
                                        setShowTemplatesList(true);
                                        setShowDropdown(false);
                                    }}
                                >
                                    <div>
                                        <div className="dropdown-item-title">Start with a template</div>
                                        <div className="dropdown-item-description">
                                            Get started faster with a board template
                                        </div>
                                    </div>
                                    <div className="template-animation">
                                        <TemplateAnimation />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="nav-profile">
                        <span 
                            className="profile-avatar"
                            onClick={() => setShowProfileModal(true)}
                        >
                            EA
                        </span>
                    </div>
                </div>
            </nav>

            {showBoardModal && (
                <div className="modal-overlay" onClick={() => setShowBoardModal(false)}>
                    <div className="create-board-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create board</h3>
                            <button onClick={() => setShowBoardModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div 
                                className="board-preview"
                                style={{
                                    backgroundColor: selectedBackground.startsWith('#') ? selectedBackground : undefined,
                                    backgroundImage: selectedBackground.startsWith('http') ? `url(${selectedBackground})` : undefined
                                }}
                            >
                                {newBoardTitle || 'Add board title'}
                            </div>

                            <div className="background-picker">
                                <h4>Background</h4>
                                <div className="background-options">
                                    <div className="color-options">
                                        {backgroundColors.map(color => (
                                            <button
                                                key={color}
                                                className={`color-option ${selectedBackground === color ? 'selected' : ''}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setSelectedBackground(color)}
                                            />
                                        ))}
                                    </div>
                                    <div className="image-options">
                                        {backgroundImages.map(image => (
                                            <button
                                                key={image}
                                                className={`image-option ${selectedBackground === image ? 'selected' : ''}`}
                                                style={{ backgroundImage: `url(${image})` }}
                                                onClick={() => setSelectedBackground(image)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="board-title-input">
                                <label>Board title</label>
                                <input
                                    type="text"
                                    placeholder="Enter board title"
                                    value={newBoardTitle}
                                    onChange={(e) => setNewBoardTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="visibility-picker">
                                <label>Visibility</label>
                                <div className="visibility-dropdown">
                                    <button 
                                        className="visibility-toggle"
                                        onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
                                    >
                                        <span className="icon">{visibilityOptions[visibility].icon}</span>
                                        <div className="selected-visibility">
                                            {visibilityOptions[visibility].title}
                                        </div>
                                        <span className="arrow-down">▼</span>
                                    </button>
                                    
                                    {showVisibilityDropdown && (
                                        <div className="visibility-dropdown-menu">
                                            {Object.entries(visibilityOptions).map(([key, option]) => (
                                                <button
                                                    key={key}
                                                    className={`visibility-option ${visibility === key ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setVisibility(key);
                                                        setShowVisibilityDropdown(false);
                                                    }}
                                                >
                                                    <span className="icon">{option.icon}</span>
                                                    <div className="option-text">
                                                        <div>{option.title}</div>
                                                        <div className="option-description">
                                                            {option.description}
                                                        </div>
                                                    </div>
                                                    {visibility === key && (
                                                        <span className="check">✓</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button 
                                className="create-board-button"
                                onClick={handleCreateBoard}
                                disabled={!newBoardTitle.trim() || !selectedBackground || isLoading}
                            >
                                {isLoading ? (
                                    <BeatLoader size={8} color="#ffffff" margin={2} />
                                ) : (
                                    'Create'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showProfileModal && (
                <div className="profile-modal-overlay" onClick={() => setShowProfileModal(false)}>
                    <div 
                        className="profile-modal" 
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="profile-modal-header">
                            <h3>Profile</h3>
                            <button onClick={() => setShowProfileModal(false)}>×</button>
                        </div>
                        <div className="profile-modal-content">
                            <div className="profile-info">
                                <div className="profile-avatar-large">EA</div>
                                <div className="profile-details">
                                    <h4>Emmanuel Ashibekong</h4>
                                    <p>ashibezeema20@gmail.com</p>
                                </div>
                            </div>
                            <div className="profile-section">
                                <h5>Account Settings</h5>
                                <button className="profile-menu-item">
                                    <span>⚙️</span> Change Password
                                </button>
                                <button className="profile-menu-item">
                                    <span>🌓</span> Theme Preferences
                                </button>
                                <button className="profile-menu-item">
                                    <span>🔕</span> Notification Settings
                                </button>
                            </div>
                            <div className="profile-section">
                                <h5>Workspace</h5>
                                <button className="profile-menu-item">
                                    <span>👤</span> Manage Teams
                                </button>
                                <button className="profile-menu-item">
                                    <span>📈</span> Activity Log
                                </button>
                            </div>
                            <button className="sign-out-button">
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showTemplatesList && (
                <div className="modal-overlay" onClick={() => setShowTemplatesList(false)}>
                    <div className="templates-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Start with a template</h3>
                            <button onClick={() => setShowTemplatesList(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="templates-grid">
                                {templateSuggestions.map(template => (
                                    <button 
                                        key={template.id}
                                        className="template-card"
                                        onClick={() => handleTemplateSelect(template)}
                                        style={{ backgroundColor: template.background }}
                                    >
                                        <div className="template-card-content">
                                            <span className="template-icon">{template.icon}</span>
                                            <div className="template-info">
                                                <div className="template-title">{template.title}</div>
                                                <div className="template-description">{template.description}</div>
                                            </div>
                                        </div>
                                        <div className="template-preview">
                                            {template.lists.slice(0, 3).map((list, index) => (
                                                <div key={index} className="preview-list">
                                                    <div className="preview-list-title">{list}</div>
                                                    <div className="preview-card"></div>
                                                    <div className="preview-card"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
