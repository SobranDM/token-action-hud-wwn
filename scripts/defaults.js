import { GROUP } from './constants.js'

/**
 * Default categories and groups
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
  const groups = GROUP
  Object.values(groups).forEach(group => {
    group.name = coreModule.api.Utils.i18n(group.name)
    group.listName = `Group: ${coreModule.api.Utils.i18n(group.name)}`
  })
  const groupsArray = Object.values(groups)
  DEFAULTS = {
    layout: [
      {
        nestId: 'attributes',
        id: 'attributes',
        name: coreModule.api.Utils.i18n('WWN.category.attributes'),
        groups: [
          { ...groups.attributes, nestId: 'attributes_attributes' },
        ]
      },
      {
        nestId: 'saves',
        id: 'saves',
        name: coreModule.api.Utils.i18n('WWN.category.saves'),
        groups: [
          { ...groups.saves, nestId: 'saves_saves' },
        ]
      },
      {
        nestId: 'abilities',
        id: 'abilities',
        name: coreModule.api.Utils.i18n('WWN.category.abilities'),
        groups: [
          { ...groups.abilities, nestId: 'abilities_abilities' },
        ]
      },
      {
        nestId: 'weapons',
        id: 'weapons',
        name: coreModule.api.Utils.i18n('WWN.items.Weapons'),
        groups: [
          { ...groups.melee, nestId: 'weapons_melee' },
          { ...groups.ranged, nestId: 'weapons_ranged' },
        ]
      },
      {
        nestId: 'inventory',
        id: 'inventory',
        name: coreModule.api.Utils.i18n('WWN.category.inventory'),
        groups: [
          { ...groups.armors, nestId: 'inventory_armors' },
          { ...groups.misc, nestId: 'inventory_misc' }
        ]
      },
      {
        nestId: 'spells',
        id: 'spells',
        name: coreModule.api.Utils.i18n('WWN.category.spells'),
        groups: [
          { ...groups._1stLevelSpells, nestId: 'spells_1st-level-spells' },
          { ...groups._2ndLevelSpells, nestId: 'spells_2nd-level-spells' },
          { ...groups._3rdLevelSpells, nestId: 'spells_3rd-level-spells' },
          { ...groups._4thLevelSpells, nestId: 'spells_4th-level-spells' },
          { ...groups._5thLevelSpells, nestId: 'spells_5th-level-spells' },
          { ...groups._6thLevelSpells, nestId: 'spells_6th-level-spells' },
          { ...groups._7thLevelSpells, nestId: 'spells_7th-level-spells' },
          { ...groups._8thLevelSpells, nestId: 'spells_8th-level-spells' },
          { ...groups._9thLevelSpells, nestId: 'spells_9th-level-spells' }
        ]
      },
      {
        nestId: 'arts',
        id: 'arts',
        name: coreModule.api.Utils.i18n('WWN.spells.Arts'),
        groups: [
          { ...groups._arts1, nestId: 'arts_arts-1' },
          { ...groups._arts2, nestId: 'arts_arts-2' },
          { ...groups._arts3, nestId: 'arts_arts-3' },
          { ...groups._arts4, nestId: 'arts_arts-4' },
          { ...groups._arts5, nestId: 'arts_arts-5' },
          { ...groups._arts6, nestId: 'arts_arts-6' },
          { ...groups._arts7, nestId: 'arts_arts-7' },
          { ...groups._arts8, nestId: 'arts_arts-8' },
          { ...groups._arts9, nestId: 'arts_arts-9' },
          { ...groups._arts10, nestId: 'arts_arts-10' }
        ]
      },
      {
        nestId: 'treasures',
        id: 'treasures',
        name: coreModule.api.Utils.i18n('WWN.items.Treasure'),
        groups: [
          { ...groups.treasure, nestId: 'treasures_treasures' }
        ]
      },
    ],
    groups: groupsArray
  }
})