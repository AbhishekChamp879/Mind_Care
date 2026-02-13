'use client';

'use client';

'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface FileInputEvent extends React.MouseEvent<HTMLButtonElement> {
  target: HTMLInputElement;
}

interface ImageUploadProps {
  currentImage?: string;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  isLoading?: boolean;
  userName: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageUpload,
  onImageRemove,
  isLoading,
  userName,
}) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = React.useState(false);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP).',
          variant: 'destructive',
        });
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast({
          title: 'File Too Large',
          description: 'Please upload an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      onImageUpload(file);
    },
    [onImageUpload, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false,
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div
      className={`relative mx-auto mb-6 ${
        isDragActive ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      {...getRootProps()}
    >
      <Avatar className="h-32 w-32">
        <AvatarImage src={currentImage} alt={userName} />
        <AvatarFallback className="text-2xl bg-primary/10">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>
      <input {...getInputProps()} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-3 right-3 h-9 w-9 rounded-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              fileInput?.click();
            }}
            disabled={isLoading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload new photo
          </DropdownMenuItem>
          {currentImage && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onImageRemove();
                }}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove photo
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isDragActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full">
          <p className="text-sm font-medium">Drop image here</p>
        </div>
      )}
    </div>
  );
};