SHELL := /bin/zsh

.PHONY: help new list

help:
	@echo "Targets:"
	@echo "  make new NAME=my-skill   Create a new skill scaffold"
	@echo "  make list                List local skills"

new:
	@if [[ -z "$(NAME)" ]]; then \
		echo "Usage: make new NAME=my-skill"; \
		exit 1; \
	fi
	@./scripts/new-skill.sh "$(NAME)"

list:
	@find ./skills -mindepth 1 -maxdepth 1 -type d ! -name "_template" -exec basename {} \; | sort
