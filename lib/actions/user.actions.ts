"use server"

import { promises } from "dns";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

interface Params{
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;

}

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
    } : Params
    ) : Promise<void> {
    connectToDB();

    try{
        await User.findOneAndUpdate(
            { id: userId },
            {username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            
            },
            { upsert: true }
        );
    
        if (path === '/profile/edit') {
            revalidatePath
        }
    } catch(error : any){
        throw new Error(`Failed to create/update user : ${error.message}`)
    }

    
}