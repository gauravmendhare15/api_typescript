interface IuserLogin {
    email: string;
    password: string;
    _id?: string;
}

interface IuserSearch {
    search: string;
    page: number;
    limit: number;
}

interface socketUser {
    _id: string;
    socketId: string;
    groups?: string[];
    email: string;
    name: string;
}

export { IuserLogin, IuserSearch, socketUser }