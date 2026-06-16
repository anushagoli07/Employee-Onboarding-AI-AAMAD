import os

from crewai import Agent, Crew, LLM, Process, Task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai.project import CrewBase, agent, crew, task

DEFAULT_GEMINI_MODEL = "gemini/gemini-2.5-flash"


def _ensure_gemini_env() -> None:
    """CrewAI/LiteLLM accepts GEMINI_API_KEY; mirror GOOGLE_API_KEY for compatibility."""
    gemini = os.getenv("GEMINI_API_KEY")
    google = os.getenv("GOOGLE_API_KEY")
    if gemini and not google:
        os.environ["GOOGLE_API_KEY"] = gemini
    elif google and not gemini:
        os.environ["GEMINI_API_KEY"] = google


def get_gemini_llm() -> LLM:
    """Shared Gemini LLM for all onboarding agents."""
    _ensure_gemini_env()
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError(
            "Missing Gemini API key. Set GEMINI_API_KEY or GOOGLE_API_KEY in .env "
            "(get a key at https://aistudio.google.com/apikey)."
        )
    model = os.getenv("MODEL", DEFAULT_GEMINI_MODEL)
    return LLM(
        model=model,
        api_key=api_key,
        temperature=float(os.getenv("LLM_TEMPERATURE", "0.7")),
    )


@CrewBase
class Aamad:
    """Automated Employee Onboarding Workflow crew."""

    agents: list[BaseAgent]
    tasks: list[Task]

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    # -------------------------------------------------------------------------
    # Agents (mirror keys in config/agents.yaml)
    # -------------------------------------------------------------------------

    @agent
    def onboarding_coordinator(self) -> Agent:
        return Agent(
            config=self.agents_config["onboarding_coordinator"],  # type: ignore[index]
            llm=get_gemini_llm(),
            verbose=True,
        )

    @agent
    def it_provisioning_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["it_provisioning_agent"],  # type: ignore[index]
            llm=get_gemini_llm(),
            verbose=True,
        )

    @agent
    def document_processing_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["document_processing_agent"],  # type: ignore[index]
            llm=get_gemini_llm(),
            verbose=True,
        )

    @agent
    def compliance_verification_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["compliance_verification_agent"],  # type: ignore[index]
            llm=get_gemini_llm(),
            verbose=True,
        )

    @agent
    def training_personalization_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["training_personalization_agent"],  # type: ignore[index]
            llm=get_gemini_llm(),
            verbose=True,
        )

    @agent
    def employee_experience_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["employee_experience_agent"],  # type: ignore[index]
            llm=get_gemini_llm(),
            verbose=True,
        )

    # -------------------------------------------------------------------------
    # Tasks (mirror keys in config/tasks.yaml; order matches workflow phases)
    # -------------------------------------------------------------------------

    @task
    def intake_and_profile_creation_task(self) -> Task:
        return Task(
            config=self.tasks_config["intake_and_profile_creation_task"],  # type: ignore[index]
        )

    @task
    def it_provisioning_task(self) -> Task:
        return Task(
            config=self.tasks_config["it_provisioning_task"],  # type: ignore[index]
        )

    @task
    def document_collection_task(self) -> Task:
        return Task(
            config=self.tasks_config["document_collection_task"],  # type: ignore[index]
        )

    @task
    def compliance_verification_task(self) -> Task:
        return Task(
            config=self.tasks_config["compliance_verification_task"],  # type: ignore[index]
        )

    @task
    def personalized_training_plan_task(self) -> Task:
        return Task(
            config=self.tasks_config["personalized_training_plan_task"],  # type: ignore[index]
        )

    @task
    def day_one_activation_task(self) -> Task:
        return Task(
            config=self.tasks_config["day_one_activation_task"],  # type: ignore[index]
        )

    @task
    def ongoing_support_and_engagement_task(self) -> Task:
        return Task(
            config=self.tasks_config["ongoing_support_and_engagement_task"],  # type: ignore[index]
        )

    @task
    def onboarding_completion_and_handoff_task(self) -> Task:
        return Task(
            config=self.tasks_config["onboarding_completion_and_handoff_task"],  # type: ignore[index]
            output_file="onboarding_completion_report.md",
        )

    @crew
    def crew(self) -> Crew:
        """Creates the employee onboarding crew."""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
            max_rpm=10,
        )
