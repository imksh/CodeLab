import mongoose, { Schema, Document } from "mongoose";

const exampleSchema = new Schema(
  {
    input: {
      type: String,
      required: true,
      trim: true,
    },
    output: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const starterCodeSchema = new Schema(
  {
    java: String,
    python: String,
    javascript: String,
    cpp: String,
  },
  { _id: false },
);

const driverCodeSchema = new Schema(
  {
    java: String,
    python: String,
    javascript: String,
    cpp: String,
  },
  { _id: false },
);

const testCaseSchema = new Schema(
  {
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const solutionSchema = new Schema(
  {
    approach: {
      type: String,
      required: true,
    },
    timeComplexity: {
      type: String,
      required: true,
    },
    spaceComplexity: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const problemSchema = new Schema(
  {
    number: Number,
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      required: true,
    },

    timeLimit: {
      type: Number,
      default: 2,
      min: 1,
    },

    memoryLimit: {
      type: Number,
      default: 256,
      min: 1,
    },

    constraints: [
      {
        type: String,
        trim: true,
      },
    ],

    examples: {
      type: [exampleSchema],
      default: [],
    },

    starterCode: {
      type: starterCodeSchema,
      default: {},
    },

    driverCode: {
      type: driverCodeSchema,
      default: {},
    },

    testCases: {
      type: [testCaseSchema],
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one test case is required",
      },
    },

    hints: {
      type: [String],
      default: [],
    },

    solution: {
      type: solutionSchema,
    },

    tags: {
      type: [String],
      default: [],
    },

    companies: {
      type: [String],
      default: [],
    },

    topics: {
      type: [String],
      default: [],
    },

    solutionCode: {
      type: String,
      default: "",
    },

    attachment: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      type: { type: String, enum: ["url", "video", "pdf", "image", "zip", ""], default: "" },
    },

    likes: Number,
    dislikes: Number
  },
  {
    timestamps: true,
  },
);

export const Problem = mongoose.model("Problem", problemSchema);
