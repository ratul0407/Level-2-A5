enum Role {
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
  ADMIN = "ADMIN",
}

interface IUser {
  name: string;
  email: string;
  password: string;
  picture?: string;
  Role: Role;
}
