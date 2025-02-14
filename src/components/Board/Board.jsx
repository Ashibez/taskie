import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import List from '../List/List';
import '../../styles/Board.css';

function Board({ boardData }) {
    // Add key to track board changes
    const [boardKey, setBoardKey] = useState(Date.now());
    
    // Reset lists when boardData changes
    useEffect(() => {
        setBoardKey(Date.now());
        // Initialize lists from boardData or create default lists
        if (boardData?.lists) {
            setLists(boardData.lists.map(list => ({
                ...list,
                id: list.id || `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                cards: list.cards || []
            })));
        } else {
            const timestamp = Date.now();
            setLists([
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
            ]);
        }
    }, [boardData]);

    // Initialize lists state
    const [lists, setLists] = useState([]);

    const handleDragEnd = (result) => {
        const { destination, source, type } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && 
            destination.index === source.index) {
            return;
        }

        // Moving lists
        if (type === 'list') {
            const newLists = Array.from(lists);
            const [removed] = newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, removed);
            setLists(newLists);
            return;
        }

        // Moving cards
        const sourceList = lists.find(list => list.id === source.droppableId);
        const destList = lists.find(list => list.id === destination.droppableId);

        if (!sourceList || !destList) return;

        // Moving within same list
        if (sourceList.id === destList.id) {
            const newCards = Array.from(sourceList.cards);
            const [removed] = newCards.splice(source.index, 1);
            newCards.splice(destination.index, 0, removed);

            const newLists = lists.map(list => 
                list.id === sourceList.id 
                    ? { ...list, cards: newCards }
                    : list
            );

            setLists(newLists);
            return;
        }

        // Moving between lists
        const sourceCards = Array.from(sourceList.cards);
        const [removed] = sourceCards.splice(source.index, 1);
        const destCards = Array.from(destList.cards);
        destCards.splice(destination.index, 0, removed);

        const newLists = lists.map(list => {
            if (list.id === sourceList.id) {
                return { ...list, cards: sourceCards };
            }
            if (list.id === destList.id) {
                return { ...list, cards: destCards };
            }
            return list;
        });

        setLists(newLists);
    };

    const addList = () => {
        const newListId = `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newList = {
            id: newListId,
            title: 'New List',
            cards: []
        };
        setLists([...lists, newList]);
    };

    const deleteList = (listId) => {
        setLists(lists.filter((list) => list.id !== listId));
    };

    const addCard = (listId, cardTitle) => {
        const newCard = {
            id: `card-${Date.now()}`,
            title: cardTitle,
            description: ''
        };

        setLists(
            lists.map((list) => {
                if (list.id === listId) {
                    return {
                        ...list,
                        cards: [...list.cards, newCard]
                    };
                }
                return list;
            })
        );
    };

    const deleteCard = (listId, cardId) => {
        setLists(
            lists.map((list) => {
                if (list.id === listId) {
                    return {
                        ...list,
                        cards: list.cards.filter((card) => card.id !== cardId)
                    };
                }
                return list;
            })
        );
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div 
                key={boardKey}
                className="board"
                style={{
                    ...(boardData?.backgroundImage 
                        ? {
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${boardData.backgroundImage})`
                        } 
                        : {}),
                    ...(boardData?.backgroundColor 
                        ? {
                            backgroundColor: boardData.backgroundColor,
                            backgroundImage: 'none'
                        } 
                        : {})
                }}
            >
                <div className="board-header">
                    <h2>{boardData?.title || 'My Board'}</h2>
                </div>
                <Droppable droppableId="board" direction="horizontal" type="list">
                    {(provided) => (
                        <div
                            className="lists-container"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {lists.map((list, index) => (
                                <List
                                    key={list.id}
                                    list={list}
                                    index={index}
                                    onDelete={() => deleteList(list.id)}
                                    onAddCard={(title) => addCard(list.id, title)}
                                    onDeleteCard={(cardId) => deleteCard(list.id, cardId)}
                                />
                            ))}
                            {provided.placeholder}
                            <button className="add-list-button" onClick={addList}>
                                Add another list
                            </button>
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
}

export default Board;
