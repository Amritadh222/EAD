const Note = require('../models/Note');

class NoteController {
  // Get all notes
  static async getAllNotes(req, res) {
    try {
      console.log('📋 Getting all notes...');
      const notes = await Note.findAll();
      console.log('✅ Notes retrieved:', notes.length);
      res.json({
        success: true,
        data: notes
      });
    } catch (error) {
      console.error('❌ Error in getAllNotes:', error);
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
      console.log('📄 Getting note by ID:', id);
      
      const note = await Note.findById(id);
      
      if (!note) {
        console.log('❌ Note not found with ID:', id);
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }

      console.log('✅ Note found:', note.title);
      res.json({
        success: true,
        data: note
      });
    } catch (error) {
      console.error('❌ Error in getNoteById:', error);
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
      console.log('\n🆕 CREATE NOTE REQUEST:');
      console.log('Request body:', req.body);
      console.log('Content-Type:', req.headers['content-type']);
      
      const { title, content } = req.body;

      // Detailed validation logging
      console.log('Validation check:');
      console.log('- Title:', title ? `"${title}" (${typeof title})` : 'MISSING');
      console.log('- Content:', content ? `"${content.substring(0, 50)}..." (${typeof content})` : 'MISSING');

      if (!title || !content) {
        console.log('❌ Validation failed: missing required fields');
        return res.status(400).json({
          success: false,
          message: 'Title and content are required',
          received: { title: !!title, content: !!content }
        });
      }

      console.log('✅ Validation passed, creating note...');
      
      const note = new Note(title, content);
      console.log('📝 Note object created, calling save()...');
      
      const noteId = await note.save();
      console.log('✅ Note saved successfully with ID:', noteId);

      res.status(201).json({
        success: true,
        message: 'Note created successfully',
        data: { id: noteId, title, content }
      });
      
      console.log('✅ Response sent successfully\n');
      
    } catch (error) {
      console.error('\n❌ ERROR IN CREATE NOTE:');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error stack:', error.stack);
      console.error('========================\n');
      
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
      console.log('📝 Updating note...');
      const { id } = req.params;
      const { title, content } = req.body;

      console.log('Update data:', { id, title, content });

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required'
        });
      }

      const updated = await Note.update(id, title, content);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }

      console.log('✅ Note updated successfully');
      res.json({
        success: true,
        message: 'Note updated successfully'
      });
    } catch (error) {
      console.error('❌ Error in updateNote:', error);
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
      console.log('🗑️ Deleting note...');
      const { id } = req.params;
      console.log('Delete note ID:', id);
      
      const deleted = await Note.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }

      console.log('✅ Note deleted successfully');
      res.json({
        success: true,
        message: 'Note deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error in deleteNote:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting note',
        error: error.message
      });
    }
  }
}

module.exports = NoteController;