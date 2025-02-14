import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { PuffLoader } from 'react-spinners';
import '../../styles/Card.css';

function Card({ card, index, onDelete, listTitle }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(card.title);
    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState(card.description || '');
    const [checklists, setChecklists] = useState(card.checklists || []);
    const [newChecklistTitle, setNewChecklistTitle] = useState('');
    const [addingChecklist, setAddingChecklist] = useState(false);
    const [members, setMembers] = useState(card.members || []);
    const [showMemberPicker, setShowMemberPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEdit = () => {
        if (editedTitle.trim()) {
            card.title = editedTitle;
            setIsEditing(false);
        }
    };

    const handleSaveDescription = () => {
        card.description = description;
    };

    const addChecklist = () => {
        if (newChecklistTitle.trim()) {
            const newChecklist = {
                id: `checklist-${Date.now()}`,
                title: newChecklistTitle,
                items: []
            };
            const updatedChecklists = [...checklists, newChecklist];
            setChecklists(updatedChecklists);
            card.checklists = updatedChecklists;
            setNewChecklistTitle('');
            setAddingChecklist(false);
        }
    };

    const addChecklistItem = (checklistId, itemText) => {
        const updatedChecklists = checklists.map((checklist) => {
            if (checklist.id === checklistId) {
                return {
                    ...checklist,
                    items: [
                        ...checklist.items,
                        {
                            id: `item-${Date.now()}`,
                            text: itemText,
                            checked: false
                        }
                    ]
                };
            }
            return checklist;
        });
        setChecklists(updatedChecklists);
        card.checklists = updatedChecklists;
    };

    const toggleChecklistItem = (checklistId, itemId) => {
        const updatedChecklists = checklists.map((checklist) => {
            if (checklist.id === checklistId) {
                return {
                    ...checklist,
                    items: checklist.items.map((item) => {
                        if (item.id === itemId) {
                            return { ...item, checked: !item.checked };
                        }
                        return item;
                    })
                };
            }
            return checklist;
        });
        setChecklists(updatedChecklists);
        card.checklists = updatedChecklists;
    };

    const addMember = (member) => {
        const updatedMembers = [...members, member];
        setMembers(updatedMembers);
        card.members = updatedMembers;
        setShowMemberPicker(false);
    };

    const removeMember = (memberId) => {
        const updatedMembers = members.filter((m) => m.id !== memberId);
        setMembers(updatedMembers);
        card.members = updatedMembers;
    };

    const handleCardClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowModal(true);
        }, 1000);
    };

    return (
        <>
            <Draggable draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        className={`card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={handleCardClick}
                    >
                        {isLoading ? (
                            <div className="card-loader">
                                <PuffLoader color="#0079bf" size={30} />
                            </div>
                        ) : (
                            <div className="card-content">
                                <p onClick={() => setIsEditing(true)}>
                                    {card.title}
                                </p>
                                <button
                                    className="card-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                >
                                    ×
                                </button>
                                <button
                                    className="card-edit-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowModal(true);
                                    }}
                                >
                                    ✎
                                </button>
                                {(card.description ||
                                    checklists.length > 0) && (
                                    <div className="card-indicators">
                                        {card.description && <span>☰</span>}
                                        {checklists.length > 0 && (
                                            <span className="checklist-indicator">
                                                ☑{' '}
                                                {checklists.reduce(
                                                    (total, list) =>
                                                        total +
                                                        list.items.filter(
                                                            (item) =>
                                                                item.checked
                                                        ).length,
                                                    0
                                                )}
                                                /
                                                {checklists.reduce(
                                                    (total, list) =>
                                                        total +
                                                        list.items.length,
                                                    0
                                                )}
                                            </span>
                                        )}
                                    </div>
                                )}
                                {members.length > 0 && (
                                    <div className="card-members">
                                        {members.map((member) => (
                                            <span
                                                key={member.id}
                                                className="member-avatar"
                                                title={member.name}
                                            >
                                                {member.name[0]}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Draggable>
            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div className="modal-title">
                                <h3>{card.title}</h3>
                                <div className="modal-subtitle">
                                    in list <span>{listTitle}</span>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="members-section">
                                <div className="section-header">
                                    <h4>Members</h4>
                                    <button
                                        className="add-member-button"
                                        onClick={() =>
                                            setShowMemberPicker(true)
                                        }
                                    >
                                        + Add member
                                    </button>
                                </div>
                                <div className="members-list">
                                    {members.map((member) => (
                                        <div
                                            key={member.id}
                                            className="member-tag"
                                        >
                                            <span className="member-avatar">
                                                {member.name[0]}
                                            </span>
                                            <span className="member-name">
                                                {member.name}
                                            </span>
                                            <button
                                                className="remove-member"
                                                onClick={() =>
                                                    removeMember(member.id)
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {showMemberPicker && (
                                    <div className="member-picker">
                                        <div className="member-picker-header">
                                            <h5>Add Member</h5>
                                            <button
                                                onClick={() =>
                                                    setShowMemberPicker(false)
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <div className="member-options">
                                            {[
                                                {
                                                    id: 'member-1',
                                                    name: 'Member One',
                                                    email: 'member1@example.com'
                                                },
                                                {
                                                    id: 'member-2',
                                                    name: 'Member Two',
                                                    email: 'member2@example.com'
                                                },
                                                {
                                                    id: 'member-3',
                                                    name: 'Member Three',
                                                    email: 'member3@example.com'
                                                }
                                            ]
                                                .filter(
                                                    (m) =>
                                                        !members.find(
                                                            (mem) =>
                                                                mem.id === m.id
                                                        )
                                                )
                                                .map((member) => (
                                                    <div
                                                        key={member.id}
                                                        className="member-option"
                                                        onClick={() =>
                                                            addMember(member)
                                                        }
                                                    >
                                                        <span className="member-avatar">
                                                            {member.name[0]}
                                                        </span>
                                                        <div className="member-info">
                                                            <span className="member-name">
                                                                {member.name}
                                                            </span>
                                                            <span className="member-email">
                                                                {member.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="description-section">
                                <div className="section-header">
                                    <h4>Description</h4>
                                    {!description.trim() && (
                                        <button
                                            className="modal-action-button"
                                            onClick={() => {
                                                const textarea =
                                                    document.getElementById(
                                                        'description-textarea'
                                                    );
                                                textarea.focus();
                                            }}
                                        >
                                            + Add description
                                        </button>
                                    )}
                                </div>
                                <textarea
                                    id="description-textarea"
                                    className={`description-textarea ${
                                        !description.trim() ? 'empty' : ''
                                    }`}
                                    placeholder="Add a more detailed description..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    onBlur={handleSaveDescription}
                                />
                            </div>
                            <div className="checklists-section">
                                <div className="section-header">
                                    <h4>Checklists</h4>
                                    {!addingChecklist && (
                                        <button
                                            className="modal-action-button"
                                            onClick={() =>
                                                setAddingChecklist(true)
                                            }
                                        >
                                            + Add checklist
                                        </button>
                                    )}
                                </div>
                                {addingChecklist && (
                                    <div className="add-checklist-form">
                                        <input
                                            type="text"
                                            placeholder="Checklist title..."
                                            value={newChecklistTitle}
                                            onChange={(e) =>
                                                setNewChecklistTitle(
                                                    e.target.value
                                                )
                                            }
                                            autoFocus
                                        />
                                        <div className="form-actions">
                                            <button 
                                                className="btn-primary"
                                                onClick={addChecklist}
                                            >
                                                Add
                                            </button>
                                            <button 
                                                className="btn-secondary"
                                                onClick={() => {
                                                    setNewChecklistTitle('');
                                                    setAddingChecklist(false);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {checklists.map((checklist) => (
                                    <Checklist
                                        key={checklist.id}
                                        checklist={checklist}
                                        onAddItem={(text) =>
                                            addChecklistItem(checklist.id, text)
                                        }
                                        onToggleItem={(itemId) =>
                                            toggleChecklistItem(
                                                checklist.id,
                                                itemId
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function Checklist({ checklist, onAddItem, onToggleItem }) {
    const [newItemText, setNewItemText] = useState('');
    const [isAddingItem, setIsAddingItem] = useState(false);

    const handleAddItem = () => {
        if (newItemText.trim()) {
            onAddItem(newItemText);
            setNewItemText('');
            setIsAddingItem(false);
        }
    };

    const totalItems = checklist.items.length;
    const completedItems = checklist.items.filter(item => item.checked).length;
    const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

    return (
        <div className="checklist">
            <div className="checklist-header">
                <h5>{checklist.title}</h5>
                <span className="checklist-progress">{progress}%</span>
            </div>
            <div className="progress-bar">
                <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progress}%` }}
                    data-complete={progress === 100}
                />
            </div>
            <div className="checklist-items">
                {checklist.items.map(item => (
                    <div key={item.id} className="checklist-item">
                        <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => onToggleItem(item.id)}
                        />
                        <span className={item.checked ? 'checked' : ''}>
                            {item.text}
                        </span>
                    </div>
                ))}
            </div>
            {isAddingItem ? (
                <div className="add-checklist-form">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="Add an item..."
                        autoFocus
                    />
                    <div className="form-actions">
                        <button 
                            className="btn-primary"
                            onClick={handleAddItem}
                        >
                            Add
                        </button>
                        <button 
                            className="btn-secondary"
                            onClick={() => {
                                setNewItemText('');
                                setIsAddingItem(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    className="modal-action-button"
                    onClick={() => setIsAddingItem(true)}
                >
                    + Add an item
                </button>
            )}
        </div>
    );
}

export default Card;
