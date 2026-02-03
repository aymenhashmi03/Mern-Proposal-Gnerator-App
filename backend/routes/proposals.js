const express = require('express');
const { body, validationResult } = require('express-validator');
const Proposal = require('../models/Proposal');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all proposals for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const proposals = await Proposal.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    
    res.json({ proposals });
  } catch (error) {
    console.error('Get proposals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single proposal by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    res.json({ proposal });
  } catch (error) {
    console.error('Get proposal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new proposal
router.post(
  '/',
  [
    auth,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('clientName').trim().notEmpty().withMessage('Client name is required'),
    body('projectDescription').trim().notEmpty().withMessage('Project description is required'),
    body('deadline').isISO8601().withMessage('Valid deadline is required')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, clientName, projectDescription, budget, deadline, status } = req.body;

      const proposal = new Proposal({
        title,
        clientName,
        projectDescription,
        budget: budget || 0,
        deadline,
        status: status || 'Draft',
        userId: req.userId
      });

      await proposal.save();

      res.status(201).json({
        message: 'Proposal created successfully',
        proposal
      });
    } catch (error) {
      console.error('Create proposal error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update proposal
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, clientName, projectDescription, budget, deadline, status } = req.body;

    const proposal = await Proposal.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Update fields
    if (title) proposal.title = title;
    if (clientName) proposal.clientName = clientName;
    if (projectDescription) proposal.projectDescription = projectDescription;
    if (budget !== undefined) proposal.budget = budget;
    if (deadline) proposal.deadline = deadline;
    if (status) proposal.status = status;

    await proposal.save();

    res.json({
      message: 'Proposal updated successfully',
      proposal
    });
  } catch (error) {
    console.error('Update proposal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete proposal
router.delete('/:id', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    res.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Delete proposal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

