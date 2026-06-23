import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import crypto from "crypto";

const execAsync = promisify(exec);

const LANGUAGE_CONFIG = {
  javascript: {
    extension: "js",
    image: "codelab-runner",
    runCommand: (filename) => `node ${filename}`,
  },
  python: {
    extension: "py",
    image: "codelab-runner",
    runCommand: (filename) => `python3 ${filename}`,
  },
  java: {
    extension: "java",
    image: "codelab-runner",
    compileCommand: () => `javac *.java`,
    runCommand: () => `java Main`,
  },
  cpp: {
    extension: "cpp",
    image: "codelab-runner",
    compileCommand: (filename) => `g++ ${filename} -o main`,
    runCommand: () => `./main`,
  },
};

/**
 * Executes code inside a Docker container.
 * @param {string} language - The programming language (e.g., 'javascript', 'python')
 * @param {string} code - The complete executable source code
 * @param {string} driverCode - The background driver code to execute the user function
 * @param {string} input - The standard input for the execution
 * @param {number} timeLimit - Time limit in seconds
 * @param {number} memoryLimit - Memory limit in MB
 * @returns {Promise<{stdout: string, stderr: string, error: string, executionTime: number}>}
 */
export const executeCode = async (language, code, driverCode = "", input = "", timeLimit = 2, memoryLimit = 256) => {
  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  // Generate unique execution directory
  const runId = crypto.randomUUID();
  const tempDir = path.resolve(`./temp/${runId}`);
  
  const filename = language === "java" ? "Solution.java" : `main.${config.extension}`;
  const filePath = path.join(tempDir, filename);
  const inputPath = path.join(tempDir, "input.txt");

  try {
    // Setup temp directory
    await fs.mkdir(tempDir, { recursive: true });
    
    // Write appropriate files based on language
    if (language === "java") {
      await fs.writeFile(path.join(tempDir, "Solution.java"), code);
      if (driverCode) {
        await fs.writeFile(path.join(tempDir, "Main.java"), driverCode);
      }
    } else {
      let finalCode = code;
      if (driverCode) {
        if (language === "cpp") {
          finalCode = driverCode.replace("/*USER_CODE_HERE*/", code);
        } else {
          finalCode = code + "\n\n" + driverCode;
        }
      }
      await fs.writeFile(filePath, finalCode);
    }
    
    await fs.writeFile(inputPath, input);

    const compileCmd = config.compileCommand ? config.compileCommand(filename) + " && " : "";
    const runCmd = config.runCommand(filename);
    
    // Construct Docker run command
    // --rm: Remove container after run
    // --network none: Disable network access
    // -v: Mount temp dir to /app
    // -w /app: Set working directory
    // --memory: Enforce memory limit
    const dockerCmd = `docker run --rm --network none -v ${tempDir}:/app -w /app --memory ${memoryLimit}m ${config.image} sh -c "${compileCmd}cat input.txt | timeout ${timeLimit}s ${runCmd}"`;

    const startTime = Date.now();
    let result = { stdout: "", stderr: "", error: null, executionTime: 0 };

    try {
      const { stdout, stderr } = await execAsync(dockerCmd, { timeout: (timeLimit + 2) * 1000 });
      result.stdout = stdout;
      result.stderr = stderr;
    } catch (execError) {
      result.stdout = execError.stdout || "";
      result.stderr = execError.stderr || "";
      
      if (execError.killed) {
        result.error = "Time Limit Exceeded";
      } else if (execError.code === 137) { // Docker OOM kill code
        result.error = "Memory Limit Exceeded";
      } else if (execError.code === 124) { // timeout command kill code
        result.error = "Time Limit Exceeded";
      } else {
        result.error = "Runtime Error";
      }
    }

    result.executionTime = Date.now() - startTime;
    return result;

  } finally {
    // Cleanup
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (e) {
      console.error(`Failed to cleanup temp dir ${tempDir}`, e);
    }
  }
};

/**
 * Runs a set of test cases against the user code.
 * (This assumes the user code expects input from stdin and outputs to stdout)
 */
export const runTestCases = async (language, code, driverCode, testCases, timeLimit, memoryLimit) => {
  const results = [];
  let passed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    
    const { stdout, stderr, error, executionTime } = await executeCode(
      language, 
      code, 
      driverCode,
      tc.input, 
      timeLimit, 
      memoryLimit
    );

    const actualOutput = stdout.trim();
    const expectedOutput = tc.output.trim();
    
    let status = "Pending";
    if (error) {
      status = error;
    } else if (stderr) {
      status = "Runtime Error";
    } else if (actualOutput === expectedOutput) {
      status = "Accepted";
    } else {
      status = "Wrong Answer";
    }

    if (status === "Accepted") passed++;

    results.push({
      testCase: i + 1,
      status,
      executionTime,
      input: tc.isHidden ? "Hidden" : tc.input,
      expectedOutput: tc.isHidden ? "Hidden" : expectedOutput,
      actualOutput: tc.isHidden ? "Hidden" : actualOutput,
      stderr
    });

    // Short circuit on first failure for competitive programming style
    if (status !== "Accepted") {
      break;
    }
  }

  const overallStatus = results.length > 0 ? results[results.length - 1].status : "No Test Cases";
  const maxExecutionTime = Math.max(...results.map(r => r.executionTime), 0);

  return {
    status: overallStatus,
    passed,
    total: testCases.length,
    executionTime: maxExecutionTime,
    results
  };
};
