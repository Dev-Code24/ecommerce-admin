import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse(`Unauthenticated Entry`, { status: 401 });
    }
    if (!name) {
      return new NextResponse(`Name is a required field.`, { status: 400 });
    }
    if (!value) {
      return new NextResponse(`Value is a required field.`, { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse(`Store Id is required.`, { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorised", { status: 403 });
    }

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.error(`[SIZES/POST]`, error);
    return new NextResponse(`Internal Error`, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse(`Store Id is required.`, { status: 400 });
    }

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(sizes);
  } catch (error) {
    console.error(`[SIZES/GET]`, error);
    return new NextResponse(`Internal Error`, { status: 500 });
  }
}
