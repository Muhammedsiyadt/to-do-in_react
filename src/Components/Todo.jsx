import React, { useState, useEffect, useRef } from 'react';
import './Todo.css';
import { IoMdDoneAll } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

const Todo = () => {
    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    useEffect(() => {
    const initialTasks = [
        { list: "Complete 30 minutes of cardio", id: Date.now() + 1, status: false },
        { list: "Prepare a healthy breakfast", id: Date.now() + 2, status: false },
        { list: "Read a chapter of a tech book", id: Date.now() + 3, status: false },
        { list: "Review pull requests on GitHub", id: Date.now() + 4, status: false },
        { list: "Solve a LeetCode problem", id: Date.now() + 5, status: false },
        { list: "Implement a new feature in the project", id: Date.now() + 6, status: false },
        { list: "Update project documentation", id: Date.now() + 7, status: false }
    ];
    setTodos(initialTasks);
}, []);

    const [editId, setEditId] = useState(null);
    const inputRef = useRef(null);
    const [showInfo, setShowInfo] = useState(null); // For showing purpose or benefits

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (todo.trim() === '') return;

        if (editId !== null) {
            const updatedTodos = todos.map((item) =>
                item.id === editId ? { id: item.id, list: todo.trim(), status: item.status } : item
            );
            setTodos(updatedTodos);
            setEditId(null);
        } else {
            if (todos.some(item => item.list.toLowerCase() === todo.toLowerCase())) {
                alert('Task already exists');
                return;
            }
            setTodos([...todos, { list: todo.trim(), id: Date.now(), status: false }]);
        }

        setTodo('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addTodo();
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const onDelete = (id) => {
        setTodos(todos.filter((item) => item.id !== id));
    };

    const onComplete = (id) => {
        const updatedTodos = todos.map((item) =>
            item.id === id ? { ...item, status: !item.status } : item
        );
        setTodos(updatedTodos);
    };

    const onEdit = (id) => {
        const editTodo = todos.find((item) => item.id === id);
        setTodo(editTodo.list);
        setEditId(editTodo.id);
    };

    const toggleInfo = (infoType) => {
        setShowInfo(infoType === showInfo ? null : infoType);
    };

    return (
        <div className='container'>
            <h1>To-Do App</h1>
            <form className='form' onSubmit={handleSubmit}>
                <input
                    value={todo}
                    ref={inputRef}
                    onChange={(e) => setTodo(e.target.value)}
                    className='inpt'
                    type='text'
                    placeholder='Enter your to-do'
                />
                <button type='submit'>{editId !== null ? 'EDIT' : 'ADD'}</button>
            </form>

            <div className='info-buttons'>
                <button onClick={() => toggleInfo('purpose')} className='info-button'>Purpose</button>
                <button onClick={() => toggleInfo('benefits')} className='info-button'>Benefits</button>
            </div>

            {showInfo === 'purpose' && (
                <div className='info-section'>
                    <h2>Purpose of a To-Do List</h2>
                    <p>The purpose of a To-Do list is to help you organize and prioritize tasks, manage your time effectively, and keep track of progress towards achieving your goals. It acts as a tool for productivity and helps reduce stress by providing a clear plan for what needs to be done.</p>
                </div>
            )}
            {showInfo === 'benefits' && (
                <div className='info-section'>
                    <h2>Benefits of Using a To-Do List</h2>
                    <ul>
                        <li>Improves time management and productivity.</li>
                        <li>Helps reduce stress by keeping track of tasks.</li>
                        <li>Increases motivation and focus.</li>
                        <li>Provides a sense of accomplishment as tasks are completed.</li>
                        <li>Helps in setting priorities and managing deadlines.</li>
                    </ul>
                </div>
            )}

            <div className='li-tags'>
                <ul>
                    {todos.map((item) => (
                        <li key={item.id} id={item.status ? 'list-item' : ''} className='li-item'>
                            {item.list}
                            <div className='icon-container'>
                                <IoMdDoneAll onClick={() => onComplete(item.id)} className='icon-done' title='Done'/>
                                <FiEdit onClick={() => onEdit(item.id)} className='icon-edit' title='Edit'/>
                                <MdDelete onClick={() => onDelete(item.id)} className='icon-delete' title='Delete'/>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Todo;
