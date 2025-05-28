require("@testing-library/jest-dom");
require("jest-fetch-mock").enableMocks();
// jest.setup.js
process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
