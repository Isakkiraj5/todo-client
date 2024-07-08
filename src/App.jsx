import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Input, Button, ListGroup, ListGroupItem, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';  // Custom CSS for additional styling

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodo, setEditTodo] = useState(null);
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get('https://todo-server-1-y7jz.onrender.com/todos');
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (editTodo) {
      const res = await axios.put(`https://todo-server-1-y7jz.onrender.com/todos/${editTodo._id}`, { text: newTodo });
      setTodos(todos.map(todo => todo._id === editTodo._id ? res.data : todo));
      setEditTodo(null);
    } else {
      const res = await axios.post('https://todo-server-1-y7jz.onrender.com/todos', { text: newTodo });
      setTodos([...todos, res.data]);
    }
    setNewTodo('');
  };

  const startEditTodo = (todo) => {
    setNewTodo(todo.text);
    setEditTodo(todo);
  };

  const confirmDeleteTodo = (id) => {
    setDeleteId(id);
    toggleModal();
  };

  const deleteTodo = async () => {
    await axios.delete(`https://todo-server-1-y7jz.onrender.com/todos/${deleteId}`);
    setTodos(todos.filter(todo => todo._id !== deleteId));
    toggleModal();
  };

  const toggleComplete = async (id) => {
    const todo = todos.find(todo => todo._id === id);
    const res = await axios.put(`https://todo-server-1-y7jz.onrender.com/todos/${id}`, { completed: !todo.completed });
    setTodos(todos.map(todo => todo._id === id ? res.data : todo));
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center">Todo List</h1>
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new todo"
            className="mb-3"
          />
          <Button color="primary" className="mb-3" onClick={addTodo}>
            {editTodo ? 'Update Todo' : 'Add Todo'}
          </Button>
          <ListGroup className="mt-3">
            {todos.map(todo => (
              <ListGroupItem key={todo._id} className="d-flex justify-content-between align-items-center">
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.text}
                </span>
                <div>
                  <Button color={todo.completed ? 'success' : 'secondary'} size="sm" className="mr-2" onClick={() => toggleComplete(todo._id)}>
                    {todo.completed ? 'Completed' : 'Incomplete'}
                  </Button>
                  <Button color="warning" size="sm" className="mr-2" onClick={() => startEditTodo(todo)}>Edit</Button>
                  <Button color="danger" size="sm" onClick={() => confirmDeleteTodo(todo._id)}>Delete</Button>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this todo?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={deleteTodo}>Delete</Button>
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

export default App;
