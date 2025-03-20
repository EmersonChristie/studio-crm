interface FileUploaderProps {
  value: File[] | undefined;
  onChange: (files: File[] | undefined) => void;
  disabled?: boolean;
  maxSize?: number;
}

export function FileUploader({
  value,
  onChange,
  disabled,
  maxSize
}: FileUploaderProps) {
  // Component implementation
}
