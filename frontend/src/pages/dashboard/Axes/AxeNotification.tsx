import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, X } from "lucide-react"

interface AxeNotificationProps {
  notification: {
    type: "success" | "error"
    message: string
  } | null
  onClose: () => void
}

export const AxeNotification = ({ notification, onClose }: AxeNotificationProps) => {
  if (!notification) return null

  return (
    <Alert
      className={`${notification.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
    >
      <div className="flex items-center gap-2">
        {notification.type === "success" ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-600" />
        )}
        <AlertDescription className={notification.type === "success" ? "text-green-800" : "text-red-800"}>
          {notification.message}
        </AlertDescription>
        <Button variant="ghost" size="sm" onClick={onClose} className="ml-auto h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  )
}
