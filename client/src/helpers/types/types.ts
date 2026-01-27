export interface Response {
  data: {
    email: string;
    password: string;
    token: string;
  };
}

export interface IData {
  email: string;
  password: string;
}