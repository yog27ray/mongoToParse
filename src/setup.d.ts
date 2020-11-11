import { Express } from 'express';
declare const app: Express;
declare function dropDB(): Promise<any>;
export { app, dropDB };
