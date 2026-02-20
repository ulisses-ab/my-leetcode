FROM node:20-bullseye

# Install any tools your runner scripts might need.
# Adjust this list to match what runner/run.sh uses (python, gcc, etc).
RUN apt-get update && apt-get install -y \
    bash \
    python3 \
    python3-pip \
    build-essential \
    nlohmann-json3-dev \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user to run untrusted code
RUN useradd -ms /bin/bash runner
USER runner

WORKDIR /workspace

# The executor mounts the submission directory at /workspace, so we don't
# copy any project files into this image.

