//dot env
import "../config/dotenv.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Models
import User from "../models/user.model.js";
import { Problem } from "../models/problem.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const codelabDataPath = path.join(
  __dirname,
  "../../../client/src/assets/data/codelab.json",
);
const questionsDataPath = path.join(__dirname, "questionsData.json");

const seedDatabase = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error("MONGO_URI not found in .env");
    }

    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected...");

    // Clear existing collections
    console.log("Clearing existing data...");
    // await User.deleteMany({});
    // await Problem.deleteMany({});

    console.log("Data cleared. Seeding...");

    // 1. Seed Demo User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("ksh777", salt);

    // const demoUser = await User.create({
    //   name: "Karan Sharma",
    //   email: "karan03945@gmail.com",
    //   phone: "1234567890",
    //   password: hashedPassword,
    //   role: "user",
    //   status: "active",
    //   avatar: {
    //     url: "https://placehold.co/600x400?text=D",
    //     publicId: ""
    //   }
    // });

    console.log("Demo User created: karan03945@gmail.com / ksh777");

    // 2. Seed Problems
    const codelabJson = JSON.parse(fs.readFileSync(codelabDataPath, "utf-8"));

    const baseProblem = {
      number: 1,
      title: codelabJson.title,
      description: codelabJson.description,
      difficulty: codelabJson.difficulty,
      timeLimit: codelabJson.timeLimit,
      memoryLimit: codelabJson.memoryLimit,
      constraints: codelabJson.constraints,
      examples: codelabJson.examples,
      starterCode: codelabJson.starterCode,
      driverCode: codelabJson.driverCode,
      testCases: codelabJson.testCases.map((tc) => ({
        input: tc.input,
        output: tc.expectedOutput || tc.output,
        isHidden: tc.isHidden,
      })),
      hints: codelabJson.hints,
      solution: codelabJson.solution,
      likes: codelabJson.likes,
      dislikes: codelabJson.dislikes,
    };

    const problemsToSeed = [baseProblem];

    const extraQuestions = JSON.parse(
      fs.readFileSync(questionsDataPath, "utf-8"),
    );

    extraQuestions.forEach((q, idx) => {
      problemsToSeed.push({
        ...q,
        number: idx + 2,
      });
    });

    // Generate 10 dummy problems
    const difficulties = ["EASY", "MEDIUM", "HARD"];
    for (let i = 1; i <= 10; i++) {
      problemsToSeed.push({
        ...baseProblem,
        number: i + extraQuestions.length + 1,
        title: `Dummy Problem ${i}`,
        difficulty: difficulties[i % 3],
        description: `This is a generated dummy problem ${i} for pagination testing. \n\n${baseProblem.description}`,
      });
    }

    await Problem.insertMany(problemsToSeed);

    console.log(`Problems Seeded: ${problemsToSeed.length} total problems`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error with data seed:", error);
    process.exit(1);
  }
};

seedDatabase();
