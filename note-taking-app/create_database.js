const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    // Create connection without specifying database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Adhikari123$' // Change this to your MySQL password
    });

    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS notes_app');
    console.log('Database "notes_app" created successfully!');

    // Switch to the new database
    await connection.execute('USE notes_app');

    // Create notes table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createTableQuery);
    console.log('Table "notes" created successfully!');

    // Insert sample data
    const sampleNotes = [
      ['Welcome Note', 'Welcome to your new note-taking app! This is your first note.'],
      ['Getting Started', 'You can create, edit, and delete notes using this application.'],
      ['Features', 'This app supports full CRUD operations with a clean, responsive interface.']
    ];

    for (const [title, content] of sampleNotes) {
      await connection.execute(
        'INSERT INTO notes (title, content) VALUES (?, ?)',
        [title, content]
      );
    }

    console.log('Sample notes inserted successfully!');
    await connection.end();
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('You can now run: npm start');
    
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
}

createDatabase();
