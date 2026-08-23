"use server";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactResult = {
  success: boolean;
  message: string;
};

export async function submitContact(input: ContactInput): Promise<ContactResult> {
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const subject = (input.subject ?? "").trim();
  const message = (input.message ?? "").trim();

  if (name.length < 2) {
    return { success: false, message: "Please enter your name." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }
  if (subject.length < 2) {
    return { success: false, message: "Please add a subject." };
  }
  if (message.length < 10) {
    return { success: false, message: "Your message should be at least 10 characters." };
  }

  try {
    await db.insert(contactMessages).values({ name, email, subject, message });
    return {
      success: true,
      message: "Message received! Our squad will get back to you within 24 hours.",
    };
  } catch (err) {
    console.error("Failed to save contact message:", err);
    return {
      success: false,
      message: "Something went wrong on our end. Please try again or email us directly.",
    };
  }
}
