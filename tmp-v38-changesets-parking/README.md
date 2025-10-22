# v38 parking

This is a temporary folder to speed up (and occasionally not crash) canary releases.

We have a lot of changesets in pre release mode (131 and counting) that need to be converted to changelog entries.

Running `changeset version` requires communicating with the github graphql api which sometimes times out OR sometimes ends the response stream midway through the response because there are too many entries in the same request without pagination.

As this is a rare and temporary problem for us, we can hide the problem by moving all these changesets in a parked directory until we need them again for the stable 38.0.0 release