import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const repositoryRoot = process.cwd();

const configurationPath = path.join(
    repositoryRoot,
    "pcf-framework.config.json"
);

const fail = (message, details = []) => {
    console.error(`FAIL: ${message}`);

    for (const detail of details) {
        console.error(`      ${detail}`);
    }

    process.exitCode = 1;
};

const readJsonFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, "utf8");

    return JSON.parse(content);
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

const findSolutionProject = (solutionDirectory, solutionName) => {
    const expectedProject = path.join(
        solutionDirectory,
        `${solutionName}.cdsproj`
    );

    if (fs.existsSync(expectedProject)) {
        return expectedProject;
    }

    const solutionProjects = fs
        .readdirSync(solutionDirectory)
        .filter((fileName) => fileName.endsWith(".cdsproj"));

    if (solutionProjects.length === 1) {
        return path.join(solutionDirectory, solutionProjects[0]);
    }

    throw new Error(
        `Unable to identify the solution project in ${solutionDirectory}.`
    );
};

const validateControl = (
    controlNumber,
    controlCount,
    controlDirectory,
    controlProject
) => {
    const relativeControlDirectory = path.relative(
        repositoryRoot,
        controlDirectory
    );

    const relativeControlProject = path.relative(
        repositoryRoot,
        controlProject
    );

    const packageJsonPath = path.join(
        controlDirectory,
        "package.json"
    );

    console.log("");
    console.log(
        `Control ${controlNumber} of ${controlCount}: ${relativeControlDirectory}`
    );
    console.log("-".repeat(72));

    if (!fs.existsSync(controlProject)) {
        fail("Referenced PCF project does not exist.", [
            `Expected project: ${relativeControlProject}`,
        ]);

        return false;
    }

    if (!fs.existsSync(packageJsonPath)) {
        fail("Referenced PCF project has no package.json.", [
            `Control directory: ${relativeControlDirectory}`,
        ]);

        return false;
    }

    let packageJson;

    try {
        packageJson = readJsonFile(packageJsonPath);
    } catch (error) {
        fail("Unable to read the control package.json.", [
            `Control directory: ${relativeControlDirectory}`,
            error instanceof Error ? error.message : String(error),
        ]);

        return false;
    }

    if (
        typeof packageJson.scripts?.validate !== "string" ||
        packageJson.scripts.validate.trim().length === 0
    ) {
        fail("The PCF control does not define an npm validation script.", [
            `Control directory: ${relativeControlDirectory}`,
            "Expected package.json script: validate",
        ]);

        return false;
    }

    const nodeModulesPath = path.join(
        controlDirectory,
        "node_modules"
    );

    if (!fs.existsSync(nodeModulesPath)) {
        fail("The PCF control dependencies are not installed.", [
            `Control directory: ${relativeControlDirectory}`,
            `Run: npm install --prefix ${relativeControlDirectory}`,
        ]);

        return false;
    }

    console.log(`Project: ${relativeControlProject}`);
    console.log("Command: npm run validate");
    console.log("");

    const validationResult = spawnSync(
        "npm",
        ["run", "validate"],
        {
            cwd: controlDirectory,
            stdio: "inherit",
            shell: false,
        }
    );

    if (validationResult.error !== undefined) {
        fail("The control validation command could not be started.", [
            `Control directory: ${relativeControlDirectory}`,
            validationResult.error.message,
        ]);

        return false;
    }

    if (validationResult.status !== 0) {
        fail("The PCF control failed validation.", [
            `Control directory: ${relativeControlDirectory}`,
            `Exit code: ${validationResult.status ?? "unknown"}`,
        ]);

        return false;
    }

    console.log("");
    console.log(`PASS: ${relativeControlDirectory}`);

    return true;
};

console.log("PCF control validation");
console.log("======================");

let configuration;

try {
    configuration = readJsonFile(configurationPath);
} catch (error) {
    fail("Unable to load the framework configuration.", [
        error instanceof Error ? error.message : String(error),
    ]);
}

if (configuration !== undefined) {
    const solutionName = configuration.solution?.name;
    const configuredSolutionPath = configuration.solution?.projectPath;

    if (
        typeof solutionName !== "string" ||
        solutionName.trim().length === 0
    ) {
        fail("Configuration property 'solution.name' is missing or invalid.");
    } else if (
        typeof configuredSolutionPath !== "string" ||
        configuredSolutionPath.trim().length === 0
    ) {
        fail(
            "Configuration property 'solution.projectPath' is missing or invalid."
        );
    } else {
        const solutionDirectory = path.resolve(
            repositoryRoot,
            configuredSolutionPath
        );

        if (!fs.existsSync(solutionDirectory)) {
            fail("The configured solution directory does not exist.", [
                `Configured path: ${configuredSolutionPath}`,
            ]);
        } else {
            let solutionProject;

            try {
                solutionProject = findSolutionProject(
                    solutionDirectory,
                    solutionName
                );
            } catch (error) {
                fail("Unable to locate the Dataverse solution project.", [
                    error instanceof Error
                        ? error.message
                        : String(error),
                ]);
            }

            if (solutionProject !== undefined) {
                const solutionProjectXml = fs.readFileSync(
                    solutionProject,
                    "utf8"
                );

                const projectReferences =
                    extractProjectReferences(solutionProjectXml);

                const pcfProjectReferences = projectReferences.filter(
                    (reference) =>
                        reference.toLowerCase().endsWith(".pcfproj")
                );

                if (pcfProjectReferences.length === 0) {
                    fail(
                        "The configured solution contains no PCF project references.",
                        [
                            `Solution project: ${path.relative(
                                repositoryRoot,
                                solutionProject
                            )}`,
                        ]
                    );
                } else {
                    console.log(
                        `Solution: ${path.relative(
                            repositoryRoot,
                            solutionProject
                        )}`
                    );

                    console.log(
                        `PCF controls discovered: ${pcfProjectReferences.length}`
                    );

                    let passedControls = 0;
                    let failedControls = 0;

                    pcfProjectReferences.forEach(
                        (projectReference, index) => {
                            const controlProject = path.resolve(
                                solutionDirectory,
                                projectReference
                            );

                            const controlDirectory = path.dirname(
                                controlProject
                            );

                            const passed = validateControl(
                                index + 1,
                                pcfProjectReferences.length,
                                controlDirectory,
                                controlProject
                            );

                            if (passed) {
                                passedControls += 1;
                            } else {
                                failedControls += 1;
                            }
                        }
                    );

                    console.log("");
                    console.log("========================================");
                    console.log(
                        `Controls discovered: ${pcfProjectReferences.length}`
                    );
                    console.log(`Controls passed:     ${passedControls}`);
                    console.log(`Controls failed:     ${failedControls}`);

                    if (failedControls > 0) {
                        console.error("");
                        console.error("PCF control validation failed.");
                        process.exitCode = 1;
                    } else {
                        console.log("");
                        console.log(
                            "All referenced PCF controls passed validation."
                        );
                    }
                }
            }
        }
    }
}
