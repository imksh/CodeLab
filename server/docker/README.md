# CodeLab Docker Execution Engine

This guide details how the CodeLab Code Execution Engine securely executes untrusted user code in an isolated environment using Docker.

## Why Docker?
When users submit code, executing it directly on the host machine is dangerous. Malicious code could attempt to read environment variables, modify the filesystem, or execute infinite loops that crash the Node.js server. 

Docker allows us to sandbox code execution by creating a temporary, isolated, and strictly constrained container for every run.

## Prerequisites
- **Docker Desktop** (or Docker Engine) must be installed and running on the host machine.
- Linux/macOS terminal (for running the build script).

## 1. Building the Runner Image
Before any code can be executed, you must build the base Docker image. This image comes pre-installed with all necessary compilers and runtimes.

1. Open your terminal and navigate to the docker directory:
   ```bash
   cd server/docker
   ```
2. Make the script executable (if it isn't already):
   ```bash
   chmod +x build.sh
   ```
3. Run the build script:
   ```bash
   ./build.sh
   ```
   *Alternatively, run `docker build -t codelab-runner .`*

> **Note:** The image will be tagged as `codelab-runner`. The backend utility hardcodes this image name, so do not alter the tag.

## 2. Supported Languages
The `codelab-runner` image currently supports:
- **JavaScript**: Node.js v20.x
- **Python**: Python 3.10+
- **Java**: OpenJDK 17
- **C++**: GCC/G++ 11+

## 3. How the Engine Works (`codeExecutor.js`)

When a user submits code via the `/api/submissions` endpoint, the `codeExecutor.js` utility follows this lifecycle:

### Step 1: File Generation
A unique execution ID (UUID) is generated. A temporary folder is created on the host machine (e.g., `server/temp/<uuid>`). The user's code and the test case input are saved into this folder (e.g., `main.cpp` and `input.txt`).

### Step 2: Container Invocation
The backend uses `child_process.exec` to spin up a Docker container with strict constraints. 

The command looks like this:
```bash
docker run --rm --network none -v /path/to/temp:/app -w /app --memory 256m codelab-runner sh -c "cat input.txt | timeout 2s <run_command>"
```

### Understanding the Constraints:
- `--rm`: Instantly destroys the container and cleans up resources the moment execution finishes.
- `--network none`: Disconnects the container from the internet. This prevents the code from installing external packages or attacking internal APIs.
- `-v /path/to/temp:/app`: Mounts the temporary folder into the container's `/app` directory, giving it access to the code and input file.
- `-w /app`: Sets the working directory inside the container.
- `--memory 256m`: Hard limits RAM usage to 256 MB. If the code exceeds this (e.g., Memory Limit Exceeded), Docker automatically kills the container (OOM Kill code `137`).
- `timeout 2s`: A Linux utility that hard-kills the internal process if it takes longer than 2 seconds (Time Limit Exceeded).

### Step 3: Result Parsing
The Node.js backend intercepts the `stdout` and `stderr` streams. 
- If the exit code is `137`, it flags a **Memory Limit Exceeded**.
- If the exit code is `124` or killed via timeout, it flags a **Time Limit Exceeded**.
- If `stderr` contains data, it flags a **Runtime Error** or **Compilation Error**.
- Otherwise, it compares the exact output against the `expectedOutput` to determine **Accepted** or **Wrong Answer**.

### Step 4: Cleanup
Regardless of success or failure, the `finally` block recursively deletes the temporary `/temp/<uuid>` directory to prevent the host machine's disk space from filling up over time.
