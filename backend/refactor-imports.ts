import { Project } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
});

project.getSourceFiles('src/**/*.ts').forEach((sourceFile) => {
  const imports = sourceFile.getImportDeclarations();

  imports.forEach((importDecl) => {
    const importPath = importDecl.getModuleSpecifierValue();

    // Nếu đang dùng alias cũ thì thay bằng alias mới
    if (importPath.startsWith('@module/')) {
      const newPath = importPath.replace(/^@module\//, '@modules/');
      importDecl.setModuleSpecifier(newPath);
      console.log(
        `[✔] ${sourceFile.getBaseName()}: ${importPath} → ${newPath}`,
      );
    }
  });
});

project.saveSync();
