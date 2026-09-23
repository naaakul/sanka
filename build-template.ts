import { Template, defaultBuildLogger } from "e2b";

async function main() {
  const template = Template()
    .fromDockerfile("./sandbox-templates/nextjs/e2b.Dockerfile");

  await Template.build(template, {
    alias: "sanka-nextjs",
    onBuildLogs: defaultBuildLogger(),
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});