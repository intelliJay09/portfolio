# Project Development Guidelines

## Debugging and Problem-Solving Approach

### Thread Analysis Methodology
Always conduct thread analysis to find out the root cause of issues and find progressive ways to fix them. Do not assume on your own. Always analyze.

#### Key Principles:
1. **Trace execution flow step by step** - Follow the code path from initial state to problem occurrence
2. **Identify state mismatches** - Compare initial state vs expected state vs actual state
3. **Check timing issues** - Verify useEffect dependencies, async operations, and lifecycle events
4. **Verify DOM/CSS state** - Ensure elements exist and have correct styling before JavaScript manipulation
5. **Look for race conditions** - Check for conflicts between multiple state updates
6. **Test different scenarios** - Fresh page loads vs hot reloads, different screen sizes, various user flows

#### Common Pitfalls to Avoid:
- Assuming initial state without verification
- Not checking if dependencies are properly set before running effects
- Overlooking timing of when DOM elements become available
- Missing differences between development and production behavior
- Making quick fixes without understanding the underlying cause

#### Progressive Fixing Strategy:
1. **Identify the exact problem** - What specifically is broken?
2. **Trace to root cause** - Why is it happening?
3. **Implement minimal fix** - Address the core issue without breaking other functionality
4. **Verify fix works** - Test in multiple scenarios
5. **Document the solution** - Explain why the fix works for future reference