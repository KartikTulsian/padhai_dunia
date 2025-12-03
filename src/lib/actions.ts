"use server"

import prisma from "./prisma";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: string | boolean }