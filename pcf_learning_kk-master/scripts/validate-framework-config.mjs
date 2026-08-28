import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repositoryRoot = process.cwd();
const configurationPath = path.join(
  repositoryRoot,
  "pcf-framework.config.json",
);

let errorCount = 0;
let successCount = 0;

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

  success(`${description} exists.`);

  return fs.readFileSync(filePath, "utf8");
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

const escapeRegularExpression = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractFirstElementValue = (xml, elementName) => {
  const expression = new RegExp(
    `<${escapeRegularExpression(elementName)}>([^<]+)</${escapeRegularExpression(elementName)}>`,
    "i",
  );

  return expression.exec(xml)?.[1]?.trim();
};

const extractPublisherXml = (solutionXml) => {
  const match = /<Publisher>([\s\S]*?)<\/Publisher>/i.exec(solutionXml);

  return match?.[1];
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

const compareValues = (description, configuredValue, generatedValue) => {
  if (configuredValue === undefined) {
    return;
  }

  if (generatedValue === undefined) {
    failure(
      `${description} could not be read from generated solution metadata.`,
    );

    return;
  }

  if (configuredValue !== generatedValue) {
    failure(`${description} does not match.`, [
      `Configured value: ${configuredValue}`,
      `Generated value:  ${generatedValue}`,
    ]);

    return;
  }

  success(`${description} matches '${configuredValue}'.`);
};

console.log("PCF framework configuration validation");
console.log("======================================");
console.log("");

const configurationContent = readRequiredFile(
  configurationPath,
  "Framework configuration",
);

if (configurationContent === undefined) {
  process.exitCode = 1;
} else {
  let configuration;

  try {
    configuration = JSON.parse(configurationContent);
    success("Framework configuration contains valid JSON.");
  } catch (error) {
    failure("Framework configuration contains invalid JSON.", [
      error instanceof Error ? error.message : String(error),
    ]);
  }

  if (configuration !== undefined) {
    const schemaVersion = getRequiredString(
      configuration.$schemaVersion,
      "$schemaVersion",
    );

    const namespace = getRequiredString(
      configuration.controlDefaults?.namespace,
      "controlDefaults.namespace",
    );

    const renderingFramework = getRequiredString(
      configuration.controlDefaults?.framework,
      "controlDefaults.framework",
    );

    const solutionName = getRequiredString(
      configuration.solution?.name,
      "solution.name",
    );

    const solutionProjectPath = getRequiredString(
      configuration.solution?.projectPath,
      "solution.projectPath",
    );

    const publisherName = getRequiredString(
      configuration.solution?.publisher?.name,
      "solution.publisher.name",
    );

    const publisherPrefix = getRequiredString(
      configuration.solution?.publisher?.prefix,
      "solution.publisher.prefix",
    );

    const packageType = getRequiredString(
      configuration.solution?.packageType,
      "solution.packageType",
    );

    if (schemaVersion === "1.0") {
      success("Configuration schema version is supported.");
    } else if (schemaVersion !== undefined) {
      failure("Configuration schema version is not supported.", [
        `Configured version: ${schemaVersion}`,
        "Supported version:  1.0",
      ]);
    }

    if (renderingFramework === "react") {
      success("Default rendering framework is React.");
    } else if (renderingFramework !== undefined) {
      failure("Default rendering framework must be 'react'.", [
        `Configured value: ${renderingFramework}`,
      ]);
    }

    if (
      namespace !== undefined &&
      /^[A-Za-z][A-Za-z0-9]*(\.[A-Za-z][A-Za-z0-9]*)*$/.test(namespace)
    ) {
      success(`Default control namespace '${namespace}' is valid.`);
    } else if (namespace !== undefined) {
      failure("Default control namespace is invalid.", [
        `Configured value: ${namespace}`,
        "Use dot-separated identifiers containing letters and numbers.",
      ]);
    }

    if (
      publisherPrefix !== undefined &&
      /^[A-Za-z][A-Za-z0-9]{1,7}$/.test(publisherPrefix)
    ) {
      success(`Publisher prefix '${publisherPrefix}' is valid.`);
    } else if (publisherPrefix !== undefined) {
      failure("Publisher prefix is invalid.", [
        `Configured value: ${publisherPrefix}`,
        "The prefix must contain 2 to 8 alphanumeric characters.",
        "The prefix must start with a letter.",
      ]);
    }

    const supportedPackageTypes = ["Unmanaged", "Managed", "Both"];

    if (
      packageType !== undefined &&
      supportedPackageTypes.includes(packageType)
    ) {
      success(`Package type '${packageType}' is supported.`);
    } else if (packageType !== undefined) {
      failure("Package type is invalid.", [
        `Configured value: ${packageType}`,
        `Supported values: ${supportedPackageTypes.join(", ")}`,
      ]);
    }

    if (solutionProjectPath !== undefined && solutionName !== undefined) {
      const absoluteSolutionProjectPath = path.resolve(
        repositoryRoot,
        solutionProjectPath,
      );

      const solutionProjectFile = path.join(
        absoluteSolutionProjectPath,
        `${solutionName}.cdsproj`,
      );

      const solutionXmlFile = path.join(
        absoluteSolutionProjectPath,
        "src",
        "Other",
        "Solution.xml",
      );

      const solutionProjectContent = readRequiredFile(
        solutionProjectFile,
        "Dataverse solution project",
      );

      const solutionXmlContent = readRequiredFile(
        solutionXmlFile,
        "Dataverse Solution.xml",
      );

      if (solutionXmlContent !== undefined) {
        const generatedSolutionName = extractFirstElementValue(
          solutionXmlContent,
          "UniqueName",
        );

        const publisherXml = extractPublisherXml(solutionXmlContent);

        const generatedPublisherName =
          publisherXml === undefined
            ? undefined
            : extractFirstElementValue(publisherXml, "UniqueName");

        const generatedPublisherPrefix =
          publisherXml === undefined
            ? undefined
            : extractFirstElementValue(publisherXml, "CustomizationPrefix");

        compareValues("Solution name", solutionName, generatedSolutionName);

        compareValues("Publisher name", publisherName, generatedPublisherName);

        compareValues(
          "Publisher prefix",
          publisherPrefix,
          generatedPublisherPrefix,
        );
      }

      if (solutionProjectContent !== undefined) {
        const projectReferences = extractProjectReferences(
          solutionProjectContent,
        );

        if (projectReferences.length === 0) {
          failure("The solution project contains no PCF project references.");
        } else {
          success(
            `The solution project contains ${projectReferences.length} project reference(s).`,
          );
        }

        for (const projectReference of projectReferences) {
          const referencedProjectPath = path.resolve(
            absoluteSolutionProjectPath,
            projectReference,
          );

          const relativeReferencedProjectPath = path.relative(
            repositoryRoot,
            referencedProjectPath,
          );

          if (!projectReference.endsWith(".pcfproj")) {
            failure("A solution project reference is not a PCF project.", [
              `Reference: ${projectReference}`,
            ]);

            continue;
          }

          if (!fs.existsSync(referencedProjectPath)) {
            failure("A referenced PCF project does not exist.", [
              `Reference: ${projectReference}`,
              `Resolved path: ${relativeReferencedProjectPath}`,
            ]);

            continue;
          }

          success(
            `Referenced PCF project exists: ${relativeReferencedProjectPath}`,
          );
        }
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
  console.error("Framework configuration validation failed.");
  process.exitCode = 1;
} else {
  console.log("");
  console.log("Framework configuration validation succeeded.");
}
