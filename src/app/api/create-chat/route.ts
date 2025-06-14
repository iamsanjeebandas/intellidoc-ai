// api/create-chat/route.ts
import { db } from "@/lib/db";
import { getS3Url } from "@/lib/db/s3";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log("Received file_key:", file_key);
    console.log("Received file_name:", file_name);

    // Call function to process the file
    await loadS3IntoPinecone(file_key);
    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId: userId,
      })
      .returning({
        insertedId: chats.id,
      });
    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // Log error details
    console.error("Error in POST request:", error);

    // Return a proper error response
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
