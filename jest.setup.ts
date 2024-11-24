// jest.setup.js or jest.setup.ts

// import { TextEncoder, TextDecoder } from "text-encoding";

import { TextEncoder, TextDecoder } from "util";

globalThis.TextEncoder = TextEncoder as any;
globalThis.TextDecoder = TextDecoder as any;
