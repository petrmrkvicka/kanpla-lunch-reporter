const postMenu = async () => {
  const axios = require("axios");
  require("dotenv").config();
  try {
    const moduleId = process.env.MODULE_ID;
    const bearerToken = process.env.BEARER_TOKEN;
    const slackToken = process.env.SLACK_TOKEN;

    const d = new Date();
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

    const getMenu = await axios.get(
      `https://api.kanpla.dk/api/v1/modules/${moduleId}/menu?date=${da}-${mo}-${ye}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    const data = getMenu.data?.response;

    const menus = data?.menus;

    const messageConstructor = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `This is the menu for ${da}-${mo}-${ye} 🥗😍`,
        },
      },
      ...menus.map((menu) => {
        const product = data?.products?.find((p) => p.id === menu?.productId);

        return {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${menu.productName}*\n${menu.name}`,
          },
          ...(product?.photo
            ? {
                accessory: {
                  type: "image",
                  image_url: product.photo,
                  alt_text: menu.name,
                },
              }
            : {}),
        };
      }),
    ];

    console.log(
      "🚀 ~ file: post-menu.ts:65 ~ postMenu ~ messageConstructor:",
      messageConstructor
    );

    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: "C04R0NJE2CC",
        blocks: messageConstructor,
        icon_emoji: "🥗",
        username: "Here comes the lunch!",
      },
      {
        headers: {
          authorization: `Bearer ${slackToken}`,
          "Content-type": "application/json; charset=utf-8",
        },
      }
    );

    console.log(response.data);

    return null;
  } catch (e) {
    console.error(e?.message);
  }
};

postMenu();
