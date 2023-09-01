const postMenu = async () => {
  const axios = require("axios");
  require("dotenv").config();
  const translatte = require("translatte");

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

    const languages = [
      { name: "en", emoji: "🇬🇧" },
      { name: "cs", emoji: "🇨🇿" },
      { name: "it", emoji: "🇮🇹" },
      { name: "sk", emoji: "🇸🇰" },
      { name: "uk", emoji: "🇺🇦" },
      { name: "fr", emoji: "🇫🇷" },
      { name: "ko", emoji: "🇰🇷" },
      { name: "haw", emoji: "🌺" },
      { name: "tl", emoji: "🇵🇭" },
    ];

    const extendedMenuPromises = menus.map(async (menu) => {
      
      
      const translationPromises = languages.map(async ({ name, emoji }) => ({
        text: (
          await translatte(menu?.name || menu?.description, {
            from: "da",
            to: name,
          })
        ).text,
        lang: emoji,
      }));

      const translations = await Promise.all(translationPromises);

      return {
        ...menu,
        translations,
      };
    });

    const extendedMenu = await Promise.all(extendedMenuPromises);

    if (!extendedMenu.length) {
      console.log("No lunch");
      return null;
    }

    const messageConstructor = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `This is the menu for ${da}-${mo}-${ye} 🥗😍`,
        },
      },
      ...extendedMenu.map((menu) => {
        const product = data?.products?.find((p) => p.id === menu?.productId);

        return {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${menu.productName}*\n${menu.name || menu.description}\n${menu.translations
              ?.map((m) => `- ${m.lang}: ${m.text}`)
              .join("\n")}`,
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

    await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: "C02ULM5MYEQ",
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

    return null;
  } catch (e) {
    console.error(e?.message);
  }
};

postMenu();
