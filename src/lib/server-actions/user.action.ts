"use server";
import { auth } from "../auth";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";

export const addNewUser = async (
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  image: String,
  path: String
) => {
  try {
    const user = await auth();

    if (!user) throw new Error("Unauthorized user!");

    // TODO: add a new user to db
  } catch (error) {
    console.error(error);
    throw error;
  }
};
