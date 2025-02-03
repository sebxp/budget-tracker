// jest.setup.js

import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";
jest.mock("next/router");
jest.mock("axios");

// Polyfill TextEncoder and TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
