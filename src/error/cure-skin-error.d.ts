declare interface CureSkinErrorType {
    message: string;
    code: number;
    type: string;
    logMessage?: string;
    skipSentry?: boolean;
    params?: {
        [key: string]: any;
    };
}
declare class CureSkinError extends Error {
    readonly skipSentry: boolean;
    readonly code: number;
    private readonly type;
    private readonly logMessage;
    private readonly params;
    constructor(error: CureSkinErrorType);
    toJSON(): {
        [key: string]: unknown;
    };
}
export { CureSkinError };
