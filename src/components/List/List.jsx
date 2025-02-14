import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Card from '../Card/Card';
import '../../styles/List.css';

function List({ list, index, onDelete, onAddCard, onDeleteCard }) {
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [listTitle, setListTitle] = useState(list.title);

    const handleAddCard = () => {
        if (newCardTitle.trim()) {
            onAddCard(newCardTitle);
            setNewCardTitle('');
            setIsAddingCard(false);
        }
    };

    const handleTitleSave = () => {
        if (listTitle.trim()) {
            setIsEditingTitle(false);
        }
    };

    return (
        <Draggable draggableId={list.id} index={index}>
            {(provided, snapshot) => (
                <div
                    className={`list ${snapshot.isDragging ? 'is-dragging' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className="list-header">
                        {isEditingTitle ? (
                            <input
                                type="text"
                                value={listTitle}
                                onChange={(e) => setListTitle(e.target.value)}
                                onBlur={handleTitleSave}
                                onKeyPress={(e) =>
                                    e.key === 'Enter' && handleTitleSave()
                                }
                                autoFocus
                            />
                        ) : (
                            <div className="list-title-container">
                                <h3 onClick={() => setIsEditingTitle(true)}>
                                    {listTitle}
                                </h3>
                                <button
                                    className="delete-list-button"
                                    onClick={onDelete}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                    <Droppable droppableId={list.id} type="card">
                        {(provided, snapshot) => (
                            <div
                                className={`cards-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {list.cards.map((card, index) => (
                                    <Card
                                        key={card.id}
                                        card={card}
                                        index={index}
                                        onDelete={() => onDeleteCard(card.id)}
                                        listTitle={listTitle}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    {isAddingCard ? (
                        <div className="add-card-form">
                            <textarea
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                placeholder="Enter card title..."
                                autoFocus
                            />
                            <div className="add-card-actions">
                                <button onClick={handleAddCard}>
                                    Add Card
                                </button>
                                <button onClick={() => setIsAddingCard(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="add-card-button"
                            onClick={() => setIsAddingCard(true)}
                        >
                            Add a card
                        </button>
                    )}
                </div>
            )}
        </Draggable>
    );
}

export default List;
