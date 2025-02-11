import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

interface AddPromptButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

export function AddPromptButton({ children, ...props }: AddPromptButtonProps) {
  return (
    <Button {...props}>
      <PlusIcon />
      {children || "Add Prompt"}
    </Button>
  )
}
