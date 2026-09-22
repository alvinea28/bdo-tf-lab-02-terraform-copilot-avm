# Optional source-contract checks

These dependency-free Node.js 24 checks reinforce the input-editing exercise; they do not replace Terraform. No package installation, Azure authentication, provider initialization, writes, or subprocesses occur.

- [check-input-contract.mjs](check-input-contract.mjs) inspects the working root and wrapper. Before checkpoint 5, exit 1 is intentional because the starter has terse descriptions and lacks policy validation. After applying the completed input sections, it expects exit 0 and `Lab 2 input source contract: PASS (not runtime Terraform validation).`
- [input-contract.test.mjs](input-contract.test.mjs) runs eight regression tests against the complete reference and deliberately changed in-memory source. It expects eight passes, zero failures independently of a learner's working edits.
- [fixtures/terse-name.tf.txt](fixtures/terse-name.tf.txt) preserves a valid type and name-validation expression while shortening only the description. Its regression must fail specifically for the description.
- [input-contract.mjs](input-contract.mjs) checks selected source expressions and explicit types. Its 80-character description threshold is an exercise rubric, not a universal documentation standard. It supports this lab's simple declaration layout, not arbitrary HCL formatting or semantic equivalence.

From the lab repository root, optional Windows PowerShell 5.1 commands:

```powershell
node --version
node --test .\tests\input-contract.test.mjs
if ($LASTEXITCODE -ne 0) { throw 'Source-contract regression failure.' }
node .\tests\check-input-contract.mjs
if ($LASTEXITCODE -ne 0) { throw 'Complete the input improvement before proceeding.' }
```

The JavaScript regex boundary test demonstrates the supplied ASCII pattern only. It does not execute Terraform variable validation, query provider capabilities, or establish Azure access. Native `terraform validate` still performs the mandatory module-interface negative exercise. Terraform mock plans, if later added, require explicit mocked providers; this package does not run a real plan.
