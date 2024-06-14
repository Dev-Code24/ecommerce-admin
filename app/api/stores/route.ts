import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse(`Unauthorised Entry`, { status: 401 });
    }
    if (!name) {
      return new NextResponse(`Name is a required field.`, { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.error(`[Stores/POST]`, error);
    return new NextResponse(`Internal Error`, { status: 500 });
  }
}
