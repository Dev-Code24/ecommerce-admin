"use client";

import { Plus as PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { APIList } from "@/components/ui/api-list";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Billboards (${data.length})`} description="Manage billboards for your stores" />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="API calls for billboard" />
      <Separator />
      <APIList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};
