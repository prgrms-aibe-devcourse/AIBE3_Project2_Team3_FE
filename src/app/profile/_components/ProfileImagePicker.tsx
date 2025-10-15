import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/global/components/ui/avatar";
import { Button } from "@/global/components/ui/button";
import { DEFAULT_AVATAR } from "@/global/consts";
import { useEffect, useRef, useState } from "react";

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png"];

type Props = {
  // 서버에서 내려준 현재 프로필 이미지 URL(없으면 null/undefined)
  currentImageUrl?: string | null;
  onFileChange?: (file: File | null) => void;
  // 저장 중 상태(선택)
  disabled?: boolean;
};

export function ProfileImagePicker({
  currentImageUrl,
  onFileChange,
  disabled,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const open = () => fileInputRef.current?.click();

  const clear = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileChange?.(null);
  };

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // 타입/용량 검증은 생략했지만 여기에 넣으면 됨
    setFile(f);
    onFileChange?.(f);
  };

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const src = preview ?? (currentImageUrl || undefined);

  return (
    <div className="flex items-center space-x-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={src || DEFAULT_AVATAR} alt="프로필" />
        <AvatarFallback>이미지</AvatarFallback>
      </Avatar>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={open}
            disabled={disabled}
          >
            프로필 사진 변경
          </Button>
          {file && (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={clear}
              disabled={disabled}
            >
              선택 해제
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">JPG/PNG, 최대 5MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={onChangeFile}
        />
      </div>
    </div>
  );
}
