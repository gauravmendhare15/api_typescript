interface IResponse {
    flag: boolean;
    message: string;
    result?: any;
    error?: any;
    code?: number;
}

export { IResponse }