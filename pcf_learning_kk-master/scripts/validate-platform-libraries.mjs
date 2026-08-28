import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repositoryRoot = process.cwd();
const configurationPath = path.join(
  repositoryRoot,
  "pcf-framework.config.json",
);

let successCount = 0;
let errorCount = 0;

const success = (message) => {
  successCount += 1;
  console.log(`PASS: ${message}`);
};

const failure = (message, details = []) => {
  errorCount += 1;
  console.error(`FAIL: ${message}`);

  for (const detail of details) {
    console.error(`      ${detail}`);
  }
};

const readRequiredFile = (filePath, description) => {
  if (!fs.existsSync(filePath)) {
    failure(`${description} does not exist.`, [
      `Expected path: ${path.relative(repositoryRoot, filePath)}`,
    ]);

    return undefined;
  }

  return fs.readFileSync(filePath, "utf8");
};

const readJsonFile = (filePath, description) => {
  const content = readRequiredFile(filePath, description);

  if (content === undefined) {
    return undefined;
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    failure(`${description} contains invalid JSON.`, [
      error instanceof Error ? error.message : String(error),
    ]);

    return undefined;
  }
};

const getRequiredString = (value, propertyPath) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    failure(
      `Configuration property '${propertyPath}' must be a non-empty string.`,
    );

    return undefined;
  }

  return value.trim();
};

const extractProjectReferences = (projectXml) => {
  const references = [];
  const expression = /<ProjectReference\s+Include="([^"]+)"\s*\/?>/gi;

  let match = expression.exec(projectXml);

  while (match !== null) {
    references.push(match[1]);
    match = expression.exec(projectXml);
  }

  return references;
};

const extractPlatformLibraryVersion = (manifestXml, libraryName) => {
  const escapedLibraryName = libraryName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const expression = new RegExp(
    `<platform-library\\s+` +
      `(?=[^>]*\\bname="${escapedLibraryName}")` +
      `(?=[^>]*\\bversion="([^"]+)")[^>]*/?>`,
    "i",
  );

  return expression.exec(manifestXml)?.[1]?.trim();
};

const normalizePackageVersion = (version) => {
  if (typeof version !== "string") {
    return undefined;
  }

  return version.trim().replace(/^[~^]/, "");
};

const compareVersion = (
  description,
  approvedVersion,
  actualVersion,
  controlPath,
) => {
  if (approvedVersion === undefined) {
    return;
  }

  if (actualVersion === undefined) {
    failure(`${description} is missing.`, [
      `Control: ${controlPath}`,
      `Expected version: ${approvedVersion}`,
    ]);

    return;
  }

  if (normalizePackageVersion(actualVersion) !== approvedVersion) {
    failure(`${description} does not match the approved version.`, [
      `Control:          ${controlPath}`,
      `Approved version: ${approvedVersion}`,
      `Actual version:   ${actualVersion}`,
    ]);

    return;
  }

  success(`${description} matches ${approvedVersion} for ${controlPath}.`);
};

const findManifestFile = (controlDirectory) => {
  const entries = fs.readdirSync(controlDirectory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const candidate = path.join(
      controlDirectory,
      entry.name,
      "ControlManifest.Input.xml",
    );

    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return undefined;
};

console.log("PCF platform-library validation");
console.log("===============================");
console.log("");

const configuration = readJsonFile(
  configurationPath,
  "Framework configuration",
);

if (configuration !== undefined) {
  const approvedReactVersion = getRequiredString(
    configuration.platformLibraries?.react,
    "platformLibraries.react",
  );

  const approvedFluentVersion = getRequiredString(
    configuration.platformLibraries?.fluent,
    "platformLibraries.fluent",
  );

  const solutionName = getRequiredString(
    configuration.solution?.name,
    "solution.name",
  );

  const solutionProjectPath = getRequiredString(
    configuration.solution?.projectPath,
    "solution.projectPath",
  );

  if (solutionName !== undefined && solutionProjectPath !== undefined) {
    const solutionDirectory = path.resolve(repositoryRoot, solutionProjectPath);

    const solutionProjectFile = path.join(
      solutionDirectory,
      `${solutionName}.cdsproj`,
    );

    const solutionProjectXml = readRequiredFile(
      solutionProjectFile,
      "Dataverse solution project",
    );

    if (solutionProjectXml !== undefined) {
      const projectReferences = extractProjectReferences(
        solutionProjectXml,
      ).filter((reference) => reference.toLowerCase().endsWith(".pcfproj"));

      if (projectReferences.length === 0) {
        failure("The Dataverse solution contains no PCF project references.");
      } else {
        success(
          `Discovered ${projectReferences.length} referenced PCF control(s).`,
        );
      }

      for (const projectReference of projectReferences) {
        const controlProjectPath = path.resolve(
          solutionDirectory,
          projectReference,
        );

        const controlDirectory = path.dirname(controlProjectPath);

        const relativeControlDirectory = path.relative(
          repositoryRoot,
          controlDirectory,
        );

        console.log("");
        console.log(`Control: ${relativeControlDirectory}`);
        console.log("-".repeat(72));

        if (!fs.existsSync(controlProjectPath)) {
          failure("Referenced PCF project does not exist.", [
            `Expected path: ${path.relative(
              repositoryRoot,
              controlProjectPath,
            )}`,
          ]);

          continue;
        }

        const manifestPath = findManifestFile(controlDirectory);

        if (manifestPath === undefined) {
          failure("ControlManifest.Input.xml could not be found.", [
            `Control: ${relativeControlDirectory}`,
          ]);

          continue;
        }

        const manifestXml = readRequiredFile(
          manifestPath,
          "PCF control manifest",
        );

        const packageJsonPath = path.join(controlDirectory, "package.json");

        const packageJson = readJsonFile(
          packageJsonPath,
          "PCF control package.json",
        );

        if (manifestXml === undefined || packageJson === undefined) {
          continue;
        }

        const manifestReactVersion = extractPlatformLibraryVersion(
          manifestXml,
          "React",
        );

        const manifestFluentVersion = extractPlatformLibraryVersion(
          manifestXml,
          "Fluent",
        );

        const packageReactVersion =
          packageJson.dependencies?.react ?? packageJson.devDependencies?.react;

        const packageReactDomVersion =
          packageJson.dependencies?.["react-dom"] ??
          packageJson.devDependencies?.["react-dom"];

        const packageFluentVersion =
          packageJson.dependencies?.["@fluentui/react-components"] ??
          packageJson.devDependencies?.["@fluentui/react-components"];

        compareVersion(
          "Manifest React platform-library version",
          approvedReactVersion,
          manifestReactVersion,
          relativeControlDirectory,
        );

        compareVersion(
          "Manifest Fluent platform-library version",
          approvedFluentVersion,
          manifestFluentVersion,
          relativeControlDirectory,
        );

        compareVersion(
          "React npm dependency",
          approvedReactVersion,
          packageReactVersion,
          relativeControlDirectory,
        );

        compareVersion(
          "React DOM npm dependency",
          approvedReactVersion,
          packageReactDomVersion,
          relativeControlDirectory,
        );

        compareVersion(
          "Fluent UI npm dependency",
          approvedFluentVersion,
          packageFluentVersion,
          relativeControlDirectory,
        );
      }
    }
  }
}

console.log("");
console.log("--------------------------------------");
console.log(`Successful checks: ${successCount}`);
console.log(`Failed checks:     ${errorCount}`);

if (errorCount > 0) {
  console.error("");
  console.error("PCF platform-library validation failed.");
  process.exitCode = 1;
} else {
  console.log("");
  console.log("PCF platform-library validation succeeded.");
}
