"use client";
import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { ImagePlus as ImagePlusIcon, Trash as TrashIcon } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, onRemove, value }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <div>
      <div className="mt-4 flex items-center gap-4">
        {value.map((url) => {
          return (
            <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
              <div className="z-10 absolute top-2 right-2">
                <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
              <Image fill className="object-cover" alt="Image" src={url} />
            </div>
          );
        })}
        <CldUploadWidget
          onUpload={onUpload}
          // onSuccess={onUpload}
          uploadPreset="nowrqiym"
        >
          {({ open }) => {
            const onClick = () => {
              open();
            };

            return (
              <Button type="button" variant="secondary" disabled={disabled} onClick={onClick}>
                <ImagePlusIcon className="h-4 w-4 mr-2" />
                Upload an Image
              </Button>
            );
          }}
        </CldUploadWidget>
      </div>
    </div>
  );
};

export default ImageUpload;
