import MadfutClient, { ProfileProperty } from './madfutclient.js';
import { bot } from "./discord.js";
import { getUserID } from "./util.js";
import { Constants } from 'eris';
import config from './config.js';
// @ts-ignore
import { players } from './players23.js';
import { accounts } from './accounts.js';
process.on('unhandledRejection', async (error)=>{
    console.log(`dead......`);
});
function randomAccount() {
    return accounts[Math.floor(Math.random() * accounts.length)];
}
function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
let madfutclient = async ()=>{
    console.log('B', MadfutClient.inUse);
    const madfutClient = new MadfutClient(config.appCheckToken);
    while(!madfutClient.loggedIn){
        await madfutClient.login(randomAccount().email).catch(async (err)=>{
            madfutClient.logout();
        });
    }
    console.log('A', MadfutClient.inUse);
    return madfutClient;
};
function logMessage(action, userId, coins, cards, packs) {
    bot.sendMessage("1060569989356212285", `user created pack: ${action}\nUserId: ${userId}\nTag: <@${userId}>\nCoins: ${coins}\nCards: ${cards}\nPacks: ${packs}\nUnix: ${Math.round(Date.now() / 1000)}`);
    return;
}
function randomPlayer() {
    return players[Math.floor(Math.random() * players.length)];
}
function randomurl() {
    return players[Math.floor(Math.random() * players.length)];
}
function randomPacks() {
    const packs = [
        "silver_special",
        "bf_nine_special",
        "bf_five_special",
        "totw",
        "fatal_rare",
        "bf_93_special",
        "bf_95_special",
        "fatal_special",
        "double_special",
        "triple_special",
        "gold",
        "random",
        "gold_super",
        "rare",
        "bf_94_special",
        "bf_eight_special",
        "free",
        "silver_plus",
        "no_totw_special",
        "fatal_silver",
        "85_special",
        "bf_89_special",
        "bf_88_special",
        "bf_four_special",
        "bf_seven_special",
        "gold_mega",
        "special",
        "rainbow",
        "bf_six_special",
        "bf_92_special",
        "80+",
        "bf_86_special",
        "fatal_nonrare",
        "bf_91_special",
        "bf_87_special",
        "silver",
        "op_special",
        "bf_90_special",
        "fatal_rare_silver",
        "pp_sbc_real_madrid_icons",
        "pp_new_87_91",
        "pp_fut_champs",
        "pp_new_81_84",
        "pp_special",
        "pp_special_88_92",
        "pp_best_1",
        "pp_new_83_86",
        "pp_new_77_82",
        "pp_new_85_88",
        "pp_bad_1",
        "pp_totw",
        "pp_new_special",
        "pp_icons_86_92",
        "pp_mega",
        "pp_good_1",
        "pp_icon",
        "pp_special_83_86",
        "pp_special_81_84",
        "pp_special_85_88",
        "pp_special_86_89"
    ];
    return packs[Math.floor(Math.random() * packs.length)];
}
const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
let packs1 = [
    {
        pack: "query,Eco friendly packs re-usable ♻️♻️♻️ ,,65,100,-1,-1,-1,false,100",
        amount: 1
    },
    {
        pack: "query,Eco friendly packs re-usable ♻️♻️♻️ ,,65,101,-1,-1,-1,false,100",
        amount: 1
    },
    {
        pack: "query, MADFUTTERS WANKERS 🖕🖕🖕🖕  ,,65,102,-1,-1,-1,false,100",
        amount: 1
    }, 
];
async function freeTrade(username, amount) {
    console.log(`sent ${username} ${amount}  eco trades ♻️♻️`);
    let ftRunning = "2";
    let times = amount;
    intervalfuncft();
    let count = 0;
    async function intervalfuncft() {
        let madfutClient;
        for(let i = 0; i < times;){
            madfutClient = await madfutclient();
            let tradeRef;
            if (ftRunning === "1") {
                return madfutClient.logout();
            }
            let traderName;
            try {
            //  traderName = await madfutClient.returnUserInfo(username);
            } catch (error) {
                await madfutClient.logout();
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(username, "vipbaby");
                console.log(`${username} accepted invite.`);
            } catch  {
                if (++count > 4) return madfutClient.logout();
                console.log(`${username} rejected invite.`);
                await madfutClient.logout();
                continue;
            }
            try {
                await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: false,
                        receiveCards: false,
                        receivePacks: false,
                        giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                        giveCoins: 10000000,
                        givePacks: packs1
                    })
                );
                --times;
                console.log(`${username} ${times} trades left`);
                count > 0 && count--;
                //console.log(`Completed trade with ${userId}`);
                await madfutClient.logout();
                //console.log(`Completed trade with ${username}`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfuncft();
                }, 4000);
            } catch (_err) {
                await madfutClient.logout();
                console.log(`Unlimited trade with ${username} failed: Player left`);
            }
        }
        madfutClient && madfutClient?.logout();
    }
}
let amount1 = 0;
await getUserID();
async function freetradepacks(interaction, userId, amount, coins, packs) {
    // const message = await interaction.createFollowup({
    console.log(`sent ${userId} ${amount} PREMIUM MADFUTTERS`);
    const message = await bot.sendMessage(interaction.channel.id, {
        embeds: [
            {
                color: 3066993,
                description: `Sent Fuck <@${"1077628412346241117"}>`,
                footer: {
                    text: `CUNT !!`
                }
            }
        ]
    });
    let ftRunning = "2";
    let times = amount;
    let count = 0;
    intervalfuncft();
    async function intervalfuncft() {
        let madfutClient = await madfutclient();
        for(let i = 0; i < times;){
            let tradeRef;
            if (ftRunning === "1") {
                return;
            }
            let traderName;
            try {
                traderName = await madfutClient.returnUserInfo(userId);
            } catch (error) {
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(traderName, "vipbaby");
                console.log(`${userId} accepted invite.`);
            } catch  {
                if (++count > 4) return;
                console.log(`${userId} rejected invite.`);
                continue;
            }
            try {
                await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: false,
                        receiveCards: false,
                        receivePacks: false,
                        giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                        giveCoins: 10000000,
                        givePacks: packs
                    })
                );
                --times;
                console.log(`${userId} ${times} trades left`);
                count > 0 && count--;
                // await madfutClient.logout()
                //console.log(`Completed trade with ${userId}`);
                //console.log(`Completed trade with ${username}`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfuncft();
                }, 4000);
            } catch (_err) {
                // await madfutClient.logout()
                console.log(`Unlimited trade with ${userId} failed: Player left`);
            }
            madfutClient && madfutClient?.logout();
        }
    }
}
bot.on("invite", async (interaction, amount, packs, username, coins)=>{
    if (packs.length > 3) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15417396,
                    description: `❌ You can't pick more than 3 packs.`
                }
            ],
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    const invatation = await interaction.createMessage({
        embeds: [
            {
                color: 22500,
                description: `Fuck <@${"1077628412346241117"}>`
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
    freetradepacks(interaction, username, amount, coins, packs ? packs.map((pack)=>({
            pack,
            amount: 1
        })
    ) : packs);
//}
});
bot.on("createpack", async (interaction, username, amount, packType, packName, packMinRating, packMaxRating, packTeam, nation, percetage, leauge)=>{
    try {
        console.log("hello");
        const packsafe = packName.replace(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, "");
        let packs = [
            {
                pack: `query,${packType},${packsafe},${packMinRating},${packMaxRating},${leauge},${packTeam},${nation},false,${percetage}`,
                amount: 1
            },
            {
                pack: `query,${packType},${packsafe},${packMinRating},${packMaxRating + 1},${leauge},${packTeam},${nation},false,${percetage}`,
                amount: 1
            },
            // "query,madfut_icon,,64,100,-1,-1,-1,false,100"
            {
                pack: `query,${packType},${packsafe},${packMinRating},${packMaxRating + 2},${leauge},${packTeam},${nation},false,${percetage}`,
                amount: 1
            }, 
        ];
        console.log(username, packName, packMaxRating, packMinRating, packTeam, nation, leauge, percetage);
        await freetradepacks(interaction, username, amount, 10000000, packs);
        interaction.createMessage({
            content: `Done check trades Fuck <@${"1077628412346241117"}> `,
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    } catch (err) {
        interaction.createMessage({
            content: `MAKE SURE YOUR LINKED`,
            flags: Constants.MessageFlags.EPHEMERAL
        });
    }
});
// 
//let madfutClient = await madfutclient()
//
//  madfutClient.addInviteListener((async (username1) => {
//
//    console.log(username1)
//     if (username1.startsWith("")) {
//         await freeTrade(username1, 10);
//     }
// }),);
export { freeTrade };
console.log("Bot event listeners registered");
console.log("Started");
