const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;

const fetch = require("node-fetch");

let discord_api_lookup = "https://discord.com/api/v8/users";
let discord_api_avatar = "https://cdn.discordapp.com/avatars";
let discord_token = "";
app.use(morgan('dev'));

app.use(express.static('public'));
app.use(express.json());

app.get("/api", (req, res) => {
    let id = req.query?.id;
    if (typeof id !== "undefined") {
        // check if id is a int
        if (Number.isInteger(parseInt(id))) {
            // lookup id
            fetch(`${discord_api_lookup}/${id}`, {
                method: "GET",
                headers: {
                    // content type application/json
                    "Content-Type": "application/json",
                    // authorization token
                    "authorization": `Bot ${discord_token}`,
                    // user agent to @h4_remiix/lookup
                    "User-Agent": "h4_remiix/lookup"
                }
            })
                .then(x => x.json())
                .then(r => {
                    let publicFlags = [];
                    let FLAGS = [
                        { flag: "DISCORD_EMPLOYEE", bitwise: 1 << 0 },
                        { flag: "PARTNERED_SERVER_OWNER", bitwise: 1 << 1 },
                        { flag: "HYPESQUAD_EVENTS", bitwise: 1 << 2 },
                        { flag: "BUGHUNTER_LEVEL_1", bitwise: 1 << 3 },
                        { flag: "HOUSE_BRAVERY", bitwise: 1 << 6 },
                        { flag: "HOUSE_BRILLIANCE", bitwise: 1 << 7 },
                        { flag: "HOUSE_BALANCE", bitwise: 1 << 8 },
                        { flag: "EARLY_SUPPORTER", bitwise: 1 << 9 },
                        { flag: "TEAM_USER", bitwise: 1 << 10 },
                        { flag: "BUGHUNTER_LEVEL_2", bitwise: 1 << 14 },
                        { flag: "VERIFIED_BOT", bitwise: 1 << 16 },
                        { flag: "EARLY_VERIFIED_BOT_DEVELOPER", bitwise: 1 << 17 },
                        { flag: "DISCORD_CERTIFIED_MODERATOR", bitwise: 1 << 18 },
                        { flag: "BOT_HTTP_INTERACTIONS", bitwise: 1 << 19 },
                        { flag: "SPAMMER", bitwise: 1 << 20 },
                        { flag: "ACTIVE_DEVELOPER", bitwise: 1 << 22 },
                        { flag: "QUARANTINED", bitwise: 17592186044416 }
                    ];

                    FLAGS.forEach((flag) => {
                        if (r.public_flags & flag.bitwise) publicFlags.push(flag.flag);
                    });


                    res.status(200).json({
                        status: "success",
                        message: "Successfully looked up user",
                        data: {
                            id: r.id,
                            username: r.username,
                            discriminator: r.discriminator,
                            avatar: `${discord_api_avatar}/${r.id}/${r.avatar}.png`,
                            badges: publicFlags
                        }
                    });

                })

        } else {
            res.status(400).json({
                status: "error",
                message: "Invalid id"
            });
        }
    } else {
        res.status(400).json({
            status: "error",
            message: "Missing id parameter"
        });
    }
});
// start app
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});