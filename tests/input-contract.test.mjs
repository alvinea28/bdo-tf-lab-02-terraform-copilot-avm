import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { reviewInputs, workshopNamePattern } from './input-contract.mjs';

const solution = new URL('../src/reference/solution/', import.meta.url);
const root = readFileSync(new URL('variables.tf', solution), 'utf8');
const wrapper = readFileSync(new URL('modules/resource-group/variables.tf', solution), 'utf8');
const codes = (rootText, wrapperText) => reviewInputs(rootText, wrapperText).map(issue => issue.code);

test('completed reference satisfies the bounded source contract', () => {
  assert.deepEqual(reviewInputs(root, wrapper), []);
});

test('terse-description fixture fails that criterion, not the type or validation rules', () => {
  const fixture = readFileSync(new URL('fixtures/terse-name.tf.txt', import.meta.url), 'utf8');
  const nextInput = wrapper.indexOf('variable "location"');
  assert.ok(nextInput > 0);
  assert.deepEqual(codes(root, fixture + '\n' + wrapper.slice(nextInput)), ['wrapper.name.description']);
});

test('removing a type is detected independently', () => {
  const changed = root.replace('type        = string', 'type        = any');
  assert.notEqual(changed, root);
  assert.deepEqual(codes(changed, wrapper), ['root.resource_group_name.type']);
});

test('loosening nullable is detected independently', () => {
  const changed = wrapper.replace('nullable    = false', 'nullable    = true');
  assert.notEqual(changed, wrapper);
  assert.deepEqual(codes(root, changed), ['wrapper.name.nullable']);
});

test('removing the allowed-location expression is detected', () => {
  const changed = root.replace('contains(var.allowed_locations, var.location)', 'true');
  assert.notEqual(changed, root);
  assert.deepEqual(codes(changed, wrapper), ['root.location.rule']);
});

test('changing the approved default is detected', () => {
  const changed = root.replace('["southeastasia"]', '["eastus"]');
  assert.notEqual(changed, root);
  assert.deepEqual(codes(changed, wrapper), ['root.allowed_locations.default']);
});

test('loosening wrapper naming is detected', () => {
  const changed = wrapper.replace(workshopNamePattern, '^rg-.*$');
  assert.notEqual(changed, wrapper);
  assert.deepEqual(codes(root, changed), ['wrapper.name.rule']);
});

test('regex examples include minimum and maximum suffix boundaries', () => {
  const rule = new RegExp(workshopNamePattern);
  for (const value of ['rg-bdo-lab02-learner01', 'rg-bdo-lab02-abc', `rg-bdo-lab02-${'a'.repeat(30)}`]) {
    assert.equal(rule.test(value), true, value);
  }
  for (const value of ['rg-bdo-lab02-ab', 'rg-bdo-lab02-ABC', 'rg-bdo-lab02-a_b', 'rg-other-learner01', `rg-bdo-lab02-${'a'.repeat(31)}`]) {
    assert.equal(rule.test(value), false, value);
  }
});
