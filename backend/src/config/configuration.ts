import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { schema } from './app-config.validation';
import { NotAcceptableException } from '@nestjs/common';
import { ValidationType } from './interface/config-type.interface';
import appRootPath from 'app-root-path';

const YAML_CONFIG_FILENAME = 'config.env.yaml';
// const YAML_CONFIG_FILENAME = 'config.env.yml';

export default (): ValidationType => {
  const configPath = path.join(appRootPath.path, YAML_CONFIG_FILENAME);
  const configObject = yaml.load(readFileSync(configPath, 'utf8'));
  const validateObject = schema.validate(configObject, { allowUnknown: false });
  const error = validateObject.error;
  const value = validateObject.value as ValidationType;

  if (error) {
    console.log(error.message);
    throw new NotAcceptableException();
  }

  return value;
};
