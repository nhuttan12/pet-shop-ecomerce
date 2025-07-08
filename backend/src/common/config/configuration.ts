import { readFileSync } from 'fs';
import path from 'path';
import { schema } from './app-config.validation';
import { ValidationType } from './interfaces/config-type.interface';
import { NotAcceptableException } from '@nestjs/common';
import appRootPath from 'app-root-path';
import yaml from 'js-yaml';

const YAML_CONFIG_FILENAME = 'config.env.yaml';
// const YAML_CONFIG_FILENAME = 'config.env.yml';

export default (): ValidationType => {
  const configPath = path.join(appRootPath.path, YAML_CONFIG_FILENAME);
  const configObject = yaml.load(readFileSync(configPath, 'utf8'));
  const validateObject = schema.validate(configObject, { allowUnknown: false });
  const error = validateObject.error;
  const value = validateObject.value as ValidationType;

  if (error) {
    console.log((error as Error).message);
    throw new NotAcceptableException();
  }

  return value;
};
