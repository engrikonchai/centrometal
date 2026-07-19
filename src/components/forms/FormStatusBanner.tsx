import { CheckCircle2, AlertTriangle } from "lucide-react";

export function FormStatusBanner({
  variant,
  title,
  body,
}: {
  variant: "success" | "error";
  title: string;
  body: string;
}) {
  const isSuccess = variant === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertTriangle;

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={
        "flex items-start gap-3 rounded-button border p-4 " +
        (isSuccess ? "border-green/30 bg-green/10" : "border-error/30 bg-error/10")
      }
    >
      <Icon
        className={"mt-0.5 size-5 shrink-0 " + (isSuccess ? "text-green" : "text-error")}
        strokeWidth={2}
        aria-hidden="true"
      />
      <div>
        <p className={"font-semibold " + (isSuccess ? "text-green" : "text-error")}>{title}</p>
        <p className="mt-0.5 text-sm text-muted">{body}</p>
      </div>
    </div>
  );
}
