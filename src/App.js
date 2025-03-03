import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Board from './components/Board/Board';
import './styles/index.css';
import { BsKanban, BsListTask, BsCalendarCheck, BsClipboardCheck, BsGraphUp } from 'react-icons/bs';

function App() {
    const [currentBoard, setCurrentBoard] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [boards, setBoards] = useState([]);
    const [recentBoards, setRecentBoards] = useState([]);

    const APP_NAME = process.env.REACT_APP_NAME;
    const STORAGE_KEY = process.env.REACT_APP_STORAGE_KEY;
    const AUTO_SAVE_INTERVAL = parseInt(process.env.REACT_APP_AUTO_SAVE_INTERVAL || '30000');
    const MAX_BOARDS = process.env.REACT_APP_MAX_BOARDS;

    const illustrations = [
        { icon: BsKanban, text: 'Organize' },
        { icon: BsListTask, text: 'Track' },
        { icon: BsCalendarCheck, text: 'Complete' },
        { icon: BsClipboardCheck, text: 'Plan' },
        { icon: BsGraphUp, text: 'Progress' }
    ];

    // Load saved data
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (parsedData.boards) setBoards(parsedData.boards);
                if (parsedData.recentBoards) setRecentBoards(parsedData.recentBoards);
            } catch (error) {
                console.error('Error parsing saved data:', error);
            }
        }
    }, [STORAGE_KEY]);

    // Carousel effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % illustrations.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [illustrations.length]);

    // Auto-save data
    useEffect(() => {
        const interval = setInterval(() => {
            const data = {
                boards,
                recentBoards
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }, AUTO_SAVE_INTERVAL);

        return () => clearInterval(interval);
    }, [boards, recentBoards, STORAGE_KEY, AUTO_SAVE_INTERVAL]);

    const handleBoardChange = (board) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentBoard(board);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 300);
    };

    const canCreateBoard = () => {
        if (MAX_BOARDS === 'unlimited') return true;
        return boards.length < parseInt(MAX_BOARDS || '10');
    };

    return (
        <div className="app">
            <Navbar 
                onBoardChange={handleBoardChange}
                boards={boards}
                setBoards={setBoards}
                recentBoards={recentBoards}
                setRecentBoards={setRecentBoards}
                canCreateBoard={canCreateBoard}
            />
            <div className={`app-container ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
                {currentBoard ? (
                    <Board boardData={currentBoard} />
                ) : (
                    <div className="welcome-page">
                        <div className="welcome-content">
                            <div className="carousel">
                                {illustrations.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div 
                                            key={item.text}
                                            className={`carousel-item ${
                                                index === currentSlide ? 'active' : 
                                                index === (currentSlide - 1 + illustrations.length) % illustrations.length ? 'prev' :
                                                index === (currentSlide + 1) % illustrations.length ? 'next' : ''
                                            }`}
                                        >
                                            <Icon />
                                            <span>{item.text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <h1>
                                <span className="welcome-text">Welcome to </span>
                                <span className="taskie-text">Taskie</span>
                            </h1>
                            <p>Create boards to organize your work and get more done</p>
                            <button 
                                className="welcome-create-button"
                                onClick={() => document.querySelector('.create-button').click()}
                            >
                                Create your first board
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
