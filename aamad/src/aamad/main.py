#!/usr/bin/env python
import json
import sys
import warnings
from datetime import datetime, timedelta

from aamad.crew import Aamad

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")


def default_onboarding_inputs() -> dict[str, str]:
    """Sample inputs matching tasks.yaml template variables."""
    start = (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d")
    return {
        "employee_name": "Jordan Lee",
        "employee_id": "EMP-2026-0142",
        "job_title": "Software Engineer II",
        "department": "Engineering",
        "location": "Austin, TX, USA",
        "start_date": start,
        "manager_name": "Alex Morgan",
        "employment_type": "Full-time",
        "company_domain": "examplecorp.com",
        "employee_personal_email": "jordan.lee.personal@email.com",
        "employee_work_email": "jordan.lee@examplecorp.com",
        "years_of_experience": "4",
    }


def run():
    """Run the onboarding crew."""
    inputs = default_onboarding_inputs()

    try:
        Aamad().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}") from e


def train():
    """Train the crew for a given number of iterations."""
    inputs = default_onboarding_inputs()
    try:
        Aamad().crew().train(
            n_iterations=int(sys.argv[1]),
            filename=sys.argv[2],
            inputs=inputs,
        )
    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}") from e


def replay():
    """Replay the crew execution from a specific task."""
    try:
        Aamad().crew().replay(task_id=sys.argv[1])
    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}") from e


def test():
    """Test the crew execution and return the results."""
    inputs = default_onboarding_inputs()

    try:
        Aamad().crew().test(
            n_iterations=int(sys.argv[1]),
            eval_llm=sys.argv[2],
            inputs=inputs,
        )
    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}") from e


def run_with_trigger():
    """Run the crew with trigger payload."""
    if len(sys.argv) < 2:
        raise Exception(
            "No trigger payload provided. Please provide JSON payload as argument."
        )

    try:
        trigger_payload = json.loads(sys.argv[1])
    except json.JSONDecodeError as exc:
        raise Exception("Invalid JSON payload provided as argument") from exc

    inputs = default_onboarding_inputs()
    inputs["crewai_trigger_payload"] = trigger_payload

    try:
        return Aamad().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(
            f"An error occurred while running the crew with trigger: {e}"
        ) from e
