const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();
class NoteController {
  // Get all notes
  static async getAllNotes(req, res) {
    try {
      const notes = await prisma.note.findMany();
      if (!notes || notes.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No notes found'
        });
      }

      res.json({
        success: true,
        data: notes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching notes',
        error: error.message
      });
    }
  }

  // Get single note
  static async getNoteById(req, res) {
    try {
      const { id } = req.params;     
      const note = await prisma.note.findUnique({
        where:{
          id: parseInt(id)
        }
      });
      
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }
      res.json({
        success: true,
        data: note
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching note',
        error: error.message
      });
    }
  }

  // Create new note
  static async createNote(req, res) {
    try {
     
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required',
          received: { title: !!title, content: !!content }
        });
      }

      
      const note = await prisma.note.create({
        data:{title, content}
      });

      res.status(201).json({
        success: true,
        message: 'Note created successfully',
        data: { id: note.id, title, content }
      });
      
    } catch (error) {      
      res.status(500).json({
        success: false,
        message: 'Error creating note',
        error: error.message,
        code: error.code
      });
    }
  }

  // Update note
  static async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required'
        });
      }

      const updated = await prisma.note.update({
        where: { id: parseInt(id) },
        data: { title, content }
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }
      res.json({
        success: true,
        message: 'Note updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating note',
        error: error.message
      });
    }
  }

  // Delete note
  static async deleteNote(req, res) {
    try {
      const { id } = req.params;      
      const deleted = await prisma.note.delete({
        where: { id: parseInt(id) }
      });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }
      res.json({
        success: true,
        message: 'Note deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting note',
        error: error.message
      });
    }
  }
}

module.exports = NoteController;