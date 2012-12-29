#!/bin/bash
curl http://registry.npmjs.org/-/all -o data/npm.json
curl http://ci.testling.com/commits.json -o data/testling.json
