import { wwnActionHandler } from './action-handler.js'
import { wwnRollHandler as Core } from './roll-handler.js'
import { DEFAULTS } from './defaults.js'
import { MODULE, REQUIRED_CORE_MODULE_VERSION } from './constants.js'

export let wwnSystemManager = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
  wwnSystemManager = class WWNSystemManager extends coreModule.api.SystemManager {
    /** @override */
    getCategoryManager() {
      return new coreModule.api.CategoryManager()
    }

    /** @override */
    getActionHandler(categoryManager) {
      const actionHandler = new wwnActionHandler(categoryManager)
      return actionHandler
    }

    /** @override */
    getAvailableRollHandlers() {
      let coreTitle = 'Core WWN'
      const choices = { core: coreTitle }
      return choices
    }

    /** @override */
    getRollHandler(handlerId) {
      let rollHandler
      switch (handlerId) {
        case 'core':
        default:
          rollHandler = new Core()
          break
      }

      return rollHandler
    }

    /** @override */
    registerSettings(updateFunc) {
    }

    /** @override */
    async registerDefaults() {
      const defaults = DEFAULTS
      return defaults
    }
  }

  /* STARTING POINT */

  const module = game.modules.get(MODULE.ID);
  module.api = {
    requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
    SystemManager: wwnSystemManager
  }
  Hooks.call('tokenActionHudSystemReady', module)
})
