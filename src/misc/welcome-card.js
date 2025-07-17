const { JSX, Builder, loadImage } = require("canvacord");

class GreetingsCard extends Builder {
  constructor() {
    super(930, 280);
    this.bootstrap({
      displayName: "",
      type: "welcome",
      avatar: "",
      message: "",
      background: "",
    });
  }

  setDisplayName(value) {
    this.options.set("displayName", value);
    return this;
  }

  setType(value) {
    this.options.set("type", value);
    return this;
  }

  setAvatar(value) {
    this.options.set("avatar", value);
    return this;
  }

  setMessage(value) {
    this.options.set("message", value);
    return this;
  }

  setBackground(value) {
    this.options.set("background", value);
    return this;
  }

  async render() {
    const { type, displayName, avatar, message, background } =
      this.options.getOptions();

    const image = await loadImage(avatar);

    return JSX.createElement(
      "div",
      {
        className:
          "h-full w-full flex flex-col items-center justify-center bg-[#23272A] rounded-full",
        style: {
          backgroundImage: background ? `url("${background}")` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
      },

      JSX.createElement(
        "div",
        {
          className:
            "px-6 bg-[#FFFFFFBF] w-[96%] h-[84%] rounded-full flex items-center",
        },
        JSX.createElement("img", {
          src: image.toDataURL(),
          style: {
            height: "200px",
            width: "200px",
            border: "4px solid #4db0fa", // border size & color
            borderRadius: "100px", // optional: rounded corners
          },
        }),
        JSX.createElement(
          "div",
          { className: "flex flex-col ml-6" },
          JSX.createElement(
            "h1",
            {
              style: {
                fontSize: "3rem", // text-5xl
                color: "#000000", // text-black
                fontWeight: "bold", // font-bold
                margin: 0,
              },
            },
            type === "welcome" ? "Welcome" : "Goodbye",
            ",",
            " ",
            JSX.createElement(
              "span",
              {
                style: {
                  color: "#4db0fa", // text-blue-500
                },
              },
              displayName,
              "!"
            )
          ),
          JSX.createElement(
            "p",
            { style: {
              color:" #4db0fa",
              fontSize: "1.875rem",
              margin: "0",
            } },
            message
          )
        )
      )
    );
  }
}

module.exports = { GreetingsCard };
