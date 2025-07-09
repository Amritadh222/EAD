const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');
  
  // Test 1: Basic connection
  try {
    console.log('Test 1: Basic MySQL connection');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Adhikari123$', // Change this to your MySQL password
    });
    
    console.log('✅ Basic connection successful');
    await connection.end();
  } catch (error) {
    console.error('❌ Basic connection failed:', error.message);
    console.error('💡 Check if MySQL is running and credentials are correct');
    return;
  }
  
  // Test 2: Database exists
  try {
    console.log('\nTest 2: Checking if database exists');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Adhikari123$', // Change this to your MySQL password
    });
    
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === 'notes_app');
    
    if (dbExists) {
      console.log('✅ Database "notes_app" exists');
    } else {
      console.log('❌ Database "notes_app" does not exist');
      console.log('💡 Run: npm run create-db');
      await connection.end();
      return;
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    return;
  }
  
  // Test 3: Table exists and structure
  try {
    console.log('\nTest 3: Checking table structure');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Adhikari123$', // Change this to your MySQL password
      database: 'notes_app'
    });
    
    const [tables] = await connection.execute('SHOW TABLES');
    const tableExists = tables.some(table => table.Tables_in_notes_app === 'notes');
    
    if (tableExists) {
      console.log('✅ Table "notes" exists');
      
      // Check table structure
      const [columns] = await connection.execute('DESCRIBE notes');
      console.log('📋 Table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key ? col.Key : ''}`);
      });
      
      // Count existing records
      const [count] = await connection.execute('SELECT COUNT(*) as count FROM notes');
      console.log(`📊 Existing records: ${count[0].count}`);
      
    } else {
      console.log('❌ Table "notes" does not exist');
      console.log('💡 Run: npm run create-db');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Table check failed:', error.message);
    return;
  }
  
  // Test 4: Test insert operation
  try {
    console.log('\nTest 4: Testing insert operation');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Adhikari123$', // Change this to your MySQL password
      database: 'notes_app'
    });
    
    const testTitle = 'Test Note ' + Date.now();
    const testContent = 'This is a test note to verify database operations work correctly.';
    
    const [result] = await connection.execute(
      'INSERT INTO notes (title, content) VALUES (?, ?)',
      [testTitle, testContent]
    );
    
    console.log('✅ Insert test successful');
    console.log(`🆔 Generated ID: ${result.insertId}`);
    
    // Clean up test record
    await connection.execute('DELETE FROM notes WHERE id = ?', [result.insertId]);
    console.log('🧹 Test record cleaned up');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Insert test failed:', error.message);
    console.error('Error details:', error);
    return;
  }
  
  console.log('\n🎉 All database tests passed!');
  console.log('💡 The database connection should work fine.');
  console.log('💡 If you still have issues, check server logs for specific errors.');
}

// Run the test
testDatabaseConnection().catch(console.error);