#!/bin/bash
cd /home/kavia/workspace/code-generation/wifi-test-management-system-6824-6833/wifi_test_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

