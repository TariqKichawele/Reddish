import { currentUser } from "@clerk/nextjs/server";
import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { addUser } from "./addUser";

interface UserResult {
    _id: string;
    username: string;
    imageUrl: string;
    email: string;
}

const parseUsername = (username: string) => {
    // Remove whitespace and convert to camelCase with random number to avoid conflicts
    const randomNum = Math.floor(1000 + Math.random() * 9000);
  
    // Convert whitespace to camelCase and add random number to avoid conflicts
    return (
      username
        .replace(/\s+(.)/g, (_, char) => char.toUpperCase()) // Convert whitespace to camelCase
        .replace(/\s+/g, "") + randomNum // Remove all whitespace and add random number
    );
};

export async function getUser():Promise<UserResult | { error: string }> {
    try {
        console.log("Fetching user from Clerk");
        const loggedInUser = await currentUser();

        if (!loggedInUser) {
            throw new Error("User not found");
        }

        const getExistingUserQuery = defineQuery(
            `*[_type == "user" && _id == $id][0]`
        )

        const existingUser = await sanityFetch({
            query: getExistingUserQuery,
            params: { id: loggedInUser.id }
        });

        if (existingUser.data?._id) {
            const user = {
                _id: existingUser.data._id,
                username: existingUser.data.username,
                imageUrl: existingUser.data.imageUrl,
                email: existingUser.data.email,
            }

            return user;
        }

        const newUser = await addUser({
            id: loggedInUser.id,
            username: parseUsername(loggedInUser.fullName!),
            email:
                loggedInUser.primaryEmailAddress?.emailAddress ||
                loggedInUser.emailAddresses[0].emailAddress,
            imageUrl: loggedInUser.imageUrl,
        });

        const user = {
            _id: newUser._id,
            username: newUser.username,
            imageUrl: newUser.imageUrl,
            email: newUser.email,
        }

        return user;
    } catch (error) {
        console.error("Error fetching user", error);
        return { error: "Failed to fetch user" };
    }
}