import { createServerClientForApp } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/states";
import { PageHeader } from "@/components/page-header";
import { CreateProjectButton } from "@/components/create-project";
import { IconFolder, IconGrid } from "@/components/icons";

export default async function ProjectsPage() {
  const supabase = await createServerClientForApp();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        description="Organize your ads and remixes into workspaces."
        action={<CreateProjectButton />}
      />
      {!projects || projects.length === 0 ? (
        <EmptyState
          icon={<IconFolder className="h-6 w-6" />}
          title="No projects yet"
          description="Create a project to group your winning ads and AI generations."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
              <CardContent className="p-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <IconGrid className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{project.name}</h3>
                {project.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
