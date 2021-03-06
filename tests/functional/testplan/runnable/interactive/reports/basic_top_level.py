import re

REPORT = {
    u"attachments": {},
    u"entries": [
        {
            u"category": u"multitest",
            u"description": None,
            u"entries": [
                {
                    u"category": u"testsuite",
                    u"description": None,
                    u"entries": [
                        {
                            u"category": u"parametrization",
                            u"description": None,
                            u"entries": [
                                {
                                    u"description": None,
                                    u"entries": [
                                        {
                                            u"category": u"DEFAULT",
                                            u"description": u"Passing assertion",
                                            u"first": 1,
                                            u"label": u"==",
                                            u"line_no": lambda x: x > 0,
                                            u"machine_time": re.compile(
                                                r"\d+\.?\d*"
                                            ),
                                            u"meta_type": u"assertion",
                                            u"passed": True,
                                            u"second": 1,
                                            u"type": "Equal",
                                            u"utc_time": re.compile(
                                                r"\d+\.?\d*"
                                            ),
                                        }
                                    ],
                                    u"logs": [],
                                    u"name": u"basic_case__arg_0",
                                    u"status": u"passed",
                                    u"status_override": None,
                                    u"suite_related": False,
                                    u"tags": {},
                                    u"timer": {
                                        "run": {
                                            u"end": re.compile(r"\d+\.?\d*"),
                                            u"start": re.compile(r"\d+\.?\d*"),
                                        }
                                    },
                                    u"type": "TestCaseReport",
                                    u"uid": u"basic_case__arg_0",
                                },
                                {
                                    u"description": None,
                                    u"entries": [
                                        {
                                            u"category": u"DEFAULT",
                                            u"description": u"Passing assertion",
                                            u"first": 1,
                                            u"label": u"==",
                                            u"line_no": lambda x: x > 0,
                                            u"machine_time": re.compile(
                                                r"\d+\.?\d*"
                                            ),
                                            u"meta_type": u"assertion",
                                            u"passed": True,
                                            u"second": 1,
                                            u"type": "Equal",
                                            u"utc_time": re.compile(
                                                r"\d+\.?\d*"
                                            ),
                                        }
                                    ],
                                    u"logs": [],
                                    u"name": u"basic_case__arg_1",
                                    u"status": u"passed",
                                    u"status_override": None,
                                    u"suite_related": False,
                                    u"tags": {},
                                    u"timer": {
                                        "run": {
                                            u"end": re.compile(r"\d+\.?\d*"),
                                            u"start": re.compile(r"\d+\.?\d*"),
                                        }
                                    },
                                    u"type": "TestCaseReport",
                                    u"uid": u"basic_case__arg_1",
                                },
                                {
                                    u"description": None,
                                    u"entries": [
                                        {
                                            u"category": u"DEFAULT",
                                            u"description": u"Passing assertion",
                                            u"first": 1,
                                            u"label": u"==",
                                            u"line_no": lambda x: x > 0,
                                            u"machine_time": re.compile(
                                                r"\d+\.?\d*"
                                            ),
                                            u"meta_type": u"assertion",
                                            u"passed": True,
                                            u"second": 1,
                                            u"type": "Equal",
                                            u"utc_time": re.compile(
                                                r"\d+\.?\d*"
                                            ),
                                        }
                                    ],
                                    u"logs": [],
                                    u"name": u"basic_case__arg_2",
                                    u"status": u"passed",
                                    u"status_override": None,
                                    u"suite_related": False,
                                    u"tags": {},
                                    u"timer": {
                                        "run": {
                                            u"end": re.compile(r"\d+\.?\d*"),
                                            u"start": re.compile(r"\d+\.?\d*"),
                                        }
                                    },
                                    u"type": "TestCaseReport",
                                    u"uid": u"basic_case__arg_2",
                                },
                            ],
                            u"fix_spec_path": None,
                            u"logs": [],
                            u"name": u"basic_case",
                            u"part": None,
                            u"status": u"passed",
                            u"status_override": None,
                            u"tags": {},
                            u"timer": {},
                            u"type": "TestGroupReport",
                            u"uid": u"basic_case",
                        }
                    ],
                    u"fix_spec_path": None,
                    u"logs": [],
                    u"name": u"BasicSuite",
                    u"part": None,
                    u"status": u"passed",
                    u"status_override": None,
                    u"tags": {},
                    u"timer": {
                        "run": {
                            u"end": re.compile(r"\d+\.?\d*"),
                            u"start": re.compile(r"\d+\.?\d*"),
                        }
                    },
                    u"type": "TestGroupReport",
                    u"uid": u"BasicSuite",
                },
                {
                    u"category": u"testsuite",
                    u"description": None,
                    u"entries": [
                        {
                            u"description": u"\n        Client sends a message, server received and responds back.\n        ",
                            u"entries": [
                                {
                                    u"category": u"DEFAULT",
                                    u"description": u"Server received",
                                    u"first": u"hello",
                                    u"label": u"==",
                                    u"line_no": lambda x: x > 0,
                                    u"machine_time": re.compile(r"\d+\.?\d*"),
                                    u"meta_type": u"assertion",
                                    u"passed": True,
                                    u"second": "hello",
                                    u"type": "Equal",
                                    u"utc_time": re.compile(r"\d+\.?\d*"),
                                },
                                {
                                    u"category": u"DEFAULT",
                                    u"description": u"Client received",
                                    u"first": u"world",
                                    u"label": u"==",
                                    u"line_no": lambda x: x > 0,
                                    u"machine_time": re.compile(r"\d+\.?\d*"),
                                    u"meta_type": u"assertion",
                                    u"passed": True,
                                    u"second": "world",
                                    u"type": "Equal",
                                    u"utc_time": re.compile(r"\d+\.?\d*"),
                                },
                            ],
                            u"logs": [],
                            u"name": u"send_and_receive_msg",
                            u"status": u"passed",
                            u"status_override": None,
                            u"suite_related": False,
                            u"tags": {},
                            u"timer": {
                                "run": {
                                    u"end": re.compile(r"\d+\.?\d*"),
                                    u"start": re.compile(r"\d+\.?\d*"),
                                }
                            },
                            u"type": "TestCaseReport",
                            u"uid": u"send_and_receive_msg",
                        }
                    ],
                    u"fix_spec_path": None,
                    u"logs": [],
                    u"name": u"TCPSuite - Custom_0",
                    u"part": None,
                    u"status": u"passed",
                    u"status_override": None,
                    u"tags": {},
                    u"timer": {
                        "run": {
                            u"end": re.compile(r"\d+\.?\d*"),
                            u"start": re.compile(r"\d+\.?\d*"),
                        }
                    },
                    u"type": "TestGroupReport",
                    u"uid": u"TCPSuite - Custom_0",
                },
                {
                    u"category": u"testsuite",
                    u"description": None,
                    u"entries": [
                        {
                            u"description": u"\n        Client sends a message, server received and responds back.\n        ",
                            u"entries": [
                                {
                                    u"category": u"DEFAULT",
                                    u"description": u"Server received",
                                    u"first": u"hello",
                                    u"label": u"==",
                                    u"line_no": lambda x: x > 0,
                                    u"machine_time": re.compile(r"\d+\.?\d*"),
                                    u"meta_type": u"assertion",
                                    u"passed": True,
                                    u"second": "hello",
                                    u"type": "Equal",
                                    u"utc_time": re.compile(r"\d+\.?\d*"),
                                },
                                {
                                    u"category": u"DEFAULT",
                                    u"description": u"Client received",
                                    u"first": u"world",
                                    u"label": u"==",
                                    u"line_no": lambda x: x > 0,
                                    u"machine_time": re.compile(r"\d+\.?\d*"),
                                    u"meta_type": u"assertion",
                                    u"passed": True,
                                    u"second": "world",
                                    u"type": "Equal",
                                    u"utc_time": re.compile(r"\d+\.?\d*"),
                                },
                            ],
                            u"logs": [],
                            u"name": u"send_and_receive_msg",
                            u"status": u"passed",
                            u"status_override": None,
                            u"suite_related": False,
                            u"tags": {},
                            u"timer": {
                                "run": {
                                    u"end": re.compile(r"\d+\.?\d*"),
                                    u"start": re.compile(r"\d+\.?\d*"),
                                }
                            },
                            u"type": "TestCaseReport",
                            u"uid": u"send_and_receive_msg",
                        }
                    ],
                    u"fix_spec_path": None,
                    u"logs": [],
                    u"name": u"TCPSuite - Custom_1",
                    u"part": None,
                    u"status": u"passed",
                    u"status_override": None,
                    u"tags": {},
                    u"timer": {
                        "run": {
                            u"end": re.compile(r"\d+\.?\d*"),
                            u"start": re.compile(r"\d+\.?\d*"),
                        }
                    },
                    u"type": "TestGroupReport",
                    u"uid": u"TCPSuite - Custom_1",
                },
            ],
            u"fix_spec_path": None,
            u"logs": [],
            u"name": u"Test1",
            u"part": None,
            u"status": u"passed",
            u"status_override": None,
            u"tags": {},
            u"timer": {
                "run": {
                    u"end": re.compile(r"\d+\.?\d*"),
                    u"start": re.compile(r"\d+\.?\d*"),
                }
            },
            u"type": "TestGroupReport",
            u"uid": u"Test1",
        },
        {
            u"category": u"multitest",
            u"description": None,
            u"entries": [
                {
                    u"category": u"testsuite",
                    u"description": None,
                    u"entries": [
                        {
                            u"category": u"parametrization",
                            u"description": None,
                            u"entries": [
                                {
                                    u"description": None,
                                    u"entries": [
                                        {
                                            u"category": u"DEFAULT",
                                            u"description": u"Passing assertion",
                                            u"first": 1,
                                            u"label": u"==",
                                            u"line_no": lambda x: x > 0,
                                            u"machine_time": re.compile(
                                                r"\d+\.?\d*"
                                            ),
                                            u"meta_type": u"assertion",
                                            u"passed": True,
                                            u"second": 1,
                                            u"type": "Equal",
                                            u"utc_time": re.compile(
                                                r"\d+\.?\d*"
                                            ),
                                        }
                                    ],
                                    u"logs": [],
                                    u"name": u"basic_case__arg_0",
                                    u"status": u"passed",
                                    u"status_override": None,
                                    u"suite_related": False,
                                    u"tags": {},
                                    u"timer": {
                                        "run": {
                                            u"end": re.compile(r"\d+\.?\d*"),
                                            u"start": re.compile(r"\d+\.?\d*"),
                                        }
                                    },
                                    u"type": "TestCaseReport",
                                    u"uid": u"basic_case__arg_0",
                                },
                                {
                                    u"description": None,
                                    u"entries": [
                                        {
                                            u"category": u"DEFAULT",
                                            u"description": u"Passing assertion",
                                            u"first": 1,
                                            u"label": u"==",
                                            u"line_no": lambda x: x > 0,
                                            u"machine_time": re.compile(
                                                r"\d+\.?\d*"
                                            ),
                                            u"meta_type": u"assertion",
                                            u"passed": True,
                                            u"second": 1,
                                            u"type": "Equal",
                                            u"utc_time": re.compile(
                                                r"\d+\.?\d*"
                                            ),
                                        }
                                    ],
                                    u"logs": [],
                                    u"name": u"basic_case__arg_1",
                                    u"status": u"passed",
                                    u"status_override": None,
                                    u"suite_related": False,
                                    u"tags": {},
                                    u"timer": {
                                        "run": {
                                            u"end": re.compile(r"\d+\.?\d*"),
                                            u"start": re.compile(r"\d+\.?\d*"),
                                        }
                                    },
                                    u"type": "TestCaseReport",
                                    u"uid": u"basic_case__arg_1",
                                },
                                {
                                    u"description": None,
                                    u"entries": [
                                        {
                                            u"category": u"DEFAULT",
                                            u"description": u"Passing assertion",
                                            u"first": 1,
                                            u"label": u"==",
                                            u"line_no": lambda x: x > 0,
                                            u"machine_time": re.compile(
                                                r"\d+\.?\d*"
                                            ),
                                            u"meta_type": u"assertion",
                                            u"passed": True,
                                            u"second": 1,
                                            u"type": "Equal",
                                            u"utc_time": re.compile(
                                                r"\d+\.?\d*"
                                            ),
                                        }
                                    ],
                                    u"logs": [],
                                    u"name": u"basic_case__arg_2",
                                    u"status": u"passed",
                                    u"status_override": None,
                                    u"suite_related": False,
                                    u"tags": {},
                                    u"timer": {
                                        "run": {
                                            u"end": re.compile(r"\d+\.?\d*"),
                                            u"start": re.compile(r"\d+\.?\d*"),
                                        }
                                    },
                                    u"type": "TestCaseReport",
                                    u"uid": u"basic_case__arg_2",
                                },
                            ],
                            u"fix_spec_path": None,
                            u"logs": [],
                            u"name": u"basic_case",
                            u"part": None,
                            u"status": u"passed",
                            u"status_override": None,
                            u"tags": {},
                            u"timer": {},
                            u"type": "TestGroupReport",
                            u"uid": u"basic_case",
                        }
                    ],
                    u"fix_spec_path": None,
                    u"logs": [],
                    u"name": u"BasicSuite",
                    u"part": None,
                    u"status": u"passed",
                    u"status_override": None,
                    u"tags": {},
                    u"timer": {
                        "run": {
                            u"end": re.compile(r"\d+\.?\d*"),
                            u"start": re.compile(r"\d+\.?\d*"),
                        }
                    },
                    u"type": "TestGroupReport",
                    u"uid": u"BasicSuite",
                },
                {
                    u"category": u"testsuite",
                    u"description": None,
                    u"entries": [
                        {
                            u"description": u"\n        Client sends a message, server received and responds back.\n        ",
                            u"entries": [
                                {
                                    u"category": u"DEFAULT",
                                    u"description": u"Server received",
                                    u"first": u"hello",
                                    u"label": u"==",
                                    u"line_no": lambda x: x > 0,
                                    u"machine_time": re.compile(r"\d+\.?\d*"),
                                    u"meta_type": u"assertion",
                                    u"passed": True,
                                    u"second": "hello",
                                    u"type": "Equal",
                                    u"utc_time": re.compile(r"\d+\.?\d*"),
                                },
                                {
                                    u"category": u"DEFAULT",
                                    u"description": u"Client received",
                                    u"first": u"world",
                                    u"label": u"==",
                                    u"line_no": lambda x: x > 0,
                                    u"machine_time": re.compile(r"\d+\.?\d*"),
                                    u"meta_type": u"assertion",
                                    u"passed": True,
                                    u"second": "world",
                                    u"type": "Equal",
                                    u"utc_time": re.compile(r"\d+\.?\d*"),
                                },
                            ],
                            u"logs": [],
                            u"name": u"send_and_receive_msg",
                            u"status": u"passed",
                            u"status_override": None,
                            u"suite_related": False,
                            u"tags": {},
                            u"timer": {
                                "run": {
                                    u"end": re.compile(r"\d+\.?\d*"),
                                    u"start": re.compile(r"\d+\.?\d*"),
                                }
                            },
                            u"type": "TestCaseReport",
                            u"uid": u"send_and_receive_msg",
                        }
                    ],
                    u"fix_spec_path": None,
                    u"logs": [],
                    u"name": u"TCPSuite - Custom_0",
                    u"part": None,
                    u"status": u"passed",
                    u"status_override": None,
                    u"tags": {},
                    u"timer": {
                        "run": {
                            u"end": re.compile(r"\d+\.?\d*"),
                            u"start": re.compile(r"\d+\.?\d*"),
                        }
                    },
                    u"type": "TestGroupReport",
                    u"uid": u"TCPSuite - Custom_0",
                },
                {
                    u"category": u"testsuite",
                    u"description": None,
                    u"entries": [
                        {
                            u"description": u"\n        Client sends a message, server received and responds back.\n        ",
                            u"entries": [
                                {
                                    u"category": u"DEFAULT",
                                    u"description": u"Server received",
                                    u"first": u"hello",
                                    u"label": u"==",
                                    u"line_no": lambda x: x > 0,
                                    u"machine_time": re.compile(r"\d+\.?\d*"),
                                    u"meta_type": u"assertion",
                                    u"passed": True,
                                    u"second": "hello",
                                    u"type": "Equal",
                                    u"utc_time": re.compile(r"\d+\.?\d*"),
                                },
                                {
                                    u"category": u"DEFAULT",
                                    u"description": u"Client received",
                                    u"first": u"world",
                                    u"label": u"==",
                                    u"line_no": lambda x: x > 0,
                                    u"machine_time": re.compile(r"\d+\.?\d*"),
                                    u"meta_type": u"assertion",
                                    u"passed": True,
                                    u"second": "world",
                                    u"type": "Equal",
                                    u"utc_time": re.compile(r"\d+\.?\d*"),
                                },
                            ],
                            u"logs": [],
                            u"name": u"send_and_receive_msg",
                            u"status": u"passed",
                            u"status_override": None,
                            u"suite_related": False,
                            u"tags": {},
                            u"timer": {
                                "run": {
                                    u"end": re.compile(r"\d+\.?\d*"),
                                    u"start": re.compile(r"\d+\.?\d*"),
                                }
                            },
                            u"type": "TestCaseReport",
                            u"uid": u"send_and_receive_msg",
                        }
                    ],
                    u"fix_spec_path": None,
                    u"logs": [],
                    u"name": u"TCPSuite - Custom_1",
                    u"part": None,
                    u"status": u"passed",
                    u"status_override": None,
                    u"tags": {},
                    u"timer": {
                        "run": {
                            u"end": re.compile(r"\d+\.?\d*"),
                            u"start": re.compile(r"\d+\.?\d*"),
                        }
                    },
                    u"type": "TestGroupReport",
                    u"uid": u"TCPSuite - Custom_1",
                },
            ],
            u"fix_spec_path": None,
            u"logs": [],
            u"name": u"Test2",
            u"part": None,
            u"status": u"passed",
            u"status_override": None,
            u"tags": {},
            u"timer": {
                "run": {
                    u"end": re.compile(r"\d+\.?\d*"),
                    u"start": re.compile(r"\d+\.?\d*"),
                }
            },
            u"type": "TestGroupReport",
            u"uid": u"Test2",
        },
    ],
    u"meta": {},
    u"name": u"InteractivePlan",
    u"status": u"passed",
    u"status_override": None,
    u"tags_index": {},
    u"timer": {},
    u"uid": u"InteractivePlan",
}
