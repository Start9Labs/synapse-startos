import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_1_164_2_1 } from './v1.164.2_1'
import { v_1_156_0_0 } from './v1.156.0_0'
import { v_1_163_0_0 } from './v1.163.0_0'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_1_164_2_1, v_1_163_0_0, v_1_156_0_0],
})
