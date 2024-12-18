/**
 * @fileoverview Contains sample data for populating the database with test/development data.
 * Uses a combination of hardcoded data for specific test cases and faker.js for generating
 * additional random data. Includes sample users, preferences, chat rooms, messages, reviews,
 * workouts, and buddy matches.
 */

import {
  BuddyMatch,
  ChatMessage,
  ChatRoom,
  Review,
  User,
  UserPreference,
  Workout,
} from "@/models";
import {
  BuddyStatus,
  ExperienceLevel,
  WorkoutStatus,
  Gender,
} from "@/types/enums";
import { faker } from "@faker-js/faker";

/**
 * Sample user data including both specific test users and randomly generated ones.
 * First 5 users are hardcoded for testing specific scenarios, followed by 10 random users.
 */
export const users = User.bulkBuild([
  {
    username: "loya",
    passwordHash: "swolemate1234",
    emailAddress: "zn23@calvin.edu",
    firstName: "Loya",
    lastName: "Smith",
    age: 25,
    height_feet: 5,
    height_inches: 8,
    weight: 170,
    gender: Gender.Male,
    experienceLevel: ExperienceLevel.Intermediate,
    bio: "Enjoys lifting weights and doing HIIT workouts.",
    isTrainer: false,
    cost: 0,
    city: "New York",
    profilePictureUrl: null,
  },
  {
    username: "jeton",
    passwordHash: "swolemate1234",
    emailAddress: "jeb64@calvin.edu",
    firstName: "Jeton",
    lastName: "Cesaj",
    age: 23,
    height_feet: 6,
    height_inches: 1,
    weight: 190,
    gender: Gender.Male,
    experienceLevel: ExperienceLevel.Advanced,
    bio: "Strength training enthusiast. Always aiming to lift heavier.",
    isTrainer: true,
    cost: 50,
    city: "Grand Rapids",
    profilePictureUrl: null,
  },
  {
    username: "alim",
    passwordHash: "swolemate1234",
    emailAddress: "aad32@calvin.edu",
    firstName: "Alim",
    lastName: "Khan",
    age: 27,
    height_feet: 5,
    height_inches: 11,
    weight: 180,
    gender: Gender.Male,
    experienceLevel: ExperienceLevel.Advanced,
    bio: "Fitness junkie with a passion for bodybuilding.",
    isTrainer: false,
    cost: 0,
    city: "Chicago",
    profilePictureUrl: null,
  },
  {
    username: "allison",
    passwordHash: "swolemate1234",
    emailAddress: "amd93@calvin.edu",
    firstName: "Allison",
    lastName: "Brown",
    age: 26,
    height_feet: 5,
    height_inches: 6,
    weight: 150,
    gender: Gender.Female,
    experienceLevel: ExperienceLevel.Intermediate,
    bio: "Loves yoga and Pilates. Looking to build strength.",
    isTrainer: false,
    cost: 0,
    city: "Los Angeles",
    profilePictureUrl: null,
  },
  {
    username: "madi",
    passwordHash: "swolemate1234",
    emailAddress: "mam64@calvin.edu",
    firstName: "Madi",
    lastName: "Taylor",
    age: 24,
    height_feet: 5,
    height_inches: 4,
    weight: 135,
    gender: Gender.Female,
    experienceLevel: ExperienceLevel.Beginner,
    bio: "Just getting into fitness. Excited to start training!",
    isTrainer: false,
    cost: 0,
    city: "San Francisco",
    profilePictureUrl: null,
  },
  ...Array(10)
    .fill(null)
    .map(() => {
      const username = faker.internet.username();
      return {
        username,
        passwordHash: "password123",
        emailAddress: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 50 }),
        height_feet: faker.number.int({ min: 4, max: 6 }),
        height_inches: faker.number.int({ min: 0, max: 11 }),
        weight: faker.number.int({ min: 120, max: 250 }),
        gender: faker.helpers.arrayElement(Object.values(Gender)),
        experienceLevel: faker.helpers.arrayElement(
          Object.values(ExperienceLevel)
        ),
        bio: faker.lorem.sentence(),
        isTrainer: faker.datatype.boolean(),
        cost: 0,
        city: faker.location.city(),
        profilePictureUrl: null,
      };
    }),
]);

/**
 * Sample user preferences data corresponding to the users.
 * Includes preferences for both hardcoded and random users.
 */
export const userPreferences = UserPreference.bulkBuild([
  {
    userId: 1,
    preferredExperienceLevel: ExperienceLevel.Beginner,
  },
  {
    userId: 2,
    preferredExperienceLevel: ExperienceLevel.Advanced,
  },
  {
    userId: 3,
    preferredExperienceLevel: ExperienceLevel.Advanced,
  },
  {
    userId: 4,
    preferredExperienceLevel: ExperienceLevel.Intermediate,
  },
  {
    userId: 5,
    preferredExperienceLevel: ExperienceLevel.Intermediate,
  },
  ...Array(10)
    .fill(null)
    .map((_, i) => ({
      userId: i + 6,
      preferredExperienceLevel: faker.helpers.arrayElement(
        Object.values(ExperienceLevel)
      ),
    })),
]);

/**
 * Sample chat rooms data establishing connections between users.
 * Creates chat rooms between user 1 and others, and additional random connections.
 */
