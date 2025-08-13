const Settings = () => {
  return (
    <main className="container py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <section className="mt-4 max-w-prose space-y-3">
        <p className="text-muted-foreground">
          Private by default. Conversations aren’t stored unless you choose to save (coming soon).
        </p>
        <p className="text-muted-foreground">More preferences coming soon.</p>
      </section>
    </main>
  );
};

export default Settings;
