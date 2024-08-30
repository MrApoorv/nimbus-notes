const express = require('express');
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const router = express.Router();

//ROUTE 1: Get all notes using GET "/api/notes/fetchallnotes" LOGIN REQ 
//i.e. auth token is needed using fetchuser middleware for that that concats req with id using the token
router.get('/fetchallnotes', fetchuser,
    async (req, res) => {
        try {
            const notes = await Notes.find({ user: req.user.id })
            res.json(notes);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    })

//ROUTE 2: Add new note using POST "/api/notes/fetchallnotes"
router.post('/addnote', fetchuser, [
    body('title', 'Enter valid Title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //if errors then stop
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

})

//ROUTE 3: update existing note using PUT "/api/notes/updatenote"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //create newNote obj using the changes from req,body
        const newNote = {};
        if (title) { newNote.title = title; }
        if (description) { newNote.description = description; }
        if (tag) { newNote.tag = tag; }

        //Find the note to be updated
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

})


//ROUTE 4: Delete existing note using delete "/api/notes/delete"
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        //Find the note to be updated
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        //Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

})


module.exports = router;