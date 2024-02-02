declare interface MongoToParseErrorType {
    message: string;
    code: number;
    type: string;
    logMessage?: string;
    skipSentry?: boolean;
    params?: {
        [key: string]: unknown;
    };
}
declare class MongoToParseError extends Error {
    readonly skipSentry: boolean;
    readonly code: number;
    private readonly type;
    private readonly logMessage;
    private readonly params;
    constructor(error: MongoToParseErrorType);
    toJSON(): {
        [key: string]: unknown;
    };
}
export { MongoToParseError };
