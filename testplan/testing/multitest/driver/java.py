from __future__ import (
    unicode_literals,
    print_function,
    division,
    absolute_import
)

import schema
import os
import six

from testplan.common.utils.strings import slugify
from testplan.testing.multitest.driver.base import Driver, DriverConfig


class JavaAppConfig(DriverConfig):

    @classmethod
    def get_options(self):
        """
        
        """
        return {
            
        }


class JavaApp(Driver):

    CONFIG = JavaAppConfig

    def __init__(self, **options):
        """
        
        """
        super(JavaApp, self).__init__(
            
            **options
        )

    def starting(self):
        pass

    def stopping(self):
        pass

