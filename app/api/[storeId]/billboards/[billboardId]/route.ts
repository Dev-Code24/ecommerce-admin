import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { billboardId: string } }) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }

    const billBoard = await prismadb.billBoard.findUnique({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billBoard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string; billboardId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();
    const { label, imageUrl } = body;
    if (!label) {
      return new NextResponse("Label is required for a billboard", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image URL is required for a billboard", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }

    const storeByUserID = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserID) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb.billBoard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string; billboardId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }
    const storeByUserID = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserID) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billBoard = await prismadb.billBoard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billBoard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
