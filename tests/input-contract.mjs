// Narrow source-text exercise checks, NOT an HCL parser or Terraform evaluator.
export const workshopNamePattern = '^rg-bdo-lab02-[a-z0-9-]{3,30}$';

function variables(text) {
  const matches = [...text.matchAll(/^variable "([^"]+)" \{/gm)];
  return new Map(matches.map((match, index) => [
    match[1], text.slice(match.index, matches[index + 1]?.index ?? text.length),
  ]));
}

export function reviewInputs(rootText, wrapperText) {
  const issues = [];
  const root = variables(rootText);
  const wrapper = variables(wrapperText);
  const add = (code, message) => issues.push({ code, message });

  function input(blocks, scope, name, type) {
    const block = blocks.get(name);
    const label = `${scope}.${name}`;
    if (!block) {
      add(`${label}.missing`, 'Input declaration is missing.');
      return '';
    }
    const actualType = block.match(/^\s*type\s*=\s*([^\r\n]+)/m)?.[1].trim();
    if (actualType !== type) add(`${label}.type`, `Expected explicit ${type}.`);
    if (!/^\s*nullable\s*=\s*false\s*$/m.test(block)) {
      add(`${label}.nullable`, 'The input must reject null.');
    }
    const description = block.match(/^\s*description\s*=\s*"([^"\r\n]*)"\s*$/m)?.[1];
    if (!description || description.length < 80) {
      add(`${label}.description`, 'Use the supplied contextual description (at least 80 characters for this exercise).');
    }
    if (!/^\s*validation\s*\{/m.test(block)) {
      add(`${label}.validation`, 'The completed input needs its validation block.');
    }
    return block;
  }

  function rule(block, text, code) {
    if (!block.includes(text)) add(code, `Missing reviewed source expression: ${text}`);
  }

  const rootName = input(root, 'root', 'resource_group_name', 'string');
  const rootLocation = input(root, 'root', 'location', 'string');
  const rootTags = input(root, 'root', 'tags', 'map(string)');
  const allowed = input(root, 'root', 'allowed_locations', 'list(string)');
  const name = input(wrapper, 'wrapper', 'name', 'string');
  const location = input(wrapper, 'wrapper', 'location', 'string');
  const tags = input(wrapper, 'wrapper', 'tags', 'map(string)');

  rule(rootName, `regex("${workshopNamePattern}", var.resource_group_name)`, 'root.name.rule');
  rule(name, `regex("${workshopNamePattern}", var.name)`, 'wrapper.name.rule');
  rule(rootLocation, 'contains(var.allowed_locations, var.location)', 'root.location.rule');
  rule(location, 'regex("^[a-z0-9]+$", var.location)', 'wrapper.location.rule');
  if (!/^\s*default\s*=\s*\["southeastasia"\]\s*$/m.test(allowed)) {
    add('root.allowed_locations.default', 'Keep the approved default list: southeastasia only.');
  }
  rule(allowed, 'length(var.allowed_locations) > 0', 'root.allowed_locations.rule');
  for (const [scope, block] of [['root', rootTags], ['wrapper', tags]]) {
    rule(block, 'trimspace(key) != ""', `${scope}.tags.keys`);
    rule(block, 'try(trimspace(value) != "", false)', `${scope}.tags.values`);
  }
  return issues;
}
