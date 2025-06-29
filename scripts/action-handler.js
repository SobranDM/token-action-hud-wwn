export let wwnActionHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
  wwnActionHandler = class WWNActionHandler extends coreModule.api.ActionHandler {

    /**
     * Build System Actions
     * @override
     * @param {array} groupIds
     * @returns {object}
     */
    async buildSystemActions(groupIds) {
      this.actors = (!this.actor) ? this.#getActors() : [this.actor]
      this.tokens = (!this.token) ? this.#getTokens() : [this.token]
      this.actorType = this.actor?.type

      this.#buildCharacterActions()
    }
    /**
    * Build character actions
    * @private
    * @returns {object}
    */
    async #buildCharacterActions() {
      this.#buildSaves('save', 'saves')
      this.#buildAbilities('ability', 'abilities')
      this.#buildSkills('skill', 'skills')
      this.#buildSpells()
      this.#buildArts()
      this.#buildItems()
    }

    #buildItems() {
      this.#buildInventoryContainer()
      this.#buildInventory('armor', ['armor'])
      this.#buildWeapons('weapon', ['weapon'])
      this.#buildInventory('misc', ['item'])
      this.#buildTreasure('treasure', ['item'])
    }
    async #buildInventoryContainer() {
      if (canvas.tokens.controlled.length > 1) return;
      const itemTypes = 'container'
      const parentgroupData = { id: 'inventory', type: 'custom' }
      for (const [_, container] of Object.entries(this.actor.items.filter(el => itemTypes.includes(el.type) && el.system.itemIds.length > 0))) {
        const groupDataClone = { id: `container_${container.id}`, name: container.name, type: 'list' }
        await this.addGroup(groupDataClone, parentgroupData, true)
        this.#buildContainer(container.system.itemIds, container, groupDataClone)
      }
    }

    #buildContainer(items, container, groupData) {
      let actions = []
      for (const itemId of items) {
        const item = this.actor.items.get(itemId)
        const actionType = item.type
        const abilityId = item.id
        const id = `${actionType}-${item.id}`
        const label = item.name
        const name = item.name
        const listName = `${actionType}${label}`
        const encodedValue = [actionType, abilityId].join(this.delimiter)
        const img = item.img
        const info2 = { text: item.system?.damage ? "(" + item[1].system.damage + ")" : (item[1].system?.quantity?.value ? "(" + item[1].system.quantity.value + ")" : ""), class: 'custominfo' }
        const cssClass = ''
        actions.push({
          id,
          name,
          encodedValue,
          info2,
          img,
          cssClass,
          listName
        })
      }
      this.addActions(actions, groupData)
    }

    /**
     * Build Weapons
     * @private
     * @param {string} groupId
     * @param {string} itemTypes
     */
    #buildWeapons(groupId, itemTypes) {
      if (canvas.tokens.controlled.length > 1) return;
      this.#buildMeleeWeapons(groupId, itemTypes)
      this.#buildRangedWeapons(groupId, itemTypes)
    }

    /**
     * Build Melee Weapons
     * @private
     * @param {string} groupId
     * @param {string} itemTypes
     */
    #buildMeleeWeapons(groupId, itemTypes) {
      const actionType = groupId
      const actions = Object.entries(
        this.actor.items.filter(
          el => itemTypes.includes(el.type)
            && (el.system.containerId == '' || el.system.containerId == undefined)
            && el.system.melee)).map((item) => {
              const abilityId = item[1].id
              const id = `${actionType}-${item[1].id}`
              const label = item[1].name
              const name = item[1].name
              const listName = `${actionType}${label}`
              const encodedValue = [actionType, abilityId].join(this.delimiter)
              const img = item[1].img
              const info2 = { text: item[1].system?.damage ? "(" + item[1].system.damage + ")" : (item[1].system?.quantity?.value ? "(" + item[1].system.quantity.value + ")" : ""), class: 'custominfo' }
              const cssClass = ''
              return {
                id,
                name,
                encodedValue,
                info2,
                img,
                cssClass,
                listName
              }
            })
      const groupData = { id: 'melee', type: 'system' }
      this.addActions(actions, groupData)
    }

    /**
     * Build Ranged Weapons
     * @private
     * @param {string} groupId
     * @param {string} itemTypes
     */
    #buildRangedWeapons(groupId, itemTypes) {
      const actionType = groupId

      const actions = Object.entries(
        this.actor.items.filter(
          el => itemTypes.includes(el.type)
            && el.system.containerId == ''
            && el.system.missile)).map((item) => {
              const abilityId = item[1].id
              const id = `${actionType}-${item[1].id}`
              const label = item[1].name
              const name = item[1].name
              const listName = `${actionType}${label}`
              const encodedValue = [actionType, abilityId].join(this.delimiter)
              const img = item[1].img
              const info2 = { text: item[1].system?.damage ? "(" + item[1].system.damage + ")" : (item[1].system?.quantity?.value ? "(" + item[1].system.quantity.value + ")" : ""), class: 'custominfo' }
              const cssClass = ''
              return {
                id,
                name,
                encodedValue,
                info2,
                img,
                cssClass,
                listName
              }
            })
      const groupData = { id: 'ranged', type: 'system' }
      this.addActions(actions, groupData)
    }

    /**
     * Build Inventory
     * @private
     * @param {string} groupId
     * @param {string} itemTypes
     */
    #buildInventory(groupId, itemTypes) {
      if (canvas.tokens.controlled.length > 1) return;
      const actionType = groupId
      const actions = Object.entries(
        this.actor.items.filter(
          el => itemTypes.includes(el.type)
            && el.system.containerId == ''
            && !el.system.treasure)).map((item) => {
              if (item[1].system.melee) range = coreModule.api.Utils.i18n('WWN.items.Melee')
              else if (item[1].system.missile) range = coreModule.api.Utils.i18n('WWN.items.Missile')
              const abilityId = item[1].id
              const id = `${actionType}-${item[1].id}`
              const label = item[1].name
              const name = item[1].name
              const listName = `${actionType}${label}`
              const encodedValue = [actionType, abilityId].join(this.delimiter)
              const img = item[1].img
              const info2 = { text: item[1].system?.damage ? "(" + item[1].system.damage + ")" : (item[1].system?.quantity?.value ? "(" + item[1].system.quantity.value + ")" : ""), class: 'custominfo' }
              const cssClass = ''
              return {
                id,
                name,
                encodedValue,
                info2,
                img,
                cssClass,
                listName
              }
            })
      const groupData = { id: groupId, type: 'system' }
      this.addActions(actions, groupData)
    }

    /**
     * Build Treasures
     * @private
     * @param {string} groupId
     * @param {string} itemTypes
     */
    #buildTreasure(groupId, itemTypes) {
      if (canvas.tokens.controlled.length > 1) return;
      const actionType = groupId
      const actions = Object.entries(this.actor.items.filter(
        el => itemTypes.includes(el.type)
          && el.system.containerId == ''
          && el.system.treasure)).map((item) => {
            if (item[1].system.melee) range = coreModule.api.Utils.i18n('WWN.items.Melee')
            else if (item[1].system.missile) range = coreModule.api.Utils.i18n('WWN.items.Missile')
            const abilityId = item[1].id
            const id = `${actionType}-${item[1].id}`
            const label = item[1].name
            const name = item[1].name
            const listName = `${actionType}${label}`
            const encodedValue = [actionType, abilityId].join(this.delimiter)
            const img = item[1].img
            const info2 = { text: item[1].system?.damage ? "(" + item[1].system.damage + ")" : (item[1].system?.quantity?.value ? "(" + item[1].system.quantity.value + ")" : ""), class: 'custominfo' }
            const cssClass = ''
            return {
              id,
              name,
              encodedValue,
              info2,
              img,
              cssClass,
              listName
            }
          })
      const groupData = { id: groupId, type: 'system' }
      this.addActions(actions, groupData)
    }

    /**
     * Build abilities
     * @private
     * @param {string} actionType
     * @param {string} groupId
     */
    #buildSaves(actionType, groupId) {
      if (canvas.tokens.controlled.length > 1) return;

      // Prune dangling saves from actors imported from other systems
      const savesList = ["evasion", "mental", "physical", "luck", "baseSave"];
      Object.keys(this.actor.system.saves).forEach((save) => {
        if (!savesList.includes(save)) {
          delete this.actor.system.saves[save]
        };
      });

      const actions = Object.entries(this.actor.system.saves).map((ability) => {
        if (ability[0] === "baseSave") return;
        const abilityId = ability[0]
        const id = `${actionType}-${abilityId}`
        const label = coreModule.api.Utils.i18n(`WWN.saves.${abilityId}`)
        const name = coreModule.api.Utils.i18n(`WWN.saves.${abilityId}`)
        const img = '/systems/wwn/assets/default/ability.png'
        const listName = `${actionType}${label}`
        const encodedValue = [actionType, abilityId].join(this.delimiter)
        const info1 = { text: ability[1].value }
        return {
          id,
          name,
          img,
          encodedValue,
          info1,
          listName
        }
      });
      actions.pop();
      const groupData = { id: groupId, type: 'system' }
      this.addActions(actions, groupData)
    }

    #buildAbilities(actionType, groupId) {
      if (canvas.tokens.controlled.length > 1) return;
      const abilities = this.actor.items.filter(el => el.type == 'ability')
      const actions = []
      abilities.forEach((ability) => {
        if (ability.system.roll.length > 0) {
          const abilityId = ability.id
          const img = ability.img
          const id = `${actionType}-${abilityId}`
          const label = ability.name
          const name = ability.name
          const listName = `${actionType}${label}`
          const encodedValue = [actionType, abilityId].join(this.delimiter)
          const info1 = { text: ability.system.roll }
          actions.push({
            id,
            name,
            img,
            encodedValue,
            info1,
            listName
          })
        }
      })
      const groupData = { id: groupId, type: 'system' }
      this.addActions(actions, groupData)
    }

    #buildSkills(actionType, groupId) {
      if (canvas.tokens.controlled.length > 1) return;
      const skills = this.actor.items.filter(el => el.type == 'skill')
      // Sort skills by name first, then by secondary property (non-secondary first)
      skills.sort((a, b) => {
        if (a.name !== b.name) {
          return a.name.localeCompare(b.name)
        }
        // If names are the same, sort by secondary (false comes before true)
        return (a.system.secondary ? 1 : 0) - (b.system.secondary ? 1 : 0)
      })
      const actions = []
      skills.forEach((skill) => {
        const abilityId = skill.id
        const id = `${actionType}-${skill.id}`
        const label = skill.name
        const name = skill.name
        const listName = `${actionType}${label}`
        const encodedValue = [actionType, abilityId].join(this.delimiter)
        const img = skill.img
        const info1 = { text: skill.system.ownedLevel.toString() }
        const info2 = { text: skill.system.skillDice ? `(${skill.system.skillDice})` : "", class: 'custominfo' }
        actions.push({
          id,
          name,
          img,
          encodedValue,
          info1,
          info2,
          listName
        })
      })
      const groupData = { id: groupId, type: 'system' }
      this.addActions(actions, groupData)
    }

    #buildSpells() {
      if (canvas.tokens.controlled.length > 1) return;
      const actionType = 'spell';
      if (this.actor.system.spells.enabled) {
        const spells = this.actor.items.filter(item => item.type == 'spell');
        if (spells.length) {
          let sortedSpells = {};
          for (var i = 0; i < spells.length; i++) {
            const lvl = spells[i].system.lvl;
            if (!sortedSpells[lvl]) sortedSpells[lvl] = [];
            sortedSpells[lvl].push(spells[i]);
          }

          // Sort each level
          Object.keys(sortedSpells).forEach((level) => {
            sortedSpells[level].sort((a, b) => a.name > b.name ? 1 : -1);
          });

          const spellList = Object.entries(sortedSpells);

          for (let i = 0; i < spellList.length; i++) {
            let level = spellList[i][0]
            if (level == 1) level = level + 'st'
            else if (level == 2) level = level + 'nd'
            else if (level == 3) level = level + 'rd'
            else level = level + 'th'

            const spellLevelList = Object.entries(spellList[i][1]).map((ability) => {
              const abilityId = ability[1].id
              const id = `${actionType}-${ability[1].id}`
              const label = ability[1].name
              const name = ability[1].name
              const listName = `${actionType}${label}`
              const encodedValue = [actionType, abilityId].join(this.delimiter)
              const info1 = { text: ability[1].system?.cast && ability[1].system.cast > 0 ? "( " + ability[1].system.cast + " )" : "" }
              const img = ability[1].img
              const active = ''
              const cssClass = `toggle${active}`
              return {
                id,
                name,
                encodedValue,
                info1,
                img,
                cssClass,
                listName
              }
            })
            const groupData = { id: level + '-level-spells', type: 'system' }
            this.addActions(spellLevelList, groupData)
          }
        }
      }
    }

    #buildArts() {
      if (canvas.tokens.controlled.length > 1) return;
      const actionType = 'art';
      if (this.actor.system.spells.enabled) {
        const artsList = this.actor.items.filter(item => item.type == 'art');
        if (artsList.length) {
          let sortedArts = {};
          for (var i = 0; i < artsList.length; i++) {
            let source = artsList[i].system.source;
            if (!sortedArts[source]) sortedArts[source] = [];
            sortedArts[source].push(artsList[i]);
          }

          // Sort each class
          Object.keys(sortedArts).forEach(source => {
            sortedArts[source].sort((a, b) => a.name > b.name ? 1 : -1);
          });

          const arts = Object.entries(sortedArts);
          for (let i = 0; i < arts.length; i++) {
            let level = arts[i][0]

            const artClassList = Object.entries(arts[i][1]).map((ability) => {
              const abilityId = ability[1].id
              const id = `${actionType}-${ability[1].id}`
              const label = ability[1].name
              const name = ability[1].name
              const listName = `${actionType}${label}`
              const encodedValue = [actionType, abilityId].join(this.delimiter)
              const info1 = { text: ability[1].system?.effort && ability[1].system.effort > 0 ? "( " + ability[1].system.effort + " )" : "" }
              const img = ability[1].img
              const active = ''
              const cssClass = `toggle${active}`
              return {
                id,
                name,
                encodedValue,
                info1,
                img,
                cssClass,
                listName
              }
            })
            const groupData = { id: `arts-${i + 1}`, type: 'system', name: level }
            this.addActions(artClassList, groupData)
          }
        }
      }
    }

    #getActors() {
      const allowedTypes = ['character', 'npc']
      const actors = canvas.tokens.controlled.filter(
        token => token.actor).map((token) => token.actor)
      if (actors.every((actor) => allowedTypes.includes(actor.type))) {
        return actors
      } else {
        return []
      }
    }

    /**
     * Get tokens
     * @private
     * @returns {object}
     */
    #getTokens() {
      const allowedTypes = ['character', 'npc']
      const tokens = canvas.tokens.controlled
      const actors = tokens.filter(token => token.actor).map((token) => token.actor)
      if (actors.every((actor) => allowedTypes.includes(actor.type))) {
        return tokens
      } else {
        return []
      }
    }

  }
})