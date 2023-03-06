This example represents the basic flow of how we will implement file-level bazel targets both at dev time and CI time in the web monorepo.

A few oversimplifications were made for the sake of brevity:
- deleted files are not accounted for, but those should trigger typescript and integration tests (if a source file is deleted then an integration test might fail - lint and unit tests are ok in this case)
- classifying files will need to be more complex and account for various different test directories, specific config file types, etc.
- the git command to identify changed files is not what we will use in practice. `git diff` is nicer for a playground example because you don't have to create a new commit.
- this example only deals with files that are in packages. it does not handle how we execute changes to root-level files like WORKSPACE
- this example doesn't deal with changes to libraries

To test 