const db = require('../config/database');

class Note {
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }

  // Create a new note
  async save() {
    try {
      const [result] = await db.execute(
        'INSERT INTO notes (title, content) VALUES (?, ?)',
        [this.title, this.content]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get all notes
  static async findAll() {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM notes ORDER BY updated_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get note by ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM notes WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update note
  static async update(id, title, content) {
    try {
      const [result] = await db.execute(
        'UPDATE notes SET title = ?, content = ? WHERE id = ?',
        [title, content, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete note
  static async delete(id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM notes WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Note;