export const chatRooms = ChatRoom.bulkBuild([
  {
    user1Id: 1,
    user2Id: 2,
  },
  {
    user1Id: 1,
    user2Id: 3,
  },
  {
    user1Id: 1,
    user2Id: 4,
  },
  {
    user1Id: 1,
    user2Id: 5,
  },
  ...Array(5)
    .fill(null)
    .map((_, i) => ({
      user1Id: 2,
      user2Id: 3 + i,
    })),
  ...Array(5)
    .fill(null)
    .map((_, i) => ({
      user1Id: 3,
      user2Id: 4 + i,
    })),
]);

/**
 * Sample chat messages data simulating conversations between users.
 * Includes a complete conversation flow between two users.
 */
export const chatMessages = ChatMessage.bulkBuild([
  {
    chatRoomId: 1,
    senderId: 1,
    messageText: "Hey! Would you like to be my workout buddy?",
  },
  {
    chatRoomId: 1,
    senderId: 2,
    messageText: "Sure! I'd love to. What kind of workouts do you usually do?",
  },
  {
    chatRoomId: 1,
    senderId: 1,
    messageText:
      "I mostly do strength training but looking to get into cardio more.",
  },
  {
    chatRoomId: 1,
    senderId: 2,
    messageText:
      "Perfect! I can definitely help with cardio routines. When would you like to meet?",
  },
  {
    chatRoomId: 1,
    senderId: 1,
    messageText: "How about next Monday at 6pm?",
  },
  {
    chatRoomId: 1,
    senderId: 2,
    messageText: "Monday at 6pm works great for me! See you then! 💪",
  },
]);

/**
 * Sample review data including ratings and feedback between users.
 * Contains both specific test reviews and randomly generated ones.
 */
export const reviews = Review.bulkBuild([
  {
    reviewerId: 2,
    reviewedId: 1,
    rating: 5,
  },
  {
    reviewerId: 1,
    reviewedId: 2,
    rating: 5,
  },
  {
    reviewerId: 3,
    reviewedId: 4,
    rating: 4,
    reviewText:
      "Good spotter and reliable workout partner. Helped me stay consistent with my routine.",
  },
  {
    reviewerId: 4,
    reviewedId: 3,
    rating: 4,
    reviewText:
      "Friendly and encouraging. Always brings positive energy to our workout sessions.",
  },
  ...Array(20)
    .fill(null)
    .map(() => {
      const reviewerId = faker.number.int({ min: 1, max: 14 });
      let reviewedId = faker.number.int({ min: 1, max: 15 });
      if (reviewedId === reviewerId) reviewedId++;
      return {
        reviewerId,
        reviewedId,
        rating: faker.number.int({ min: 1, max: 5 }),
        reviewText: faker.lorem.sentence(),
      };
    }),
]);

/**
 * Sample workout session data between users.
 * Includes both completed and upcoming workout sessions.
 */
export const workouts = Workout.bulkBuild([
  {
    creatorId: 1,
    partnerId: 2,
    workoutTime: new Date("2024-01-15"),
    status: WorkoutStatus.Completed,
  },
  {
    creatorId: 2,
    partnerId: 1,
    workoutTime: new Date("2024-01-17"),
    status: WorkoutStatus.Completed,
  },
  ...Array(20)
    .fill(null)
    .map(() => {
      const creatorId = faker.number.int({ min: 1, max: 14 });
      let partnerId = faker.number.int({ min: 1, max: 15 });
      if (creatorId === partnerId) partnerId++;
      return {
        creatorId,
        partnerId,
        workoutTime: faker.date.soon(),
        status: faker.helpers.arrayElement(Object.values(WorkoutStatus)),
      };
    }),
]);

/**
 * Sample buddy match data showing different relationship statuses between users.
 * Includes accepted, pending, and random status matches.
 */
export const buddyMatches = BuddyMatch.bulkBuild([
  {
    requesterId: 1,
    receiverId: 2,
    status: BuddyStatus.Accepted,
  },
  {
    requesterId: 1,
    receiverId: 3,
    status: BuddyStatus.Accepted,
  },
  {
    requesterId: 1,
    receiverId: 4,
    status: BuddyStatus.Accepted,
  },
  {
    requesterId: 1,
    receiverId: 5,
    status: BuddyStatus.Accepted,
  },
  {
    requesterId: 2,
    receiverId: 6,
    status: BuddyStatus.Accepted,
  },
  {
    requesterId: 2,
    receiverId: 7,
    status: BuddyStatus.Accepted,
  },
  {
    requesterId: 3,
    receiverId: 8,
    status: BuddyStatus.Pending,
  },
  {
    requesterId: 3,
    receiverId: 9,
    status: BuddyStatus.Pending,
  },
  {
    requesterId: 4,
    receiverId: 10,
    status: BuddyStatus.Accepted,
  },
  {
    requesterId: 4,
    receiverId: 11,
    status: BuddyStatus.Pending,
  },
  {
    requesterId: 5,
    receiverId: 12,
    status: BuddyStatus.Accepted,
  },
  ...Array(20)
    .fill(null)
    .map(() => {
      const requesterId = faker.number.int({ min: 1, max: 14 });
      let receiverId = faker.number.int({ min: 1, max: 15 });
      if (requesterId === receiverId) receiverId++;
      return {
        requesterId,
        receiverId,
        status: faker.helpers.arrayElement(Object.values(BuddyStatus)),
      };
    }),
]);
