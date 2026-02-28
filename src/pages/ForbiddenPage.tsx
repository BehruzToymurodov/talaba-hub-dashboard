export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold">403</h1>
        <p className="mt-2 text-muted-foreground">You do not have access to this page.</p>
      </div>
    </div>
  );
}
