import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse(`Unauthenticated Entry`, { status: 401 });
    }
    if (!label) {
      return new NextResponse(`Label is a required field.`, { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse(`Image URL is a required field.`, { status: 400 });
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

    const billBoard = await prismadb.billBoard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billBoard);
  } catch (error) {
    console.error(`[BILLBOARDS/POST]`, error);
    return new NextResponse(`Internal Error`, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse(`Store Id is required.`, { status: 400 });
    }

    const billBoards = await prismadb.billBoard.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billBoards);
  } catch (error) {
    console.error(`[BILLBOARDS/GET]`, error);
    return new NextResponse(`Internal Error`, { status: 500 });
  }
}
