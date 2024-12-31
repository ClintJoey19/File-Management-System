export type UserRole = "user" | "admin";

export type User = {
  id: String;
  firstname: String;
  lastname: String;
  email: String;
  password?: String;
  image: String;
  role: String;
  createdAt: Date;
  updatedtAt: Date;
};
