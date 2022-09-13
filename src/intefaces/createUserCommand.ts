interface CreateUserCommand {
  email: string;
  password: string;
  nickname: string;
  birthday: string;
  gender: string;
  profileImgUrl: string;
}

interface CreateUserReq {
  email: string;
  password: string;
  nickname: string;
  birthday: string;
  gender: string;
}

export { CreateUserCommand, CreateUserReq };
