# Node.js CSV Parser CI/CD

This project is a Node.js application for parsing CSV files, complete with a CI/CD pipeline using GitHub Actions.
CI/CD updates can be check on https://csv-parser.digitools.today
## Table of Contents

- About the Project
- Prerequisites
- Installation
- Usage
- Running the Application
- CI/CD Pipeline
- Deploying to Server
- Contributing
- License

## About the Project

Provide a brief description of the project, its purpose, and what it does. Mention key features and technologies used.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (version 20.x recommended)
- npm (Node Package Manager)
- PM2 (for process management)
- SSH access to the deployment server
- Git

## Installation

To install this project, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/yourrepository.git
   cd yourrepository
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

## Usage

Describe how to use the project, including examples of common use cases.

## Running the Application

To run the application, follow these steps:

1. Build the project:

   ```sh
   npm run build
   ```

2. Create the `uploads` directory:

   ```sh
   mkdir -p dist/uploads
   ```

3. Start the application using PM2:

   ```sh
   pm2 start npm --name "csv-parser" -- start
   ```

## CI/CD Pipeline

The project includes a GitHub Actions workflow for continuous integration and deployment. The workflow:

- Runs tests on every push and pull request to the `master` branch.
- Deploys the application to a remote server after passing tests.

### GitHub Actions Workflow

The workflow is defined in `.github/workflows/ci-cd.yml`:

```yaml
name: Node.js CSV Parser CI/CD

on:
  push:
    branches: [ "master" ]
  pull_request:
    branches: [ "master" ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci --force
    - run: npm run build --if-present

    - name: Create uploads folder
      run: mkdir -p dist/uploads

    - run: npm test

    - name: Add remote host to known_hosts
      run: |
        mkdir -p ~/.ssh
        ssh-keyscan -p ${{ secrets.SiGiRi_SSH_PORT }} ${{ secrets.SiGiRi_SSH_HOST }} >> ~/.ssh/known_hosts

    - name: Deploy to Server
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SiGiRi_SSH_PRIVATE_KEY }}
        SSH_HOST: ${{ secrets.SiGiRi_SSH_HOST }}
        SSH_USER: ${{ secrets.SiGiRi_SSH_USER }}
        SSH_PORT: ${{ secrets.SiGiRi_SSH_PORT }}
      run: |
        echo "$SSH_PRIVATE_KEY" > private_key
        chmod 600 private_key
        rsync -avz -e "ssh -i private_key -p $SSH_PORT" --exclude node_modules ./ $SSH_USER@$SSH_HOST:/home/ubuntu/csv-parser
        ssh -i private_key -p $SSH_PORT $SSH_USER@$SSH_HOST << 'EOF'
          cd /home/ubuntu/csv-parser
          npm install --production
          mkdir -p uploads
          pm2 restart csv-parser || pm2 start npm --name "csv-parser" -- start
          exit
        EOF
      shell: bash
```

## Deploying to Server

To deploy the application manually, follow these steps:

1. Ensure SSH access to the server.
2. Run the build process and create the `uploads` folder:

   ```sh
   npm run build
   mkdir -p dist/uploads
   ```

3. Deploy the code to the server:

   ```sh
   rsync -avz -e "ssh -p [SSH_PORT]" --exclude node_modules ./ [SSH_USER]@[SSH_HOST]:/home/ubuntu/csv-parser
   ```

4. SSH into the server and start the application using PM2:

   ```sh
   ssh -p [SSH_PORT] [SSH_USER]@[SSH_HOST]
   cd /home/ubuntu/csv-parser
   npm install --production
   pm2 restart csv-parser || pm2 start npm --name "csv-parser" -- start
   exit
   ```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.
