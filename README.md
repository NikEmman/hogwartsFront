# hogwartsFront

## Description

This Next.js React app serves as the frontend for displaying Hogwarts houses. It connects to the Express.js backend to fetch house data.

The UI dynamically renders houses fetched through the API and includes a search bar for filtering results by name. Additionally, users can search for individual house traits.

## Details

Find it live, hosted on [Vercel](https://hogwarts-front.vercel.app/)

## Instructions to run locally

- Open the console and `cd` into the desired folder
- Clone the repository using the following command:`git clone git@github.com:NikEmman/hogwartsFront.git`
- Navigate into the repo folder `cd hogwartsFront` and run `npm install` to install the dependencies
- In the main folder (where `package.json` file is located), create a new file and name it `.env.local`, add to it the following content `NEXT_PUBLIC_API_URL=http://localhost:3001`. That is the backend API url where the front-end's calls will be directed to
- To start the server run `npm run dev`. You can now access the project through the browser at the url `http://localhost:3000`
- If you wish to run it together with the backend server, follow the instructions on [back-end repo](https://github.com/NikEmman/hogwartsBackend)

## Test suite

- After cloning the repo and installing dependencies (see directions above), you can run the integration test suite with this command `npm test` where a summary of passed/failed tests will appear
