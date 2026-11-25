// Runs on every page before React starts (Next's client instrumentation hook).
// Installs the Trusted Types default policy; see lib/trusted-types.ts for why it is also here.
import { installTrustedTypesPolicy } from './lib/trusted-types'

installTrustedTypesPolicy()
