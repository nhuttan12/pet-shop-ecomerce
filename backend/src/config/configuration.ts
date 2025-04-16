import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { schema } from './config.validation';
import { NotAcceptableException } from '@nestjs/common';
import { ValidationType } from './config-type.interface';
import * as appRootPath from 'app-root-path';

const YAML_CONFIG_FILENAME = 'config.env.yaml';

export default () => {
  const configPath = path.join(appRootPath.path, YAML_CONFIG_FILENAME);
  const configObject = yaml.load(readFileSync(configPath, 'utf8'));
  const validateObject = schema.validate(configObject, { allowUnknown: false });
  const error = validateObject.error;
  const value = validateObject.value as ValidationType;

  if (error) {
    throw new NotAcceptableException();
  }

  return value;
};
