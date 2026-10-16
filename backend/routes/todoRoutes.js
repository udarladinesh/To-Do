import express from 'express';
import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

const router = express.Router();

// GET /api/todos - Get all todos, newest first
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const { title } = req.body || {};

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required and cannot be empty' });
    }

    const newTodo = new Todo({
      title: title.trim(),
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PATCH /api/todos/:id - Update completed status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body || {};

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    // Validate completed field
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed field must be a boolean (true or false)' });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id - Delete a todo by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({
      message: 'Todo deleted successfully',
      id: deletedTodo._id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;
