import 'dotenv/config';
import { db } from './db';
import { users, rooms, complaints, messFeedback, visitors, lostFound, sosAlerts, events } from '@shared/schema';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Hash password for all test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('✅ Generated password hash');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await db.delete(events);
    await db.delete(sosAlerts);
    await db.delete(lostFound);
    await db.delete(visitors);
    await db.delete(messFeedback);
    await db.delete(complaints);
    await db.delete(rooms);
    await db.delete(users);
    console.log('🗑️  Cleared existing data');

    // Insert users
    await db.insert(users).values([
      { username: 'student1', email: 'student1@test.com', password: hashedPassword, role: 'student', name: 'Alice Johnson' },
      { username: 'student2', email: 'student2@test.com', password: hashedPassword, role: 'student', name: 'Bob Williams' },
      { username: 'student3', email: 'student3@test.com', password: hashedPassword, role: 'student', name: 'Charlie Brown' },
      { username: 'student4', email: 'student4@test.com', password: hashedPassword, role: 'student', name: 'Diana Miller' },
      { username: 'student5', email: 'student5@test.com', password: hashedPassword, role: 'student', name: 'Ethan Davis' },
      { username: 'student6', email: 'student6@test.com', password: hashedPassword, role: 'student', name: 'Fiona Garcia' },
      { username: 'warden1', email: 'warden@test.com', password: hashedPassword, role: 'warden', name: 'Mr. Harrison' },
    ]);
    console.log('✅ Inserted users');

    // Get user IDs for relationships
    const allUsers = await db.select().from(users);
    const student1 = allUsers.find(u => u.username === 'student1')!;
    const student2 = allUsers.find(u => u.username === 'student2')!;
    const student3 = allUsers.find(u => u.username === 'student3')!;
    const student5 = allUsers.find(u => u.username === 'student5')!;
    const warden = allUsers.find(u => u.username === 'warden1')!;

    // Insert rooms
    await db.insert(rooms).values([
      { number: '101', floor: 1, capacity: 4, occupied: 2, status: 'available' },
      { number: '102', floor: 1, capacity: 4, occupied: 4, status: 'full' },
      { number: '103', floor: 1, capacity: 3, occupied: 0, status: 'maintenance' },
      { number: '201', floor: 2, capacity: 4, occupied: 1, status: 'available' },
      { number: '202', floor: 2, capacity: 4, occupied: 3, status: 'available' },
    ]);
    console.log('✅ Inserted rooms');

    // Insert complaints
    await db.insert(complaints).values([
      {
        userId: student1.id,
        category: 'plumbing',
        location: 'Room 101',
        description: 'Leaky faucet in the bathroom.',
        status: 'pending',
        priority: 'high',
        roomNumber: '101',
      },
      {
        userId: student3.id,
        category: 'internet',
        location: 'Room 102',
        description: 'Wi-Fi is very slow.',
        status: 'resolved',
        priority: 'medium',
        roomNumber: '102',
      },
    ]);
    console.log('✅ Inserted complaints');

    // Insert visitors
    await db.insert(visitors).values([
      {
        name: 'John Smith',
        phone: '123-456-7890',
        purpose: 'Family Visit',
        studentId: student1.id,
        studentName: 'Alice Johnson',
        roomNumber: '101',
        status: 'checked-in',
      },
    ]);
    console.log('✅ Inserted visitors');

    // Insert SOS alerts
    await db.insert(sosAlerts).values([
      {
        userId: student2.id,
        userName: 'Bob Williams',
        roomNumber: '101',
        location: 'Block 1 - Medical Emergency: Severe headache and dizziness',
        status: 'active',
      },
      {
        userId: student5.id,
        userName: 'Ethan Davis',
        roomNumber: '102',
        location: 'Block 2 - Fire Alert: Smoke detected from electrical outlet',
        status: 'active',
      },
    ]);
    console.log('✅ Inserted SOS alerts');

    // Insert events
    await db.insert(events).values([
      {
        name: 'Monthly Hostel Committee Meeting',
        date: new Date('2025-11-15T16:00:00Z'),
        time: '4:00 PM',
        location: 'Common Room',
        purpose: 'Discuss monthly hostel activities and address student concerns',
        createdBy: warden.id,
      },
      {
        name: 'Sports Day',
        date: new Date('2025-11-20T10:00:00Z'),
        time: '10:00 AM',
        location: 'Sports Ground',
        purpose: 'Annual inter-hostel sports competition',
        createdBy: warden.id,
      },
      {
        name: 'Cleanliness Drive',
        date: new Date('2025-11-18T09:00:00Z'),
        time: '9:00 AM',
        location: 'All Blocks',
        purpose: 'Monthly hostel cleaning and maintenance day',
        createdBy: warden.id,
      },
    ]);
    console.log('✅ Inserted events');

    // Insert mess feedback
    await db.insert(messFeedback).values([
      {
        userId: student1.id,
        meal: 'lunch',
        qualityRating: 4,
        tasteRating: 4,
        wastage: false,
        comments: 'Good variety and taste!',
      },
      {
        userId: student2.id,
        meal: 'dinner',
        qualityRating: 3,
        tasteRating: 3,
        wastage: true,
        comments: 'Portion size was too large',
      },
    ]);
    console.log('✅ Inserted mess feedback');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Username: student1 (or student2-6)');
    console.log('   Username: warden1');
    console.log('   Password: password123');
    console.log('   (All passwords are bcrypt hashed)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }

  process.exit(0);
}

seed();
