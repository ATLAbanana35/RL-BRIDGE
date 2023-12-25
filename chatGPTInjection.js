let NOCHILDS = [];
setInterval(() => {
  document
    .querySelector(
      "#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.flex-1.overflow-hidden > div > div > div"
    )
    .childNodes.forEach((child) => {
      if (!child.classList.contains("sticky")) {
        if (
          document.querySelector(
            "#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.flex-1.overflow-hidden > div > div > div"
          ).childNodes[
            document.querySelector(
              "#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.flex-1.overflow-hidden > div > div > div"
            ).childNodes.length - 1
          ] === child
        ) {
          child.querySelectorAll("a").forEach((imgs) => {
            if (imgs.href.includes("192.168.1.140")) {
              if (NOCHILDS.indexOf(child.dataset) == -1) {
                console.log("OK");
                NOCHILDS.push(child.dataset);
                setTimeout(() => {
                  window.open(imgs.href);
                }, 3000);
              }
            } else if (imgs.href.includes("random.org//")) {
              if (NOCHILDS.indexOf(child.dataset) == -1) {
                NOCHILDS.push(child.dataset);
                console.log(imgs.href.split("random.org//")[1].split("&&")[0]);
                if (
                  imgs.href.split("random.org//")[1].split("&&")[0] === "Y2S"
                ) {
                  console.log("ok_1");
                  let XML = new XMLHttpRequest();
                  XML.open(
                    "GET",
                    "https://loinesservers.alwaysdata.net/search.php?q=" +
                      imgs.href.split("&&")[1]
                  );
                  XML.onload = function () {
                    let resultText = XML.responseText;
                    const startPos =
                      document.querySelector(
                        "textarea[data-id]"
                      ).selectionStart;
                    const endPos =
                      document.querySelector("textarea[data-id]").selectionEnd;
                    const newText =
                      document
                        .querySelector("textarea[data-id]")
                        .value.substring(0, startPos) +
                      resultText +
                      document
                        .querySelector("textarea[data-id]")
                        .value.substring(endPos);
                    document.querySelector("textarea[data-id]").value = newText;
                    document.querySelector("textarea[data-id]").selectionStart =
                      startPos + resultText.length;
                    document.querySelector("textarea[data-id]").selectionEnd =
                      document.querySelector(
                        "textarea[data-id]"
                      ).selectionStart;
                    document
                      .querySelector("textarea[data-id]")
                      .dispatchEvent(new Event("input", { bubbles: true }));
                    setTimeout(() => {
                      document
                        .querySelector(
                          "#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.w-full.pt-2.md\\:pt-0.border-t.md\\:border-t-0.gizmo\\:border-t-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.md\\:pl-2.gizmo\\:pl-0.gizmo\\:md\\:pl-0.md\\:w-\\[calc\\(100\\%-\\.5rem\\)\\] > form > div > div > div > button.absolute.p-1.rounded-md.md\\:bottom-3.md\\:p-2.md\\:right-3.dark\\:hover\\:bg-gray-900.dark\\:disabled\\:hover\\:bg-transparent.right-2.gizmo\\:dark\\:disabled\\:bg-white.gizmo\\:disabled\\:bg-black.gizmo\\:disabled\\:opacity-10.disabled\\:text-gray-400.enabled\\:bg-brand-purple.gizmo\\:enabled\\:bg-black.text-white.gizmo\\:p-0\\.5.gizmo\\:border.gizmo\\:border-black.gizmo\\:rounded-lg.gizmo\\:dark\\:border-white.gizmo\\:dark\\:bg-white.bottom-1\\.5.transition-colors.disabled\\:opacity-40"
                        )
                        .click();
                    }, 1000);

                    console.log(XML.responseText);
                  };
                  XML.send();
                }
              }
            }
          });
        }
      }
    });
}, 2000);
