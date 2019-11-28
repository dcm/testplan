"""Module containing Testplan main class."""

import os
import sys

sys.dont_write_bytecode = True

__all__ = (
    'Testplan',
    'TestplanConfig',
    'TestplanResult',
    'test_plan',
    'Task',
    'TaskResult',
    'common',
    'exporters',
    'report',
    'runnable',
    'runners',
    'testing',
    'vendor',
    'web_ui',
    'base',
    'defaults',
    'environment',
    'parser',
    'dependencies',
    'TESTPLAN_DEPENDENCIES_PATH',
)

TESTPLAN_DEPENDENCIES_PATH = 'TESTPLAN_DEPENDENCIES_PATH'

if TESTPLAN_DEPENDENCIES_PATH in os.environ:
    print('Importing testplan dependencies from: {}'.format(
        os.environ[TESTPLAN_DEPENDENCIES_PATH]))
    sys.path.insert(0, os.environ[TESTPLAN_DEPENDENCIES_PATH])
    import dependencies  # pylint: disable=import-error
    sys.path.remove(os.environ[TESTPLAN_DEPENDENCIES_PATH])

from . import common
from . import exporters
from . import report
from . import runnable
from . import runners
from testplan.runners.pools.tasks import Task, TaskResult
from . import testing
from . import vendor
from . import web_ui
from . import base
from testplan.base import Testplan, TestplanConfig, TestplanResult, test_plan
from . import defaults
from . import environment
from . import parser

