const db = require('../config/database');

class Note {
  constructor(title, content) {
    this.title = title;
    this.content = content;
    console.log('📝 Note constructor called:', { title, content });
  }

  // Create a new note
  async save() {
    try {
      console.log('💾 Note.save() called');
      console.log('Data to save:', { title: this.title, content: this.content });
      
      // Check if database connection exists
      console.log('🔗 Testing database connection...');
      await db.execute('SELECT 1');
      console.log('✅ Database connection OK');
      
      console.log('📤 Executing INSERT query...');
      const [result] = await db.execute(
        'INSERT INTO notes (title, content) VALUES (?, ?)',
        [this.title, this.content]
      );
      
      console.log('✅ Insert successful, result:', result);
      console.log('🆔 Generated ID:', result.insertId);
      
      return result.insertId;
    } catch (error) {
      console.error('❌ Error in Note.save():');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('SQL State:', error.sqlState);
      console.error('SQL Message:', error.sqlMessage);
      console.error('Full error:', error);
      throw error;
    }
  }

  // Get all notes
  static async findAll() {
    try {
      console.log('📋 Note.findAll() called');
      
      const [rows] = await db.execute(
        'SELECT * FROM notes ORDER BY updated_at DESC'
      );
      
      console.log('✅ Found', rows.length, 'notes');
      return rows;
    } catch (error) {
      console.error('❌ Error in Note.findAll():', error);
      throw error;
    }
  }

  // Get note by ID
  static async findById(id) {
    try {
      console.log('🔍 Note.findById() called with ID:', id);
      
      const [rows] = await db.execute(
        'SELECT * FROM notes WHERE id = ?',
        [id]
      );
      
      console.log('✅ Query result:', rows.length > 0 ? 'Found' : 'Not found');
      return rows[0];
    } catch (error) {
      console.error('❌ Error in Note.findById():', error);
      throw error;
    }
  }

  // Update note
  static async update(id, title, content) {
    try {
      console.log('📝 Note.update() called:', { id, title, content });
      
      const [result] = await db.execute(
        'UPDATE notes SET title = ?, content = ? WHERE id = ?',
        [title, content, id]
      );
      
      console.log('✅ Update result:', result);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('❌ Error in Note.update():', error);
      throw error;
    }
  }

  // Delete note
  static async delete(id) {
    try {
      console.log('🗑️ Note.delete() called with ID:', id);
      
      const [result] = await db.execute(
        'DELETE FROM notes WHERE id = ?',
        [id]
      );
      
      console.log('✅ Delete result:', result);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('❌ Error in Note.delete():', error);
      throw error;
    }
  }
}

module.exports = Note;