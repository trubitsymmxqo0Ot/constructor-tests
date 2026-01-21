import type { User } from "../types/types.ts";

class userDTO {
  email;
  password;
  id;
  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
  }
}

export default userDTO;