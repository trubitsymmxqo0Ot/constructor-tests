import { create } from "zustand";

interface InitialStateProps {
  user: {
    email: string;
    password: string;
  };
}

interface IActions {
  setData: (email: string | undefined, password: string | undefined) => void;
}

const initialState: InitialStateProps = {
  user: {
    email: "",
    password: "",
  },
};

interface ILogin extends InitialStateProps, IActions {}

export const useLogin = create<ILogin>((set) => ({
  ...initialState,
  setData: (email, password) => {
    set((state) => ({
      user: {
        ...state.user,
        email: email ?? "",
        password: password ?? "",
      },
    }));
  },
}));
