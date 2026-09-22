import { readFileSync } from 'node:fs';
import { reviewInputs } from './input-contract.mjs';

const root = new URL('../src/terraform/', import.meta.url);
const issues = reviewInputs(
  readFileSync(new URL('variables.tf', root), 'utf8'),
  readFileSync(new URL('modules/resource-group/variables.tf', root), 'utf8'),
);

if (issues.length) {
  console.error('Lab 2 input improvement is incomplete (source-text checks only):');
  for (const issue of issues) console.error(`${issue.code}: ${issue.message}`);
  process.exitCode = 1;
} else {
  console.log('Lab 2 input source contract: PASS (not runtime Terraform validation).');
}
