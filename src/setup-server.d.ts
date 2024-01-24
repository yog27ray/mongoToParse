import { Express } from 'express';
declare const app: Express;
declare function dropDB(): Promise<void>;
export { app, dropDB };
