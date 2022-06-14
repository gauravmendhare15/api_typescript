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

export { IuserLogin, IuserSearch }