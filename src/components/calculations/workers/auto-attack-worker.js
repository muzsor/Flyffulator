import Context from '../../../flyff/flyffcontext';
import * as Utils from "../../../flyff/flyffutils";
import Entity from "../../../flyff/flyffentity";
import { getDamage } from '../../../flyff/flyffdamagecalculator';

self.onmessage = function (event) {
    const { context, cycles = 200 } = event.data;

    const player = new Entity(null);
    player.unserialize(context.player);

    const attacker = new Entity(null);
    attacker.unserialize(context.attacker);

    const defender = new Entity(null);
    defender.unserialize(context.defender);

    Context.player = player
    Context.attacker = attacker
    Context.defender = defender
    Context.attackFlags = context.attackFlags
    Context.skill = context.skill
    Context.settings = context.settings
    Context.expSettings = context.expSettings

    let isDualWield = false;
    Context.defender.activeBuffs = [];
    let out = [];

    let totalDamage = 0;

    for (let i = 0; i < cycles; i++) {
        Context.skill = null;

        if (Context.attacker.equipment.mainhand.itemProp.subcategory === "wand") {
            Context.attackFlags = Utils.ATTACK_FLAGS.MAGIC;
        } else {
            Context.attackFlags = Utils.ATTACK_FLAGS.GENERIC;
        }

        const res = {
            damage: getDamage(isDualWield),
            critical: (Context.attackFlags & Utils.ATTACK_FLAGS.CRITICAL) !== 0,
            block: (Context.attackFlags & Utils.ATTACK_FLAGS.BLOCKING) !== 0,
            miss: (Context.attackFlags & Utils.ATTACK_FLAGS.MISS) !== 0,
            parry: (Context.attackFlags & Utils.ATTACK_FLAGS.PARRY) !== 0,
            double: (Context.attackFlags & Utils.ATTACK_FLAGS.DOUBLE) !== 0,
            afterDamageProps: Context.afterDamageProps
        };

        out.push(res);

        totalDamage += res.damage;

        if (Context.player.job.id === 2246 && Context.player.equipment.offhand != null) {
            isDualWield = !isDualWield;
        }
    }

    self.postMessage(out);

    console.log("Total Damage: " + totalDamage);
    let hps = (30 / 80) * 4 * Context.player.getAttackSpeed();
    console.log("Hit Per Second:", hps);
    let totalSeconds = cycles / hps;
    console.log("Total Seconds:", totalSeconds);
    console.log("Damage Per Second:", (totalDamage / totalSeconds / 1000).toString() + 'k');
};
