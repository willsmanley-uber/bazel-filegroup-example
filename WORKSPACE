workspace(
    name = "bazel-filegroup-example",
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
  name = "jazelle",
  url = "https://registry.yarnpkg.com/jazelle/-/jazelle-0.0.0-standalone.74.tgz",
  strip_prefix = "package",
)

load("@jazelle//:workspace-rules.bzl", "jazelle_dependencies")
jazelle_dependencies(
  node_version = "16.15.0",
  node_sha256 = {
    "darwin-x64": "",
    "linux-x64": "",
    "win-x64": "",
  },
  yarn_version = "1.22.0",
  yarn_sha256 = "",
)

