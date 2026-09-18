type ProspectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProspectPage({
  params,
}: ProspectPageProps) {
  const { id } = await params;

  return (
    <section>
      <h1 className="text-3xl font-bold text-foreground">
        Prospect numéro {id}
      </h1>
    </section>
  );
}