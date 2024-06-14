"use client";

import { useState } from "react";
import axios from "axios";

import { Trash as TrashIcon, Copy as CopyIcon, Edit as EditIcon, MoreHorizontal as MoreHorizontalIcon } from "lucide-react";
import { BillboardColumn } from "./columns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: BillboardColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Billboard Id copied to the clipboard");
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
      toast.success("Billboards deleted successfully !");
      router.refresh();
    } catch (error) {
      toast.error("Make sure you removed all categories using this billboard first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <CopyIcon className="h-4 w-4 mr-2" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}>
            <EditIcon className="h-4 w-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
