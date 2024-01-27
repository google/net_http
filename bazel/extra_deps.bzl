load("@rules_foreign_cc//foreign_cc:repositories.bzl", "rules_foreign_cc_dependencies")

def net_http_extra_deps():
    rules_foreign_cc_dependencies()
