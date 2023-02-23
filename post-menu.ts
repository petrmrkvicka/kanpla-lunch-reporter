const postMenu = async () => {
  console.log("OKI");
  const axios = require("axios");

  const moduleId = "T3VkyhJ6gcvkKEkcVY5a";

  const getMenu = await axios.get(
    `https://api.kanpla.dk/api/v1/modules/T3VkyhJ6gcvkKEkcVY5a/menu?date=22-02-2023`,
    {
      headers: {
        Authorization:
          "Bearer 0cafeae91b00147004b0feaa2fb9496d49ffe6b6144c952a72060ce4046fc2d8",
      },
    }
  );

  const data = getMenu.data;
  console.log("🚀 ~ file: post-menu.ts:14 ~ postMenu ~ data:", data);

  return null;
};

postMenu();
