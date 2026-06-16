import type { ResearchInputs } from "../types/workflow";

export function validateInputs(
  inputs: ResearchInputs,
): Partial<Record<keyof ResearchInputs, string>> {
  const errors: Partial<Record<keyof ResearchInputs, string>> = {};
  const topic = inputs.topic.trim();

  if (topic.length < 3) {
    errors.topic = "Topic must be at least 3 characters.";
  } else if (topic.length > 500) {
    errors.topic = "Topic must be 500 characters or fewer.";
  }

  if (!inputs.depth) {
    errors.depth = "Select a research depth.";
  }

  if (inputs.focusAreas.length > 200) {
    errors.focusAreas = "Focus areas must be 200 characters or fewer.";
  }

  if (inputs.notes.length > 2000) {
    errors.notes = "Notes must be 2000 characters or fewer.";
  }

  return errors;
}
