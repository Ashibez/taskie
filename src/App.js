import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Board from './components/Board/Board';
import './styles/index.css';
import { BsKanban, BsListTask, BsCalendarCheck, BsClipboardCheck, BsGraphUp } from 'react-icons/bs';

function App() {
    const [currentBoard, setCurrentBoard] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const illustrations = [
        { icon: BsKanban, text: 'Organize' },
        { icon: BsListTask, text: 'Track' },
        { icon: BsCalendarCheck, text: 'Complete' },
        { icon: BsClipboardCheck, text: 'Plan' },
        { icon: BsGraphUp, text: 'Progress' }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % illustrations.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const handleBoardChange = (board) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentBoard(board);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 300);
    };

    return (
        <div className="app">
            <Navbar onBoardChange={handleBoardChange} />
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
