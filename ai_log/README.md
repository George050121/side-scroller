# AI Session Logs

This folder is automatically maintained by the Claude Code hook in
`.claude/hooks/log_ai.py`.

## What gets logged

Every time Claude Code finishes a session in this repository, a Markdown
file is created here with:

| Section | Contents |
|---------|----------|
| **User Prompt** | The original request sent to Claude |
| **Tools Used** | Every file write, bash command, search, etc. |
| **AI Summary** | Claude's final response / summary of work done |

## File naming

```
ai_log/YYYY-MM-DD_HH-MM-SS_<session-id>.md
```

## How it works

1. `.claude/settings.json` registers two hooks:
   - `UserPromptSubmit` — captures the prompt before Claude starts
   - `Stop` — fires when Claude finishes; writes the log, then runs
     `git commit` + `git push` automatically

2. The hook script lives at `.claude/hooks/log_ai.py` (pure Python 3,
   no extra dependencies).
