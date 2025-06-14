#!/usr/bin/env ts-node

import mongoose from 'mongoose';
import { User } from '../src/models/User';
import { connectDB } from '../src/config/database';

async function updateUserDailyLimits() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Update all existing users to have the new daily limit fields
    const result = await User.updateMany(
      {
        $or: [
          { dailyArticlesAccessed: { $exists: false } },
          { dailyVideosAccessed: { $exists: false } },
          { lastAccessDate: { $exists: false } },
          { accessedContentToday: { $exists: false } }
        ]
      },
      {
        $set: {
          dailyArticlesAccessed: 0,
          dailyVideosAccessed: 0,
          lastAccessDate: new Date(),
          accessedContentToday: {
            articles: [],
            videos: []
          }
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} users with new daily limit fields`);

    // Verify the update
    const usersWithNewFields = await User.countDocuments({
      dailyArticlesAccessed: { $exists: true },
      dailyVideosAccessed: { $exists: true },
      lastAccessDate: { $exists: true },
      accessedContentToday: { $exists: true }
    });

    console.log(`Total users with daily limit fields: ${usersWithNewFields}`);

  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
updateUserDailyLimits()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
